import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL, ENDPOINTS } from "../../config/api";
import HeaderBar from "../../components/HeaderBar";

// Match theme color from Contact screens
const THEME_COLOR = '#9CCDDB';

export default function ContactProfiles({ route, navigation }) {
  const { contactId } = route.params || {};
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchContactDetails();
  }, [contactId]);

  const fetchContactDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token || !contactId) {
        Alert.alert("Error", "Unable to load contact details");
        navigation.goBack();
        return;
      }

      const response = await axios.get(
        `${API_URL}${ENDPOINTS.CONTACT_DETAILS}/${contactId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setContact(response.data);
      
      // Get user data to check if this contact is in favorites
      const userResponse = await axios.get(
        `${API_URL}${ENDPOINTS.GET_FAVORITES}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const favorites = userResponse.data;
      setIsFavorite(favorites.some(fav => fav.id === contactId));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contact details:", error);
      Alert.alert("Error", "Failed to load contact details");
      navigation.goBack();
    }
  };

  const toggleFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) return;

      if (isFavorite) {
        // Remove from favorites
        await axios.delete(`${API_URL}${ENDPOINTS.REMOVE_FAVORITE}/${contactId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Alert.alert("Success", "Contact removed from favorites");
      } else {
        // Add to favorites
        await axios.post(`${API_URL}${ENDPOINTS.ADD_FAVORITE}/${contactId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Alert.alert("Success", "Contact added to favorites");
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite status:", error);
      Alert.alert("Error", "Failed to update favorite status");
    }
  };

  // Format date without external library
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <HeaderBar title="Contact Details" navigation={navigation} showBack={true} />
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" style={baseScreenStylesNew.themeText} />
          <Text style={styles.loadingText}>Loading contact details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Format account created date if available
  const createdAt = formatDate(contact.createdAt);

  return (
    <SafeAreaView style={baseScreenStylesNew.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <HeaderBar title="Contact Details" navigation={navigation} showBack={true} />
      
      <ScrollView style={[styles.container,baseScreenStylesNew.container]} contentContainerStyle={styles.contentContainer}>
        {/* Profile Header Section */}
        <View style={styles.profileHeader}>
          <Image 
            source={contact.avatar ? { uri: contact.avatar } : require("../../assets/default-images/user_with_gem.jpeg")} 
            style={styles.profileImage} 
          />
          
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{contact.name}</Text>
            <Text style={styles.username}>@{contact.username}</Text>
            <View style={[styles.roleBadge, baseScreenStylesNew.themeColor]}>
              <Text style={styles.roleText}>{contact.role}</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.favoriteButton, isFavorite ? styles.favoriteActive : null]} 
            onPress={toggleFavorite}
          >
            <MaterialIcons 
              name={isFavorite ? "star" : "star-outline"} 
              size={24} 
              color={isFavorite ? "#FFFFFF" : "#FFFFFF"}
            />
            <Text style={styles.favoriteText}>
              {isFavorite ? "Favorited" : "Add to favorites"}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Contact Details Cards */}
        <View style={styles.detailsSection}>
          <Text style={[styles.sectionTitle, baseScreenStylesNew.blackText]}>CONTACT INFORMATION</Text>
          
          <View style={[styles.detailCard, baseScreenStylesNew.backgroundColor]}>
            <View style={styles.detailItem}>
              <Ionicons name="call-outline" size={20}  style={[styles.detailIcon, baseScreenStylesNew.themeText]} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Phone</Text>
                <Text style={[styles.detailValue, baseScreenStylesNew.blackText]}>{contact.phone}</Text>
              </View>
            </View>
            
            <View style={styles.detailDivider} />
            
            <View style={styles.detailItem}>
              <Ionicons name="mail-outline" size={20}  style={[styles.detailIcon, baseScreenStylesNew.themeText]} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={[styles.detailValue, baseScreenStylesNew.blackText]}>{contact.email}</Text>
              </View>
            </View>
            
            <View style={styles.detailDivider} />
            
            <View style={styles.detailItem}>
              <Ionicons name="location-outline" size={20} style={[styles.detailIcon, baseScreenStylesNew.themeText]}/>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={[styles.detailValue, baseScreenStylesNew.blackText]}>{contact.address || "Not specified"}</Text>
              </View>
            </View>
            
            <View style={styles.detailDivider} />
            
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={20} style={[styles.detailIcon, baseScreenStylesNew.themeText]} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Member Since</Text>
                <Text style={[styles.detailValue, baseScreenStylesNew.blackText]}>{createdAt}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Actions buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => navigation.navigate('ChatScreen', {
              contactId: contactId,
              contactName: contact.name,
              contactAvatar: contact.avatar,
              contactUsername: contact.username
            })}
          >
            <Ionicons name="chatbubble-outline" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Message</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.navigate('GemstoneMarketplace', { sellerId: contactId })}
          >
            <Ionicons name="diamond-outline" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>View Gems</Text>
          </TouchableOpacity>
        </View>

        {/* You can implement the past work section if you have this data from your API */}
        <Text style={[styles.sectionTitle, baseScreenStylesNew.blackText]}>PAST WORK</Text>
        {contact.pastWork && contact.pastWork.length > 0 ? (
          <FlatList
            data={contact.pastWork}
            numColumns={3}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.pastWorkImage} />
            )}
          />
        ) : (
          <Text style={styles.emptyText}>No past work to display</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#777',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  username: {
    fontSize: 16,
    color: '#777',
    marginBottom: 5,
  },
  roleBadge: {
    borderRadius: 5,
    paddingVertical: 3,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: THEME_COLOR,
  },
  favoriteActive: {
    backgroundColor: '#FFD700',
  },
  favoriteText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#FFFFFF',
  },
  detailsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  detailCard: {
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E1E1E1',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailIcon: {
    marginRight: 10,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#777',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
  },
  primaryButton: {
    backgroundColor: '#4F30C2',
  },
  secondaryButton: {
    backgroundColor: '#3B5998',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  pastWorkImage: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777',
    fontStyle: 'italic',
    marginTop: 10,
  },
});
