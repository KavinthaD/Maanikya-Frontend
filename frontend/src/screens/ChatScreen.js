import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { API_URL, ENDPOINTS } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import HeaderBar from "../components/HeaderBar";
import { useWebSocket } from "../contexts/WebSocketContext";

const THEME_COLOR = "#9CCDDB";

export default function ChatScreen({ route, navigation }) {
  const { socket, isConnected, lastError, reconnect } = useWebSocket();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isContactTyping, setIsContactTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  // Get route params
  const { contactId, contactName, contactUsername, contactAvatar } =
    route.params;
  const [userId, setUserId] = useState(null);

  const flatListRef = useRef();

  // Helper to format message time
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Fetch initial messages
  const fetchInitialMessages = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        navigation.navigate("Login");
        return;
      }

      // Get user ID for identifying own messages
      const userProfile = await axios.get(
        `${API_URL}${ENDPOINTS.GET_USER_PROFILE}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserId(userProfile.data._id);

      // Fetch messages
      const response = await axios.get(
        `${API_URL}${ENDPOINTS.GET_MESSAGES}/${contactId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(`Fetched ${response.data.length} messages`);

      const formattedMessages = response.data.map((msg) => ({
        ...msg,
        _id: msg.id || msg._id, // Ensure consistent _id field
        isOwn: msg.isOwn,
      }));

      setMessages(formattedMessages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('ChatScreen mounted - loading initial messages');
    fetchInitialMessages();
    
    // Cleanup function
    return () => {
      console.log('ChatScreen unmounting');
    };
  }, [contactId]); // Re-fetch when contact changes

  useEffect(() => {
    // Only set up listeners if we have all the data we need
    if (!socket || !isConnected || !contactId || !userId) {
      return;
    }

    console.log("Setting up socket listeners for chat:", contactId);

    // Join the chat room
    socket.emit("join-chat", contactId);
    console.log("Joining chat room with contact ID:", contactId);
    console.log("Current user ID:", userId);

    // Handle new messages
    const handleNewMessage = (message) => {
      console.log("New message received via WebSocket:", message);

      // Check if message belongs to this conversation
      const isFromCurrentChat =
        (message.sender === contactId && message.recipient === userId) ||
        (message.sender === userId && message.recipient === contactId);

      console.log("Is message for current chat:", isFromCurrentChat);

      if (isFromCurrentChat) {
        setMessages((prevMessages) => {
          // Check if we already have this message by ID
          const existingMessage = prevMessages.find(
            (m) => m._id === message.id || m.id === message.id
          );

          if (existingMessage) {
            console.log(
              "Message already exists in state, not adding duplicate"
            );
            return prevMessages;
          }

          // Check if this is confirming a sending message
          const tempIndex = prevMessages.findIndex(
            (m) => m.sending && m.content === message.content && m.isOwn
          );

          if (tempIndex !== -1) {
            console.log("Replacing temporary message with confirmed one");
            const updated = [...prevMessages];
            updated[tempIndex] = {
              ...message,
              _id: message.id,
              isOwn: message.sender === userId,
              sending: false,
            };
            return updated;
          }

          // Add as new message
          console.log("Adding new message to state:", message.content);
          return [
            ...prevMessages,
            {
              ...message,
              _id: message.id,
              isOwn: message.sender === userId,
            },
          ];
        });
      }
    };

    // Handle message sent confirmations
    const handleMessageSent = (data) => {
      console.log("Message sent confirmation:", data.messageId);

      setMessages((prevMessages) => {
        // Find temporary sending message
        const tempIndex = prevMessages.findIndex((m) => m.sending === true);
        if (tempIndex === -1) return prevMessages;

        // Replace with confirmed message
        const updated = [...prevMessages];
        updated[tempIndex] = {
          ...updated[tempIndex],
          _id: data.messageId,
          sending: false,
        };
        return updated;
      });
    };

    // Handle typing indicators
    const handleTypingUpdate = (data) => {
      if (data.userId === contactId) {
        setIsContactTyping(data.isTyping);
      }
    };

    // Handle errors
    const handleError = (error) => {
      console.error("WebSocket message error:", error.message);
    };

    // Register all event handlers
    socket.on("new-message", handleNewMessage);
    socket.on("message-sent", handleMessageSent);
    socket.on("message-error", handleError);
    socket.on("user-typing", handleTypingUpdate);

    // Clean up all handlers when component unmounts or deps change
    return () => {
      console.log("Cleaning up WebSocket listeners");
      socket.off("new-message", handleNewMessage);
      socket.off("message-sent", handleMessageSent);
      socket.off("message-error", handleError);
      socket.off("user-typing", handleTypingUpdate);
    };
  }, [socket, isConnected, contactId, userId]);

  // Send message function using WebSockets
  const sendMessage = async () => {
    if (!inputText.trim() || !socket || !isConnected) return;

    const messageText = inputText.trim();
    setInputText("");

    // Clear typing indicator
    if (typeof handleStopTyping === "function") {
      handleStopTyping();
    }

    // Create temporary message with unique ID
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      _id: tempId,
      content: messageText,
      timestamp: new Date().toISOString(),
      isOwn: true,
      sending: true,
    };

    // Add to messages
    setMessages((prev) => [...prev, tempMessage]);

    try {
      console.log("Sending message to:", contactId);
      // Send via socket
      socket.emit("send-message", {
        recipientId: contactId,
        content: messageText,
      });
    } catch (error) {
      console.error("Error sending message:", error);

      // Update temporary message to show error
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId ? { ...msg, sending: false, error: true } : msg
        )
      );
    }
  };

  // Handle typing indicator
  const handleTyping = () => {
    if (!typing && socket && isConnected && userId && contactId) {
      setTyping(true);

      const conversationId = generateConversationId(userId, contactId);
      console.log("Sending typing indicator:", true);

      socket.emit("typing", {
        conversationId: conversationId,
        isTyping: true,
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(handleStopTyping, 2000);
  };

  const handleStopTyping = () => {
    if (typing && socket && isConnected && userId && contactId) {
      setTyping(false);

      const conversationId = generateConversationId(userId, contactId);
      console.log("Sending typing indicator:", false);

      socket.emit("typing", {
        conversationId: conversationId,
        isTyping: false,
      });
    }
  };

  // Helper function to generate conversation ID
  const generateConversationId = (userId1, userId2) => {
    const sortedIds = [userId1, userId2].sort();
    return `${sortedIds[0]}_${sortedIds[1]}`;
  };

  // Input change handler
  const handleInputChange = (text) => {
    setInputText(text);
    handleTyping();
  };

  // Render message bubble
  const renderMessage = ({ item, index }) => {
    const isOwnMessage = item.sender === userId || item.isOwn;

    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage
            ? styles.ownMessageContainer
            : styles.otherMessageContainer,
        ]}
        key={`message-${item._id || index}`} // Additional key for more reliability
      >
        <View
          style={[
            styles.messageBubble,
            isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble,
            item.sending && styles.sendingMessageBubble,
            item.error && styles.errorMessageBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
            ]}
          >
            {item.content}
          </Text>

          <Text
            style={[
              styles.messageTime,
              isOwnMessage ? styles.ownMessageTime : styles.otherMessageTime,
            ]}
          >
            {item.sending
              ? "Sending..."
              : item.error
              ? "Failed"
              : formatMessageTime(item.timestamp || item.createdAt)}
          </Text>

          {item.error && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                // Remove failed message and try again
                setMessages((prev) =>
                  prev.filter((msg) => msg._id !== item._id)
                );
                setInputText(item.content);
              }}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  // Custom header for chat screen
  const renderHeader = () => (
    <TouchableOpacity
      style={styles.headerContainer}
      onPress={() => navigation.navigate("ContactProfiles", { contactId })}
    >
      <Image
        source={
          contactAvatar
            ? { uri: contactAvatar }
            : require("../assets/default-images/user_with_gem.jpeg")
        }
        style={styles.headerAvatar}
      />
      <View style={styles.headerInfo}>
        <Text style={styles.headerName}>{contactName}</Text>
        <Text style={styles.headerUsername}>@{contactUsername}</Text>
      </View>
    </TouchableOpacity>
  );

  // Update renderConnectionStatus to only show for logged-in users
  const renderConnectionStatus = () => {
    // Don't use useWebSocket() here - it's already called above
    if (!socket) return null;

    if (!isConnected) {
      return (
        <View style={styles.connectionStatus}>
          <Text style={styles.connectionStatusText}>
            {lastError ? `Connection issue: ${lastError}` : "Connecting..."}
          </Text>
          {lastError && (
            <TouchableOpacity
              onPress={reconnect} // Use the reconnect function from above
              style={styles.reconnectButton}
            >
              <Text style={styles.reconnectText}>Reconnect</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }
    return null;
  };

  // Add typing indicator to your UI
  const renderTypingIndicator = () => {
    if (!isContactTyping) return null;

    return (
      <View style={styles.typingContainer}>
        <Text style={styles.typingText}>{contactName} is typing...</Text>
      </View>
    );
  };

  // Debug logging
  useEffect(() => {
    console.log("Messages state updated:", messages.length, "messages");
    // Log the last message if available
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      console.log(
        "Last message in state:",
        lastMsg.content?.substring(0, 20),
        "from",
        lastMsg.isOwn ? "me" : "them",
        lastMsg.sending ? "(sending)" : ""
      );
    }
  }, [messages]);

  // Update your render function to include these new components
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <HeaderBar
        customContent={renderHeader()}
        navigation={navigation}
        showBack={true}
      />

      {renderConnectionStatus()}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={THEME_COLOR} />
          </View>
        ) : (
          <>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) =>
                item._id || item.id || `msg-${Date.now()}-${Math.random()}`
              }
              contentContainerStyle={styles.messagesList}
              extraData={[messages.length, isContactTyping]}
              initialNumToRender={15}
              windowSize={10}
              maxToRenderPerBatch={10}
              onContentSizeChange={() => {
                if (flatListRef.current && messages.length > 0) {
                  flatListRef.current.scrollToEnd({ animated: true });
                }
              }}
              onLayout={() => {
                if (flatListRef.current && messages.length > 0) {
                  flatListRef.current.scrollToEnd({ animated: false });
                }
              }}
            />

            {renderTypingIndicator()}

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type your message..."
                value={inputText}
                onChangeText={handleInputChange}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (!inputText.trim() || sending) && styles.sendButtonDisabled,
                ]}
                onPress={sendMessage}
                disabled={!inputText.trim() || sending}
              >
                {sending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 1,
  },
  headerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 20,
  },
  headerInfo: {
    marginLeft: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333333",
  },
  headerUsername: {
    fontSize: 12,
    color: "#888888",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "80%",
  },
  ownMessageContainer: {
    alignSelf: "flex-end",
  },
  otherMessageContainer: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    borderRadius: 18,
    padding: 12,
    minWidth: 80,
  },
  ownMessageBubble: {
    backgroundColor: THEME_COLOR,
  },
  otherMessageBubble: {
    backgroundColor: "#F0F0F0",
  },
  sendingMessageBubble: {
    opacity: 0.7,
  },
  errorMessageBubble: {
    backgroundColor: "#FFEDED",
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  messageText: {
    fontSize: 16,
  },
  ownMessageText: {
    color: "#FFFFFF",
  },
  otherMessageText: {
    color: "#333333",
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  ownMessageTime: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  otherMessageTime: {
    color: "#999999",
  },
  retryButton: {
    marginTop: 6,
    alignSelf: "flex-end",
  },
  retryText: {
    color: "#FF6B6B",
    fontSize: 12,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME_COLOR,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: "#CCCCCC",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#999999",
  },
  emptySubText: {
    fontSize: 14,
    color: "#AAAAAA",
    marginTop: 8,
  },
  connectionStatus: {
    backgroundColor: "#FFF3CD",
    padding: 6,
    alignItems: "center",
  },
  connectionStatusText: {
    color: "#856404",
    fontSize: 12,
  },
  typingContainer: {
    padding: 8,
    paddingLeft: 16,
  },
  typingText: {
    color: "#666",
    fontSize: 12,
    fontStyle: "italic",
  },
  reconnectButton: {
    backgroundColor: "#0078d7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginTop: 5,
  },
  reconnectText: {
    color: "white",
    fontSize: 12,
  },
});
