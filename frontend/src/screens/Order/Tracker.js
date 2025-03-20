import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Linking,
  TextInput
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { API_URL, ENDPOINTS } from "../../config/api";
import HeaderBar from "../../components/HeaderBar";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import { orderStyles } from "../../styles/OrderStyles"; // Import shared styles
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import ImageView from "react-native-image-viewing";

const TrackerScreen = ({ navigation }) => {
  // State variables
  const [activeTab, setActiveTab] = useState("Requested");
  const [orders, setOrders] = useState({
    Requested: [],
    Ongoing: [],
    Completed: [], // New category
    History: [],
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);
  // Add state for receipt photo upload
  const [receiptPhoto, setReceiptPhoto] = useState(null);
  const [isReceiptModalVisible, setIsReceiptModalVisible] = useState(false);
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(false);
const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
const [cancelReason, setCancelReason] = useState('');

  // Fetch orders on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  // Function to refresh data
  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // Function to fetch orders
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

      const response = await axios.get(
        `${API_URL}${ENDPOINTS.GET_ORDERS_OWNER}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Orders response:", response.data);

      // Filter orders where userRole is owner
      const ownerOrders = response.data.filter(
        (order) => order.userRole === "owner"
      );

      // Process and categorize orders
      const requestedOrders = [];
      const ongoingOrders = [];
      const completedOrders = []; // New array
      const historyOrders = [];

      ownerOrders.forEach((order) => {
        // Format date
        const formattedDate = new Date(order.requestDate).toLocaleDateString();

        // Create a consistent order object
        const formattedOrder = {
          id: order.orderId,
          orderId: order._id, // Store MongoDB ID for API calls
          name: order.workerName || order.workerUsername || "Unknown Worker", // Use name or fall back to username
          date: formattedDate,
          image:
            order.workerPhoto ||
            require("../../assets/default-images/avatar.png"),
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
          userRole: order.userRole, // Store user's relationship to this order
        };

        const normalizedStatus = String(order.status || "")
          .toLowerCase()
          .trim();

        switch (normalizedStatus) {
          case "requested":
            requestedOrders.push(formattedOrder);
            break;
          case "accepted":
            ongoingOrders.push(formattedOrder);
            break;
          case "pendingpayment":
            formattedOrder.isPendingPayment = true;
            completedOrders.push(formattedOrder);
            break;
          case "completed":
            completedOrders.push(formattedOrder);
            break;
          case "cancelled":
            // Include cancellation details in the formatted order
            formattedOrder.cancellation = order.cancellation || {};
            historyOrders.push(formattedOrder);
            break;
          case "paymentcompleted":
          case "declined":
            historyOrders.push(formattedOrder);
            break;
          default:
            console.warn(`Unrecognized status: "${order.status}" for order #${order.orderId}`);
            requestedOrders.push(formattedOrder);
        }
      });

      // Update state with categorized orders
      setOrders({
        Requested: requestedOrders,
        Ongoing: ongoingOrders,
        Completed: completedOrders, // Add new category
        History: historyOrders,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Add this function to your TrackerScreen component
  const handleOrderClick = async (order) => {
    try {
      // First show the modal with basic details
      setSelectedOrder(order);
      setTrackingModalVisible(true);

      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("Authentication token missing");
        return;
      }

      // Debug: Extract the correct order ID
      const orderId = order.orderId || order._id || order.id;

      // Debug: Log the API request details
      const apiUrl = `${API_URL}${ENDPOINTS.ORDERS}/owner-view/${orderId}`;
      console.log("Fetching order details from:", apiUrl);
      console.log("Order object:", {
        id: order.id,
        orderId: order.orderId,
        _id: order._id,
      });

      // Make the request to get detailed order info including gems
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Debug: Log the response
      console.log(
        "Order details response:",
        JSON.stringify(response.data, null, 2)
      );

      if (response.data && response.data.success) {
        const detailedOrder = response.data.order;

        // Ensure the gems array is properly formatted for React Native
        const formattedGems = detailedOrder.gems?.map(gem => ({
          _id: gem._id || '',
          id: gem.gemId || '',
          // Update how we get the gem type
          type: gem.details?.gemType || gem.gemType || gem.type || 'Unknown',
          // Handle weight and other properties
          weight: gem.details?.weight || gem.weight || 0,
          color: gem.details?.color || gem.color || '',
          photo: gem.photo || '',
          status: gem.status || ''
        })) || [];

        // Update the selected order with detailed information
        setSelectedOrder(prevOrder => ({
          ...prevOrder,
          gems: formattedGems,
          statusHistory: detailedOrder.statusHistory || [],
          specialNote: detailedOrder.specialNote || prevOrder.specialNote || '',
          price: detailedOrder.price || prevOrder.price,
          orderType: detailedOrder.orderType || prevOrder.orderType,
          receiptPhoto: detailedOrder.payment?.receiptPhoto || prevOrder.receiptPhoto,
          payment: detailedOrder.payment || prevOrder.payment || {},
          cancellation: detailedOrder.cancellation || prevOrder.cancellation || {}
        }));
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      // Continue showing modal with basic info since we've already opened it
    }
  };

//handle order cancellation
const handleCancelOrder = async () => {
  if (!cancelReason.trim()) {
    Alert.alert('Error', 'Please provide a reason for cancellation');
    return;
  }

  try {
    const token = await AsyncStorage.getItem("authToken");
    const orderId = selectedOrder.orderId || selectedOrder._id;
    
    if (!orderId) {
      Alert.alert('Error', 'Invalid order ID');
      return;
    }

    const response = await axios.patch(
      `${API_URL}/api/orders/${orderId}/cancel`,
      {
        cancelReason: cancelReason
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (response.data.success) {
      Alert.alert('Success', 'Order cancelled successfully');
      setIsCancelModalVisible(false);
      setCancelReason('');
      setTrackingModalVisible(false);
      fetchOrders(); // Refresh orders list
    }
  } catch (error) {
    console.error('Cancel order error:', error);
    Alert.alert('Error', error.response?.data?.message || 'Failed to cancel order');
  }
};

  // Function to pick an image from gallery without forcing cropping
  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Permission to access media library is required!"
        );
        return;
      }

      // Launch image picker without requiring cropping
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, // Changed to false to avoid forcing cropping
        quality: 0.8,
      });

      if (!result.canceled) {
        setReceiptPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  // Function to upload receipt and confirm payment
  const confirmPayment = async () => {
    try {
      if (!selectedOrder) return;
      if (!receiptPhoto) {
        Alert.alert("Error", "Please upload a receipt photo first");
        return;
      }

      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Authentication required. Please log in.");
        return;
      }

      setLoading(true);
      
      // Get file extension from URI
      const uriParts = receiptPhoto.split('.');
      const fileType = uriParts[uriParts.length - 1];

      // Create form data with proper filename and type
      const formData = new FormData();
      formData.append("receiptPhoto", {
        uri: receiptPhoto,
        name: `receipt.${fileType || 'jpg'}`,
        type: `image/${fileType || 'jpeg'}`
      });
      formData.append("status", "pendingPayment");
      formData.append(
        "note",
        "Payment made and receipt uploaded by owner. Awaiting confirmation."
      );

      console.log("Receipt photo URI:", receiptPhoto);

      const orderId = selectedOrder.orderId || selectedOrder._id;
      console.log("Uploading payment receipt for order:", orderId);

      // Upload receipt and update status
      const response = await axios.patch(
        `${API_URL}/api/orders/owner/${orderId}/payment`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Payment receipt upload response:", response.data);
      
      // Close modal and update state
      setIsReceiptModalVisible(false);
      setReceiptPhoto(null);

      // Update the local order status
      setSelectedOrder((prev) => ({
        ...prev,
        status: "pendingPayment",
        receiptPhoto: response.data.order.receiptPhoto,
        statusHistory: response.data.order.statusHistory || prev.statusHistory,
      }));

      // Refresh orders list
      fetchOrders();
      
      Alert.alert("Success", "Payment receipt uploaded successfully");
    } catch (error) {
      console.error("Error uploading receipt:", error.response?.data || error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to upload receipt"
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to render content based on active tab
  const renderContent = () => {
    if (loading) {
      return (
        <View style={orderStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#9CCDDB" />
          <Text style={orderStyles.loadingText}>Loading orders...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={orderStyles.errorContainer}>
          <Text style={orderStyles.errorText}>{error}</Text>
          <TouchableOpacity
            style={orderStyles.retryButton}
            onPress={fetchOrders}
          >
            <Text style={orderStyles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    const currentOrders =
      activeTab === "History"
        ? (orders[activeTab] || []).filter((order) =>
            ["paymentCompleted", "declined", "cancelled"].includes(order.status)
          )
        : orders[activeTab] || [];

    if (currentOrders.length === 0) {
      return (
        <View style={orderStyles.emptyContainer}>
          <Text style={orderStyles.emptyText}>
            {activeTab === "Requested"
              ? "You have no requested orders"
              : activeTab === "Ongoing"
              ? "You have no ongoing orders"
              : activeTab === "Completed"
              ? "You have no completed orders"
              : "You have no order history"}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={orderStyles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {currentOrders.map((order) => (
          <TouchableOpacity
            key={order.id || order.orderId}
            style={orderStyles.orderContainer}
            onPress={() => handleOrderClick(order)}
          >
            <Image
              source={
                typeof order.image === "string"
                  ? { uri: order.image }
                  : order.image
              }
              style={orderStyles.image}
              defaultSource={require("../../assets/default-images/avatar.png")}
            />
            <View style={orderStyles.orderDetails}>
              {/* Order header with title and badge */}
              <View style={orderStyles.orderCardHeader}>
                {/* 1. Order Type (Priority 1) */}
                <Text style={orderStyles.orderTypeTitle}>
                  {order.orderType?.charAt(0).toUpperCase() +
                    order.orderType?.slice(1) || "Unknown"}{" "}
                  Order
                </Text>

                {/* Update badge styles and text to match status */}
                {order.status?.toLowerCase() === "completed" && (
                  <View style={[orderStyles.pendingPaymentBadge, {backgroundColor: '#3498db'}]}>
                    <Text style={orderStyles.pendingPaymentText}>
                    Payment Pending
                    </Text>
                  </View>
                )}
                {order.status?.toLowerCase() === "pendingpayment" && (
                  <View style={[orderStyles.pendingPaymentBadge, {backgroundColor: '#f39c12'}]}>
                    <Text style={orderStyles.pendingPaymentText}>
                      Payment Review
                    </Text>
                  </View>
                )}
                {/* Show receipt icon for History orders with payment receipts */}
                {activeTab === "History" && order.receiptPhoto && (
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      setFullScreenImage({ uri: order.receiptPhoto });
                      setIsImageViewerVisible(true);
                    }}
                    style={{ padding: 5 }}
                  >
                    <Ionicons name="receipt-outline" size={20} color="#3498db" />
                  </TouchableOpacity>
                )}
                {/* Add cancelled badge */}
                {order.status?.toLowerCase() === "cancelled" && (
                  <View style={[
                    orderStyles.pendingPaymentBadge, 
                    { backgroundColor: '#e74c3c' }
                  ]}>
                    <Text style={orderStyles.pendingPaymentText}>
                      Cancelled
                    </Text>
                  </View>
                )}
              </View>

              {/* 2. Username (Priority 2) */}
              <Text style={orderStyles.orderUsername}>
                Worker: <Text style={orderStyles.orderName}>{order.name}</Text>
              </Text>

              {/* 3. Order ID (Priority 3) */}
              <Text style={orderStyles.orderId}>Order#: {order.id}</Text>

              {/* 4. Order timestamp (Priority 4) */}
              <Text
                style={[orderStyles.orderDate, baseScreenStylesNew.themeText]}
              >
                {activeTab === "Requested"
                  ? `Requested: ${new Date(order.requestDate).toLocaleString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}`
                  : activeTab === "Ongoing"
                  ? `Ongoing since: ${new Date(
                      order.acceptedDate || order.requestDate
                    ).toLocaleDateString()}`
                  : activeTab === "History" && order.status?.toLowerCase() === "paymentcompleted"
                  ? `Payment completed: ${
                      order.payment?.paymentConfirmedDate ? 
                      new Date(order.payment.paymentConfirmedDate).toLocaleDateString() : 
                      new Date(order.updatedAt || order.completedDate).toLocaleDateString()
                    }`
                  : `Cancelled: ${new Date(
                      order.completedDate || order.requestDate
                    ).toLocaleDateString()}`}
              </Text>
              {/* Add cancellation reason if available */}
              {order.status?.toLowerCase() === "cancelled" && order.cancellation?.reason && (
                <Text style={[orderStyles.orderDate, { color: '#e74c3c' }]}>
                  Reason: {order.cancellation.reason}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  // Order Tracking Modal (same as Orders.js but removing worker-specific actions)
  const renderOrderTrackingModal = () => {
    if (!selectedOrder) return null;

    // Get status history or create default if not available
    const statusHistory = selectedOrder.statusHistory || [];
    const requested = {
      status: "requested",
      timestamp: selectedOrder.requestDate,
      note: "Order requested",
    };
    const accepted =
      statusHistory.find((s) => s.status === "accepted") ||
      (selectedOrder.status !== "requested"
        ? {
            status: "accepted",
            timestamp: selectedOrder.acceptedDate || selectedOrder.requestDate,
            note: "Order accepted",
          }
        : null);
    const completed =
      statusHistory.find((s) => s.status === "completed") ||
      (selectedOrder.status === "completed" || selectedOrder.status === "pendingPayment"
        ? {
            status: "completed",
            timestamp: selectedOrder.completedDate || new Date(),
            note: "Order completed",
          }
        : null);
    const pendingPayment =
      statusHistory.find((s) => s.status === "pendingPayment") ||
      (selectedOrder.status === "pendingPayment"
        ? {
            status: "pendingPayment",
            timestamp: selectedOrder.completedDate || new Date(),
            note: "Order completed, awaiting payment",
          }
        : null);

    // Add padding to scroll content when buttons need to be shown
    const needsButtonSpace = activeTab === "Completed" && 
      (selectedOrder.status === "completed" || selectedOrder.status === "pendingPayment");

    return (
      <Modal
        visible={trackingModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setTrackingModalVisible(false)}
      >
        <View style={orderStyles.trackingModalContainer}>
          <View style={orderStyles.trackingModalContent}>
            <TouchableOpacity
              onPress={() => setTrackingModalVisible(false)}
              style={orderStyles.closeButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>

            <View style={orderStyles.modalHeaderContainer}>
              <Text style={orderStyles.trackingModalHeader}>
                Order#: {selectedOrder.id || selectedOrder.orderId}
              </Text>
            </View>
            
            {/* Show pending badge in modal header with better label */}
            {selectedOrder.status?.toLowerCase() === "pendingpayment" && (
              <View style={[orderStyles.pendingPaymentBadge, { 
                marginLeft: 10,
                backgroundColor: '#f39c12' // Consistent orange color for review status
              }]}>
                <Text style={orderStyles.pendingPaymentText}>
                  Payment Review
                </Text>
              </View>
            )}
            {/* Show pending badge in modal header */}
{selectedOrder.status?.toLowerCase() === "completed" && (
  <View style={[orderStyles.pendingPaymentBadge, { 
    marginLeft: 10,
    backgroundColor: '#3498db'
  }]}>
    <Text style={orderStyles.pendingPaymentText}>
      Payment Pending
    </Text>
  </View>
)}
            
            <ScrollView
              contentContainerStyle={[
                orderStyles.trackingScrollContainer,
                // Add padding when buttons will be shown
                needsButtonSpace && { paddingBottom: 80 }
              ]}
            >
              {/* Gems section with detailed information */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={[
                  orderStyles.gemScroll,
                  baseScreenStylesNew.colorGreyLight1,
                ]}
              >
                {selectedOrder.gems && selectedOrder.gems.length > 0 ? (
                  selectedOrder.gems.map((gem, index) => {
                    // Ensure all gem properties are properly formatted as strings
                    const gemId =
                      typeof gem.id === "string"
                        ? gem.id
                        : String(gem.id || "");
                    const gemType =
                      typeof gem.type === "string"
                        ? gem.type
                        : String(gem.type || "Unknown");
                    const gemWeight =
                      gem.weight !== undefined ? Number(gem.weight) : 0;
                    const gemPhoto =
                      typeof gem.photo === "string" ? gem.photo : "";

                    return (
                      <View
                        key={`gem-${index}`}
                        style={orderStyles.gemContainer}
                      >
                        <Image
                          source={
                            gemPhoto && gemPhoto.startsWith("http")
                              ? { uri: gemPhoto }
                              : require("../../assets/gem-images/gem1.jpeg")
                          }
                          style={orderStyles.gemModalImage}
                          defaultSource={require("../../assets/gem-images/gem1.jpeg")}
                        />
                        <Text
                          style={[
                            orderStyles.gemModalType,
                            baseScreenStylesNew.blackText,
                          ]}
                        >
                          {gemType !== "Unknown"
                            ? gemType
                                .replace("_", " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase())
                            : "Gem"}
                        </Text>
                        {/* Changed condition to explicitly check if weight is a number and not undefined */}
                        {gemWeight !== undefined && gemWeight !== null && (
                          <Text
                            style={[
                              orderStyles.gemModalWeight,
                              baseScreenStylesNew.blackText,
                            ]}
                          >
                            {gemWeight} ct
                          </Text>
                        )}
                        <Text
                          style={[
                            orderStyles.gemId,
                            baseScreenStylesNew.blackText,
                          ]}
                        >
                          ID: {gemId.substring(0, 8)}
                        </Text>
                      </View>
                    );
                  })
                ) : (
                  <View style={orderStyles.gemContainer}>
                    <Text style={orderStyles.noGemsText}>No gems attached</Text>
                  </View>
                )}
              </ScrollView>

              {/* Order details section */}
              <View style={orderStyles.orderDetailsContainer}>
                <View style={orderStyles.detailRow}>
                  <Text style={orderStyles.detailLabel}>Order Type:</Text>
                  <Text style={orderStyles.detailValue}>
                    {selectedOrder.orderType?.charAt(0).toUpperCase() +
                      selectedOrder.orderType?.slice(1) || "Unknown"}
                  </Text>
                </View>

                <View style={orderStyles.detailRow}>
                  <Text style={orderStyles.detailLabel}>Worker:</Text>
                  <Text style={orderStyles.detailValue}>
                    {selectedOrder.name}
                  </Text>
                </View>

                <View style={orderStyles.detailRow}>
                  <Text style={orderStyles.detailLabel}>Requested Date:</Text>
                  <Text style={orderStyles.detailValue}>
                    {new Date(selectedOrder.requestDate).toLocaleString()}
                  </Text>
                </View>
                <View style={orderStyles.detailRow}>
                  <Text style={orderStyles.detailLabel}>Special Note:</Text>
                  <Text style={orderStyles.detailValue}>
                    {selectedOrder.specialNote}
                  </Text>
                </View>
              </View>

              

              <View style={orderStyles.dividerContainer}>
                <View style={orderStyles.divider} />
              </View>

              {/* Order status timeline - simplified to avoid duplicates */}
              <View style={orderStyles.orderStatus}>
                <Text style={orderStyles.orderDet}>Order Status</Text>

                {/* Payment Completed status */}
                {selectedOrder.status?.toLowerCase() === "paymentcompleted" && (
                  <View
                    style={[
                      orderStyles.statusBoxPayment,
                      { backgroundColor: "#4CAF50" }, 
                    ]}
                  >
                    <View>
                      <Text style={orderStyles.statusText}>
                        Payment Completed
                      </Text>
                      <Text style={orderStyles.dateText}>
                        {selectedOrder.completedDate
                          ? `Payment confirmed on ${new Date(
                              selectedOrder.completedDate
                            ).toLocaleString()}`
                          : "Payment date not available"}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Display status history notes if available, after all status boxes */}
                {statusHistory.length > 0 && statusHistory.some(status => status.note) && (
                  <View style={[orderStyles.historyNotesContainer, { marginTop: 15 }]}>
                    <Text
                      style={[
                        orderStyles.historyNotesTitle,
                        baseScreenStylesNew.blackText,
                      ]}
                    >
                      Status History Notes
                    </Text>
                    {statusHistory.map(
                      (status, index) =>
                        status.note && (
                          <View
                            key={`note-${index}`}
                            style={[
                              orderStyles.historyNoteItem,
                              index === statusHistory.filter(s => s.note).length - 1 ? 
                              { marginBottom: 0, borderBottomWidth: 0 } : {}
                            ]}
                          >
                            <Text style={orderStyles.historyNoteDate}>
                              {new Date(status.timestamp).toLocaleString()}:
                            </Text>
                            <Text style={orderStyles.historyNoteText}>
                              {status.note}
                            </Text>
                          </View>
                        )
                    )}
                  </View>
                )}
                {selectedOrder.status?.toLowerCase() === "cancelled" && (
                  <View
                    style={[
                      orderStyles.statusBoxPayment,
                      { backgroundColor: "#e74c3c" }
                    ]}
                  >
                    <View>
                      <Text style={orderStyles.statusText}>
                        Order Cancelled
                      </Text>
                      <Text style={orderStyles.dateText}>
                        {selectedOrder.cancellation?.cancelledAt
                          ? `Cancelled on ${new Date(
                              selectedOrder.cancellation.cancelledAt
                            ).toLocaleString()}`
                          : "Cancellation date not available"}
                      </Text>
                      {selectedOrder.cancellation?.reason && (
                        <Text style={[orderStyles.dateText, { marginTop: 5 }]}>
                          Reason: {selectedOrder.cancellation.reason}
                        </Text>
                      )}
                    </View>
                  </View>
                )}
              </View>
              {/* Payment receipt section for History tab */}
              {activeTab === "History" && 
                selectedOrder.status?.toLowerCase() === "paymentcompleted" && 
                selectedOrder.receiptPhoto && (
                <View style={orderStyles.dividerContainer}>
                  <View style={orderStyles.divider} />
                  <View style={{ padding: 15, alignItems: "center", marginTop: 10 }}>
                    <Text style={{
                      fontSize: 16,
                      fontWeight: "bold", 
                      color: "#555",
                      marginBottom: 10,
                    }}>
                      Payment Receipt
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setFullScreenImage({ uri: selectedOrder.receiptPhoto });
                        setIsImageViewerVisible(true);
                      }}
                      style={{
                        alignItems: 'center',
                        marginTop: 5,
                      }}
                    >
                      <Image
                        source={{ uri: selectedOrder.receiptPhoto }}
                        style={{
                          width: 200,
                          height: 120,
                          borderRadius: 8,
                          marginBottom: 8,
                        }}
                        resizeMode="cover"
                      />
                      <Text style={{
                        fontSize: 13,
                        color: '#3498db',
                        marginTop: 5,
                      }}>
                        Tap to view full receipt
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
            
            {/* FIXED POSITION BUTTONS */}
            {/* Upload Payment button */}
            {selectedOrder && String(selectedOrder?.status).toLowerCase() === "completed" && (
              <View 
                style={[
                  orderStyles.fixedButtonContainer,
                  {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    backgroundColor: 'white',
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 5,
                    zIndex: 1000
                  }
                ]}
              >
                <TouchableOpacity
                  style={[
                    orderStyles.fixedButton,
                    { backgroundColor: '#3498db' }, // Match the badge color
                    
                  ]}
                  onPress={() => setIsReceiptModalVisible(true)}
                >
                  <Text style={orderStyles.fixedButtonText}>
                    Mark as Paid
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Payment Pending Review status */}
            {activeTab === "Completed" && selectedOrder.status === "pendingPayment" && (
              <View 
                style={[
                  orderStyles.fixedButtonContainer,
                  {
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    backgroundColor: 'white',
                    shadowColor: "#000", 
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 5,
                    zIndex: 1000
                  }
                ]}
              >
                <View style={{ padding: 15, alignItems: "center" }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#555",
                    marginBottom: 10,
                  }}>
                    Payment Under Review
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: "#777",
                    textAlign: "center",
                    marginBottom: 10,
                  }}>
                    Your payment receipt has been uploaded. Waiting for the
                    worker to confirm receipt.
                  </Text>
                  
                  {selectedOrder.receiptPhoto && (
                    <TouchableOpacity 
                      onPress={() => {
                        // Option to add a function to view receipt in full screen
                        // Or just make this area non-clickable
                      }}
                      style={{
                        alignItems: 'center',
                        marginTop: 5,
                      }}
                    >
                      <Text style={{ 
                        color: '#555', 
                        fontSize: 13, 
                        marginBottom: 5, 
                        fontWeight: '500' 
                      }}>
                        Receipt Uploaded
                      </Text>
                      <Image
                        source={{ uri: selectedOrder.receiptPhoto }}
                        style={{
                          width: 100,
                          height: 60,
                          borderRadius: 5,
                        }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
            {/* Add this section for Ongoing tab */}
            {activeTab === "Ongoing" && (
              <View style={orderStyles.fixedButtonContainer}>
                {selectedOrder.status === "completed" ? (
                  <TouchableOpacity
                    style={[orderStyles.fixedButton, { width: "100%" }]}
                    onPress={() => setIsReceiptModalVisible(true)}
                  >
                    <Text style={orderStyles.fixedButtonText}>
                      Mark as Paid
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity
                      style={[orderStyles.fixedButton, { backgroundColor: "#FF4444" }]}
                      onPress={() => setIsCancelModalVisible(true)}
                    >
                      <Text style={orderStyles.fixedButtonText}>Cancel Order</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  // Add this function to the component
  const renderReceiptModal = () => (
    <Modal visible={isReceiptModalVisible} transparent animationType="slide">
      <View style={orderStyles.modalContainer}>
        <View style={[orderStyles.modalContent, { height: "auto", padding: 20 }]}>
          <TouchableOpacity
            onPress={() => {
              setIsReceiptModalVisible(false);
              setReceiptPhoto(null);
            }}
            style={orderStyles.closeButton}
          >
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={orderStyles.modalHeader}>Upload Payment Receipt</Text>
          
          <Text style={{
            fontSize: 14, 
            color: "#555",
            textAlign: "center",
            marginBottom: 15
          }}>
            Please upload a photo of your payment receipt to notify the worker that payment has been made.
          </Text>
          
          {receiptPhoto ? (
            <View style={orderStyles.previewContainer}>
              <Image 
                source={{ uri: receiptPhoto }} 
                style={orderStyles.receiptPreview}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={orderStyles.changeImageButton}
                onPress={pickImage}
              >
                <Text style={orderStyles.buttonTextSmall}>Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={orderStyles.uploadButton}
              onPress={pickImage}
            >
              <Ionicons name="camera" size={28} color="#fff" />
              <Text style={orderStyles.uploadButtonText}>Select Receipt Photo</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[
              baseScreenStylesNew.Button1, 
              orderStyles.confirmButton,
              {opacity: receiptPhoto ? 1 : 0.5}
            ]}
            onPress={confirmPayment}
            disabled={!receiptPhoto}
          >
            <Text style={orderStyles.buttonText}>Mark as Paid</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const saveImageToGallery = async (imageUrl) => {
    try {
      // Request specific permissions based on platform version
      if (!hasGalleryPermission) {
        const permissionResult = await MediaLibrary.requestPermissionsAsync(false);
        const { status } = permissionResult;
        
        setHasGalleryPermission(status === 'granted');
        
        if (status !== 'granted') {
          Alert.alert(
            "Permission Required", 
            Platform.OS === 'android' 
              ? "To save images, Maanikya needs permission to access your photos. Please go to your device settings to enable this permission."
              : "Cannot save images without storage permission.",
            [
              { text: "Cancel", style: "cancel" },
              { 
                text: "Settings", 
                onPress: () => {
                  if (Platform.OS === 'ios') {
                    Linking.openURL('app-settings:');
                  } else {
                    Linking.openSettings();
                  }
                }
              }
            ]
          );
          return;
        }
      }
      
      Alert.alert("Saving Image", "Please wait while we save the receipt to your gallery...");
      
      const filename = imageUrl.split('/').pop() || `receipt-${Date.now()}.jpg`;
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;
      
      const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);
      
      if (downloadResult.status !== 200) {
        throw new Error(`Failed to download image: ${downloadResult.status}`);
      }
      
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
      
      try {
        const album = await MediaLibrary.getAlbumAsync("MaanikyaReceipts");
        
        if (album) {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        } else {
          await MediaLibrary.createAlbumAsync("MaanikyaReceipts", asset, false);
        }
        
        Alert.alert("Success", "Receipt saved to your gallery in the 'MaanikyaReceipts' album");
      } catch (albumError) {
        console.log("Album creation/update failed but image was saved:", albumError);
        Alert.alert("Partially Successful", "Receipt saved to your gallery, but couldn't add to the Maanikya album");
      }
    } catch (error) {
      console.error("Error saving image:", error);
      Alert.alert("Error", "Failed to save receipt to gallery. Please try again.");
    }
  };

  // Add this modal component for cancel reason
const renderCancelModal = () => (
  <Modal
    visible={isCancelModalVisible}
    transparent
    animationType="slide"
    onRequestClose={() => setIsCancelModalVisible(false)}
  >
    <View style={orderStyles.modalContainer}>
      <View style={orderStyles.modalContent}>
        <Text style={orderStyles.modalHeader}>Cancel Order</Text>
        <TextInput
          style={orderStyles.reasonInput}
          placeholder="Enter reason for cancellation"
          value={cancelReason}
          onChangeText={setCancelReason}
          multiline
        />
        <View style={orderStyles.modalActions}>
          <TouchableOpacity
            style={[orderStyles.fixedButton, { backgroundColor: "#FF4444" }]}
            onPress={() => {
              setIsCancelModalVisible(false);
              setCancelReason('');
            }}
          >
            <Text style={orderStyles.fixedButtonText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[orderStyles.fixedButton, { backgroundColor: "#4CAF50" }]}
            onPress={handleCancelOrder}
          >
            <Text style={orderStyles.fixedButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

  return (
    <View style={baseScreenStylesNew.container}>
      <HeaderBar
        title="My gems"
        navigation={navigation}
        showBack={true}
        leftIcon="menu"
        onLeftPress={() => navigation.openDrawer()}
      />
      <View style={baseScreenStylesNew.tabBar}>
        {["Requested", "Ongoing", "Completed", "History"].map((tab) => (
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
      {renderOrderTrackingModal()}
      {renderReceiptModal()}
      {renderCancelModal()}
      {/* Full screen image viewer */}
      <ImageView
        images={fullScreenImage ? [fullScreenImage] : []}
        imageIndex={0}
        visible={isImageViewerVisible}
        onRequestClose={() => setIsImageViewerVisible(false)}
        FooterComponent={({ imageIndex }) => (
          <View style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: 15,
            flexDirection: 'row',
            justifyContent: 'center',
            width: '100%'
          }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#3498db',
                padding: 10,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onPress={() => saveImageToGallery(selectedOrder.receiptPhoto)}
            >
              <Ionicons name="download" size={18} color="#fff" style={{ marginRight: 8 }} />
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Save to Gallery</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default TrackerScreen;
