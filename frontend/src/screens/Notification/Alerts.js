import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  ActivityIndicator, 
  Alert,
  RefreshControl,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { baseScreenStylesNew } from '../../styles/baseStylesNew';
import Header_1 from '../../components/Header_1';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL, ENDPOINTS } from '../../config/api';
import { useNavigation } from '@react-navigation/native';

const THEME_COLOR = '#007BFF'; // Keep consistent with your existing blue theme

const AlertsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [hasUnread, setHasUnread] = useState(false);

  // Fetch alerts from API
  const fetchAlerts = async (showRefresh = false) => {
    try {
      // Only set loading true if not refreshing
      if (!showRefresh) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      
      const token = await AsyncStorage.getItem("authToken");
      
      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      const response = await axios.get(`${API_URL}${ENDPOINTS.ALERTS}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data) {
        setNotifications(response.data);
        // Check if there are any unread notifications
        setHasUnread(response.data.some(alert => !alert.read));
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching alerts:", err);
      setError("Failed to load alerts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load alerts when component mounts
  useEffect(() => {
    fetchAlerts();
  }, []);
  
  // Function to format time
  const formatTime = (timestamp) => {
    const now = new Date();
    const alertDate = new Date(timestamp);
    const diffMs = now - alertDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time
      return alertDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays < 7) {
      // Within a week - show day name
      return alertDate.toLocaleDateString([], { weekday: 'short' });
    } else if (alertDate.getFullYear() === now.getFullYear()) {
      // This year - show month and day
      return alertDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } else {
      // Different year - show date with year
      return alertDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  // Mark all alerts as read
  const markAllAsRead = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      
      // If no unread notifications, return early
      if (!hasUnread) {
        return;
      }
      
      await axios.put(`${API_URL}${ENDPOINTS.MARK_ALL_ALERTS_READ}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update local state - mark all notifications as read
      setNotifications(prevNotifications => 
        prevNotifications.map(alert => ({ ...alert, read: true }))
      );
      
      setHasUnread(false);
      
      // Show brief success message
      Alert.alert("Success", "All notifications marked as read");
      
    } catch (err) {
      console.error("Error marking all alerts as read:", err);
      Alert.alert("Error", "Failed to mark all as read");
    }
  };

  // Delete selected alerts
  const deleteSelectedAlerts = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      
      for (const id of selectedIds) {
        await axios.delete(`${API_URL}${ENDPOINTS.ALERTS}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      // Refresh alerts after deletion
      fetchAlerts();
      setSelectedIds([]);
      setIsSelectionMode(false);
    } catch (err) {
      console.error("Error deleting alerts:", err);
      Alert.alert("Error", "Failed to delete alerts");
    }
  };

  // Mark single alert as read when clicked
  const markAsRead = async (id) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      
      await axios.put(`${API_URL}${ENDPOINTS.MARK_ALERT_READ}/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(alert => 
          alert._id === id ? { ...alert, read: true } : alert
        )
      );

      // Check if we still have any unread notifications
      const stillHasUnread = notifications.some(alert => 
        alert._id !== id && !alert.read
      );
      setHasUnread(stillHasUnread);
      
    } catch (err) {
      console.error("Error marking alert as read:", err);
    }
  };

  // Handle alert click
  const handleAlertClick = (alert) => {
    if (isSelectionMode) {
      handlePress(alert._id);
    } else {
      markAsRead(alert._id);
      
      // Navigate if clickAction is specified
      if (alert.clickAction) {
        const [screen, params] = alert.clickAction.split('/');
        navigation.navigate(screen, { id: params });
      }
    }
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map(item => item._id));
    }
  };

  // Handle press on alert (for selection mode)
  const handlePress = (id) => {
    setSelectedIds(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(selectedId => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  // Close selection mode
  const handleCloseSelection = () => {
    setIsSelectionMode(false);
    setSelectedIds([]);
  };

  // Enter selection mode
  const enterSelectionMode = () => {
    setIsSelectionMode(true);
  };

  // Render alert item
  const renderAlertItem = ({ item }) => {
    const isSelected = selectedIds.includes(item._id);
    const profileImage = item.senderImage 
      ? { uri: item.senderImage }
      : require('../../assets/gemimg/user1.jpg'); // Default image
    
    return (
      <TouchableOpacity
        onPress={() => handleAlertClick(item)}
        style={[
          styles.alertItem, 
          !item.read && !isSelected && styles.unreadAlert,
          isSelected && baseScreenStylesNew.themeColor
        ]}
      >
        <Image source={profileImage} style={styles.alertImage} />
        <View style={styles.alertTextContainer}>
          <Text style={[styles.alertName, isSelected && styles.selectedText]}>
            {item.senderName || "System"}
          </Text>
          <Text style={[styles.alertMessage, isSelected && styles.selectedText]}>
            {item.message}
          </Text>
        </View>
        <Text style={[styles.alertTime, isSelected && styles.selectedText]}>
          {formatTime(item.createdAt)}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <Header_1 title="Alerts" />
      
      <TouchableWithoutFeedback onPress={handleCloseSelection}>
        <View style={styles.container}>
          {/* Top action bar */}
          <View style={styles.topBar}>
            {/* Left side - Mark All Read button (only shown when there are unread notifications) */}
            {hasUnread && (
              <TouchableOpacity 
                onPress={markAllAsRead}
                style={styles.actionButton}
              >
                <Ionicons name="checkmark-done-outline" size={22} color={THEME_COLOR} />
                <Text style={styles.actionButtonText}>Mark All Read</Text>
              </TouchableOpacity>
            )}
            
            {/* Right side - Select button */}
            <View style={styles.rightActions}>
              {!isSelectionMode ? (
                <TouchableOpacity 
                  onPress={enterSelectionMode}
                  style={styles.actionButton}
                >
                  <Ionicons name="checkbox-outline" size={22} color={THEME_COLOR} />
                  <Text style={styles.actionButtonText}>Select</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  onPress={handleCloseSelection}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          {/* Selection mode indicator */}
          {isSelectionMode && (
            <View style={styles.selectionBar}>
              <Text style={styles.selectionText}>
                {selectedIds.length} selected
              </Text>
              <TouchableOpacity onPress={toggleSelectAll}>
                <Text style={styles.selectAllText}>
                  {selectedIds.length === notifications.length ? "Deselect All" : "Select All"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          
          {/* Alerts list or empty/loading/error state */}
          {loading ? (
            <View style={styles.centeredContainer}>
              <ActivityIndicator size="large" color={THEME_COLOR} />
              <Text style={styles.loadingText}>Loading alerts...</Text>
            </View>
          ) : error ? (
            <View style={styles.centeredContainer}>
              <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => fetchAlerts()}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : notifications.length === 0 ? (
            <View style={styles.centeredContainer}>
              <Ionicons name="notifications-off-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No alerts yet</Text>
            </View>
          ) : (
            <FlatList
              data={notifications}
              renderItem={renderAlertItem}
              keyExtractor={item => item._id}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => fetchAlerts(true)}
                  colors={[THEME_COLOR]}
                  tintColor={THEME_COLOR}
                />
              }
              contentContainerStyle={styles.listContainer}
            />
          )}
          
          {/* Delete Button (Visible Only in Selection Mode with items selected) */}
          {isSelectionMode && selectedIds.length > 0 && (
            <TouchableOpacity 
              style={[baseScreenStylesNew.themeColor, styles.deleteButton]} 
              onPress={deleteSelectedAlerts}
            >
              <Ionicons name="trash-outline" size={24} color="white" />
              <Text style={styles.deleteText}>Delete ({selectedIds.length})</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    padding: 6,
  },
  actionButtonText: {
    color: THEME_COLOR,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  selectionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f7ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectionText: {
    fontSize: 16,
    fontWeight: '500',
    color: THEME_COLOR,
  },
  selectAllText: {
    fontSize: 14,
    color: THEME_COLOR,
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 80, // Add space at bottom for delete button
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
  },
  deleteText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 5,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 7,
    marginVertical: 1,
    marginHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  alertImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  alertMessage: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  alertTime: {
    fontSize: 12,
    color: '#666',
    marginRight: 8
  },
  selectedText: {
    color: 'white', // Change text color when selected
  },
  unreadAlert: {
    backgroundColor: '#f0f7ff',  // Light blue background for unread alerts
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    color: '#333333',
    marginTop: 12,
    fontSize: 16,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: THEME_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AlertsScreen;
