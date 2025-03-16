import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { Ionicons,Feather, MaterialIcons } from "@expo/vector-icons";
import { baseScreenStylesNew } from "../styles/baseStylesNew";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL, ENDPOINTS } from "../config/api";
import HeaderBar from "../components/HeaderBar";
import { useFocusEffect } from '@react-navigation/native';
import { useWebSocket } from '../contexts/WebSocketContext';

const THEME_COLOR = '#9CCDDB';

export default function MessageInbox({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const { socket, notifications, unreadCount, clearNotifications } = useWebSocket();
  
  // Format time for display
  const formatMessageTime = (timestamp) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    const isToday = messageDate.toDateString() === now.toDateString();
    
    if (isToday) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (now - messageDate < 7 * 24 * 60 * 60 * 1000) {
      // Within the last 7 days, show day name
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return days[messageDate.getDay()];
    } else {
      // Older messages, show date
      return messageDate.toLocaleDateString([], { day: 'numeric', month: 'short' });
    }
  };
  
  // Truncate long messages
  const truncateMessage = (message, maxLength = 40) => {
    if (!message) return "";
    return message.length > maxLength
      ? `${message.substring(0, maxLength)}...`
      : message;
  };
  
  // Get initial letter for avatar placeholder
  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };
  
  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        navigation.navigate('Login');
        return;
      }
      
      console.log("Fetching conversations from:", `${API_URL}${ENDPOINTS.GET_CONVERSATIONS}`);
      
      const response = await axios.get(
        `${API_URL}${ENDPOINTS.GET_CONVERSATIONS}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log("Conversations response:", response.data);
      
      // Handle the response format from your backend
      const formattedConversations = response.data.map(conv => ({
        contactId: conv.contact?.id,
        name: conv.contact?.name || "Unknown",
        username: conv.contact?.username || "unknown",
        avatar: conv.contact?.avatar,
        lastMessage: conv.lastMessage || "",
        timestamp: conv.timestamp || new Date().toISOString(),
        unreadCount: conv.unreadCount || 0
      }));
      
      setConversations(formattedConversations);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      if (error.response) {
        console.log("Error response:", error.response.data);
        console.log("Error status:", error.response.status);
      }
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Refresh when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchConversations();
      
      // Remove the polling interval - WebSockets will handle updates
      // const intervalId = setInterval(fetchConversations, 10000); 
      
      // return () => clearInterval(intervalId);
      return () => {}; // Empty cleanup function
    }, [])
  );
  
  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchConversations();
  };
  
  // Use the WebSocket notification system to update conversations
  useEffect(() => {
    if (notifications.length > 0) {
      console.log("New notifications received, refreshing conversations");
      fetchConversations();
      clearNotifications();
    }
  }, [notifications]);
  
  // Navigate to chat screen
  const openChat = (contact) => {
    navigation.navigate('ChatScreen', {
      contactId: contact.contactId,
      contactName: contact.name,
      contactUsername: contact.username,
      contactAvatar: contact.avatar
    });
  };
  
  // Render conversation item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => openChat(item)}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      {item.avatar ? (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitial}>{getInitial(item.name)}</Text>
        </View>
      )}
      
      {/* Conversation details */}
      <View style={styles.conversationDetails}>
        <View style={styles.conversationHeader}>
          <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.time}>{formatMessageTime(item.timestamp)}</Text>
        </View>
        
        <View style={styles.messagePreviewContainer}>
          <Text style={[
            styles.messagePreview,
            item.unreadCount > 0 && styles.unreadMessage
          ]} numberOfLines={1}>
            {truncateMessage(item.lastMessage)}
          </Text>
          
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
  
  // Empty conversations state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="chatbubbles-outline" size={70} color="#CCCCCC" />
      <Text style={styles.emptyText}>No conversations yet</Text>
      <Text style={styles.emptySubText}>
        Start messaging your contacts to see them here
      </Text>
      <TouchableOpacity 
        style={styles.newChatButton}
        onPress={() => navigation.navigate('Contacts')}
      >
        <Text style={styles.newChatButtonText}>Find Contacts</Text>
      </TouchableOpacity>
    </View>
  );
  
  // Main render
  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Messages"
        navigation={navigation}
        showBack={true}
        rightComponent={
          <TouchableOpacity 
            onPress={() => navigation.navigate('Contacts')}
            style={styles.headerButton}
          >
            <Feather name="user-plus" size={24} color="#333" />
          </TouchableOpacity>
        }
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME_COLOR} />
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.contactId || item.id || `conv-${Math.random()}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[THEME_COLOR]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    flexGrow: 1,
  },
  conversationItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: THEME_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  conversationDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    flex: 1,
    marginRight: 8,
  },
  time: {
    fontSize: 12,
    color: "#999999",
  },
  messagePreviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  messagePreview: {
    fontSize: 14,
    color: "#666666",
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    fontWeight: "500",
    color: "#333333",
  },
  unreadBadge: {
    backgroundColor: THEME_COLOR,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  unreadCount: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#666666",
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999999",
    marginTop: 8,
    textAlign: "center",
  },
  newChatButton: {
    marginTop: 24,
    backgroundColor: THEME_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  newChatButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  headerButton: {
    padding: 8,
  }
});