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
        
        console.log('Is from current chat:', isFromCurrentChat);
        
        if (isFromCurrentChat) {
          setMessages(prev => {
            // First, check if we already have a message with this ID
            const existingMessageIndex = prev.findIndex(m => 
              m._id === message.id || m.id === message.id
            );
            
            // If message already exists, don't add it
            if (existingMessageIndex !== -1) {
              console.log('Message already exists in state, not adding duplicate');
              return prev;
            }
            
            // Check if this is a confirmation of a sending message
            const tempMessageIndex = prev.findIndex(m => 
              m.sending === true && 
              m.content === message.content && 
              m.isOwn === (message.sender === userId)
            );
            
            if (tempMessageIndex !== -1) {
              console.log('Found temporary message, replacing with confirmed message');
              // Replace the temporary message with the confirmed one
              const newMessages = [...prev];
              newMessages[tempMessageIndex] = {
                ...message,
                _id: message.id,
                isOwn: message.sender === userId,
                sending: false
              };
              return newMessages;
            }
            
            // Otherwise, add as a new message
            console.log('Adding new message to state');
            return [
              ...prev, 
              { 
                ...message,
                _id: message.id,
                isOwn: message.sender === userId,
                sending: false
              }
            ];
          });
        }
      };
      
      // Add message listener
      socket.on('new-message', handleNewMessage);
      socket.on('message-sent', (data) => {
        console.log('Message sent confirmation:', data.messageId);
        
        setMessages(prev => {
          // Find any temporary message that's still in "sending" state
          const tempIndex = prev.findIndex(msg => msg.sending === true && msg.isOwn === true);
          
          // If no temporary message found, don't change anything
          if (tempIndex === -1) return prev;
          
          // Check if we already have the confirmed message (avoid duplicate)
          const confirmedExists = prev.some(msg => msg._id === data.messageId);
          if (confirmedExists) {
            // If confirmed message exists, remove the temporary one
            return prev.filter(msg => msg._id !== prev[tempIndex]._id);
          }
          
          // Otherwise update the temporary message
          const newMessages = [...prev];
          newMessages[tempIndex] = {
            ...newMessages[tempIndex],
            _id: data.messageId,
            sending: false,
            timestamp: new Date().toISOString()
          };
          return newMessages;
        });
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
  
  // Replace BOTH useEffects with socket handlers with this single unified one:

// Replace both useEffects that handle socket events with this single one
useEffect(() => {
  // Only set up listeners if we have all the data we need
  if (socket && isConnected && contactId && userId) {
    console.log('Setting up socket listeners for chat:', contactId);
    
    // Join the chat room
    socket.emit('join-chat', contactId);
    
    // Handle new messages
    const handleNewMessage = (message) => {
      console.log('New message received:', message);
      console.log('From sender:', message.sender, 'to recipient:', message.recipient);
      
      // Check if message belongs to this conversation
      const isFromCurrentChat = 
        (message.sender === contactId && message.recipient === userId) || 
        (message.sender === userId && message.recipient === contactId);
      
      console.log('Is from current chat:', isFromCurrentChat);
      
      if (isFromCurrentChat) {
        setMessages(prevMessages => {
          // First check if we already have this message
          const existingMsg = prevMessages.find(m => 
            (m._id === message.id) || (m.id === message.id)
          );
          
          if (existingMsg) {
            console.log('Message already exists in state, skipping');
            return prevMessages; // No change needed
          }
          
          // Check if this is confirming a message we sent
          const tempIndex = prevMessages.findIndex(m => 
            m.sending && m.content === message.content && m.isOwn
          );
          
          if (tempIndex !== -1) {
            console.log('Replacing temporary message with confirmed one');
            const updatedMessages = [...prevMessages];
            updatedMessages[tempIndex] = {
              ...message,
              _id: message.id,
              isOwn: message.sender === userId,
              sending: false
            };
            return updatedMessages;
          }
          
          // Otherwise add as new message
          console.log('Adding new message to state:', message.content);
          return [
            ...prevMessages,
            {
              ...message,
              _id: message.id,
              isOwn: message.sender === userId
            }
          ];
        });
      }
    };
    
    // Handle message sent confirmations
    const handleMessageSent = (data) => {
      console.log('Message sent confirmation:', data.messageId);
      
      setMessages(prevMessages => {
        // Find the sending message
        const tempIndex = prevMessages.findIndex(m => m.sending === true);
        if (tempIndex === -1) return prevMessages;
        
        // Update with confirmed state
        const updatedMessages = [...prevMessages];
        updatedMessages[tempIndex] = {
          ...updatedMessages[tempIndex],
          _id: data.messageId,
          sending: false
        };
        return updatedMessages;
      });
    };
    
    // Handle errors
    const handleError = (error) => {
      console.error('Message error:', error.message);
    };
    
    // Register all event handlers
    socket.on('new-message', handleNewMessage);
    socket.on('message-sent', handleMessageSent);
    socket.on('message-error', handleError);
    
    // Clean up all handlers when component unmounts or deps change
    return () => {
      console.log('Removing socket listeners');
      socket.off('new-message', handleNewMessage);
      socket.off('message-sent', handleMessageSent);
      socket.off('message-error', handleError);
    };
  }
}, [socket, isConnected, contactId, userId]);

  // Send message function using WebSockets
  const sendMessage = async () => {
    if (!inputText.trim() || !socket || !isConnected) return;
    
    const messageText = inputText.trim();
    setInputText('');
    
    // Clear typing indicator
    if (typeof handleStopTyping === 'function') {
      handleStopTyping();
    }
    
    // Create temporary message with unique ID
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      _id: tempId,
      content: messageText,
      timestamp: new Date().toISOString(),
      isOwn: true,
      sending: true
    };
    
    // Add to messages
    setMessages(prev => [...prev, tempMessage]);
    
    try {
      console.log('Sending message to:', contactId);
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
          msg._id === tempId
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
  
  // Debug logging
  useEffect(() => {
    console.log('Messages state updated:', messages.length, 'messages');
    // Log the last message if available
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      console.log('Last message in state:', 
        lastMsg.content?.substring(0, 20), 
        'from', lastMsg.isOwn ? 'me' : 'them',
        lastMsg.sending ? '(sending)' : ''
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
              renderItem={renderMessage}
              keyExtractor={(item) => item._id || item.id || `${item.content}-${Date.now()}-${Math.random()}`}
              contentContainerStyle={styles.messagesList}
              extraData={messages.length} // Force update when messages change
              onContentSizeChange={() => {
                setTimeout(() => {
                  if (flatListRef.current && messages.length > 0) {
                    flatListRef.current.scrollToEnd({ animated: true });
                  }
                }, 100); // Add a small delay to ensure component has updated
              }}
              onLayout={() => {
                setTimeout(() => {
                  if (flatListRef.current && messages.length > 0) {
                    flatListRef.current.scrollToEnd({ animated: false });
                  }
                }, 100); // Add a small delay to ensure component has updated
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