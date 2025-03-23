//Screen Creator Tilmi

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Modal,
  FlatList
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { Ionicons } from '@expo/vector-icons';
import { baseScreenStylesNew } from '../../styles/baseStylesNew';
import { baseScreenStyles } from '../../styles/baseStyles';
import HeaderBar from '../../components/HeaderBar';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2; // 2 cards per row with margins

const Market = ({ navigation }) => {
  const [gemstones, setGemstones] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sort state variables
  const [sortOption, setSortOption] = useState("price");
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortModalVisible, setSortModalVisible] = useState(false);

  const fetchGems = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get(`${API_URL}/api/market/view`);
      
      if (response.data.success) {
        setGemstones(response.data.gems);
        setError(null);
      } else {
        setError('Failed to load gems');
      }
    } catch (error) {
      console.error('Error fetching gems:', error);
      setError('Network error. Please try again.');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchGems();
    }, [])
  );

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

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

  // Format price with commas
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format gem type
  const formatGemType = (type) => {
    if (!type) return "Unknown";
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format gem details
  const formatGemDetails = (weight, gemType) => {
    const formattedWeight = weight ? `${weight} ct` : '';
    const formattedType = gemType ? formatGemType(gemType) : '';
    
    if (formattedWeight && formattedType) {
      return `${formattedWeight} ${formattedType}`;
    } else if (formattedWeight) {
      return formattedWeight;
    } else if (formattedType) {
      return formattedType;
    }
    return '';
  };

  // Filter gemstones based on search query
  const filteredGems = gemstones.filter((gem) => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const gemIdMatch = gem.gemId && gem.gemId.toLowerCase().includes(searchLower);
    const gemTypeMatch = gem.gemType && gem.gemType.toLowerCase().includes(searchLower);
    const ownerMatch = gem.owner && gem.owner.toLowerCase().includes(searchLower);
    
    return gemIdMatch || gemTypeMatch || ownerMatch;
  });

  // Sort gemstones based on selected option and direction
  const sortedGems = [...filteredGems].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;
    
    switch(sortOption) {
      case "gemId":
        return direction * (a.gemId || "").localeCompare(b.gemId || "");
      case "date":
        return direction * (new Date(a.listedDate) - new Date(b.listedDate));
      case "weight":
        const weightA = a.weight || 0;
        const weightB = b.weight || 0;
        return direction * (weightA - weightB);
      case "price":
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        return direction * (priceA - priceB);
      case "type":
        const typeA = a.gemType || "";
        const typeB = b.gemType || "";
        return direction * typeA.localeCompare(typeB);
      default:
        return direction * (a.price - b.price);
    }
  });

  // Render the sort modal
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
              { key: "price", label: "Price" },
              { key: "gemId", label: "Gem ID" },
              { key: "date", label: "Listed Date" },
              { key: "weight", label: "Weight" },
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

  // Render a gem card
  const renderGemCard = ({ item }) => (
    <TouchableOpacity
      style={styles.gemstoneCard}
      onPress={() => navigation.navigate("GemDetailsScreen", { gemId: item.gemId })}
    >
      <View style={styles.gemImageContainer}>
        <Image
          source={{ uri: item.photo }}
          style={styles.gemImage}
          resizeMode="cover"
          defaultSource={require("../../assets/gems/no_gem.jpeg")}
        />
        <Text style={styles.gemId}>{item.gemId}</Text>
      </View>
      <View style={styles.gemDetails}>
        <Text style={styles.gemSpecs} numberOfLines={1}>
          {formatGemDetails(item.weight, item.gemType)}
        </Text>
        <Text style={styles.gemOwner} numberOfLines={1}>
          Owner: {item.owner}
        </Text>
        <Text style={styles.gemPrice}>
          LKR {formatPrice(item.price)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={baseScreenStylesNew.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <HeaderBar 
        title="Marketplace"
        navigation={navigation}
        showBack={true} 
      />

      {/* Search and Sort Section */}
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
              placeholder="Search marketplace..."
              value={searchQuery}
              onChangeText={handleSearch}
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
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={baseScreenStyles.colors.primary} />
          <Text style={styles.loadingText}>Loading gems...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: baseScreenStyles.colors.primary }]} 
            onPress={fetchGems}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={sortedGems}
          renderItem={renderGemCard}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.gemListContainer}
          ListHeaderComponent={
            <Text style={styles.sectionTitle}>Available Gems</Text>
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="diamond-outline" size={64} color={baseScreenStyles.colors.text.light} />
              <Text style={styles.emptyText}>
                {searchQuery ? "No gems match your search" : "No gems available"}
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={fetchGems}
              colors={[baseScreenStyles.colors.primary]} 
              tintColor={baseScreenStyles.colors.primary}
            />
          }
        />
      )}

      {/* Sort Modal */}
      {renderSortModal()}
    </SafeAreaView>
  );
};

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
    marginBottom: 0,
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
  
  // Section Title
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: baseScreenStyles.colors.text.dark,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
  },
  
  // Gem List Container
  gemListContainer: {
    paddingBottom: 20,
  },
  
  // Gem Card Styles  
  gemstoneCard: {
    width: CARD_WIDTH,
    backgroundColor: baseScreenStyles.colors.background,
    borderRadius: 12,
    margin: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  gemImageContainer: {
    position: 'relative',
    width: '100%',
    height: CARD_WIDTH * 0.9,
    overflow: 'hidden',
  },
  gemImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  gemId: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  gemDetails: {
    padding: 12,
  },
  gemSpecs: {
    fontSize: 15,
    fontWeight: 'bold',
    color: baseScreenStyles.colors.text.dark,
    marginBottom: 3,
  },
  gemOwner: {
    fontSize: 13,
    color: baseScreenStyles.colors.text.medium,
    marginBottom: 5,
  },
  gemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: baseScreenStyles.colors.primary,
  },
  
  // Loading, Error, and Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    color: baseScreenStyles.colors.text.medium,
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: baseScreenStyles.colors.text.medium,
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
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
});

export default Market;