//Screen creator: Copilot

import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  RefreshControl,
  SafeAreaView,
  StatusBar
} from "react-native";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import HeaderBar from "../../components/HeaderBar";
import { API_URL, ENDPOINTS } from "../../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const WorkerFinancialRecords = ({ navigation }) => {
  const [financialData, setFinancialData] = useState(null);
  const [workerType, setWorkerType] = useState(null); // "cutter" or "burner"
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Format currency function
  const formatCurrency = (amount) => {
    return `LKR. ${amount.toLocaleString()}`;
  };

  // Get worker type and fetch financial data
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        // Get token from storage
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          Alert.alert("Authentication Error", "Please log in again.");
          return;
        }

        // Try to get saved worker type first
        const savedWorkerType = await AsyncStorage.getItem("workerType");
        if (savedWorkerType && (savedWorkerType === "cutter" || savedWorkerType === "burner")) {
          setWorkerType(savedWorkerType);
        }

        // Still get user profile to determine worker type from the server
        const response = await axios.get(
          `${API_URL}${ENDPOINTS.GET_USER_PROFILE}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.role) {
          // Set worker type based on role
          const role = response.data.role.toLowerCase();
          let detectedType = null;
          
          if (role.includes("cutter")) {
            detectedType = "cutter";
          } else if (role.includes("burner")) {
            detectedType = "burner";
          } else {
            setError("Invalid worker role. Please contact support.");
            setLoading(false);
            return;
          }
          
          // Save worker type for future use
          await AsyncStorage.setItem("workerType", detectedType);
          setWorkerType(detectedType);

          // Now fetch financial data
          fetchFinancialData(selectedPeriod);
        } else {
          setError("Could not determine worker type.");
          setLoading(false);
        }
      } catch (err) {
        console.error("Error getting user info:", err);
        setError("Failed to load user information");
        setLoading(false);
      }
    };

    getUserInfo();
  }, []);

  // Fetch financial data based on selected period
  const fetchFinancialData = async (period) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get token from storage
      const token = await AsyncStorage.getItem("authToken");
      
      if (!token) {
        Alert.alert("Authentication Error", "Please log in again.");
        return;
      }
      
      // Make API request
      const response = await axios.get(
        `${API_URL}${ENDPOINTS.GET_WORKER_FINANCIAL}?period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data && response.data.success) {
        console.log('Worker financial data:', response.data);
        setFinancialData(response.data);
        // Set worker type from response
        if (response.data.workerType) {
          setWorkerType(response.data.workerType === 'cutting' ? 'cutter' : 'burner');
        }
        setSelectedPeriod(period);
      } else {
        setError("Failed to load financial data");
      }
    } catch (err) {
      console.error("Error fetching financial data:", err);
      setError("An error occurred while loading financial data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchFinancialData(selectedPeriod);
  };

  // Period selector buttons
  const PeriodSelector = () => (
    <View style={baseScreenStylesNew.tabBar}>
      {["daily", "weekly", "monthly", "yearly", "alltime"].map((period) => (
        <TouchableOpacity
          key={period}
          style={[
            baseScreenStylesNew.tabButton,
            selectedPeriod === period ? baseScreenStylesNew.tabButtonActive : baseScreenStylesNew.tabButtonInactive
          ]}
          onPress={() => fetchFinancialData(period)}
        >
          <Text 
            style={[
              baseScreenStylesNew.tabText,
              selectedPeriod === period 
                ? baseScreenStylesNew.tabTextActive 
                : baseScreenStylesNew.tabTextInactive
            ]}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={baseScreenStylesNew.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <HeaderBar 
        title="Financial Records" 
        navigation={navigation} 
        showBack={true} 
      />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Loading financial data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !refreshing) {
    return (
      <SafeAreaView style={baseScreenStylesNew.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <HeaderBar 
        title="Financial Records" 
        navigation={navigation} 
        showBack={true} 
      />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchFinancialData(selectedPeriod)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Calculate the financial data to display
  const dataToShow = selectedPeriod === "alltime" 
    ? (financialData?.financialData || {})
    : (financialData?.periodData || {});

  const totalRevenue = dataToShow.totalRevenue || 0;
  const totalCosts = dataToShow.totalCosts || 0;
  const netProfit = totalRevenue - totalCosts;

  return (
    <SafeAreaView style={baseScreenStylesNew.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <HeaderBar 
        title="Financial Records" 
        navigation={navigation} 
        showBack={true} 
      />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007BFF"]}
            tintColor="#007BFF"
          />
        }
      >
        <View style={styles.container}>
          {/* Period selector */}
          <PeriodSelector />
          
          {/* Display period info */}
          {financialData?.startDate && financialData?.endDate && selectedPeriod !== 'alltime' && (
            <Text style={styles.periodInfo}>
              {new Date(financialData.startDate).toLocaleDateString()} - {new Date(financialData.endDate).toLocaleDateString()}
            </Text>
          )}
          
          {/* Worker type banner */}
          <View style={[styles.workerTypeBanner, 
            workerType === "cutter" ? styles.cutterBanner : styles.burnerBanner]}>
            <Text style={styles.workerTypeText}>
              {workerType === "cutter" ? "Gem Cutter" : "Gem Burner"}
            </Text>
          </View>
          
          {/* Net profit display */}
          <View style={[styles.totalProfitContainer, baseScreenStylesNew.themeColor]}>
            <Text style={styles.totalProfitTitle}>
              {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Net Profit
            </Text>
            <Text style={styles.totalProfitAmount}>
              {formatCurrency(netProfit)}
            </Text>
          </View>
          
          {/* Revenue section */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, baseScreenStylesNew.blackText]}>Revenue</Text>
            <View style={styles.recordList}>
              <View style={[styles.recordItem, baseScreenStylesNew.item]}>
                <Text style={[styles.recordText, baseScreenStylesNew.blackText]}>Total Orders</Text>
                <Text style={[styles.recordText, baseScreenStylesNew.blackText]}>{dataToShow.orderCount || 0}</Text>
              </View>
            </View>
            <View style={styles.recordList}>
              <View style={[styles.recordItem, baseScreenStylesNew.item]}>
                <Text style={[styles.recordText, baseScreenStylesNew.blackText]}>Revenue from Orders</Text>
                <Text style={[styles.recordText, baseScreenStylesNew.blackText]}>{formatCurrency(totalRevenue)}</Text>
              </View>
            </View>
          </View>
          
          {/* Expenses section - Different for cutter vs burner */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, baseScreenStylesNew.blackText]}>Expenses</Text>
            
            {workerType === "cutter" ? (
              // Cutter-specific expenses
              <>
                <View style={styles.recordList}>
                  <View style={[styles.recordItem, baseScreenStylesNew.item]}>
                    <Text style={[styles.recordText, baseScreenStylesNew.blackText]}>Tool Maintenance</Text>
                    <Text style={[styles.recordText, baseScreenStylesNew.blackText]}>{formatCurrency(dataToShow.toolCosts || 0)}</Text>
                  </View>
                </View>
                <View style={styles.recordList}>
                  <View style={[styles.recordItem, baseScreenStylesNew.item]}>
                    <Text style={[styles.recordText, baseScreenStylesNew.blackText]}>Equipment Wear</Text>
                    <Text style={[styles.recordText, baseScreenStylesNew.blackText]}>{formatCurrency(dataToShow.equipmentCosts || 0)}</Text>
                  </View>
                </View>
                <View style={styles.recordList}>
                  <View style={[styles.recordItem, baseScreenStylesNew.item]}>
                    <Text style={[styles.recordText, baseScreenStylesNew.blackText]}>Other Expenses</Text>
                    <Text style={[styles.recordText, baseScreenStylesNew.blackText]}>{formatCurrency(dataToShow.otherCosts || 0)}</Text>
                  </View>
                </View>
              </>
            ) : (
              // Burner-specific expenses
              <>
                <View style={styles.recordList}>
                  <View style={[styles.recordItem, baseScreenStylesNew.item]}>
                    <Text style={[styles.recordText, baseScreenStylesNew.blackText]}>Gas/Fuel Costs</Text>
                    <Text style={[styles.recordText, baseScreenStylesNew.blackText]}>{formatCurrency(dataToShow.fuelCosts || 0)}</Text>
                  </View>
                </View>
                <View style={styles.recordList}>
                  <View style={[styles.recordItem, baseScreenStylesNew.item]}>
                    <Text style={[styles.recordText, baseScreenStylesNew.blackText]}>Equipment Maintenance</Text>
                    <Text style={[styles.recordText, baseScreenStylesNew.blackText]}>{formatCurrency(dataToShow.maintenanceCosts || 0)}</Text>
                  </View>
                </View>
                <View style={styles.recordList}>
                  <View style={[styles.recordItem, baseScreenStylesNew.item]}>
                    <Text style={[styles.recordText, baseScreenStylesNew.blackText]}>Other Expenses</Text>
                    <Text style={[styles.recordText, baseScreenStylesNew.blackText]}>{formatCurrency(dataToShow.otherCosts || 0)}</Text>
                  </View>
                </View>
              </>
            )}
            
            {/* Total expenses row */}
            <View style={[styles.recordItem, styles.lastRecordItem]}>
              <Text style={[styles.lastRecordText, baseScreenStylesNew.blackText]}>Total Expenses</Text>
              <Text style={[styles.lastRecordText, baseScreenStylesNew.blackText]}>{formatCurrency(totalCosts)}</Text>
            </View>
          </View>
          
          {/* Order stats section */}
          <View style={[styles.statsContainer, baseScreenStylesNew.justBox]}>
            <Text style={[styles.statsTitle, baseScreenStylesNew.themeText]}>Order Statistics</Text>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Completed Orders:</Text>
              <Text style={styles.statsValue}>{dataToShow.completedOrders || 0}</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Pending Orders:</Text>
              <Text style={styles.statsValue}>{dataToShow.pendingOrders || 0}</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Average Order Value:</Text>
              <Text style={styles.statsValue}>
                {dataToShow.orderCount > 0 
                  ? formatCurrency(totalRevenue / dataToShow.orderCount) 
                  : formatCurrency(0)}
              </Text>
            </View>
          </View>
          
          {/* Efficiency metrics */}
          <View style={[styles.efficiencyContainer, baseScreenStylesNew.justBox]}>
            <Text style={[styles.efficiencyTitle, baseScreenStylesNew.themeText]}>Efficiency Metrics</Text>
            <View style={styles.progressBarContainer}>
              <Text style={[styles.progressLabel, baseScreenStylesNew.blackText]}>Profit Margin</Text>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${Math.min(Math.max((netProfit / totalRevenue) * 100, 0), 100)}%` },
                    getMarginColor(netProfit, totalRevenue)
                  ]}
                />
              </View>
              <Text style={styles.progressValue}>
                {totalRevenue > 0 ? `${Math.round((netProfit / totalRevenue) * 100)}%` : '0%'}
              </Text>
            </View>
            
            <View style={styles.progressBarContainer}>
              <Text style={styles.progressLabel}>Orders per Day</Text>
              <View style={styles.progressBarBackground}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${Math.min((dataToShow.ordersPerDay || 0) * 20, 100)}%` },
                    styles.blueProgress
                  ]}
                />
              </View>
              <Text style={styles.progressValue}>
                {dataToShow.ordersPerDay?.toFixed(1) || '0'}
              </Text>
            </View>
          </View>

          {/* Spacer at the bottom for better UX */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
      
    </SafeAreaView>
  );
};

// Helper function to determine margin color
const getMarginColor = (netProfit, totalRevenue) => {
  if (totalRevenue === 0) return styles.grayProgress;
  
  const margin = netProfit / totalRevenue;
  if (margin >= 0.3) return styles.greenProgress; // Good margin (30%+)
  if (margin >= 0.15) return styles.yellowProgress; // Moderate margin (15-30%)
  return styles.redProgress; // Low margin (<15%)
};

const styles = StyleSheet.create({
  
  container: {
    padding: 15,
    paddingBottom: 80, // Add padding at bottom for navbar
  },
  periodSelectorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    minWidth: 70,
    alignItems: "center",
  },
  selectedPeriodButton: {
    backgroundColor: "#007BFF",
  },
  periodButtonText: {
    color: "#555",
    fontSize: 12,
    fontWeight: "500",
  },
  selectedPeriodText: {
    color: "#fff",
    fontWeight: "bold",
  },
  periodInfo: {
    textAlign: "center",
    marginBottom: 10,
    color: "#666",
    fontSize: 12,
  },
  workerTypeBanner: {
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  cutterBanner: {
    backgroundColor: "rgba(77, 166, 255, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(77, 166, 255, 0.4)",
  },
  burnerBanner: {
    backgroundColor: "rgba(255, 149, 0, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(255, 149, 0, 0.4)",
  },
  workerTypeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#444",
  },
  totalProfitContainer: {
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    borderRadius: 8,
  },
  totalProfitTitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  totalProfitAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  recordList: {
    backgroundColor:'rgba(172, 168, 168, 0.21)',
    borderWidth: 2,
    borderColor: 'rgba(85, 84, 84, 0.21)',
    borderRadius: 2,
    marginBottom: 10,
  },
  recordItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  recordText: {
    color: "#000",
    fontSize: 15,
  },
  lastRecordText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "bold"
  },
  lastRecordItem: {
    borderBottomWidth: 0,
    backgroundColor: "rgba(130, 130, 130, 0.67)",
    borderWidth: 2,
    borderColor: "#AEA8A8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  statsContainer: {
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  statsLabel: {
    color: "#000",
  },
  statsValue: {
    fontWeight: "bold",
    color: "#000",
  },
  efficiencyContainer: {
    marginBottom: 20,
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  efficiencyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#000",
  },
  progressBarContainer: {
    marginBottom: 15,
  },
  progressLabel: {
    marginBottom: 5,
    color: "#000",
    fontSize: 14,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 5,
  },
  progressBar: {
    height: "100%",
  },
  progressValue: {
    textAlign: "right",
    fontSize: 12,
    color: "#000",
    fontWeight: "bold"
  },
  greenProgress: {
    backgroundColor: "#4CAF50", // Green
  },
  yellowProgress: {
    backgroundColor: "#FFC107", // Yellow/amber
  },
  redProgress: {
    backgroundColor: "#F44336", // Red
  },
  blueProgress: {
    backgroundColor: "#2196F3", // Blue
  },
  grayProgress: {
    backgroundColor: "#9E9E9E", // Gray
  },
  bottomSpacer: {
    height: 30, // Extra space at the bottom
  }
});

export default WorkerFinancialRecords;