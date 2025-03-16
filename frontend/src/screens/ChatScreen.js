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
import { baseScreenStylesNew } from '../styles/baseStylesNew';


const POLLING_INTERVAL = 5000; // Poll every 5 seconds for new messages

export default function ChatScreen({ route, navigation }) {
  const { contactId, contactName, contactAvatar, contactUsername } = route.params;
  
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState(null);
  
  const flatListRef = useRef();
  
  // Helper to format message time
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get current user ID
  useEffect(() => {
    const getUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsed = JSON.parse(userData);
          setUserId(parsed.id);
        }
      } catch (error) {
        console.error('Error getting user data:', error);
      }
    };
    
    getUserId();
  }, []);
  
  // Fetch messages
  const fetchMessages = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        navigation.navigate('Login');
        return;
      }
      
      const response = await axios.get(`${API_URL}${ENDPOINTS.GET_MESSAGES}/${contactId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Make sure each message has a valid _id
      const messagesWithIds = response.data.map(msg => ({
        ...msg,
        _id: msg._id || msg.id || `server-${Date.now()}-${Math.random()}`
      }));
      
      // Keep optimistic messages that aren't in the response yet
      setMessages(prevMessages => {
        const optimisticMessages = prevMessages.filter(msg => 
          msg.sending && !messagesWithIds.some(serverMsg => 
            serverMsg.content === msg.content && 
            Math.abs(new Date(serverMsg.createdAt) - new Date(msg.timestamp)) < 10000
          )
        );
        return [...messagesWithIds, ...optimisticMessages];
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };
  
  // Initial load and polling
  useEffect(() => {
    fetchMessages();
    
    const intervalId = setInterval(fetchMessages, POLLING_INTERVAL);
    
    return () => clearInterval(intervalId);
  }, [contactId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);
  
  // Send message
const sendMessage = async () => {
    if (!inputText.trim()) return;
    
    const messageText = inputText.trim();
    setInputText(''); // Clear input immediately for better UX
    
    try {
      setSending(true);
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        navigation.navigate('Login');
        return;
      }
      
      // Optimistically add message to UI
      const tempId = `temp-${Date.now()}`;
      const optimisticMessage = {
        _id: tempId,
        content: messageText,
        sender: userId, // Use userId instead of isOwn flag for consistency
        timestamp: new Date().toISOString(),
        sending: true
      };
      
      setMessages(prevMessages => [...prevMessages, optimisticMessage]);
      
      // Actually send message
      const response = await axios.post(
        `${API_URL}${ENDPOINTS.SEND_MESSAGE}`,
        { 
          recipientId: contactId,
          content: messageText 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update messages to replace optimistic message with real one
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === tempId ? {
            ...response.data,
            _id: response.data._id || response.data.id // Handle either _id or id in response
          } : msg
        )
      );
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Show error state for the message
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === tempId ? { ...msg, sending: false, error: true } : msg
        )
      );
    } finally {
      setSending(false);
    }
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
          isOwnMessage ? baseScreenStylesNew.themeColor : styles.otherMessageBubble,
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
  
  return (
    <SafeAreaView style={[baseScreenStylesNew.backgroundColor,baseScreenStylesNew.container]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <HeaderBar
        customContent={renderHeader()}
        navigation={navigation}
        showBack={true}
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" style={baseScreenStylesNew.themeText} />
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
            
            <View style={[styles.inputContainer, baseScreenStylesNew.backgroundColor]}>
              <TextInput
                style={styles.input}
                placeholder="Type your message..."
                value={inputText}
                onChangeText={setInputText}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                style={[
                  styles.sendButton,
                  baseScreenStylesNew.themeColor,
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
});