//Screen creator: Dulith

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert
} from "react-native";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import { TextInput } from "react-native";
import Header_2 from "../../components/Header_2";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL, ENDPOINTS } from "../../config/api";
import { Ionicons, FontAwesome } from "@expo/vector-icons";

const OrderScreen = () => {
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Requested");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false);
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Add these new state variables
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderPayment, setOrderPayment] = useState(false);
  
  // Orders state
  const [orders, setOrders] = useState({
    Requested: [],
    Ongoing: [],
    History: []
  });

  // Fetch orders on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  // Function to fetch orders from the API
  const fetchOrders = async () => {
    try {
      setError(null);
      if (!refreshing) setLoading(true);
      
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}${ENDPOINTS.GET_ORDERS}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("Orders response:", response.data);
      
      // Process and categorize orders
      const orderData = response.data;
      const requestedOrders = [];
      const ongoingOrders = [];
      const historyOrders = [];

      orderData.forEach(order => {
        // Format date
        const formattedDate = new Date(order.requestDate).toLocaleDateString();
        
        // Get the relevant name based on user role
        let relevantName, relevantUsername, relevantId;
        
        if (order.userRole === 'worker') {
          // If I'm the worker, show owner's info
          relevantName = order.ownerName;
          relevantUsername = order.ownerUsername;
          relevantId = order.ownerId;
        } else {
          // If I'm the owner, show worker's info
          relevantName = order.workerName;
          relevantUsername = order.workerUsername;
          relevantId = order.workerId;
        }
        
        // Create a consistent order object
        const formattedOrder = {
          id: order.orderId,
          orderId: order._id, // Store MongoDB ID for API calls
          name: relevantName || relevantUsername || "Unknown User", // Use name or fall back to username
          date: formattedDate,
          image: (order.userRole === 'worker' ? order.ownerAvatar : order.workerAvatar) || require("../../assets/gemimg/user1.jpg"),
          status: order.status,
          gems: order.gems || [],
          specialNote: order.specialNote || "",
          statusHistory: order.statusHistory || [],
          workerId: order.workerId,
          ownerId: order.ownerId,
          orderType: order.orderType,
          price: order.price,
          requestDate: order.requestDate,
          acceptedDate: order.acceptedDate,
          completedDate: order.completedDate,
          userRole: order.userRole // Store user's relationship to this order
        };

        // Categorize orders based on status
        if (order.status === "requested") {
          requestedOrders.push(formattedOrder);
        } else if (["accepted", "processing", "inProgress"].includes(order.status.toLowerCase())) {
          ongoingOrders.push(formattedOrder);
        } else if (["completed", "declined", "cancelled"].includes(order.status.toLowerCase())) {
          historyOrders.push(formattedOrder);
        }
      });

      // Update state with categorized orders
      setOrders({
        Requested: requestedOrders,
        Ongoing: ongoingOrders,
        History: historyOrders
      });
      
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    
    if (activeTab === "Ongoing" || activeTab === "History") {
      // Show tracking modal instead of navigating
      setTrackingModalVisible(true);
      
      // Set initial status based on order data
      setOrderCompleted(order.status === "completed");
      setOrderPayment(order.status === "completed" && order.paymentReceived);
    } else {
      setIsModalVisible(true);
    }
  };

  const handleAccept = async () => {
    setIsModalVisible(false);
    setIsPriceModalVisible(true);
  };

  // Update the handleDecline function to use the correct API endpoint
  const handleDecline = async () => {
    try {
      if (!selectedOrder) return;
      
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Authentication required. Please log in.");
        return;
      }

      // Update order status to declined using the PATCH endpoint
      await axios.patch(
        `${API_URL}/api/orders/${selectedOrder.orderId}/status`, // Use the correct route pattern
        { 
          status: "declined", 
          note: "Order declined by worker" 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Close modal and refresh orders
      setIsModalVisible(false);
      fetchOrders();
      Alert.alert("Success", "Order has been declined");
      
    } catch (error) {
      console.error("Error declining order:", error);
      Alert.alert(
        "Error", 
        error.response?.data?.message || "Failed to decline order"
      );
    }
  };

  // Update the handleSendPrice function to use the correct API endpoint
  const handleSendPrice = async () => {
    try {
      if (!selectedOrder || !price) {
        Alert.alert("Error", "Please enter a valid service fee");
        return;
      }
      
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Authentication required. Please log in.");
        return;
      }

      // Parse price as a float to ensure it's treated as a number
      const priceValue = parseFloat(price);
      
      if (isNaN(priceValue) || priceValue <= 0) {
        Alert.alert("Error", "Please enter a valid service fee amount");
        return;
      }

      // Update order with price and set status to accepted using the PATCH endpoint
      await axios.patch(
        `${API_URL}/api/orders/${selectedOrder.orderId}/status`, // Use the correct route pattern
        { 
          status: "accepted", 
          price: priceValue,
          note: `Order accepted with service fee of LKR ${priceValue}`
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Close modal, reset price, and refresh orders
      setIsPriceModalVisible(false);
      setPrice("");
      fetchOrders();
      Alert.alert("Success", "Service fee has been sent to the customer");
      
    } catch (error) {
      console.error("Error accepting order:", error);
      
      // Show the specific error message from the API if available
      if (error.response?.data?.message === "Price is required when accepting an order") {
        Alert.alert("Error", "Please enter a service fee to accept this order");
      } else {
        Alert.alert("Error", error.response?.data?.message || "Failed to send price");
      }
    }
  };

  // Update handleMarkAsCompleted to use the same route
  const handleMarkAsCompleted = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Authentication required. Please log in.");
        return;
      }

      // Update order status to completed using the PATCH endpoint
      await axios.patch(
        `${API_URL}/api/orders/${selectedOrder.orderId}/status`,
        { 
          status: "completed",
          note: "Order marked as completed by worker"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrderCompleted(true);
      fetchOrders(); // Refresh orders
      
      Alert.alert("Success", "Order has been marked as completed");
    } catch (error) {
      console.error("Error marking order as completed:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to complete order");
    }
  };

  const handleConfirmPayment = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Authentication required. Please log in.");
        return;
      }

      // Update order payment status
      await axios.put(
        `${API_URL}${ENDPOINTS.UPDATE_ORDER}/${selectedOrder.orderId}/payment`,
        { 
          paymentReceived: true,
          note: "Payment received and confirmed"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrderPayment(true);
      fetchOrders(); // Refresh orders
      
      Alert.alert("Success", "Payment has been confirmed", [
        { 
          text: "OK", 
          onPress: () => setTrackingModalVisible(false) 
        }
      ]);
    } catch (error) {
      console.error("Error confirming payment:", error);
      Alert.alert("Error", error.response?.data?.message || "Failed to confirm payment");
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9CCDDB" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchOrders}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const currentOrders = orders[activeTab] || [];
    
    if (currentOrders.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {activeTab === "Requested" 
              ? "You have no requested orders" 
              : activeTab === "Ongoing" 
                ? "You have no ongoing orders" 
                : "You have no order history"}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {currentOrders.map((order) => (
          <TouchableOpacity
            key={order.id || order.orderId}
            style={styles.orderContainer}
            onPress={() => handleOrderClick(order)}
          >
            <Image 
              source={
                typeof order.image === 'string' 
                  ? { uri: order.image } 
                  : order.image
              } 
              style={styles.image} 
              defaultSource={require("../../assets/gemimg/user1.jpg")}
            />
            <View style={styles.orderDetails}>
              {/* 1. Order Type (Priority 1) */}
              <Text style={styles.orderTypeTitle}>
                {(order.orderType?.charAt(0).toUpperCase() + order.orderType?.slice(1)) || "Unknown"} Order
              </Text>
              
              {/* 2. Username (Priority 2) */}
              <Text style={styles.orderUsername}>
                {order.userRole === 'worker' ? 'Client: ' : 'Worker: '}
                <Text style={styles.orderName}>{order.name}</Text>
              </Text>
              
              {/* 3. Order ID (Priority 3) */}
              <Text style={styles.orderId}>Order#: {order.id}</Text>
              
              {/* 4. Order timestamp (Priority 4) */}
              <Text style={[styles.orderDate, baseScreenStylesNew.themeText]}>
                {activeTab === "Requested"
                  ? `Requested: ${new Date(order.requestDate).toLocaleString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}`
                  : activeTab === "Ongoing"
                    ? `Ongoing since: ${new Date(order.acceptedDate || order.requestDate).toLocaleDateString()}`
                    : `Completed: ${new Date(order.completedDate || order.requestDate).toLocaleDateString()}`}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderOrderTrackingModal = () => {
    if (!selectedOrder) return null;
    
    // Get status history or create default if not available
    const statusHistory = selectedOrder.statusHistory || [];
    const requested = {
      status: "requested",
      timestamp: selectedOrder.requestDate,
      note: "Order requested"
    };
    const accepted = statusHistory.find(s => s.status === "accepted") || 
                    (selectedOrder.status !== "requested" ? { 
                      status: "accepted", 
                      timestamp: selectedOrder.acceptedDate || selectedOrder.requestDate,
                      note: "Order accepted"
                    } : null);
    const inProgress = statusHistory.find(s => s.status === "inProgress") || 
                      (selectedOrder.status === "inProgress" ? {
                        status: "inProgress",
                        timestamp: new Date(),
                        note: "Order in progress"
                      } : null);
    const completed = statusHistory.find(s => s.status === "completed") || 
                      (selectedOrder.status === "completed" || orderCompleted ? {
                        status: "completed",
                        timestamp: selectedOrder.completedDate || new Date(),
                        note: "Order completed"
                      } : null);
    
    return (
      <Modal
        visible={trackingModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTrackingModalVisible(false)}
      >
        <View style={styles.trackingModalContainer}>
          <View style={styles.trackingModalContent}>
            <TouchableOpacity 
              onPress={() => setTrackingModalVisible(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            
            <Text style={styles.trackingModalHeader}>
              Order#: {selectedOrder.id}
            </Text>
            
            <ScrollView contentContainerStyle={styles.trackingScrollContainer}>
              {/* Gems section */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={[styles.gemScroll, baseScreenStylesNew.colorGreyLight1]}
              >
                {selectedOrder.gems && selectedOrder.gems.length > 0 ? (
                  selectedOrder.gems.map((gemId, index) => (
                    <View key={`gem-${index}`} style={styles.gemContainer}>
                      <Image 
                        source={require("../../assets/gem-images/gem1.jpeg")} 
                        style={styles.gemImage} 
                      />
                      <Text style={[styles.gemId, baseScreenStylesNew.blackText]}>{gemId}</Text>
                    </View>
                  ))
                ) : (
                  <View style={styles.gemContainer}>
                    <Text style={styles.noGemsText}>No gems attached</Text>
                  </View>
                )}
              </ScrollView>

              {/* Price and rating row */}
              <View style={styles.row}>
                <Text style={[styles.price, baseScreenStylesNew.blackText]}>
                  {selectedOrder.price ? `Rs. ${selectedOrder.price}` : 'Price not set'}
                </Text>
                <View style={styles.ratingSection}>
                  <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FontAwesome key={star} name="star" size={24} color="#70B5DF"/>
                    ))}
                  </View>
                </View>
              </View>
              
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
              </View>

              {/* Order status timeline */}
              <View style={styles.orderStatus}>
                <Text style={[styles.orderDet, baseScreenStylesNew.blackText]}>Order Details</Text>
                
                {/* Request status */}
                <View style={[styles.statusBoxRequest, baseScreenStylesNew.colorBlueTheme5]}>
                  <Image 
                    source={require("../../assets/owner-icons/order-request.png")} 
                    style={styles.statusIcon}
                  />
                  <View>
                    <Text style={styles.statusText}>Order Requested</Text>
                    <Text style={styles.dateText}>
                      {requested.timestamp ? 
                        `Requested on ${new Date(requested.timestamp).toLocaleDateString()}` : 
                        'Request date not available'}
                    </Text>
                  </View>
                </View>
                
                {/* Accept status */}
                {(accepted || selectedOrder.status !== "requested") && (
                  <View style={[styles.statusBoxAccept, baseScreenStylesNew.colorBlueTheme6]}>
                    <Image 
                      source={require("../../assets/owner-icons/order-accept.png")} 
                      style={styles.statusIcon}
                    />
                    <View>
                      <Text style={styles.statusText}>Order Accepted</Text>
                      <Text style={styles.dateText}>
                        {accepted?.timestamp ? 
                          `Accepted on ${new Date(accepted.timestamp).toLocaleDateString()}` : 
                          'Acceptance date not available'}
                      </Text>
                    </View>
                  </View>
                )}
                
                {/* In Progress status */}
                {(inProgress || ["inProgress", "completed"].includes(selectedOrder.status)) && (
                  <View style={[styles.statusBoxConfirm, baseScreenStylesNew.colorBlueTheme7]}>
                    <Image 
                      source={require("../../assets/owner-icons/order-confirm.png")} 
                      style={styles.statusIcon}
                    />
                    <View>
                      <Text style={styles.statusText}>Order In Progress</Text>
                      <Text style={styles.dateText}>
                        {inProgress?.timestamp ? 
                          `Started on ${new Date(inProgress.timestamp).toLocaleDateString()}` : 
                          'Start date not available'}
                      </Text>
                    </View>
                  </View>
                )}
                
                {/* Completed status */}
                {(completed || orderCompleted || selectedOrder.status === "completed") && (
                  <View style={[styles.statusBoxComplete, baseScreenStylesNew.colorBlueTheme8]}>
                    <Image 
                      source={require("../../assets/owner-icons/order-complete.png")} 
                      style={styles.statusIcon}
                    />
                    <View>
                      <Text style={styles.statusText}>Order Completed</Text>
                      <Text style={styles.dateText}>
                        {completed?.timestamp ? 
                          `Completed on ${new Date(completed.timestamp).toLocaleDateString()}` : 
                          'Completion date not available'}
                      </Text>
                    </View>
                  </View>
                )}
                
                {/* Payment status */}
                {(orderPayment || selectedOrder.paymentReceived) && (
                  <View style={[styles.statusBoxPayment, baseScreenStylesNew.colorBlueTheme9]}>
                    <Image 
                      source={require("../../assets/owner-icons/order-paid.png")} 
                      style={styles.statusIcon}
                    />
                    <View>
                      <Text style={styles.statusText}>Payment Received</Text>
                      <Text style={styles.dateText}>
                        Payment confirmed
                      </Text>
                    </View>
                  </View>
                )}
              </View>

              {/* Action buttons */}
              {selectedOrder.status !== "completed" && !orderCompleted && selectedOrder.userRole === "worker" && (
                <TouchableOpacity 
                  style={[styles.completeButton, baseScreenStylesNew.Button1]} 
                  onPress={handleMarkAsCompleted}
                >
                  <Text style={[styles.completeButtonText, baseScreenStylesNew.buttonText]}>
                    Mark as Completed
                  </Text>
                </TouchableOpacity>
              )}

              {(orderCompleted || selectedOrder.status === "completed") && 
               !orderPayment && !selectedOrder.paymentReceived && 
               selectedOrder.userRole === "worker" && (
                <TouchableOpacity 
                  style={[styles.paidButton, baseScreenStylesNew.Button1]} 
                  onPress={handleConfirmPayment}
                >
                  <Text style={[styles.completeButtonText, baseScreenStylesNew.buttonText]}>
                    Confirm Payment and Close the Order
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={baseScreenStylesNew.container}>
      <Header_2 title="Orders" />
      <View style={baseScreenStylesNew.tabBar}>
        {["Requested", "Ongoing", "History"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              baseScreenStylesNew.tabButton,
              activeTab === tab
                ? baseScreenStylesNew.tabButtonActive
                : baseScreenStylesNew.tabButtonInactive,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                baseScreenStylesNew.tabText,
                activeTab === tab
                  ? baseScreenStylesNew.tabTextActive
                  : baseScreenStylesNew.tabTextInactive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {renderContent()}

      {/* Modal for Accept/Decline - Only shown for workers */}
      <Modal visible={isModalVisible && selectedOrder?.userRole === 'worker'} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              onPress={() => setIsModalVisible(false)} // Changed from setOrderModalVisible
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalHeader}>Order Details</Text>
            {selectedOrder && (
              <>
                <Image 
                  source={
                    typeof selectedOrder.image === 'string'
                      ? { uri: selectedOrder.image }
                      : selectedOrder.image
                } 
                style={styles.modalImage} 
                defaultSource={require("../../assets/gemimg/user1.jpg")}
              />
              <Text style={styles.modalText}>
                Client: {selectedOrder.name}
              </Text>
              <Text style={styles.modalText}>
                Order ID: {selectedOrder.id}
              </Text>
              <Text style={styles.modalText}>
                Type: {selectedOrder.orderType}
              </Text>
              <Text style={styles.modalText}>
                Gems: {selectedOrder.gems?.length || 0}
              </Text>
              <Text style={styles.modalText}>
                Requested Date: {selectedOrder.date}
              </Text>
              {selectedOrder.specialNote && (
                <Text style={styles.modalNote}>
                  Note: {selectedOrder.specialNote}
                </Text>
              )}
            </>
          )}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[baseScreenStylesNew.Button1, styles.declineButton]}
              onPress={handleDecline}
            >
              <Text style={baseScreenStylesNew.buttonText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[baseScreenStylesNew.Button1, styles.acceptButton]}
              onPress={handleAccept}
            >
              <Text style={baseScreenStylesNew.buttonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

    {/* Modal for owner viewing order details - when userRole is owner */}
    <Modal visible={isModalVisible && selectedOrder?.userRole === 'owner'} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            onPress={() => setIsModalVisible(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.modalHeader}>Order Details</Text>
          {selectedOrder && (
            <>
              <Image 
                source={
                  typeof selectedOrder.image === 'string'
                    ? { uri: selectedOrder.image }
                    : selectedOrder.image
                } 
                style={styles.modalImage} 
                defaultSource={require("../../assets/gemimg/user1.jpg")}
              />
              <Text style={styles.modalText}>
                Worker: {selectedOrder.name}
              </Text>
              <Text style={styles.modalText}>
                Order ID: {selectedOrder.id}
              </Text>
              <Text style={styles.modalText}>
                Type: {selectedOrder.orderType}
              </Text>
              <Text style={styles.modalText}>
                Requested Date: {selectedOrder.date}
              </Text>
              {selectedOrder.specialNote && (
                <Text style={styles.modalNote}>
                  Note: {selectedOrder.specialNote}
                </Text>
              )}
            </>
          )}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[baseScreenStylesNew.Button1, styles.acceptButton]}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={baseScreenStylesNew.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

    {/* Modal for Price Input */}
    <Modal visible={isPriceModalVisible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity 
            onPress={() => setIsPriceModalVisible(false)}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.modalHeader}>Set Service Fee</Text>
          {selectedOrder && (
            <>
              <Image 
                source={
                  typeof selectedOrder.image === 'string'
                    ? { uri: selectedOrder.image }
                    : selectedOrder.image
                } 
                style={styles.modalImage}
                defaultSource={require("../../assets/gemimg/user1.jpg")}
              />
              <Text style={styles.modalText}>
                Client: {selectedOrder.name}
              </Text>
              <Text style={styles.modalText}>
                Order ID: {selectedOrder.id}
              </Text>
              <Text style={styles.modalText}>
                Requested Date: {selectedOrder.date}
              </Text>

              <TextInput
                style={styles.priceInput}
                placeholder="Service fee (LKR)"
                placeholderTextColor="#ffffff99"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
              <TouchableOpacity
                style={[baseScreenStylesNew.Button1, styles.sendButton]}
                onPress={handleSendPrice}
              >
                <Text style={styles.buttonText}>Send</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>

    {/* Order tracking modal - new! */}
    {renderOrderTrackingModal()}
  </View>
);
};

const styles = StyleSheet.create({
  // Keep most existing styles
  
  // Add new styles for loading and error states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#9CCDDB',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  modalNote: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    fontStyle: 'italic',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  
  // Rest of your styles...
  spacer: {
    height: 20,
  },
  
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    backgroundColor: "#072D44",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
  },
 
  tab: {
    backgroundColor: 'transparent',
    alignItems: "center",
    paddingVertical: 5,
   
  },
  tabText: {
    fontWeight: "bold",
    color: "#000", 
    backgroundColor: "#ffffff", 
    paddingHorizontal: 25,
    borderRadius: 20,
    paddingVertical: 15,
    fontSize: 15,
  },
  activeTabText: {
    fontWeight: "bold",
    color: "#ffffff", 
    backgroundColor: "#170969", 
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  orderContainer: {
    flexDirection: "row",
    backgroundColor: "rgb(255, 255, 255)",
    margin: 13,
    padding: 12,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "rgba(228, 227, 227, 0.61)",
    elevation: 9,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 12,
    borderRadius: 10,
  },
  orderDetails: {
    flex: 1,
    overflow: 'hidden', // Ensure content doesn't overflow
  },
  orderTypeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9CCDDB", // Theme color
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  orderUsername: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  orderName: {
    color: "#000",
    fontWeight: "600",
  },
  orderId: {
    fontSize: 13,
    color: "#444",
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 12,
    marginTop: 2,
  },
  
  // For Modal Close Buttons
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Keep other styles as they are
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Change from "white" to semi-transparent black
  },
  modalContent: {
    backgroundColor: "rgb(220, 220, 220)",
    borderWidth: 2,
    borderColor: "rgba(228, 227, 227, 0.61)",
    width: "80%",
    height: "50%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",

  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#000", 
    marginBottom: 10,
    
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
  },
  declineButton: {
    borderRadius: 8,
    width: "40%",
  },
  acceptButton: {
    borderRadius: 8,
    width: "40%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalImage: {
    width: 100, 
    height: 100, 
    borderRadius: 10,
    marginBottom: 25, 
  },
  priceInput: {
    borderWidth: 1,
    borderColor: "#ffffff99",
    color: "#fff",
    width: "80%",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor:"#072D44"
  },
  sendButton: {
    padding: 10,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
  },
  orderType: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  
  // Add new styles for tracking modal
  trackingModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  trackingModalContent: {
    width: '90%',
    height: '85%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    position: 'relative',
  },
  trackingModalHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginVertical: 10,
  },
  trackingScrollContainer: {
    paddingBottom: 20,
  },
  
  // Gem scroll styles
  gemScroll: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
    backgroundColor: 'rgba(172, 168, 168, 0.21)',
  },
  gemContainer: {
    alignItems: "center",
    marginRight: 15,
    marginLeft: 5,
  },
  gemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  gemId: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 5,
  },
  noGemsText: {
    fontStyle: 'italic',
    color: '#888',
    padding: 20,
  },
  
  // Price and rating row
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
  ratingSection: {
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
  },
  
  // Divider
  dividerContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
  },
  
  // Order status section
  orderStatus: {
    marginTop: 10,
    paddingBottom: 20,
  },
  orderDet: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
    marginLeft: 10,
  },
  statusBoxRequest: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 40,
  },
  statusBoxAccept: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 40,
  },
  statusBoxConfirm: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 40,
  },
  statusBoxComplete: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 40,
  },
  statusBoxPayment: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    marginHorizontal: 40,
  },
  statusIcon: {
    width: 50,
    height: 50,
    marginLeft: 10,
    marginRight: 15,
  },
  statusText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  dateText: {
    color: "white",
    fontSize: 12,
    marginTop: 5
  },
  
  // Action buttons
  completeButton: {
    paddingVertical: 12,
    borderRadius: 10,
    width: '80%',
    marginTop: 20,
    alignSelf: "center"
  },
  paidButton: {
    paddingVertical: 14,
    borderRadius: 10,
    width: '80%',
    marginTop: 20,
    alignSelf: "center"
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center"
  },
});

export default OrderScreen;
