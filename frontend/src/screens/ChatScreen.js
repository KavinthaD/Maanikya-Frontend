import React, { useState, useEffect, useRef } from 'react';
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
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL, ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import HeaderBar from '../components/HeaderBar';
import { useWebSocket } from '../contexts/WebSocketContext';

const THEME_COLOR = '#9CCDDB';

export default function ChatScreen({ route, navigation }) {
  const { socket, isConnected, lastError, reconnect } = useWebSocket();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isContactTyping, setIsContactTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  
  // Get route params
  const { contactId, contactName, contactUsername, contactAvatar } = route.params;
  const [userId, setUserId] = useState(null);
  
  const flatListRef = useRef();
  
  // Helper to format message time
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Fetch initial messages
  const fetchInitialMessages = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        navigation.navigate('Login');
        return;
      }
      
      // Get user ID for identifying own messages
      const userProfile = await axios.get(`${API_URL}${ENDPOINTS.GET_USER_PROFILE}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserId(userProfile.data._id);
      
      // Fetch messages
      const response = await axios.get(
        `${API_URL}${ENDPOINTS.GET_MESSAGES}/${contactId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log(`Fetched ${response.data.length} messages`);
      
      const formattedMessages = response.data.map(msg => ({
        ...msg,
        _id: msg.id || msg._id,  // Ensure consistent _id field
        isOwn: msg.isOwn
      }));
      
      setMessages(formattedMessages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };
  
  // Join chat room when component mounts
  useEffect(() => {
    fetchInitialMessages();
    
    // Only try to join chat if socket exists and is connected
    if (socket && isConnected && contactId) {
      console.log('Joining chat room with contact:', contactId);
      socket.emit('join-chat', contactId);
      
      // Listen for new messages
      const handleNewMessage = (message) => {
        console.log('New message received:', message);
        
        // Add message to state if it's from this conversation
        const isFromCurrentChat = 
          (message.sender === contactId && message.recipient === userId) || 
          (message.sender === userId && message.recipient === contactId);
        
        if (isFromCurrentChat) {
          setMessages(prev => [
            ...prev, 
            { 
              ...message,
              _id: message.id || message._id,
              isOwn: message.sender === userId
            }
          ]);
          
          // Mark message as read if we're the recipient
          if (message.sender === contactId) {
            socket.emit('mark-as-read', { 
              messageId: message.id || message._id,
              conversationId: message.conversationId
            });
          }
        }
      };
      
      // Add message listener
      socket.on('new-message', handleNewMessage);
      socket.on('message-sent', (data) => {
        console.log('Message sent confirmation:', data.messageId);
      });
      socket.on('message-error', (error) => {
        console.error('Message error:', error.message);
      });
      
      // Clean up
      return () => {
        console.log('Cleaning up socket listeners');
        socket.off('new-message', handleNewMessage);
        socket.off('message-sent');
        socket.off('message-error');
      };
    }
  }, [contactId, userId, socket, isConnected]);
  
  // Send message function using WebSockets
  const sendMessage = async () => {
    if (!inputText.trim() || !socket || !isConnected) return;
    
    const messageText = inputText.trim();
    setInputText('');
    
    // Clear typing indicator
    handleStopTyping();
    
    // Create temporary message for immediate display
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      content: messageText,
      timestamp: new Date().toISOString(),
      isOwn: true,
      sending: true
    };
    
    // Add to messages
    setMessages(prev => [...prev, tempMessage]);
    
    try {
      // Send via socket
      socket.emit('send-message', {
        recipientId: contactId,
        content: messageText
      });
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Update temporary message to show error
      setMessages(prev => 
        prev.map(msg => 
          msg._id === tempMessage._id 
            ? { ...msg, sending: false, error: true } 
            : msg
        )
      );
    }
  };
  
  // Handle typing indicator
  const handleTyping = () => {
    if (!typing && socket) {
      setTyping(true);
      socket.emit('typing', { 
        conversationId: generateConversationId(userId, contactId),
        isTyping: true 
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
    if (typing && socket) {
      setTyping(false);
      socket.emit('typing', { 
        conversationId: generateConversationId(userId, contactId),
        isTyping: false 
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
          isOwnMessage ? styles.ownMessageContainer : styles.otherMessageContainer
        ]}
        key={`message-${item._id || index}`} // Additional key for more reliability
      >
        <View style={[
          styles.messageBubble,
          isOwnMessage ? styles.ownMessageBubble : styles.otherMessageBubble,
          item.sending && styles.sendingMessageBubble,
          item.error && styles.errorMessageBubble
        ]}>
          <Text style={[
            styles.messageText,
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText
          ]}>
            {item.content}
          </Text>
          
          <Text style={[
            styles.messageTime,
            isOwnMessage ? styles.ownMessageTime : styles.otherMessageTime
          ]}>
            {item.sending ? 'Sending...' : item.error ? 'Failed' : formatMessageTime(item.timestamp || item.createdAt)}
          </Text>
          
          {item.error && (
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                // Remove failed message and try again
                setMessages(prev => prev.filter(msg => msg._id !== item._id));
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
      onPress={() => navigation.navigate('ContactProfiles', { contactId })}
    >
      <Image
        source={
          contactAvatar
            ? { uri: contactAvatar }
            : require('../assets/default-images/user_with_gem.jpeg')
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
        <Text style={styles.typingText}>
          {contactName} is typing...
        </Text>
      </View>
    );
  };
  
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
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
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
              keyExtractor={item => item._id ? item._id.toString() : `temp-${Date.now()}-${Math.random()}`}
              renderItem={renderMessage}
              contentContainerStyle={styles.messagesList}
              onContentSizeChange={() => {
                if (messages.length > 0) {
                  flatListRef.current?.scrollToEnd({ animated: true });
                }
              }}
              onLayout={() => {
                if (messages.length > 0) {
                  flatListRef.current?.scrollToEnd({ animated: false });
                }
              }}
              removeClippedSubviews={false} // Prevents rendering issues
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No messages yet</Text>
                  <Text style={styles.emptySubText}>Send a message to start chatting</Text>
                </View>
              }
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
                  (!inputText.trim() || sending) && styles.sendButtonDisabled
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
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: 'bold',
    color: '#333333',
  },
  headerUsername: {
    fontSize: 12,
    color: '#888888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    padding: 16,
    flexGrow: 1,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
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
    backgroundColor: '#F0F0F0',
  },
  sendingMessageBubble: {
    opacity: 0.7,
  },
  errorMessageBubble: {
    backgroundColor: '#FFEDED',
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  messageText: {
    fontSize: 16,
  },
  ownMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#333333',
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherMessageTime: {
    color: '#999999',
  },
  retryButton: {
    marginTop: 6,
    alignSelf: 'flex-end',
  },
  retryText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999999',
  },
  emptySubText: {
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: 8,
  },
  connectionStatus: {
    backgroundColor: '#FFF3CD',
    padding: 6,
    alignItems: 'center',
  },
  connectionStatusText: {
    color: '#856404',
    fontSize: 12,
  },
  typingContainer: {
    padding: 8,
    paddingLeft: 16,
  },
  typingText: {
    color: '#666',
    fontSize: 12,
    fontStyle: 'italic',
  },
  reconnectButton: {
    backgroundColor: '#0078d7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginTop: 5,
  },
  reconnectText: {
    color: 'white',
    fontSize: 12,
  },
});