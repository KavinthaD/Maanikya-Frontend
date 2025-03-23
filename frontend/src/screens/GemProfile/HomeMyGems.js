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
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import { baseScreenStyles } from "../../styles/baseStyles";
import HeaderBar from "../../components/HeaderBar";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, ENDPOINTS } from "../../config/api";

// Get screen dimensions to calculate gem card sizes properly
const { width } = Dimensions.get('window');
// Calculate width for 4 gems per row (with margins)
const CARD_WIDTH = (width - 40) / 4; // 40 accounts for padding and margins

// Add a unique key for the FlatList
const flatListKey = "four-column-grid";

const GemCollectionScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [gems, setGems] = useState([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedGems, setSelectedGems] = useState([]);
  const [sortOption, setSortOption] = useState("gemId");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isSellModalVisible, setSellModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gemPrices, setGemPrices] = useState({});
  const [historyModalVisible, setHistoryModalVisible] = useState(false);
  const [soldOutGems, setSoldOutGems] = useState([]);
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const fetchGems = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("authToken");
    if (!token) {
      console.error("Authentication token not found");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}${ENDPOINTS.GET_MY_GEMS}?includeAll=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setGems(response.data.gems.filter((gem) => gem.status !== "SoldOut"));
      setSoldOutGems(
        response.data.gems.filter((gem) => gem.status === "SoldOut")
      );
    } catch (error) {
      console.error(
        "Error fetching gems:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGems();
  }, []);

  const formatGemType = (type) => {
    if (!type) return "Unknown";
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getFormattedWeight = (weight) => {
    if (weight === null || weight === undefined) return "N/A";
    return `${weight} ct`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatCost = (cost) => {
    if (cost === null || cost === undefined) return "N/A";
    return `LKR ${cost}`;
  };

  const filteredGems = gems.filter((gem) => {
    if (!gem.gemId || !searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    const gemIdMatch = gem.gemId.toLowerCase().includes(searchLower);
    const gemTypeMatch = gem.details?.gemType?.toLowerCase().includes(searchLower);
    const statusMatch = gem.status.toLowerCase().includes(searchLower);
    return gemIdMatch || gemTypeMatch || statusMatch;
  });

  const sortedGems = [...filteredGems].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;
    
    switch(sortOption) {
      case "gemId":
        return direction * a.gemId.localeCompare(b.gemId);
      case "date":
        return direction * (new Date(a.createdAt) - new Date(b.createdAt));
      case "weight":
        const weightA = a.details?.weight || 0;
        const weightB = b.details?.weight || 0;
        return direction * (weightA - weightB);
      case "cost":
        const costA = a.cost || 0;
        const costB = b.cost || 0;
        return direction * (costA - costB);
      case "type":
        const typeA = a.details?.gemType || "";
        const typeB = b.details?.gemType || "";
        return direction * typeA.localeCompare(typeB);
      default:
        return direction * a.gemId.localeCompare(b.gemId);
    }
  });

  const showSortOptions = () => {
    setSortModalVisible(true);
  };
  
  const handleSortOptionSelect = (option) => {
    if (sortOption === option) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortOption(option);
      setSortDirection("asc");
    }
    setSortModalVisible(false);
  };

  const getSortIcon = () => {
    return sortDirection === "asc" ? "arrow-up" : "arrow-down";
  };

  const toggleSelect = () => {
    setIsSelectMode(!isSelectMode);
    if (isSelectMode) {
      setSelectedGems([]);
    }
  };

  // 2. Update the toggleGemSelection function to check gem status before selection
  const toggleGemSelection = (gemId) => {
    if (selectedGems.includes(gemId)) {
      setSelectedGems(selectedGems.filter(id => id !== gemId));
    } else {
      setSelectedGems([...selectedGems, gemId]);
    }
  };

  const handleShowHistory = () => {
    setHistoryModalVisible(true);
  };

  const getValidImageSource = (photoUrl) => {
    if (typeof photoUrl === 'string' && photoUrl) {
      return { uri: photoUrl };
    }
    return require("../../assets/gems/no_gem.jpeg");
  };

  // Gem card render function - optimized for 4 columns
  const renderGemItem = React.useCallback(
    ({ item }) => {
      const isSelected = selectedGems.includes(item.gemId);
      const isInOrder = item.status === "InOrder" || item.status === "Requested";
      const isInMarket = item.inMarket === true;

      return (
        <TouchableOpacity
          style={[
            styles.gemCard,
            isSelectMode && isSelected ? styles.selectedGemCard : null,
            isSelectMode && !isSelected ? { opacity: 0.7 } : { opacity: 1 },
          ]}
          onPress={() => {
            if (isSelectMode) {
              if (isInOrder) {
                Alert.alert(
                  "Cannot Select",
                  `Gem ${item.gemId} is already in an order request.`
                );
                return;
              }
              if (isInMarket) {
                Alert.alert(
                  "Cannot Select",
                  `Gem ${item.gemId} is currently on sale in the market.`
                );
                return;
              }
              toggleGemSelection(item.gemId);
            } else {
              navigation.navigate("MyGems", { gemId: item.gemId });
            }
          }}
        >
          <Image
            source={getValidImageSource(item.photo)}
            style={styles.gemImage}
            resizeMode="cover"
          />

          {/* Status Indicators */}
          {isInOrder && (
            <View style={styles.statusIndicator}>
              <Ionicons name="time-outline" size={16} color="#FFFFFF" />
            </View>
          )}

          {isInMarket && (
            <View style={[styles.statusIndicator, styles.marketIndicator]}>
              <Ionicons name="pricetag-outline" size={16} color="#FFFFFF" />
            </View>
          )}

          {/* Gem Details */}
          <View style={styles.gemDetailsContainer}>
            <Text style={styles.gemId} numberOfLines={1}>{item.gemId}</Text>
            <Text style={styles.gemType} numberOfLines={1}>
              {formatGemType(item.details?.gemType)}
            </Text>
            <Text style={styles.gemWeight}>
              {getFormattedWeight(item.details?.weight)}
            </Text>
          </View>

          {/* Selection Indicator */}
          {isSelectMode && isSelected && (
            <View style={styles.selectionIndicator}>
              <Ionicons name="checkmark-circle" size={20} color={baseScreenStyles.colors.primary} />
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [isSelectMode, selectedGems, navigation]
  );

  // Sort modal with improved styling
  const renderSortModal = () => {
    return (
      <Modal
        visible={sortModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sortModalContent}>
            <View style={styles.sortModalHeader}>
              <Text style={styles.sortModalTitle}>Sort By</Text>
              <TouchableOpacity
                onPress={() => setSortModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {[
              { key: "gemId", label: "Gem ID" },
              { key: "date", label: "Registration Date" },
              { key: "weight", label: "Weight" },
              { key: "cost", label: "Cost" },
              { key: "type", label: "Gem Type" }
            ].map(option => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.sortOption,
                  sortOption === option.key ? styles.selectedSortOption : null
                ]}
                onPress={() => handleSortOptionSelect(option.key)}
              >
                <Text style={[
                  styles.sortOptionText,
                  sortOption === option.key ? { color: baseScreenStyles.colors.primary } : null
                ]}>
                  {option.label}
                </Text>
                {sortOption === option.key && (
                  <Ionicons 
                    name={getSortIcon()} 
                    size={20} 
                    color={baseScreenStyles.colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    );
  };

  // Add the history modal render function after the renderSortModal function
  const renderHistoryModal = () => {
    return (
      <Modal
        visible={historyModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setHistoryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.historyModalContent}>
            <View style={styles.sortModalHeader}>
              <Text style={styles.sortModalTitle}>Gem History</Text>
              <TouchableOpacity
                onPress={() => setHistoryModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            {soldOutGems.length === 0 ? (
              <View style={styles.emptyHistoryContainer}>
                <Ionicons 
                  name="time-outline" 
                  size={40} 
                  color={baseScreenStyles.colors.text.light} 
                />
                <Text style={styles.emptyHistoryText}>
                  No gem history found
                </Text>
                <Text style={styles.emptyHistorySubtext}>
                  Gems that have been sold will appear here
                </Text>
              </View>
            ) : (
              <FlatList
                data={soldOutGems}
                renderItem={({ item }) => (
                  <View style={styles.historyItem}>
                    <Image
                      source={getValidImageSource(item.photo)}
                      style={styles.historyItemImage}
                      resizeMode="cover"
                    />
                    <View style={styles.historyItemDetails}>
                      <Text style={styles.historyItemId}>{item.gemId}</Text>
                      <Text style={styles.historyItemType}>
                        {formatGemType(item.details?.gemType)}
                      </Text>
                      <Text style={styles.historyItemWeight}>
                        {getFormattedWeight(item.details?.weight)}
                      </Text>
                      <Text style={styles.historyItemDate}>
                        Sold on: {formatDate(item.updatedAt || item.createdAt)}
                      </Text>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.gemId || item._id}
                contentContainerStyle={styles.historyList}
              />
            )}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView
      style={[
        baseScreenStylesNew.backgroundColor,
        baseScreenStylesNew.container,
      ]}
    >
      <HeaderBar
        title="Gem Inventory"
        navigation={navigation}
        showBack={true}
        leftIcon="menu"
        onLeftPress={() => navigation.openDrawer()}
      />
      
      {/* Improved Search and Filter Section */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          {/* Search Box */}
          <View style={styles.searchInputContainer}>
            <Ionicons 
              name="search" 
              size={20} 
              color={baseScreenStyles.colors.text.medium} 
              style={styles.searchIcon} 
            />
            <TextInput
              style={styles.searchInput}
              placeholderTextColor={baseScreenStyles.colors.input.placeholder}
              placeholder="Search gems..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} style={styles.clearButton}>
                <Ionicons name="close-circle" size={18} color={baseScreenStyles.colors.text.medium} />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Sort Button */}
          <TouchableOpacity
            style={styles.sortButton}
            onPress={showSortOptions}
          >
            <Ionicons
              name={getSortIcon()}
              size={18}
              color={baseScreenStyles.colors.background}
            />
            <Text style={styles.sortButtonText}>
              Sort
            </Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsRow}>
          <View style={styles.buttonSpacer} />
          <TouchableOpacity
            style={styles.historyButton}
            onPress={handleShowHistory}
          >
            <Ionicons 
              name="time-outline" 
              size={16} 
              color={baseScreenStyles.colors.primary} 
            />
            <Text style={styles.historyButtonText}>History</Text>
          </TouchableOpacity>
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

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={baseScreenStyles.colors.primary} />
          <Text style={styles.loadingText}>Loading gems...</Text>
        </View>
      ) : (
        <>
          {sortedGems.length === 0 ? (
            <View style={styles.noGemsContainer}>
              <Text style={styles.noGemsText}>No gems found</Text>
            </View>
          ) : (
            <FlatList
              key={flatListKey}
              data={sortedGems}
              renderItem={renderGemItem}
              keyExtractor={(item) => item.gemId || item._id || Math.random().toString()}
              numColumns={4} // Changed to 4 columns
              contentContainerStyle={styles.gemGrid}
            />
          )}

          {/* Sort Modal */}
          {renderSortModal()}

          {/* History Modal */}
          {renderHistoryModal()}

          {/* Other modals would go here */}
        </>
      )}
    </SafeAreaView>
  );
};

// Updated styles with improved styling
const styles = StyleSheet.create({
  // Header Section
  header: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: baseScreenStyles.colors.background,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: baseScreenStyles.colors.input.background,
    borderWidth: 1,
    borderColor: baseScreenStyles.colors.input.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: baseScreenStyles.colors.text.dark,
  },
  clearButton: {
    padding: 4,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: baseScreenStyles.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
    elevation: 2,
  },
  sortButtonText: {
    fontSize: 14,
    marginLeft: 4,
    color: baseScreenStyles.colors.background,
    fontWeight: "500",
  },
  
  // Action Buttons
  buttonsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonSpacer: {
    flex: 1,
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 10,
    borderWidth: 1,
    borderColor: baseScreenStyles.colors.primary,
  },
  historyButtonText: {
    marginLeft: 4,
    fontSize: 13,
    color: baseScreenStyles.colors.primary,
    fontWeight: "500",
  },
  selectButton: {
    backgroundColor: baseScreenStyles.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  selectButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: baseScreenStyles.colors.background,
  },
  
  // Loading and Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: baseScreenStyles.colors.text.medium,
  },
  noGemsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noGemsText: {
    fontSize: 16,
    color: baseScreenStyles.colors.text.medium,
  },
  
  // Gem Grid and Cards
  gemGrid: {
    padding: 8,
  },
  gemCard: {
    width: CARD_WIDTH,
    margin: 4,
    backgroundColor: baseScreenStyles.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
  },
  selectedGemCard: {
    borderColor: baseScreenStyles.colors.primary,
    borderWidth: 2,
    opacity: 1,
  },
  gemImage: {
    width: "100%",
    height: CARD_WIDTH, // Square aspect ratio
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  gemDetailsContainer: {
    padding: 6,
  },
  gemId: {
    fontSize: 12,
    fontWeight: "600",
    color: baseScreenStyles.colors.text.dark,
    marginBottom: 2,
  },
  gemType: {
    fontSize: 10,
    color: baseScreenStyles.colors.text.medium,
    marginBottom: 2,
  },
  gemWeight: {
    fontSize: 10,
    color: baseScreenStyles.colors.text.medium,
    fontWeight: "500",
  },
  selectionIndicator: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 10,
    padding: 2,
  },
  statusIndicator: {
    position: "absolute",
    top: 4,
    left: 4,
    backgroundColor: "#f47c48",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  marketIndicator: {
    backgroundColor: baseScreenStyles.colors.success,
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  sortModalContent: {
    width: "80%",
    backgroundColor: baseScreenStyles.colors.background,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  sortModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: baseScreenStyles.colors.primary,
  },
  sortModalTitle: {
    color: baseScreenStyles.colors.background,
    fontSize: 16,
    fontWeight: "600",
  },
  modalCloseButton: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCloseButtonText: {
    color: baseScreenStyles.colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  sortOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  selectedSortOption: {
    backgroundColor: "#F0F9FB",
  },
  sortOptionText: {
    fontSize: 15,
    color: baseScreenStyles.colors.text.dark,
  },
  historyModalContent: {
    width: "80%",
    backgroundColor: baseScreenStyles.colors.background,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  emptyHistoryContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyHistoryText: {
    fontSize: 16,
    color: baseScreenStyles.colors.text.light,
    marginTop: 10,
  },
  emptyHistorySubtext: {
    fontSize: 14,
    color: baseScreenStyles.colors.text.light,
    marginTop: 5,
    textAlign: "center",
  },
  historyList: {
    padding: 16,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: baseScreenStyles.colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
  },
  historyItemImage: {
    width: 60,
    height: 60,
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
  },
  historyItemDetails: {
    flex: 1,
    padding: 10,
  },
  historyItemId: {
    fontSize: 14,
    fontWeight: "600",
    color: baseScreenStyles.colors.text.dark,
    marginBottom: 2,
  },
  historyItemType: {
    fontSize: 12,
    color: baseScreenStyles.colors.text.medium,
    marginBottom: 2,
  },
  historyItemWeight: {
    fontSize: 12,
    color: baseScreenStyles.colors.text.medium,
    fontWeight: "500",
  },
  historyItemDate: {
    fontSize: 12,
    color: baseScreenStyles.colors.text.medium,
  },
});

export default GemCollectionScreen;