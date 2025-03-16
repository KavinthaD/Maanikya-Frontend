//Screen creator: Isum

import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  View,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import HeaderBar from "../components/HeaderBar";
import LinearGradient from "react-native-linear-gradient";
import axios from "axios";
import { API_URL, ENDPOINTS } from "../config/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { baseScreenStylesNew } from "../styles/baseStylesNew";

const THEME_COLOR = '#9CCDDB'; // Light blue theme color
const GemOnDisplay = ({ navigation }) => {
  // Store gems on display
  const [onDisplay, setOnDisplay] = useState([]);
  // Store sold gems
  const [sold, setSold] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGem, setSelectedGem] = useState(null);
  const [buyerName, setBuyerName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch market gems when component mounts
  useEffect(() => {
    fetchMarketGems();
  }, []);

  // Function to fetch market gems from API
  const fetchMarketGems = async () => {
    try {
      if (!refreshing) setLoading(true);
      setError(null);

      // Get auth token
      const token = await AsyncStorage.getItem("authToken");
      
      if (!token) {
        setError("Authentication required. Please login.");
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const response = await axios.get(`${API_URL}${ENDPOINTS.GET_MY_MARKET_GEMS}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Sort gems by status - separate available and sold gems
        const availableGems = [];
        const soldGems = [];
        
        response.data.gems.forEach(gem => {
          if (gem.status === "Available") {
            availableGems.push({
              id: gem.gemId,
              image: { uri: gem.photo },
              gemType: gem.gemType || "",
              weight: gem.weight || null,
              price: gem.price.toString(),
            });
          } else if (gem.status === "Sold") {
            soldGems.push({
              id: gem.gemId,
              image: { uri: gem.photo },
              gemType: gem.gemType || "",
              weight: gem.weight || null,
              buyer: gem.buyer || "Unknown",
              price: gem.price.toString(),
            });
          }
        });
        
        setOnDisplay(availableGems);
        setSold(soldGems);
      } else {
        setError("Failed to load gems");
      }
    } catch (error) {
      console.error("Error fetching market gems:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Handle refresh when user pulls down
  const handleRefresh = () => {
    setRefreshing(true);
    fetchMarketGems();
  };

  // Open modal for marking gem as sold
  const openModal = (gem) => {
    setSelectedGem(gem);
    setModalVisible(true);
  };

  // Mark gem as sold
  const markSold = async () => {
    if (selectedGem && buyerName && price) {
      try {
        setModalVisible(false); // Close the modal first to show loading state if needed

        // Get auth token
        const token = await AsyncStorage.getItem("authToken");
        
        if (!token) {
          Alert.alert("Error", "Authentication required. Please login.");
          return;
        }

        // Call API to update gem status to sold
        const response = await axios.put(
          `${API_URL}/api/market/${selectedGem.id}/sell`, 
          {
            buyer: buyerName,
            soldPrice: price  // Changed from price to soldPrice to match backend expectation
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.success) {
          // Update local state
          setOnDisplay(onDisplay.filter((item) => item.id !== selectedGem.id));
          setSold([...sold, { 
            ...selectedGem, 
            buyer: buyerName, 
            price: price  // This is for UI display, so keep as price
          }]);
          
          // Reset form fields
          setBuyerName("");
          setPrice("");
          
          Alert.alert("Success", "Gem marked as sold successfully!");
        } else {
          Alert.alert("Error", response.data.message || "Failed to update gem status");
        }
      } catch (error) {
        console.error("Error marking gem as sold:", error);
        
        // Show specific error message if available
        const errorMessage = error.response?.data?.message || 
                            "Failed to update gem status. Please try again.";
        
        Alert.alert("Error", errorMessage);
      }
    } else {
      Alert.alert("Required Fields", "Please enter buyer's name and gem price.");
    }
  };

  // Item separator for FlatList
  const ItemSeperator = () => (
    <View style={{ height: 1, backgroundColor: "#e0e0e0", marginVertical: 5 }} />
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderBar 
        title="Gems On Market" 
        navigation={navigation} 
        showBack={true} 
      />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#051B41" />
          <Text style={styles.loadingText}>Loading gems...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <HeaderBar 
        title="Gems On Market" 
        navigation={navigation} 
        showBack={true} 
      />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMarketGems}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={baseScreenStylesNew.container}>
      <HeaderBar 
        title="Gems On Market" 
        navigation={navigation} 
        showBack={true} 
      />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            colors={[THEME_COLOR]} 
            tintColor={THEME_COLOR}
          />
        }
      >
        <View style={styles.displayContainer}>
          <View style={styles.header}>
            <View style={styles.headerLine} />
            <Text style={styles.subtopic}>On Display</Text>
            <View style={styles.headerLine} />
          </View>
          {onDisplay.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="diamond-outline" size={40} color="#CCCCCC" />
              <Text style={styles.emptyStateText}>No gems on display</Text>
            </View>
          ) : (
            <FlatList
              data={onDisplay}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.gemDisplay}>
                  <Image 
                    source={item.image} 
                    style={styles.gemImg} 
                    defaultSource={require("../assets/logo.png")}
                  />
                  <View style={styles.gemInfo}>
                    <Text style={styles.gemId}>{item.id}</Text>
                    <Text style={styles.gemDetails}>
                      {item.weight ? `${item.weight} ct ` : ''}{item.gemType || ''}
                    </Text>
                    <Text style={styles.gemPrice}>LKR {item.price}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => openModal(item)}
                    style={[baseScreenStylesNew.themeColor, styles.soldBtn]}
                  >
                    <Text style={[baseScreenStylesNew.whiteText,styles.soldBtnText]}>Mark As Sold</Text>
                  </TouchableOpacity>
                </View>
              )}
              ItemSeparatorComponent={ItemSeperator}
              scrollEnabled={false}
            />
          )}
        </View>

        
        <LinearGradient
      colors={['rgb(3, 15, 79)', 'rgb(11, 10, 43)']}
      style={[styles.soldContainer,styles.gradientBackground]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
          <View style={styles.header}>
            <View style={styles.headerLine2} />
            <Text style={styles.subtopic2} >Sold out</Text>
            <View style={styles.headerLine2} />
          </View>
          {sold.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cash-outline" size={40} color={"white"}/>
              <Text style={styles.emptyStateText2}>No sold gems</Text>
            </View>
          ) : (
            <FlatList
              data={sold}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.soldGems}>
                  <Image 
                    source={item.image} 
                    style={styles.gemImg}
                    defaultSource={require("../assets/logo.png")}
                  />
                  <View style={styles.gemInfo}>
                    <Text style={[baseScreenStylesNew.whiteText,styles.gemId]}>{item.id}</Text>
                    <Text style={[baseScreenStylesNew.whiteText,styles.gemDetails]}>
                      {item.weight ? `${item.weight} ct ` : ''}{item.gemType || ''}
                    </Text>
                    <Text style={styles.soldDetails}>Buyer: {item.buyer}</Text>
                    <Text style={styles.soldDetails}>Price: LKR {item.price}</Text>
                  </View>
                </View>
              )}
              ItemSeparatorComponent={ItemSeperator}
              scrollEnabled={false}
            />
          )}
          </LinearGradient>
       

        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalContainer}>
          <LinearGradient
      colors={['rgb(3, 15, 79)', 'rgb(11, 10, 43)']}
      style={styles.gradientBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirm Sale</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Buyer's Name"
                value={buyerName}
                onChangeText={setBuyerName}
                placeholderTextColor="#888"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Sold Price (LKR)"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
                placeholderTextColor="#888"
              />
              <View style={styles.modalBtn}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={[baseScreenStylesNew.cancelButton, styles.cancelBtn]}
                >
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={markSold} style={[baseScreenStylesNew.Button2, styles.confirmBtn]}>
                  <Text style={styles.btnText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
            </LinearGradient>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  displayContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  soldContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "black",
  },
  headerLine2: {
    flex: 1,
    height: 1,
    backgroundColor: "white",
  },
  subtopic: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 10,
  },
  subtopic2: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 10,
    color: "white"
  },
  gemDisplay: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  gemImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 20,
  },
  gemInfo: {
    flex: 1,
  },
  gemId: {
    fontSize: 16,
    fontWeight: "bold",
  },
  gemDetails: {
    fontSize: 14,

  },
  gemPrice: {
    fontSize: 14,
    color: "#333",
  },
  soldBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  soldBtnText: {
    fontSize: 14,
    fontWeight: "500",
  },
  soldGems: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  soldDetails: {
    fontSize: 14,
    color: "#FFF",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
  },
gradientBackground: {
  width: "90%",
  padding: 24,
  borderRadius: 12,
  maxWidth: 400,
},
  modalContent: {
    width: "100%",
    padding: 24,
    borderRadius: 12,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    color: "white",
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  modalBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: "45%",
    marginRight: 6,
  },
  confirmBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: "45%",
    
  },
  btnText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
  },
  scrollContainer: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#051B41",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: "#FF6B6B",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#FF6B6B",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyStateText: {
    marginTop: 10,
    fontSize: 16,
  },
  emptyStateText2: {
    marginTop: 10,
    fontSize: 16,
    color: "white"
  },
});

export default GemOnDisplay;
