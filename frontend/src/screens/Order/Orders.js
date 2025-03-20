//Screen creator: Dulith

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import { TextInput } from "react-native";
import HeaderBar from "../../components/HeaderBar";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL, ENDPOINTS } from "../../config/api";
import { Ionicons } from "@expo/vector-icons";
import { orderStyles } from "../../styles/OrderStyles"; // Import shared styles
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import ImageView from "react-native-image-viewing"; // Install with: npm install react-native-image-viewing
import { Platform } from "react-native";

const OrderScreen = () => {
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
  const [isImageViewerVisible, setIsImageViewerVisible] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Orders state
  const [orders, setOrders] = useState({
    Requested: [],
    Ongoing: [],
    Completed: [], // New category
    History: [],
  });

  // Fetch orders on screen focus
  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  /**
   * Fetches and formats orders from the API, categorizing them by status
   * @returns {Promise<void>}
   */
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
        `${API_URL}${ENDPOINTS.GET_ORDERS_WORKER}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Add this right after fetching the orders response
      console.log(
        "Worker Orders API response:",
        JSON.stringify(response.data.slice(0, 2))
      );

      // Process and categorize orders
      const orderData = response.data;
      const requestedOrders = [];
      const ongoingOrders = [];
      const completedOrders = []; // New array
      const historyOrders = [];

      orderData.forEach((order) => {
        // Add debug logs for status values
        console.log(
          `Order #${order.orderId} - Status: "${
            order.status
          }" - Type: ${typeof order.status}`
        );

        // Format date
        const formattedDate = new Date(order.requestDate).toLocaleDateString();

        // Get the relevant name based on user role
        let relevantName, relevantUsername, relevantId;

        if (order.userRole === "worker") {
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
          id: order.orderId, // This is the ORD-#### format
          _id: order._id, 
          
          name: relevantName || relevantUsername || "Unknown User", // Use name or fall back to username
          date: formattedDate,
          image:
            (order.userRole === "worker"
              ? order.ownerPhoto
              : order.workerAvatar) ||
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

        // Make sure to normalize the status case for safer comparison
        const normalizedStatus = String(order.status || "")
          .toLowerCase()
          .trim();

        switch (normalizedStatus) {
          case "requested":
            requestedOrders.push(formattedOrder);
            break;
          case "accepted":
          case "pendingpayment":
            ongoingOrders.push(formattedOrder);
            break;
          case "completed":
            completedOrders.push(formattedOrder);
            break;
          case "paymentcompleted": // Add this specific case
          case "declined":
          case "cancelled":
            historyOrders.push({
              ...formattedOrder,
              cancellation: order.cancellation || {} // Include cancellation details
            });
            break;
          default:
            console.log(`Unknown status: ${normalizedStatus}`);
        }
      });

      // Log the final counts
      console.log(
        `Orders categorized - Requested: ${requestedOrders.length}, Ongoing: ${ongoingOrders.length}, Completed: ${completedOrders.length}, History: ${historyOrders.length}`
      );

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

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

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
  
      const orderId = order.orderId || order._id;
      console.log("Fetching details for order:", orderId);
  
      // Make the request to get detailed order info
      const response = await axios.get(
        `${API_URL}/api/orders/${order.userRole === 'worker' ? 'worker' : 'owner'}-view/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      console.log("Order details response:", response.data);
  
      if (response.data && response.data.order) {
        const detailedOrder = response.data.order;
  
        // Format gems data from the response
        const formattedGems = detailedOrder.gems?.map(gem => ({
          _id: gem._id?.toString() || '',
          id: gem.gemId || gem._id?.toString() || '',
          type: gem.details?.gemType || 'Unknown', // Check details.gemType first
          weight: gem.details?.weight || gem.weight || 0,
          color: gem.details?.color || gem.color || '',
          photo: gem.photo || '',
          status: gem.status || ''
        })) || [];
  
        // Update the selected order with detailed information
        setSelectedOrder(prev => ({
          ...prev,
          ...detailedOrder,
          gems: formattedGems,
          statusHistory: detailedOrder.statusHistory || [],
          specialNote: detailedOrder.specialNote || prev.specialNote || '',
          price: detailedOrder.price || prev.price,
          orderType: detailedOrder.orderType || prev.orderType,
          receiptPhoto: detailedOrder.payment?.receiptPhoto || prev.receiptPhoto,
          payment: detailedOrder.payment || prev.payment || {},
          cancellation: detailedOrder.cancellation || prev.cancellation || {}
        }));
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      Alert.alert(
        "Error",
        "Failed to load order details. Please try again."
      );
    }
  };

  // Update handleDecline function to use the correct endpoint
  const handleDecline = async () => {
    try {
      if (!selectedOrder) return;

      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Authentication required. Please log in.");
        return;
      }

      const orderId = selectedOrder._id 
      await axios.patch(
        `${API_URL}/api/orders/worker/${orderId}/status`,
        {
          status: "declined",
          note: "Order declined by worker",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTrackingModalVisible(false);
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

  // Update handleAccept function to directly accept without price
  const handleAccept = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Authentication required. Please log in.");
        return;
      }

      const orderId = selectedOrder._id
      await axios.patch(
        `${API_URL}/api/orders/worker/${orderId}/status`,
        {
          status: "accepted",
          note: "Order accepted by worker",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTrackingModalVisible(false);
      fetchOrders();
      Alert.alert("Success", "Order has been accepted");
    } catch (error) {
      console.error("Error accepting order:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to accept order"
      );
    }
  };

  // Update handleMarkAsCompleted to show price modal instead
  const handleMarkAsCompleted = () => {
    setTrackingModalVisible(false);
    setIsPriceModalVisible(true);
  };

  // Rename handleSendPrice to handleCompleteWithPrice
  const handleCompleteWithPrice = async () => {
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

      const priceValue = parseFloat(price);

      if (isNaN(priceValue) || priceValue <= 0) {
        Alert.alert("Error", "Please enter a valid service fee amount");
        return;
      }

      const orderId = selectedOrder._id;
      await axios.patch(
        `${API_URL}/api/orders/worker/${orderId}/status`,
        {
          status: "completed", // This should match what the backend is expecting
          price: priceValue,
          note: `Order completed with service fee of LKR ${priceValue}`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsPriceModalVisible(false);
      setPrice("");
      fetchOrders();
      Alert.alert(
        "Success",
        "Order has been completed and service fee has been set. The owner will now be asked to make payment."
      );
    } catch (error) {
      console.error("Error completing order:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to complete order"
      );
    }
  };

  /**
   * Handles order status updates with proper error handling
   * @param {string} newStatus - The new status to set for the order
   * @returns {Promise<void>}
   */
  const handleUpdateStatus = async (newStatus) => {
    try {
      if (!selectedOrder) return;

      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Authentication required. Please log in.");
        return;
      }

      const orderId = selectedOrder._id;
      await axios.patch(
        `${API_URL}/api/orders/worker/${orderId}/status`,
        {
          status: newStatus,
          note: `Order marked as ${newStatus} by worker`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTrackingModalVisible(false);
      fetchOrders();
      Alert.alert("Success", `Order has been marked as ${newStatus}`);
    } catch (error) {
      console.error(`Error updating order status to ${newStatus}:`, error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          `Failed to update order status to ${newStatus}`
      );
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
          note: "Payment received and confirmed",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchOrders(); // Refresh orders

      Alert.alert("Success", "Payment has been confirmed", [
        {
          text: "OK",
          onPress: () => setTrackingModalVisible(false),
        },
      ]);
    } catch (error) {
      console.error("Error confirming payment:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to confirm payment"
      );
    }
  };

  // Add this function for workers to confirm payment receipt
  const confirmPaymentReceived = async () => {
    try {
      if (!selectedOrder) return;

      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Authentication required. Please log in.");
        return;
      }

      const orderId = selectedOrder._id;
      await axios.patch(
        `${API_URL}/api/orders/worker/${orderId}/status`,
        {
          status: "paymentCompleted", // Use paymentCompleted status
          note: "Payment confirmed by worker",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setTrackingModalVisible(false);
      fetchOrders();
      Alert.alert("Success", "Payment has been confirmed");
    } catch (error) {
      console.error("Error confirming payment:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to confirm payment"
      );
    }
  };

  // Add this function inside your component to handle image saving
  const saveImageToGallery = async (imageUrl) => {
    try {
      // Request specific permissions based on platform version
      if (!hasGalleryPermission) {
        // Use the appropriate permission type
        const permissionResult = await MediaLibrary.requestPermissionsAsync(
          false
        );
        const { status } = permissionResult;

        setHasGalleryPermission(status === "granted");

        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            Platform.OS === "android"
              ? "To save images, Maanikya needs permission to access your photos. Please go to your device settings to enable this permission."
              : "Cannot save images without storage permission.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Settings",
                onPress: () => {
                  // Open app settings if permission was denied
                  if (Platform.OS === "ios") {
                    Linking.openURL("app-settings:");
                  } else {
                    Linking.openSettings();
                  }
                },
              },
            ]
          );
          return;
        }
      }

      // Show loading indicator
      Alert.alert(
        "Saving Image",
        "Please wait while we save the receipt to your gallery..."
      );

      // Generate a unique filename to avoid conflicts
      const filename = imageUrl.split("/").pop() || `receipt-${Date.now()}.jpg`;
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;

      // Download the image to cache first
      console.log("Downloading image to cache:", fileUri);
      const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);

      if (downloadResult.status !== 200) {
        throw new Error(`Failed to download image: ${downloadResult.status}`);
      }

      console.log("Image downloaded successfully:", downloadResult.uri);

      // Save to gallery with proper album creation
      const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);

      if (!asset) {
        throw new Error("Failed to create asset");
      }

      console.log("Asset created:", asset.uri);

      try {
        // Try to create or use the custom album for receipts
        const album = await MediaLibrary.getAlbumAsync("MaanikyaReceipts");

        if (album) {
          // Album exists, add asset to it
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        } else {
          // Create new album with this asset
          await MediaLibrary.createAlbumAsync("MaanikyaReceipts", asset, false);
        }

        Alert.alert(
          "Success",
          "Receipt saved to your gallery in the 'MaanikyaReceipts' album",
          [{ text: "OK" }]
        );
      } catch (albumError) {
        // If album creation fails, at least the image is saved to the gallery
        console.log(
          "Album creation/update failed but image was saved:",
          albumError
        );
        Alert.alert(
          "Partially Successful",
          "Receipt saved to your gallery, but couldn't add to the Maanikya album",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error saving image:", error);
      Alert.alert(
        "Error",
        "Failed to save receipt to gallery. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const handleReceiptPress = async (order) => {
    try {
      // Only proceed if we're in History tab and order is paymentCompleted
      if (activeTab !== "History" || order.status?.toLowerCase() !== "paymentcompleted") {
        console.log("Receipt can only be viewed for completed payments in History tab");
        return;
      }
  
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Authentication required");
        return;
      }
  
      // Log the order details for debugging
      console.log("Fetching receipt for order:", {
        orderId: order.orderId, // Use orderId instead of _id
        id: order.id,
        status: order.status,
        tab: activeTab
      });
  
      // First try to use the receipt URL directly if available
      if (order.receiptPhoto) {
        setFullScreenImage({ uri: order.receiptPhoto });
        setIsImageViewerVisible(true);
        return;
      }
  
      // If no direct URL, then fetch from API
      const response = await axios.get(
        `${API_URL}/api/orders/receipt/${order.orderId}`, // Use orderId here
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      if (response.data.success && response.data.receiptUrl) {
        setFullScreenImage({ uri: response.data.receiptUrl });
        setIsImageViewerVisible(true);
      } else {
        Alert.alert("Error", "Receipt not found");
      }
    } catch (error) {
      console.error("Error fetching receipt:", error);
      Alert.alert("Error", "Failed to load receipt");
    }
  };

  // Update the renderContent function to filter history orders
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

    const currentOrders = activeTab === "History" 
      ? (orders[activeTab] || []).filter((order) => 
          ["paymentcompleted", "declined", "cancelled"].includes(
            order.status?.toLowerCase().trim()
          )
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
              : "No orders in history"}
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
              defaultSource={require("../../assets/gemimg/user1.jpg")}
            />
            <View style={orderStyles.orderDetails}>
              {/* Order Type with Badge for pendingPayment */}
              <View style={orderStyles.orderCardHeader}>
                <Text style={orderStyles.orderTypeTitle}>
                  {order.orderType?.charAt(0).toUpperCase() +
                    order.orderType?.slice(1) || "Unknown"}{" "}
                  Order
                </Text>

                {/* Add payment pending badge */}
                {order.status?.toLowerCase() === "completed" && (
                  <View
                    style={[
                      orderStyles.pendingPaymentBadge,
                      { backgroundColor: "#3498db" },
                    ]}
                  >
                    <Text style={orderStyles.pendingPaymentText}>
                      Payment Pending
                    </Text>
                  </View>
                )}
                {order.status?.toLowerCase() === "pendingpayment" && (
                  <View
                    style={[
                      orderStyles.pendingPaymentBadge,
                      { backgroundColor: "#f39c12" },
                    ]}
                  >
                    <Text style={orderStyles.pendingPaymentText}>
                      Payment Review
                    </Text>
                  </View>
                )}

                {/* Show receipt icon for History tab with payment receipts */}
                {activeTab === "History" &&
                  order.status?.toLowerCase() === "paymentcompleted" && (
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        handleReceiptPress(order);
                      }}
                      style={{ padding: 5 }}
                    >
                      <Ionicons
                        name="receipt-outline"
                        size={20}
                        color="#3498db"
                      />
                    </TouchableOpacity>
                  )}
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

              {/* Rest of order card content */}
              <Text style={orderStyles.orderUsername}>
                {order.userRole === "worker" ? "Client: " : "Worker: "}
                <Text style={orderStyles.orderName}>{order.name}</Text>
              </Text>
              <Text style={orderStyles.orderId}>Order#: {order.id}</Text>
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
                  : activeTab === "History" &&
                    order.status?.toLowerCase() === "paymentcompleted"
                  ? `Payment completed: ${
                      order.payment?.paymentConfirmedDate
                        ? new Date(
                            order.payment.paymentConfirmedDate
                          ).toLocaleDateString()
                        : new Date(
                            order.updatedAt || order.completedDate
                          ).toLocaleDateString()
                    }`
                  : `Cancelled: ${new Date(
                      order.completedDate || order.requestDate
                    ).toLocaleDateString()}`}
              </Text>
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

  // Completely rewrite the renderOrderTrackingModal function for better reliability
  const renderOrderTrackingModal = () => {
    if (!selectedOrder) return null;
    // Define status variables from history
    const statusHistory = selectedOrder.statusHistory || [];
    const requested = {
      status: "requested",
      timestamp: selectedOrder.requestDate,
      note: "Order requested",
    };
    const accepted =
      statusHistory.find((s) => s.status === "accepted") ||
      (selectedOrder.acceptedDate
        ? {
            status: "accepted",
            timestamp: selectedOrder.acceptedDate,
            note: "Order accepted",
          }
        : null);
    const inProgress =
      statusHistory.find((s) => s.status === "inProgress") ||
      (selectedOrder.status === "inProgress"
        ? {
            status: "inProgress",
            timestamp: new Date(),
            note: "Order in progress",
          }
        : null);
    const completed =
      statusHistory.find((s) => s.status === "completed") ||
      (selectedOrder.status === "completed"
        ? {
            status: "completed",
            timestamp: selectedOrder.completedDate,
            note: "Order completed",
          }
        : null);

    // Improved status check function with more robust checking
    const checkStatus = (orderStatus, targetStatus) => {
      // Convert both to lowercase strings for safer comparison
      const status = String(orderStatus || "").toLowerCase();
      const target = String(targetStatus || "").toLowerCase();

      // Check if the status matches any of these variations
      return (
        status === target ||
        status === target.replace(/\s+/g, "") || // Remove spaces
        status === target.replace(/\s+/g, "_")
      ); // Convert spaces to underscores
    };

    // Force display of the correct action button based on the current tab
    const shouldShowMarkInProgress = selectedOrder.status === "accepted";
    const shouldShowMarkCompleted =
      activeTab === "Ongoing" ||
      selectedOrder.status === "inProgress" ||
      selectedOrder.status === "inprogress" ||
      selectedOrder.status?.toLowerCase()?.includes("progress");

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
            {/* Show pending badge in modal header */}
            {selectedOrder.status?.toLowerCase() === "completed" && (
              <View
                style={[
                  orderStyles.pendingPaymentBadge,
                  {
                    marginLeft: 10,
                    backgroundColor: "#3498db",
                  },
                ]}
              >
                <Text style={orderStyles.pendingPaymentText}>
                  Payment Pending
                </Text>
              </View>
            )}
            {selectedOrder.status?.toLowerCase() === "pendingpayment" && (
              <View
                style={[
                  orderStyles.pendingPaymentBadge,
                  {
                    marginLeft: 10,
                    backgroundColor: "#f39c12",
                  },
                ]}
              >
                <Text style={orderStyles.pendingPaymentText}>
                  Payment Review
                </Text>
              </View>
            )}
            <ScrollView
              contentContainerStyle={[
                orderStyles.trackingScrollContainer,
                orderStyles.modalContentWithButtons,
              ]}
            >
              {/* Gems section */}
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
                    // Ensure all gem properties are properly formatted
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
                    const gemColor =
                      typeof gem.color === "string" ? gem.color : "";

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

                        {gemWeight !== undefined &&
                          gemWeight !== null &&
                          gemWeight > 0 && (
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
                          ID: {gemId.substring(0, 10)}
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
                  <Text style={orderStyles.detailLabel}>Owner:</Text>
                  <Text style={orderStyles.detailValue}>
                    {selectedOrder.ownerName ||
                      selectedOrder.name ||
                      "Unknown Owner"}
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
                    {selectedOrder.specialNote || "None"}
                  </Text>
                </View>

                {selectedOrder.price && (
                  <View style={orderStyles.detailRow}>
                    <Text style={orderStyles.detailLabel}>Price:</Text>
                    <Text style={orderStyles.detailValue}>
                      LKR {selectedOrder.price.toFixed(2)}
                    </Text>
                  </View>
                )}
              </View>

              {/* Only show Order Status section if NOT in requested state */}
              {selectedOrder.status !== "requested" && (
                <>
                  <View style={orderStyles.dividerContainer}>
                    <View style={orderStyles.divider} />
                  </View>

                  {/* Order Status section - ONLY showing the colored status boxes */}
                  <View style={orderStyles.orderStatus}>
                    <Text style={orderStyles.orderDet}>Order Status</Text>

                    {/* Show Payment Completed status if applicable */}
                    {selectedOrder.status?.toLowerCase() ===
                      "paymentcompleted" && (
                      <View
                        style={[
                          orderStyles.statusBoxPayment,
                          { backgroundColor: "#4CAF50" },
                        ]}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={orderStyles.statusText}>
                            Payment Completed
                          </Text>
                          <Text style={orderStyles.dateText}>
                            {selectedOrder.payment?.paymentConfirmedDate
                              ? `Payment confirmed on ${new Date(
                                  selectedOrder.payment.paymentConfirmedDate
                                ).toLocaleString()}`
                              : selectedOrder.completedDate
                              ? `Payment confirmed on ${new Date(
                                  selectedOrder.completedDate
                                ).toLocaleString()}`
                              : "Payment date not available"}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Notes section */}
                    {statusHistory.length > 0 &&
                      statusHistory.some((status) => status.note) && (
                        <View
                          style={[
                            orderStyles.historyNotesContainer,
                            { marginTop: 15 },
                          ]}
                        >
                          <Text
                            style={[
                              orderStyles.historyNotesTitle,
                              baseScreenStylesNew.blackText,
                            ]}
                          >
                            Status History Notes
                          </Text>
                          {statusHistory
                            .filter((status) => status.note)
                            .map((status, index, filteredArray) => (
                              <View
                                key={`note-${index}`}
                                style={[
                                  orderStyles.historyNoteItem,
                                  index === filteredArray.length - 1
                                    ? {
                                        marginBottom: 0,
                                        borderBottomWidth: 0,
                                      }
                                    : {},
                                ]}
                              >
                                <Text style={orderStyles.historyNoteDate}>
                                  {new Date(status.timestamp).toLocaleString()}:
                                </Text>
                                <Text style={orderStyles.historyNoteText}>
                                  {status.note}
                                </Text>
                              </View>
                            ))}
                        </View>
                      )}
                  </View>
                </>
              )}
              
            </ScrollView>

            {/* SIMPLIFIED ACTION BUTTONS BASED ON ACTIVE TAB */}
            {activeTab === "Requested" &&
              selectedOrder.status === "requested" && (
                <View
                  style={
                    orderStyles.fixedButtonContainer
                  }
                >
                  <TouchableOpacity
                    style={[
                      orderStyles.fixedButton,
                      { backgroundColor: "#e74c3c" },
                    ]}
                    onPress={handleDecline}
                  >
                    <Text style={orderStyles.fixedButtonText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      orderStyles.fixedButton,
                      { backgroundColor: "#9CCDDB" },
                    ]}
                    onPress={handleAccept}
                  >
                    <Text style={orderStyles.fixedButtonText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              )}

            {/* For Ongoing tab - ALWAYS show Mark as Completed regardless of status */}
            {activeTab === "Ongoing" && (
              <View style={orderStyles.fixedButtonContainer}>
                <TouchableOpacity
                  style={[
                    orderStyles.fixedButton,
                    { width: "100%" },
                  ]}
                  onPress={handleMarkAsCompleted}
                >
                  <Text style={orderStyles.fixedButtonText}>
                    Mark as Completed
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    orderStyles.fixedButton,
                    { backgroundColor: "#FF4444" },
                  ]}
                  onPress={() => {
                    setIsCancelModalVisible(true);
                  }}
                >
                  <Text style={orderStyles.fixedButtonText}>Cancel Order</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Show payment confirmation button for pendingPayment orders in Completed tab */}
            {activeTab === "Completed" &&
              selectedOrder.status === "pendingPayment" && (
                <View style={orderStyles.fixedButtonContainer}>
                 
                  <TouchableOpacity
                    style={[
                      orderStyles.fixedButton,
                      baseScreenStylesNew.colorBlueTheme8,
                      { width: "100%" },
                    ]}
                    onPress={confirmPaymentReceived}
                  >
                    <Text style={orderStyles.fixedButtonText}>
                      Confirm Payment Received
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            
            {/* Update the payment confirmation section in renderOrderTrackingModal */}
            {activeTab === "Completed" && selectedOrder.status?.toLowerCase() === "pendingpayment" && (
              <View style={[orderStyles.fixedButtonContainer]}>
                <View style={orderStyles.paymentPreviewContainer}>
                  {selectedOrder.receiptPhoto ? (
                    <TouchableOpacity
                      onPress={() => {
                        setFullScreenImage({ uri: selectedOrder.receiptPhoto });
                        setIsImageViewerVisible(true);
                      }}
                      style={orderStyles.receiptPreviewButton}
                    >
                      <Image
                        source={{ uri: selectedOrder.receiptPhoto }}
                        style={orderStyles.receiptThumbnail}
                        resizeMode="cover"
                      />
                      <Text style={orderStyles.viewReceiptText}>View Receipt</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={orderStyles.noReceiptContainer}>
                      <Text style={orderStyles.noReceiptText}>No receipt uploaded yet</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    style={orderStyles.confirmPaymentButton}
                    onPress={confirmPaymentReceived}
                  >
                    <Text style={orderStyles.confirmPaymentText}>
                      Confirm Payment
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  // Update the Price Input Modal
  const renderPriceModal = () => (
    <Modal visible={isPriceModalVisible} transparent animationType="slide">
      <View style={orderStyles.modalContainer}>
        <View
          style={[orderStyles.modalContent, { height: "auto", padding: 20 }]}
        >
          <TouchableOpacity
            onPress={() => setIsPriceModalVisible(false)}
            style={orderStyles.closeButton}
          >
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={orderStyles.modalHeader}>Set Service Fee</Text>
          {selectedOrder && (
            <>
              <Text style={orderStyles.modalText}>
                Order#: {selectedOrder.id}
              </Text>
              <TextInput
                style={orderStyles.priceInput}
                placeholder="Service fee (LKR)"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
              <TouchableOpacity
                style={[baseScreenStylesNew.Button1, orderStyles.sendButton]}
                onPress={handleCompleteWithPrice}
              >
                <Text style={orderStyles.buttonText}>Complete</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  // Add this function to handle order cancellation
  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for cancellation');
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem("authToken");
      const orderId = selectedOrder._id;
      
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

      {/* Modal for Accept/Decline - Only shown for workers */}
      <Modal
        visible={isModalVisible && selectedOrder?.userRole === "worker"}
        transparent
        animationType="slide"
      >
        <View style={orderStyles.modalContainer}>
          <View style={orderStyles.modalContent}>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={orderStyles.closeButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={orderStyles.modalHeader}>Order Details</Text>
            {selectedOrder && (
              <>
                {/* Horizontal scrolling gem images */}
                {selectedOrder.gemDetails &&
                selectedOrder.gemDetails.length > 0 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={orderStyles.gemScroll}
                    contentContainerStyle={orderStyles.gemScrollContent}
                  >
                    {selectedOrder.gemDetails.map((gem, index) => (
                      <View
                        key={`gem-${index}`}
                        style={orderStyles.gemModalContainer}
                      >
                        <Image
                          source={
                            typeof gem.photo === "string"
                              ? { uri: gem.photo }
                              : require("../../assets/gem-images/gem1.jpeg")
                          }
                          style={orderStyles.gemModalImage}
                          defaultSource={require("../../assets/gem-images/gem1.jpeg")}
                        />
                        <Text style={orderStyles.gemModalType}>{gem.type}</Text>
                        <Text style={orderStyles.gemModalId}>
                          {gem.id.toString().substring(0, 8)}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                ) : (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={orderStyles.gemScroll}
                    contentContainerStyle={orderStyles.gemScrollContent}
                  >
                    {selectedOrder.gems &&
                      selectedOrder.gems.map((gemId, index) => (
                        <View
                          key={`gem-${index}`}
                          style={orderStyles.gemModalContainer}
                        >
                          <Image
                            source={require("../../assets/gem-images/gem1.jpeg")}
                            style={orderStyles.gemModalImage}
                          />
                          <Text style={orderStyles.gemModalId}>
                            {String(gemId).substring(0, 8)}
                          </Text>
                        </View>
                      ))}
                  </ScrollView>
                )}

                <Text style={orderStyles.modalText}>
                  Client: {selectedOrder.name}
                </Text>
                <Text style={orderStyles.modalText}>
                  Order ID: {selectedOrder.id}
                </Text>
                <Text style={orderStyles.modalText}>
                  Type: {selectedOrder.orderType}
                </Text>
                <Text style={orderStyles.modalText}>
                  Gems: {selectedOrder.gems?.length || 0}
                </Text>
                <Text style={orderStyles.modalText}>
                  Requested Date: {selectedOrder.date}
                </Text>
                {selectedOrder.specialNote && (
                  <Text style={orderStyles.modalNote}>
                    Note: {selectedOrder.specialNote}
                  </Text>
                )}
              </>
            )}
            <View style={orderStyles.modalActions}>
              <TouchableOpacity
                style={[baseScreenStylesNew.Button1, orderStyles.declineButton]}
                onPress={handleDecline}
              >
                <Text style={baseScreenStylesNew.buttonText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[baseScreenStylesNew.Button1, orderStyles.acceptButton]}
                onPress={handleAccept}
              >
                <Text style={baseScreenStylesNew.buttonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for owner viewing order details - when userRole is owner */}

      <Modal
        visible={isModalVisible && selectedOrder?.userRole === "owner"}
        transparent
        animationType="slide"
      >
        <View style={orderStyles.modalContainer}>
          <View style={orderStyles.modalContent}>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={orderStyles.closeButton}
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
            <Text style={orderStyles.modalHeader}>Order Details</Text>
            {selectedOrder && (
              <>
                <Image
                  source={
                    typeof selectedOrder.image === "string"
                      ? { uri: selectedOrder.image }
                      : selectedOrder.image
                  }
                  style={orderStyles.modalImage}
                  defaultSource={require("../../assets/gemimg/user1.jpg")}
                />
                <Text style={orderStyles.modalText}>
                  Worker: {selectedOrder.name}
                </Text>
                <Text style={orderStyles.modalText}>
                  Order ID: {selectedOrder.id}
                </Text>
                <Text style={orderStyles.modalText}>
                  Type: {selectedOrder.orderType}
                </Text>
                <Text style={orderStyles.modalText}>
                  Requested Date: {selectedOrder.date}
                </Text>
                {selectedOrder.specialNote && (
                  <Text style={orderStyles.modalNote}>
                    Note: {selectedOrder.specialNote}
                  </Text>
                )}
              </>
            )}
            <View style={orderStyles.modalActions}>
              <TouchableOpacity
                style={[baseScreenStylesNew.Button1, orderStyles.acceptButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={baseScreenStylesNew.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for Price Input */}
      {renderPriceModal()}

      {/* Order tracking modal */}
      {renderOrderTrackingModal()}

      {/* Full screen image viewer */}
      <ImageView
        images={fullScreenImage ? [fullScreenImage] : []}
        imageIndex={0}
        visible={isImageViewerVisible}
        onRequestClose={() => setIsImageViewerVisible(false)}
        FooterComponent={({ imageIndex }) => (
          <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              padding: 15,
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#3498db",
                padding: 10,
                borderRadius: 8,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => saveImageToGallery(selectedOrder.receiptPhoto)}
            >
              <Ionicons
                name="download"
                size={18}
                color="#fff"
                style={{ marginRight: 8 }}
              />
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Save to Gallery
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {renderCancelModal()}
    </View>
  );
};

export default OrderScreen;
