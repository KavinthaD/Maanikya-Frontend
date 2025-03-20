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

  // Orders state
  const [orders, setOrders] = useState({
    Requested: [],
    Ongoing: [],
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

      // Process and categorize orders
      const orderData = response.data;
      const requestedOrders = [];
      const ongoingOrders = [];
      const historyOrders = [];

      orderData.forEach((order) => {
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
          id: order.orderId,
          orderId: order._id, // Store MongoDB ID for API calls
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

        // Categorize orders based on status
        if (order.status === "requested") {
          requestedOrders.push(formattedOrder);
        } else if (
          ["accepted", "processing", "inProgress"].includes(
            order.status.toLowerCase()
          )
        ) {
          ongoingOrders.push(formattedOrder);
        } else if (
          ["completed", "declined", "cancelled"].includes(
            order.status.toLowerCase()
          )
        ) {
          historyOrders.push(formattedOrder);
        }
      });

      // Update state with categorized orders
      setOrders({
        Requested: requestedOrders,
        Ongoing: ongoingOrders,
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

      // Then fetch detailed order data in the background
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("Authentication token missing");
        return;
      }

      // Extract the correct order ID
      const orderId = order.orderId || order._id || order.id;

      // Make the request to get detailed order info including gems
      const response = await axios.get(`${API_URL}${ENDPOINTS.ORDERS}/worker-view/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data && response.data.success) {
        const detailedOrder = response.data.order;

        // Ensure the gems array is properly formatted for React Native
        const formattedGems = detailedOrder.gems
          ? detailedOrder.gems.map((gem) => ({
              ...gem,
              _id: gem._id ? gem._id.toString() : "",
              weight: gem.weight !== undefined ? Number(gem.weight) : 0,
              type: gem.type ? String(gem.type) : "",
              color: gem.color ? String(gem.color) : "",
              status: gem.status ? String(gem.status) : "",
              photo: gem.photo ? String(gem.photo) : "",
            }))
          : [];

        // Update the selected order with detailed information
        setSelectedOrder((prevOrder) => ({
          ...prevOrder,
          gems: formattedGems,
          statusHistory: detailedOrder.statusHistory || [],
          specialNote: detailedOrder.specialNote || prevOrder.specialNote || "",
          price: detailedOrder.price || prevOrder.price,
          orderType: detailedOrder.orderType || prevOrder.orderType,
          ownerName: detailedOrder.ownerName || prevOrder.ownerName,
          ownerPhoto: detailedOrder.ownerPhoto || prevOrder.ownerPhoto,
        }));
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      // Continue showing modal with basic info since we've already opened it
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

      const orderId = selectedOrder.orderId || selectedOrder._id;
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

      const orderId = selectedOrder.orderId || selectedOrder._id;
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

      const orderId = selectedOrder.orderId || selectedOrder._id;
      await axios.patch(
        `${API_URL}/api/orders/worker/${orderId}/status`,
        {
          status: "completed",
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
        "Order has been completed and service fee has been set"
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

      const orderId = selectedOrder.orderId || selectedOrder._id;
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

    const currentOrders =
      activeTab === "History"
        ? (orders[activeTab] || []).filter(
            (order) => order.status === "completed"
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
              defaultSource={require("../../assets/gemimg/user1.jpg")}
            />
            <View style={orderStyles.orderDetails}>
              {/* 1. Order Type (Priority 1) */}
              <Text style={orderStyles.orderTypeTitle}>
                {order.orderType?.charAt(0).toUpperCase() +
                  order.orderType?.slice(1) || "Unknown"}{" "}
                Order
              </Text>

              {/* 2. Username (Priority 2) */}
              <Text style={orderStyles.orderUsername}>
                {order.userRole === "worker" ? "Client: " : "Worker: "}
                <Text style={orderStyles.orderName}>{order.name}</Text>
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
                  : `Completed: ${new Date(
                      order.completedDate || order.requestDate
                    ).toLocaleDateString()}`}
              </Text>
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

            <Text style={orderStyles.trackingModalHeader}>
              Order#: {selectedOrder.id || selectedOrder.orderId}
            </Text>

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

                  <View style={{ paddingBottom: 0 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        marginLeft: 10,
                        color: "#000",
                      }}
                    >
                      Order Status
                    </Text>

                    <View
                      style={[
                        orderStyles.statusBoxRequest,
                        baseScreenStylesNew.colorBlueTheme5,
                        { padding: 10 },
                      ]}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={orderStyles.statusText}>
                          Order Requested
                        </Text>
                        <Text style={orderStyles.dateText}>
                          {requested.timestamp
                            ? `Requested on ${new Date(
                                requested.timestamp
                              ).toLocaleString()}`
                            : "Request date not available"}
                        </Text>
                      </View>
                    </View>

                    {/* Accept status */}
                    {(accepted || selectedOrder.status !== "requested") && (
                      <View
                        style={[
                          orderStyles.statusBoxAccept,
                          baseScreenStylesNew.colorBlueTheme6,
                        ]}
                      >
                        <View>
                          <Text style={orderStyles.statusText}>
                            Order Accepted
                          </Text>
                          <Text style={orderStyles.dateText}>
                            {accepted?.timestamp
                              ? `Accepted on ${new Date(
                                  accepted.timestamp
                                ).toLocaleString()}`
                              : "Acceptance date not available"}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* In Progress status */}
                    {(inProgress ||
                      ["inProgress", "completed"].includes(
                        selectedOrder.status
                      )) && (
                      <View
                        style={[
                          orderStyles.statusBoxConfirm,
                          baseScreenStylesNew.colorBlueTheme7,
                        ]}
                      >
                        <View>
                          <Text style={orderStyles.statusText}>
                            Order In Progress
                          </Text>
                          <Text style={orderStyles.dateText}>
                            {inProgress?.timestamp
                              ? `Started on ${new Date(
                                  inProgress.timestamp
                                ).toLocaleString()}`
                              : "Start date not available"}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Completed status */}
                    {(completed ||
                      selectedOrder.status === "completed") && (
                      <View
                        style={[
                          orderStyles.statusBoxComplete,
                          baseScreenStylesNew.colorBlueTheme8,
                        ]}
                      >
                        <View>
                          <Text style={orderStyles.statusText}>
                            Order Completed
                          </Text>
                          <Text style={orderStyles.dateText}>
                            {completed?.timestamp
                              ? `Completed on ${new Date(
                                  completed.timestamp
                                ).toLocaleString()}`
                              : "Completion date not available"}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Display status history notes if available */}
                    {statusHistory.length > 0 && (
                      <View
                        style={[
                          orderStyles.historyNotesContainer,
                          { marginTop: 5 },
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
                        {statusHistory.map(
                          (status, index) =>
                            status.note && (
                              <View
                                key={`note-${index}`}
                                style={orderStyles.historyNoteItem}
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
                  </View>
                </>
              )}
            </ScrollView>

            {/* SIMPLIFIED ACTION BUTTONS BASED ON ACTIVE TAB */}
            {activeTab === "Requested" &&
              selectedOrder.status === "requested" && (
                <View
                  style={[
                    orderStyles.fixedButtonContainer,
                    {
                      borderBottomLeftRadius: 20,
                      borderBottomRightRadius: 20,
                      backgroundColor: "white",
                    },
                  ]}
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
                    baseScreenStylesNew.colorBlueTheme8,
                    { width: "100%" },
                  ]}
                  onPress={handleMarkAsCompleted}
                >
                  <Text style={orderStyles.fixedButtonText}>
                    Mark as Completed
                  </Text>
                </TouchableOpacity>
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
                placeholderTextColor="#ffffff99"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
              <TouchableOpacity
                style={[baseScreenStylesNew.Button1, orderStyles.sendButton]}
                onPress={handleCompleteWithPrice}
              >
                <Text style={orderStyles.buttonText}>Complete & Set Fee</Text>
              </TouchableOpacity>
            </>
          )}
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
    </View>
  );
};

export default OrderScreen;
