//Screen creator: Isum  //this is ownertracker

import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, TextInput, SafeAreaView, TouchableOpacity } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import HeaderBar from "../../components/HeaderBar";
import { API_URL, ENDPOINTS } from "../../config/api"; // **Routes are imported from api.js**
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tracker = ({navigation}) => {
  // State variables
  const [activeTab, setActiveTab] = useState("Requested");
  const [orders, setOrders] = useState({
    Requested: [],
    Ongoing: [],
    History: [],
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [trackingModalVisible, setTrackingModalVisible] = useState(false);

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

  const fetchOrders = async () => {
      try {
      setError(null);
      if (!refreshing) setLoading(true);
      
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        setError("Authentication required. Please log in.");
        setLoading(false);
        return;
      }

      const response = await  axios.get(`${API_URL}${ENDPOINTS.OWNER_IN_PROGRESS_ORDERS}`, { // **Route from ENDPOINTS**
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log("Orders response:", response.data);

      // Filter orders where userRole is owner
      const ownerOrders = response.data.filter(
        (order) => order.userRole === "owner"
      );

      // Process and categorize orders
      const requestedOrders = [];
      const ongoingOrders = [];
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
    
    };
  };

   // Add this function to your TrackerScreen component
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
        const formattedGems = detailedOrder.gems
          ? detailedOrder.gems.map((gem) => ({
              ...gem,
              _id: gem._id ? gem._id.toString() : "",
              // Handle weight explicitly to ensure 0 is preserved as a number
              weight: gem.weight !== undefined ? Number(gem.weight) : 0,
              type: gem.type ? String(gem.type) : "",
              color: gem.color ? String(gem.color) : "",
              status: gem.status ? String(gem.status) : "",
              photo: gem.photo ? String(gem.photo) : "",
            }))
          : [];

        // Update the selected order with detailed gem information and other properties
        setSelectedOrder((prevOrder) => ({
          ...prevOrder,
          gems: formattedGems,
          statusHistory: detailedOrder.statusHistory || [],
          specialNote: detailedOrder.specialNote || prevOrder.specialNote || "",
          price: detailedOrder.price || prevOrder.price,
          orderType: detailedOrder.orderType || prevOrder.orderType,
          // Add any other properties that might be needed from the detailed response
        }));
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      // Continue showing modal with basic info since we've already opened it
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
  
    const currentOrders = orders[activeTab] || [];
  
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
              defaultSource={require("../../assets/default-images/avatar.png")}
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
            timestamp: selectedOrder.completedDate || new Date(),
            note: "Order completed",
          }
        : null);

  
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
              contentContainerStyle={orderStyles.trackingScrollContainer}
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
  
                {/* Rating display only for completed orders */}
                {selectedOrder.status === "completed" && (
                  <View style={orderStyles.row}>
                    <Text
                      style={[orderStyles.price, baseScreenStylesNew.blackText]}
                    >
                      Service Rating
                    </Text>
                    <View style={orderStyles.ratingSection}>
                      <View style={orderStyles.ratingContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FontAwesome
                            key={star}
                            name="star"
                            size={24}
                            color="#70B5DF"
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                )}
  
                <View style={orderStyles.dividerContainer}>
                  <View style={orderStyles.divider} />
                </View>
  
                {/* Order status timeline */}
                <View style={orderStyles.orderStatus}>
                  <Text
                    style={[orderStyles.orderDet, baseScreenStylesNew.blackText]}
                  >
                    Order Status
                  </Text>
  
                  <View
                    style={[
                      orderStyles.statusBoxRequest,
                      baseScreenStylesNew.colorBlueTheme5,
                    ]}
                  >
                    <View>
                      <Text style={orderStyles.statusText}>Order Requested</Text>
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
                        <Text style={orderStyles.statusText}>Order Accepted</Text>
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
                  {(completed || selectedOrder.status === "completed") && (
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
                    <View style={orderStyles.historyNotesContainer}>
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
              </ScrollView>
            </View>
          </View>
        </Modal>
      );
  };

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
      {renderOrderTrackingModal()}
    </View>
  );
};

export default Tracker;