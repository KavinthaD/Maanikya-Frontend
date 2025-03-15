//Screen creator: Mehara

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
import Header_2 from "../../components/Header_2";
import { API_URL, ENDPOINTS } from "../../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const OwnerFinancialRecords = () => {
  const [financialData, setFinancialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("weekly");
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Format currency function
  const formatCurrency = (amount) => {
    return `LKR. ${amount.toLocaleString()}`;
  };

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
        `${API_URL}${ENDPOINTS.GET_OWNER_FINANCIAL}?period=${period}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.data && response.data.success) {
        console.log(`Received ${period} financial data:`, response.data);
        setFinancialData(response.data);
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

  // Load data on component mount
  useEffect(() => {
    fetchFinancialData(selectedPeriod);
  }, []);

  // Period selector buttons
  const PeriodSelector = () => (
    <View style={baseScreenStylesNew.tabBar}> 
      {["daily", "weekly", "yearly", "alltime"].map((period) => (
        <TouchableOpacity
          key={period}
          style={[
            baseScreenStylesNew.tabButton,
            selectedPeriod === period 
              ? baseScreenStylesNew.tabButtonActive 
              : baseScreenStylesNew.tabButtonInactive
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
        <Header_2 title="Financial Records" />
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
        <Header_2 title="Financial Records" />
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

  const totalProfit = financialData?.totalProfit || 0;
  
  // Use periodData for the current period and totalProfit for all-time
  const displayProfit = selectedPeriod === "alltime" 
    ? (financialData?.financialData?.netProfit || 0)
    : dataToShow.netProfit || 0;

  // Function to get profit color based on value
  const getProfitColor = (value) => {
    return value >= 0 ? "green" : "red";
  };

  return (
    <SafeAreaView style={baseScreenStylesNew.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Header_2 title="Financial Records" />
      
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
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
          {selectedPeriod !== "alltime" && (
            <Text style={styles.periodInfo}>
              {new Date(financialData?.startDate).toLocaleDateString()} - {new Date(financialData?.endDate).toLocaleDateString()}
            </Text>
          )}
          
          {/* Total profit display */}
          <View style={[styles.totalProfitContainer, baseScreenStylesNew.themeColor]}>
            <Text style={styles.totalProfitTitle}>
              {selectedPeriod === "alltime" ? "Total Profit (All Time)" : `${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Profit`}
            </Text>
            <Text style={styles.totalProfitAmount}>
              {formatCurrency(displayProfit)}
            </Text>
          </View>
          
          {/* Financial records list */}
          {[ 
            { title: "Buying cost", amount: formatCurrency(dataToShow.gemPurchaseCost || 0) },
            { title: "Cutting cost", amount: formatCurrency(dataToShow.cuttingCost || 0) },
            { title: "Burning cost", amount: formatCurrency(dataToShow.burningCost || 0) },
            { title: "Sold price", amount: formatCurrency(dataToShow.salesRevenue || 0) }
          ].map((item, index) => (
            <View
              key={index} 
              style={[baseScreenStylesNew.item, styles.recordList]}
            >
              <View style={[styles.recordItem]}>
                <Text style={styles.recordText}>{item.title}</Text>
                <Text style={styles.recordText}>{item.amount}</Text>
              </View>
            </View>
          ))}
          
          {/* Total row */}
          <View style={[styles.recordItem, styles.lastRecordItem]}>
            <Text style={styles.lastRecordText}>Total</Text>
            <Text style={styles.lastRecordText}>{formatCurrency(displayProfit)}</Text>
          </View>
          
          {/* Display all-time profit if not on all-time view */}
          {selectedPeriod !== "alltime" && (
            <View style={styles.allTimeContainer}>
              <Text style={styles.allTimeLabel}>All-time Profit:</Text>
              <Text style={[
                styles.allTimeValue,
                { color: getProfitColor(totalProfit) } // Apply color dynamically here
              ]}>
                {formatCurrency(totalProfit)}
              </Text>
            </View>
          )}
          
          {/* Stats section */}
          {selectedPeriod !== "alltime" && dataToShow.soldGemsCount > 0 && (
            <View style={styles.statsContainer}>
              <Text style={styles.statsTitle}>Period Statistics</Text>
              <View style={styles.statsRow}>
                <Text style={styles.statsLabel}>Gems Sold:</Text>
                <Text style={styles.statsValue}>{dataToShow.soldGemsCount}</Text>
              </View>
            </View>
          )}
          
          {selectedPeriod === "alltime" && (
            <View style={styles.statsContainer}>
              <Text style={styles.statsTitle}>Overall Statistics</Text>
              <View style={styles.statsRow}>
                <Text style={styles.statsLabel}>Total Gems:</Text>
                <Text style={styles.statsValue}>
                  {financialData?.financialData?.gemsCount || 0}
                </Text>
              </View>
              <View style={styles.statsRow}>
                <Text style={styles.statsLabel}>Gems Sold:</Text>
                <Text style={styles.statsValue}>
                  {financialData?.financialData?.soldGemsCount || 0}
                </Text>
              </View>
            </View>
          )}

          {/* Inventory Section */}
          <View style={[baseScreenStylesNew.justBox,styles.inventoryContainer]}>
            <Text style={[baseScreenStylesNew.themeText,styles.inventoryTitle]}>Inventory</Text>
            
            <View style={styles.inventoryRow}>
              <Text style={styles.inventoryLabel}>Value:</Text>
              <Text style={[baseScreenStylesNew.themeText,styles.inventoryValue]}>
                {formatCurrency(dataToShow.inventoryValue || 0)}
              </Text>
            </View>
            
            <View style={styles.inventoryRow}>
              <Text style={styles.inventoryLabel}>Items:</Text>
              <Text style={[baseScreenStylesNew.themeText,styles.inventoryValue]}>
                {dataToShow.inventoryGemsCount || 0}
              </Text>
            </View>
            
            {/* Status breakdown */}
            {dataToShow.inventoryStatus && Object.keys(dataToShow.inventoryStatus).length > 0 && (
              <View style={styles.statusBreakdown}>
                <Text style={styles.statusTitle}>Status Breakdown:</Text>
                {Object.entries(dataToShow.inventoryStatus).map(([status, count]) => (
                  <View key={status} style={styles.statusRow}>
                    <Text style={styles.statusLabel}>{status}:</Text>
                    <Text style={styles.statusCount}>{count}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Spacer at the bottom for better UX */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
      
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 80, // Add padding at bottom for navbar
  },

  periodInfo: {
    textAlign: "center",
    marginBottom: 10,
    color: "#666",
    fontSize: 12,
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  recordList: {
    borderWidth: 2,
    borderColor: 'rgba(85, 84, 84, 0.21)',
    borderRadius: 2,
    marginBottom: 14,
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
    backgroundColor: "rgba(130, 130,130, 0.67)",
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
  allTimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  allTimeLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  allTimeValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statsContainer: {
    marginTop: 20,
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  statsLabel: {
    color: "#555",
  },
  statsValue: {
    fontWeight: "bold",
    color: "#333",
  },
  inventoryContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d0e8ff",
  },
  inventoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    
  },
  inventoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  inventoryLabel: {
    color: "#555",
  },
  inventoryValue: {
    fontWeight: "bold",
  },
  statusBreakdown: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#d0e8ff",
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#555",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  statusLabel: {
    color: "#666",
    fontSize: 13,
  },
  statusCount: {
    fontWeight: "500",
    color: "#444",
    fontSize: 13,
  },
  bottomSpacer: {
    height: 30, // Extra space at the bottom
  }
});

export default OwnerFinancialRecords;