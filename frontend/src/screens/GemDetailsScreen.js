//Screen Creator Kavintha

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  ActivityIndicator,
  Share,
  Dimensions,
  SafeAreaView,
  StatusBar
} from "react-native";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import axios from "axios";
import { API_URL } from "../config/api";
import { LinearGradient } from "expo-linear-gradient";
import { baseScreenStyles } from "../styles/baseStyles";

const { width } = Dimensions.get("window");
const THEME_COLOR = "#9CCDDB"; // Light blue theme color

// Color name to hex map for common gem colors
const colorToHex = {
  red: "#FF0000",
  blue: "#0000FF",
  green: "#00FF00",
  yellow: "#FFFF00",
  purple: "#800080",
  pink: "#FFC0CB",
  orange: "#FFA500",
  brown: "#A52A2A",
  black: "#000000",
  white: "#FFFFFF",
  amber: "#FFBF00",
  teal: "#008080",
  cyan: "#00FFFF",
};

// Updated mock data to match API response
const mockGemData = {
  marketId: "mock123",
  status: "Available",
  price: 90000,
  listedDate: "2025-03-13T17:05:01.742Z",
  gemId: "G0001",
  photo: "https://res.cloudinary.com/dwtlv2h5o/image/upload/v1741883777/gems/wwpzy0z5zx1mqiyvgwkz.jpg",
  weight: 1.5,
  gemType: "amber",
  shape: "square",
  color: "orange",
  description: "This is a beautiful orange Amber with a square cut. It has excellent clarity and translucent transparency. The gem displays a pearly luster with medium brilliance. The color is vibrant and consistent throughout the stone. The square cut enhances the gem's natural beauty and maximizes its visual appeal.",
  dimensions: "2.20 x 1.5 x 1.0",
  extraInfo: null,
  owner: {
    username: "Bruce",
    firstName: "Bruce",
    lastName: "Wayne",
    phone: "0710000000"
  }
};

const GemDetailsScreen = ({ route, navigation }) => {
  const { gemId } = route.params;
  const [gem, setGem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchGemDetails();
  }, [gemId]);

  const fetchGemDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/market/view/${gemId}`);
      
      if (response.data.success) {
        // Process the gem data - add colorHex based on color name if needed
        const gemData = response.data.gemDetails;
        
        if (gemData.color && !gemData.colorHex) {
          const colorName = gemData.color.toLowerCase();
          gemData.colorHex = colorToHex[colorName] || THEME_COLOR; // Default to theme color if not found
        }
        
        setGem(gemData);
        setError(null);
      } else {
        throw new Error("Failed to load gem details");
      }
    } catch (err) {
      console.error("Error fetching gem details:", err);
      setError("Failed to load gem details. Using demo data instead.");
      setGem(mockGemData); // Use mock data as fallback
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (gem?.owner?.phone) {
      Linking.openURL(`tel:${gem.owner.phone}`);
    }
  };

  const handleShare = async () => {
    try {
      const shareMessage = `Check out this beautiful ${gem.weight}ct ${gem.gemType}: ${gem.description}`;
      
      await Share.share({
        message: shareMessage,
        title: `Gem ${gem.gemId}`,
        url: gem.photo
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={THEME_COLOR} />
          <Text style={styles.loadingText}>Loading gem details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !gem) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchGemDetails}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{gem.gemId}</Text>
        <TouchableOpacity 
          style={styles.shareButton} 
          onPress={handleShare}
        >
          <Ionicons name="share-social-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image
            source={gem.photo ? { uri: gem.photo } : require("../assets/gems/no_gem.jpeg")}
            style={styles.gemImage}
            resizeMode="contain"
          />
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{gem.gemType || "Unknown Type"}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.infoCard}>
            <View style={styles.gemHeader}>
              <View>
                <Text style={styles.gemId}>{gem.gemId}</Text>
                <Text style={styles.gemType}>
                  {gem.weight ? `${gem.weight} ct ${gem.gemType || ""}` : gem.gemType || "Unknown Type"}
                </Text>
              </View>
              <View style={styles.priceTag}>
                <MaterialCommunityIcons name="tag" size={20} color="#fff" />
                <Text style={styles.priceText}>
                  LKR {gem.price?.toLocaleString() || "Not for sale"}
                </Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Ionicons name="person" size={20} color="#555" />
                <Text style={styles.infoLabel}>Owner:</Text>
                <Text style={styles.infoValue}>
                  {gem.owner?.firstName 
                    ? `${gem.owner.firstName} ${gem.owner.lastName}`
                    : "Unknown Owner"}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="call" size={20} color="#555" />
                <Text style={styles.infoLabel}>Contact:</Text>
                <TouchableOpacity onPress={handleContact}>
                  <Text style={[styles.infoValue, styles.contactLink]}>
                    {gem.owner?.phone || "Not available"}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="color-palette" size={20} color="#555" />
                <Text style={styles.infoLabel}>Color:</Text>
                <Text style={styles.infoValue}>{gem.color || "Not specified"}</Text>
                {gem.color && (
                  <View 
                    style={[
                      styles.colorSwatch, 
                      { backgroundColor: gem.colorHex || gem.color }
                    ]} 
                  />
                )}
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="diamond" size={20} color="#555" />
                <Text style={styles.infoLabel}>Gem type:</Text>
                <Text style={styles.infoValue}>{gem.gemType || "Not specified"}</Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="shapes" size={20} color="#555" />
                <Text style={styles.infoLabel}>Shape:</Text>
                <Text style={styles.infoValue}>{gem.shape || "Not specified"}</Text>
              </View>

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="weight" size={20} color="#555" />
                <Text style={styles.infoLabel}>Weight:</Text>
                <Text style={styles.infoValue}>{gem.weight || "Not specified"} CT</Text>
              </View>

              {gem.dimensions && (
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons name="ruler" size={20} color="#555" />
                  <Text style={styles.infoLabel}>Dimensions:</Text>
                  <Text style={styles.infoValue}>{gem.dimensions}</Text>
                </View>
              )}

              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="calendar" size={20} color="#555" />
                <Text style={styles.infoLabel}>Listed on:</Text>
                <Text style={styles.infoValue}>{formatDate(gem.listedDate)}</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.descriptionSection}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.descriptionText}>{gem.description || "No description provided."}</Text>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.actionSection}>
              <TouchableOpacity style={styles.actionButton} onPress={handleContact}>
                <Ionicons name="call-outline" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Contact Owner</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  shareButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  imageContainer: {
    width: "100%",
    height: 300,
    position: "relative",
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  gemImage: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
  badgeContainer: {
    position: "absolute",
    top: 15,
    right: 15,
  },
  badge: {
    backgroundColor: THEME_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  detailsContainer: {
    
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  gemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  gemId: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#222",
  },
  gemType: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  priceTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
  },
  priceText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 15,
  },
  infoSection: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    flexWrap: "nowrap"
  },
  infoLabel: {
    fontSize: 16,
    color: "#555",
    fontWeight: "500",
    marginLeft: 5,
    width: 100,
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    flex: 1,
    
  },
  contactLink: {
    color: THEME_COLOR,
    textDecorationLine: "underline",
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  descriptionSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  actionSection: {
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: THEME_COLOR,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 15,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 15,
    color: "#666666",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  errorText: {
    color: "#666666",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
  retryButton: {
    backgroundColor: THEME_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  }
});

export default GemDetailsScreen;