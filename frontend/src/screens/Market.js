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
  StatusBar
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API_URL } from '../config/api';
import { Ionicons } from '@expo/vector-icons';
import { baseScreenStylesNew } from '../styles/baseStylesNew';
import HeaderBar from '../components/HeaderBar';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 40) / 2; // 2 cards per row with margins
const THEME_COLOR = '#170969'; // Light blue theme color

const Market = ({ navigation }) => {
  const [gemstones, setGemstones] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAscending, setSortAscending] = useState(true);

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

  const handleSort = () => {
    setSortAscending(!sortAscending);
  };

  // Format price with commas
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format gem details
  const formatGemDetails = (weight, gemType) => {
    const formattedWeight = weight ? `${weight} ct` : '';
    const formattedType = gemType ? gemType.charAt(0).toUpperCase() + gemType.slice(1) : '';
    
    if (formattedWeight && formattedType) {
      return `${formattedWeight} ${formattedType}`;
    } else if (formattedWeight) {
      return formattedWeight;
    } else if (formattedType) {
      return formattedType;
    }
    return '';
  };

  // Filter and sort gemstones
  const filteredAndSortedGemstones = gemstones
    .filter((gem) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (gem.gemId && gem.gemId.toLowerCase().includes(searchLower)) ||
        (gem.gemType && gem.gemType.toLowerCase().includes(searchLower)) ||
        (gem.owner && gem.owner.toLowerCase().includes(searchLower))
      );
    })
    .sort((a, b) => {
      if (sortAscending) {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

  return (
    <SafeAreaView style={baseScreenStylesNew.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <HeaderBar 
        title="Marketplace" 
      />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={fetchGems}
            colors={[THEME_COLOR]} 
            tintColor={THEME_COLOR}
          />
        }
      >
        <View style={styles.searchContainer}>
          <View style={baseScreenStylesNew.search}>
            <Ionicons name="search" style={baseScreenStylesNew.searchIcon} />
            <TextInput
              style={baseScreenStylesNew.searchInput}
              placeholder="Search gems..."
              placeholderTextColor={baseScreenStylesNew.searchIcon.color}
              value={searchQuery}
              onChangeText={handleSearch}
            />
            <TouchableOpacity style={[styles.sortButton, baseScreenStylesNew.themeColor]} onPress={handleSort}>
              <Ionicons name={sortAscending ? "arrow-up" : "arrow-down"} size={16} color="#FFF" />
              <Text style={styles.sortButtonText}>Price</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.sectionTitle, baseScreenStylesNew.blackText]}>Available Gems</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={THEME_COLOR} />
              <Text style={styles.loadingText}>Loading gems...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchGems}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : filteredAndSortedGemstones.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="diamond-outline" size={64} color={THEME_COLOR} />
              <Text style={styles.emptyText}>No gems available</Text>
            </View>
          ) : (
            <View style={styles.gemstoneGrid}>
              {filteredAndSortedGemstones.map((gem) => (
                <TouchableOpacity
                  key={gem._id}
                  style={styles.gemstoneCard}
                  onPress={() => navigation.navigate("GemDetailsScreen", { gemId: gem.gemId })}
                >
                  <View style={styles.gemImageContainer}>
                    <Image
                      source={{ uri: gem.photo || require("../assets/gems/no_gem.jpeg") }}
                      style={styles.gemImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.gemId}>{gem.gemId}</Text>
                  </View>
                  <View style={styles.gemDetails}>
                    <Text style={styles.gemSpecs} numberOfLines={1}>
                      {formatGemDetails(gem.weight, gem.gemType)}
                    </Text>
                    <Text style={styles.gemOwner} numberOfLines={1}>
                      Owner: {gem.owner}
                    </Text>
                    <Text style={styles.gemPrice}>
                      LKR {formatPrice(gem.price)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
  },
  searchContainer: {
    padding: 15,
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
    color: '#FFF',
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  gemstoneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gemstoneCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
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
    color: '#333333',
    marginBottom: 3,
  },
  gemOwner: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 5,
  },
  gemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME_COLOR,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    color: '#333333',
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: THEME_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    color: '#333333',
    fontSize: 16,
    marginTop: 12,
  },
});

export default Market;
