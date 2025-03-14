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
import { baseScreenStyles } from "../../styles/baseStyles";
import Header_2 from "../../components/Header_2";
import BS_NavBar from "../../components/BS_NavBar";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, ENDPOINTS } from "../../config/api";
import { LinearGradient } from "expo-linear-gradient";

const searchIcon =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAAqklEQVRYhe2UQQ6AIAwEWeL/v6wHY0QK3W0JiYns0VB2h1YUiDQD2oABGdAFaW+AAawR+ybXPQBJupO0SPq6FylBLyeXx56klSkqgCRJc+YARxvQzg1oxwW0E3+PMue8/BR/+wqSZ0B6CpLvgHYKktfAkT+h1eb1i3B1BrRjAO1fB2g/TNqJv0eZc15+ir99BckzID0FyXdAOwXJa+DIn9Bq83oAVx0DTyemB+GeqEUAAAAASUVORK5CYII=";

const GemCollectionScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [gems, setGems] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedGems, setSelectedGems] = useState([]);
  const [sortAscending, setSortAscending] = useState(true);
  const [isSellModalVisible, setSellModalVisible] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [gemPrices, setGemPrices] = useState({});

  useEffect(() => {
    const fetchGems = async () => {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        console.error("Authentication token not found");
        setLoading(false);
        return; // Exit if no token
      }
      try {
        const response = await axios.get(`${API_URL}${ENDPOINTS.GET_MY_GEMS}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGems(response.data.gems);
        console.log("Number of gems fetched:", response.data.gems.length);
      } catch (error) {
        console.error(
          "Error fetching gems:",
          error.response ? error.response.data : error.message
        );
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

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

  const toggleGemSelection = (gemId) => {
    if (!isSelectMode) return;

    setSelectedGems((prev) => {
      if (prev.includes(gemId)) {
        return prev.filter((id) => id !== gemId);
      } else {
        return [...prev, gemId];
      }
    });
  };

  const handleSendOrder = () => {
    console.log("Sending order for gems:", selectedGems);
    setIsSelectMode(false);
    setSelectedGems([]);
    navigation.navigate("FavoritesScreen");
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
        Alert.alert("Success", "Gems have been added to the market.");
        setSellModalVisible(false);
        setSelectedGems([]);
        setGemPrices({});
        setIsSelectMode(false);
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

  const renderGemItem = React.useCallback(
    ({ item }) => {
      const isSelected = selectedGems.includes(item.gemId);
      return (
        <TouchableOpacity
          style={[
            styles.gemCard,
            isSelectMode && !isSelected ? { opacity: 0.7 } : { opacity: 1 },
          ]}
          onPress={() => {
            if (isSelectMode) {
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
          <Text style={styles.gemId}>{item.gemId}</Text>
        </TouchableOpacity>
      );
    },
    [isSelectMode, selectedGems, navigation]
  );

  return (
    <SafeAreaView style={baseScreenStyles.container}>
      <Header_2 title="My Gems" />
      <StatusBar barStyle="light-content" />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9CCDDB" />
          <Text style={{ marginTop: 10 }}>Loading gems...</Text>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <View style={styles.searchSection}>
              <View style={styles.searchRow}>
                <View style={styles.searchBar}>
                  <Image source={{ uri: searchIcon }} style={styles.searchIcon} />
                  <TextInput
                    placeholder="Search"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
                <TouchableOpacity style={styles.sortButton} onPress={toggleSort}>
                  <Text style={styles.sortButtonText}>
                    Sort {sortAscending ? "↑" : "↓"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.selectButtonContainer}>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={toggleSelect}
                >
                  <Text style={styles.selectButtonText}>
                    {isSelectMode ? "Cancel" : "Select"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

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
              <TouchableOpacity style={styles.sellButton} onPress={handleSellPress}>
                <Text style={styles.actionButtonText}>Sell</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sendOrderButton}
                onPress={handleSendOrder}
              >
                <Text style={styles.actionButtonText}>Send Order</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
   
  },
  
  // Search section styles
  searchSection: {
    marginBottom: 8,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: "#9CCDDB",
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333333",
  },
  
  // Buttons
  sortButton: {
    backgroundColor: "#9CCDDB",
    padding: 8,
    borderRadius: 8,
    minWidth: 70,
    alignItems: "center",
  },
  sortButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  selectButtonContainer: {
    alignItems: "flex-end",
  },
  selectButton: {
    backgroundColor: "#9CCDDB",
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
    borderRadius: 4,
  },
  gemId: {
    marginTop: 4,
    fontSize: 12,
    color: "#003366",
    fontWeight: "500",
  },
  
  // Selection actions
  selectionActions: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  sellButton: {
    flex: 1,
    backgroundColor: "#003366",
    padding: 16,
    borderRadius: 25,
    marginRight: 8,
    alignItems: "center",
  },
  sendOrderButton: {
    flex: 1,
    backgroundColor: "#003366",
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
  }
});

export default GemCollectionScreen;
