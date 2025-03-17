//Screen Creator Tilmi
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  Platform,
  StatusBar,
  Modal,
  Alert,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import HeaderBar from "../../components/HeaderBar";
import BS_NavBar from "../../components/BS_NavBar";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, ENDPOINTS } from "../../config/api";

const GemCollectionScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [gems, setGems] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedGems, setSelectedGems] = useState([]);
  const [sortAscending, setSortAscending] = useState(true);
  const [isSellModalVisible, setSellModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [gemPrices, setGemPrices] = useState({});
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [soldOutGems, setSoldOutGems] = useState([]);
  
  // Extract the fetchGems function to make it reusable
  const fetchGems = async () => {
    setLoading(true); // Show loading indicator when refreshing
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      console.error("Authentication token not found");
      setLoading(false);
      return; // Exit if no token
    }
    try {
      const response = await axios.get(`${API_URL}${ENDPOINTS.GET_MY_GEMS}?includeAll=true`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGems(response.data.gems.filter(gem => gem.status !== "SoldOut"));
      setSoldOutGems(response.data.gems.filter(gem => gem.status === "SoldOut"));
      console.log("Number of gems fetched:", response.data.gems.length);
      console.log("Number of sold gems:", response.data.gems.filter(gem => gem.status === "SoldOut").length);
    } catch (error) {
      console.error(
        "Error fetching gems:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // Use fetchGems in useEffect
  useEffect(() => {
    fetchGems();
  }, []);

  const filteredGems = gems.filter((gem) => {
    // Check if gem.gemId is defined before calling toLowerCase
    return (
      gem.gemId && gem.gemId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const sortedGems = [...filteredGems].sort((a, b) => {
    return sortAscending
      ? a.gemId.localeCompare(b.gemId)
      : b.gemId.localeCompare(a.gemId);
  });

  const toggleSort = () => {
    setSortAscending(!sortAscending);
  };

  const toggleSelect = () => {
    setIsSelectMode(!isSelectMode);
    if (isSelectMode) {
      // If exiting select mode, clear selected gems
      setSelectedGems([]);
    }
  };

  // 2. Update the toggleGemSelection function to check gem status before selection
const toggleGemSelection = (gemId) => {
  if (!isSelectMode) {
    navigation.navigate("MyGems", { gemId });
    return;
  }
  
  // Find the gem object with this ID
  const gem = gems.find(g => g.gemId === gemId);
  
  // Check if gem exists
  if (!gem) {
    console.error(`Gem with ID ${gemId} not found`);
    return;
  }
  
  // Check if gem is in order or market
  if (gem.status === "InOrder" || gem.status === "Requested") {
    Alert.alert("Cannot Select", `Gem ${gemId} is already in an order request.`);
    return;
  }
  
  if (gem.inMarket) {
    Alert.alert("Cannot Select", `Gem ${gemId} is currently on sale in the market.`);
    return;
  }
  
  // If gem is available, toggle its selection
  setSelectedGems((prev) => {
    if (prev.includes(gemId)) {
      return prev.filter((id) => id !== gemId);
    } else {
      return [...prev, gemId];
    }
  });
};

  // 3. Update the handleSendOrder function to double-check gems before navigation
const handleSendOrder = () => {
  if (selectedGems.length === 0) {
    Alert.alert("Error", "Please select at least one gem");
    return;
  }
  
  // Verify all selected gems are available (not in order or market)
  const unavailableGems = [];
  
  // Find the complete gem objects that match the selected gem IDs
  const selectedGemObjects = gems.filter(gem => {
    const isSelected = selectedGems.includes(gem.gemId);
    
    // Check for unavailable gems
    if (isSelected) {
      if (gem.status === "InOrder" || gem.status === "Requested") {
        unavailableGems.push(`${gem.gemId} (in order)`);
        return false;
      }
      
      if (gem.inMarket) {
        unavailableGems.push(`${gem.gemId} (in market)`);
        return false;
      }
    }
    
    return isSelected;
  });
  
  // Show alert if any gems are unavailable
  if (unavailableGems.length > 0) {
    Alert.alert(
      "Cannot Proceed",
      `The following gems are no longer available:\n\n${unavailableGems.join("\n")}`,
      [{ text: "OK" }]
    );
    
    // Remove unavailable gems from selection
    setSelectedGems(prev => 
      prev.filter(gemId => {
        const gem = gems.find(g => g.gemId === gemId);
        return gem && gem.status !== "InOrder" && 
               gem.status !== "Requested" && !gem.inMarket;
      })
    );
    
    return;
  }
  
  console.log("Sending order for gems:", selectedGemObjects.map(gem => gem.gemId));
  
  // Navigate to Favorites screen with the selected gem objects
  navigation.navigate("FavoritesScreen", { 
    selectedGems: selectedGemObjects 
  });
  
  // Reset selection mode and clear selected gems
  setIsSelectMode(false);
  setSelectedGems([]);
};

  const handleSellPress = () => {
    // Initialize prices for all selected gems
    const initialPrices = {};
    selectedGems.forEach(gemId => {
      initialPrices[gemId] = '';
    });
    setGemPrices(initialPrices);
    setSellModalVisible(true);
  };

  const updateGemPrice = (gemId, price) => {
    setGemPrices(prev => ({
      ...prev,
      [gemId]: price
    }));
  };

  // 2. Update the handleAddGemsToMarket function to refresh data after success
const handleAddGemsToMarket = async () => {
  if (selectedGems.length === 0) {
    Alert.alert("No Gems Selected", "Please select gems to sell.");
    return;
  }

  // Check if all gems have prices
  const missingPrices = selectedGems.filter(gemId => !gemPrices[gemId]);
  if (missingPrices.length > 0) {
    Alert.alert("Missing Prices", "Please set prices for all selected gems.");
    return;
  }

  const token = await AsyncStorage.getItem("authToken");
  if (!token) {
    console.error("Authentication token not found");
    return; // Exit if no token
  }

  try {
    // Create gemData array with prices
    const gemData = selectedGems.map(gemId => ({
      gemId,
      price: parseFloat(gemPrices[gemId])
    }));

    const response = await axios.post(
      `${API_URL}${ENDPOINTS.ADD_GEMS_TO_MARKET}`,
      { gems: gemData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201) {
      // Close modal and reset selection states immediately
      setSellModalVisible(false);
      setSelectedGems([]);
      setGemPrices({});
      setIsSelectMode(false);
      
      // Show alert with refresh on dismissal
      Alert.alert(
        "Success", 
        "Gems have been added to the market.",
        [
          {
            text: "OK",
            onPress: () => {
              // Refetch the gems data when user clicks OK
              fetchGems();
            }
          }
        ]
      );
    }
  } catch (error) {
    console.error("Error adding gems to market:", error);
    Alert.alert(
      "Error",
      error.response?.data?.message || "Failed to add gems to market."
    );
  }
};

  const handleSellCancel = () => {
    setSellModalVisible(false);
  };

  const renderSelectedGemItem = ({ item }) => {
    const gemData = gems.find((g) => g.gemId === item);
    if (!gemData) return null;
    
    return (
      <View style={styles.modalGemItem}>
        <Image
          source={{ uri: gemData.photo || require("../../assets/gems/no_gem.jpeg") }}
          style={styles.modalGemImage}
          resizeMode="cover"
        />
        <View style={styles.modalGemInfo}>
          <Text style={styles.modalGemId}>{gemData.gemId}</Text>
          <Text style={styles.modalGemType}>
            {(gemData.weight ? `${gemData.weight} ct ` : '') + 
             (gemData.details?.gemType || gemData.gemType || "Unknown")}
          </Text>
        </View>
        <View style={styles.modalPriceContainer}>
          <View style={styles.priceInputWrapper}>
            <TextInput
              style={styles.priceInput}
              placeholder="0.00"
              placeholderTextColor="#999999"
              keyboardType="decimal-pad"
              value={gemPrices[item]}
              onChangeText={(text) => updateGemPrice(item, text)}
            />
          </View>
        </View>
      </View>
    );
  };

  // 1. Update the renderGemItem function to show status indicators
const renderGemItem = React.useCallback(
  ({ item }) => {
    const isSelected = selectedGems.includes(item.gemId);
    const isInOrder = item.status === "InOrder" || item.status === "Requested";
    const isInMarket = item.inMarket === true;
    
    return (
      <TouchableOpacity
        style={[
          styles.gemCard,
          isSelectMode && !isSelected ? { opacity: 0.7 } : { opacity: 1 },
        ]}
        onPress={() => {
          if (isSelectMode) {
            // Check if gem is already in an order or market before selection
            if (isInOrder) {
              Alert.alert("Cannot Select", `Gem ${item.gemId} is already in an order request.`);
              return;
            }
            if (isInMarket) {
              Alert.alert("Cannot Select", `Gem ${item.gemId} is currently on sale in the market.`);
              return;
            }
            toggleGemSelection(item.gemId);
          } else {
            navigation.navigate("MyGems", { gemId: item.gemId }); // Navigate to MyGems with gemId
          }
        }}
      >
        <Image
          source={{ uri: item.photo || require("../../assets/gems/no_gem.jpeg") }}
          style={styles.gemImage}
          resizeMode="cover"
        />
        
        {/* Status Indicators */}
        {isInOrder && (
          <View style={styles.statusIndicator}>
            <Ionicons name="time-outline" size={18} color="#FFFFFF" />
          </View>
        )}
        
        {isInMarket && (
          <View style={[styles.statusIndicator, styles.marketIndicator]}>
            <Ionicons name="pricetag-outline" size={18} color="#FFFFFF" />
          </View>
        )}
        
        <Text style={styles.gemId}>{item.gemId}</Text>
      </TouchableOpacity>
    );
  },
  [isSelectMode, selectedGems, navigation]
);

  const handleShowHistory = () => {
    setHistoryModalVisible(true);
  };

  const handleCloseHistory = () => {
    setHistoryModalVisible(false);
  };

  const renderHistoryItem = ({ item }) => {
    return (
      <View style={styles.historyItem}>
        <Image
          source={{ uri: item.photo || require("../../assets/gems/no_gem.jpeg") }}
          style={styles.historyGemImage}
          resizeMode="cover"
        />
        
        <View style={styles.historyGemDetails}>
          <Text style={styles.historyGemId}>{item.gemId}</Text>
          <Text style={styles.historyGemType}>
            {(item.details?.gemType || item.gemType || "Unknown")}
          </Text>
          {item.details?.soldTo && (
            <Text style={styles.historyGemBuyer}>
              Sold to: {item.details.soldTo}
            </Text>
          )}
          {item.details?.soldPrice && (
            <Text style={styles.historyGemPrice}>
              Price: LKR {item.details.soldPrice.toLocaleString()}
            </Text>
          )}
          {item.details?.soldDate && (
            <Text style={styles.historyGemDate}>
              Date: {new Date(item.details.soldDate).toLocaleDateString()}
            </Text>
          )}
        </View>
        
        <View style={styles.soldBadge}>
          <Text style={styles.soldBadgeText}>Sold</Text>
        </View>
      </View>
    );
  };

  const renderHistoryModal = () => {
    return (
      <Modal
        visible={historyModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseHistory}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.historyModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Gem History</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton} 
                onPress={handleCloseHistory}
              >
                <Text style={styles.modalCloseButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {soldOutGems.length === 0 ? (
              <View style={styles.modalEmptyContainer}>
                <Ionicons name="diamond-outline" size={60} color="#CCCCCC" />
                <Text style={styles.modalEmptyText}>No sold gems found</Text>
              </View>
            ) : (
              <FlatList
                data={soldOutGems}
                renderItem={renderHistoryItem}
                keyExtractor={(item) => item.gemId || item._id}
                contentContainerStyle={styles.historyList}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </View>
      </Modal>
    );
  };

  // Update the JSX for the buttons in the header
  return (
    <SafeAreaView style={[baseScreenStylesNew.backgroundColor, baseScreenStylesNew.container]}>
      <HeaderBar 
        title="My gems" 
        navigation={navigation} 
        showBack={true} 
        leftIcon="menu" 
        onLeftPress={() => navigation.openDrawer()}
      />
      <View style={[baseScreenStylesNew.container.backgroundColor, styles.header]}>
        <View style={styles.searchContainer}>
          <View style={baseScreenStylesNew.search}>
            <Ionicons name="search" style={baseScreenStylesNew.searchIcon} />
            <TextInput
              style={baseScreenStylesNew.searchInput}
              placeholderTextColor={baseScreenStylesNew.searchIcon.color}
              placeholder="Search gems..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={[styles.sortButton, baseScreenStylesNew.themeColor]} onPress={toggleSort}>
              <Ionicons name={sortAscending ? "arrow-up" : "arrow-down"} size={16} color="#fff" />
              <Text style={[baseScreenStylesNew.whiteText, styles.sortButtonText]}>Sort</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Updated buttons container */}
        <View style={styles.buttonsRow}>
          {/* Empty space to push buttons to the right */}
          <View style={styles.buttonSpacer} />
          
          {/* History button */}
          <TouchableOpacity
            style={[styles.historyButton, baseScreenStylesNew.outlineButton]}
            onPress={handleShowHistory}
          >
            <Ionicons name="time-outline" size={16} color="#9CCDDB" />
            <Text style={styles.historyButtonText}>History</Text>
          </TouchableOpacity>
          
          {/* Select button - fixed width */}
          <TouchableOpacity
            style={[styles.selectButton, baseScreenStylesNew.themeColor]}
            onPress={toggleSelect}
          >
            <Text style={[styles.selectButtonText, baseScreenStylesNew.whiteText]}>
              {isSelectMode ? "Cancel" : "Select"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9CCDDB" />
          <Text style={{ marginTop: 10 }}>Loading gems...</Text>
        </View>
      ) : (
        <>
          {sortedGems.length === 0 ? (
            <View style={styles.noGemsContainer}>
              <Text style={styles.noGemsText}>No gems found</Text>
            </View>
          ) : (
            <FlatList
              data={sortedGems}
              renderItem={renderGemItem}
              keyExtractor={(item) => item.gemId || item._id || Math.random().toString()}
              numColumns={3}
              contentContainerStyle={styles.gemGrid}
            />
          )}

          <Modal visible={isSellModalVisible} transparent={true} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Set Prices for Gems</Text>
                  <TouchableOpacity onPress={handleSellCancel} style={styles.modalCloseButton}>
                    <Text style={styles.modalCloseButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                
                {selectedGems.length === 0 ? (
                  <View style={styles.modalEmptyContainer}>
                    <Text style={styles.modalEmptyText}>No gems selected</Text>
                  </View>
                ) : (
                  <View style={styles.modalListContainer}>
                    <View style={styles.modalColumnHeaders}>
                      <Text style={styles.columnHeaderGem}>Gem</Text>
                      <Text style={styles.columnHeaderPrice}>Price (LKR)</Text>
                    </View>
                    
                    <FlatList
                      data={selectedGems}
                      renderItem={renderSelectedGemItem}
                      keyExtractor={(item) => item}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.modalGemList}
                    />
                  </View>
                )}
                
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={handleSellCancel}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleAddGemsToMarket}
                    disabled={selectedGems.length === 0}
                  >
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {isSelectMode && (
            <View style={styles.selectionActions}>
              <TouchableOpacity style={[styles.sellButton, baseScreenStylesNew.themeColor]} onPress={handleSellPress}>
                <Text style={styles.actionButtonText}>Sell</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sendOrderButton, baseScreenStylesNew.themeColor]}
                onPress={handleSendOrder}
              >
                <Text style={styles.actionButtonText}>Send Order</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
      {renderHistoryModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    paddingHorizontal: 15,
  },
  searchContainer: {
    width: '100%',
    marginBottom: 10, // Reduced from 15 to tighten layout
  },
  
  // New row container for buttons
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', // Align buttons to the right
    width: '100%',
    marginTop: 5, // Reduced from 10 to tighten layout
  },
  
  // Spacer to push buttons to the right
  buttonSpacer: {
    flex: 1,
  },
  
  // Updated history button style
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 10, // Space between buttons
  },
  
  historyButtonText: {
    color: '#9CCDDB',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 5,
  },
  
  // Updated select button style - compact with fixed width
  selectButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80, // Fixed width for consistent look
  },
  
  selectButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 46,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 46,
    color: '#333333',
    fontSize: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 8,
  },
  sortButtonText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  selectButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },


  // Buttons
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginLeft: 8,
  },
  sortButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  selectButtonContainer: {
    alignItems: "flex-end",
  },
  selectButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 70,
    alignItems: "center",
  },
  selectButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  
  // Gem grid styles
  gemGrid: {
    padding: 8,
  },
  gemCard: {
    flex: 1 / 3,
    aspectRatio: 1,
    margin: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  gemImage: {
    width: "80%",
    height: "80%",
    borderRadius: 7,
  },
  gemId: {
    marginTop: 4,
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
  },
  
  // Selection actions
  selectionActions: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    backgroundColor: "rgba(152, 149, 149, 0.35)",
  },
  sellButton: {
    flex: 1,
    padding: 16,
    borderRadius: 25,
    marginRight: 8,
    alignItems: "center",
  },
  sendOrderButton: {
    flex: 1,
    padding: 16,
    borderRadius: 25,
    marginLeft: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  
  // Loading indicator
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#9CCDDB",
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalGemList: {
    padding: 10,
    width: "100%",
  },
  modalEmptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  modalEmptyText: {
    color: "#666666",
    fontSize: 16,
  },
  modalGemItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  modalGemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    marginRight: 12,
  },
  modalGemInfo: {
    flex: 1,
  },
  modalGemId: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalGemType: {
    color: "#666666",
    fontSize: 14,
    marginTop: 2,
  },
  modalPriceContainer: {
    alignItems: "flex-end",
    width: 150,
  },
  priceLabelText: {
    color: "#333333",
    fontSize: 14,
    marginBottom: 4,
    alignSelf: "flex-start",
  },
  priceInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 8,
    height: 40,
    width: "100%",
  },
  currencySymbol: {
    color: "#333333",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    color: "#333333",
    fontSize: 16,
    paddingVertical: 8,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: "#F8F8F8",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  confirmButton: {
    backgroundColor: "#9CCDDB",
  },
  cancelButtonText: {
    color: "#666666",
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  noGemsContainer: {
    padding: 30,
    alignItems: "center",
  },
  noGemsText: {
    color: "#666666",
    fontSize: 16,
  },
  modalListContainer: {
    padding: 0,
    width: "100%",
  },
  modalColumnHeaders: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 60,
    paddingVertical: 8,
    backgroundColor: "#F5F5F5",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  columnHeaderGem: {
    flex: 1,
    color: "#333333",
    fontSize: 16,
    fontWeight: "bold",
  },
  columnHeaderPrice: {
    width: 150,
    color: "#333333",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "right",
  },
  statusIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF6347",
    borderRadius: 12,
    padding: 4,
  },
  marketIndicator: {
    backgroundColor: "#FFD700",
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  historyButtonText: {
    color: '#9CCDDB',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 5,
  },
  historyModalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  historyList: {
    padding: 12,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  historyGemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    marginRight: 15,
  },
  historyGemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  historyGemId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 2,
  },
  historyGemType: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  historyGemBuyer: {
    fontSize: 13,
    color: '#444444',
    marginBottom: 2,
  },
  historyGemPrice: {
    fontSize: 13,
    color: '#444444',
    marginBottom: 2,
  },
  historyGemDate: {
    fontSize: 12,
    color: '#888888',
  },
  soldBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#E74C3C',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  soldBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  buttonSpacer: {
    flex: 1,
  },
});

export default GemCollectionScreen;
