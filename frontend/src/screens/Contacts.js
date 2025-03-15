import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  RefreshControl
} from "react-native";
import { FontAwesome, MaterialIcons, AntDesign, Ionicons } from "@expo/vector-icons";
import { baseScreenStylesNew } from "../styles/baseStylesNew";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL, ENDPOINTS } from "../config/api";
import { useFocusEffect } from '@react-navigation/native';
import HeaderBar from "../components/HeaderBar"; 

// Sort categories
const categories = ["All", "Favorites", "Burner", "Elec. Burner", "Cutter", "Owner"];

// Temporary mock data (will be replaced with API data)
const mockContacts = [
  { id: "1", username: "dulith", name: "Dulith Wanigarathne", role: "Cutter", rating: 4, avatar: null },
  { id: "2", username: "isum", name: "Isum Hansaja Perera", role: "Burner", rating: 3, avatar: null },
  { id: "3", username: "kavintha", name: "Kavintha Dinushan", role: "Elec. Burner", rating: 5, avatar: null },
  { id: "4", username: "sriyanka", name: "Sriyanka Sansidu", role: "Owner", rating: 4, avatar: null },
];

const { width } = Dimensions.get('window');
const THEME_COLOR = '#9CCDDB'; // Match the Market.js theme color

const Contacts = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [contacts, setContacts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Fetch contacts from API
  const fetchContacts = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      // Make the API request
      const response = await axios.get(`${API_URL}${ENDPOINTS.GET_CONTACTS}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Set contacts directly from API response, even if it's an empty array
      setContacts(response.data);
      setError(null);
      
      setLoading(false);
      setRefreshing(false);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError("Failed to load contacts");
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Toggle favorite status for a contact
  const toggleFavorite = async (contactId, currentFavoriteStatus) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      if (currentFavoriteStatus) {
        // Remove from favorites
        await axios.delete(`${API_URL}${ENDPOINTS.REMOVE_FAVORITE}/${contactId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        // Add to favorites
        await axios.post(`${API_URL}${ENDPOINTS.ADD_FAVORITE}/${contactId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      // Update the contacts list with new favorite status
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === contactId 
            ? { ...contact, isFavorite: !currentFavoriteStatus } 
            : contact
        )
      );
      
    } catch (err) {
      console.error(`Error ${currentFavoriteStatus ? 'removing from' : 'adding to'} favorites:`, err);
      Alert.alert(
        "Error", 
        `Failed to ${currentFavoriteStatus ? 'remove from' : 'add to'} favorites`
      );
    }
  };

  // Filter contacts based on search text and selected category
  useEffect(() => {
    let filtered = [...contacts];
    
    // Apply category filter
    if (selectedCategory === "Favorites") {
      filtered = filtered.filter(contact => contact.isFavorite);
    } else if (selectedCategory !== "All") {
      filtered = filtered.filter(contact => 
        contact.role.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }
    
    // Apply search filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(contact => 
        contact.name.toLowerCase().includes(searchLower) || 
        contact.username.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredContacts(filtered);
  }, [contacts, selectedCategory, searchText]);

  // Load contacts on screen focus (like Market.js)
  useFocusEffect(
    React.useCallback(() => {
      fetchContacts();
    }, [])
  );

  // Remove contact from favorites
  const removeContact = async (contactId) => {
    Alert.alert(
      "Remove Contact",
      "Are you sure you want to remove this contact?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("authToken");
              if (!token) {
                throw new Error("Authentication token not found");
              }
              
              // When the API is implemented, uncomment this code
              /*
              await axios.delete(`${API_URL}${ENDPOINTS.REMOVE_CONTACT}/${contactId}`, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              });
              */
              
              // For now, just filter out the contact locally
              setContacts(prev => prev.filter(contact => contact.id !== contactId));
              Alert.alert("Success", "Contact removed successfully");
            } catch (err) {
              console.error("Error removing contact:", err);
              Alert.alert("Error", "Failed to remove contact");
            }
          }
        }
      ]
    );
  };

  // Render each contact card
  const renderContactItem = ({ item }) => {
    const defaultAvatar = require("../assets/default-images/user_with_gem.jpeg");
    const avatarSource = item.avatar ? { uri: item.avatar } : defaultAvatar;
    
    return (
      <TouchableOpacity 
        style={styles.contactCard}
        onPress={() => navigation.navigate("ConnectedUsers", { contactId: item.id })}
      >
        <Image source={avatarSource} style={styles.avatar} />
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactRole}>{item.role}</Text>
        </View>
        
        <View style={styles.contactActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => toggleFavorite(item.id, item.isFavorite)}
          >
            {item.isFavorite ? (
              <MaterialIcons name="star" size={22} color="#FFD700" />
            ) : (
              <MaterialIcons name="star-outline" size={22} color="#999" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate("ChatScreen", {
              contactId: item.id,
              contactName: item.name,
              contactAvatar: item.avatar,
              contactUsername: item.username
            })}
          >
            <MaterialIcons name="message" size={22} color={THEME_COLOR} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => removeContact(item.id)}
          >
            <MaterialIcons name="person-remove" size={22} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Replace the header with the new HeaderBar */}
      <HeaderBar 
        title="Contacts" 
        navigation={navigation} 
        showBack={true} 
      />
      
      <View style={styles.container}>
        {/* Search Bar - Styled like Market.js */}
        <View style={styles.searchContainer}>
          <View style={baseScreenStylesNew.search}>
            <Ionicons name="search" size={20} color="#666" style={baseScreenStylesNew.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <MaterialIcons name="clear" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Category Filter */}
        <ScrollView 
  horizontal 
  showsHorizontalScrollIndicator={false}
  style={styles.categoriesContainer}
  contentContainerStyle={styles.categoryList}
>
  {categories.map((category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryTab,
        selectedCategory === category && styles.activeCategory,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === category && styles.activeCategoryText,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>
        
        {/* Contacts List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={THEME_COLOR} />
            <Text style={styles.loadingText}>Loading contacts...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={64} color="#FF6B6B" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => fetchContacts()}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Your Contacts</Text>
            
            {filteredContacts.length === 0 ? (
              <View style={styles.emptyContainer}>
                <MaterialIcons name="person-search" size={64} color="#ccc" />
                <Text style={styles.emptyText}>
                  {searchText || selectedCategory !== "All" 
                    ? "No contacts match your search" 
                    : "You haven't added any contacts yet"}
                </Text>
                <TouchableOpacity 
                  style={styles.addFirstContactBtn}
                  onPress={() => navigation.navigate("AddContact")}
                >
                  <Text style={styles.addFirstContactBtnText}>Add Your First Contact</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={filteredContacts}
                keyExtractor={(item) => item.id}
                renderItem={renderContactItem}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                  <RefreshControl 
                    refreshing={refreshing} 
                    onRefresh={() => fetchContacts(true)}
                    colors={[THEME_COLOR]} 
                    tintColor={THEME_COLOR}
                  />
                }
              />
            )}
          </>
        )}
      </View>
      
      {/* Add Contact Button (fixed at bottom right) - Updated to square with text */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate("AddContact")}
      >
        <AntDesign name="plus" size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>Add Contact</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  searchContainer: {
    padding: 15,
    paddingBottom: 5,
  },
  searchInput: {
    flex: 1,
    height: 46,
    color: '#333333',
    fontSize: 16,
  },
  categoriesContainer: {
    marginVertical: 8,
    maxHeight: 50, // Add a max height to contain the ScrollView
  },
  categoryList: {
    paddingHorizontal: 15,
    paddingVertical: 4,
    alignItems: 'center', // This centers items vertically
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    height: 36, // Fixed height for consistent appearance
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  activeCategory: {
    backgroundColor: THEME_COLOR,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeCategoryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginHorizontal: 15,
    marginTop: 5,
    marginBottom: 15,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 80, // Space for FAB
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 40,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  contactRole: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  contactActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: THEME_COLOR,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    color: '#333333',
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: THEME_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginBottom: 150,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  addFirstContactBtn: {
    backgroundColor: THEME_COLOR,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addFirstContactBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // Update for the favorite star icon
  favoriteIcon: {
    marginLeft: 5, 
  },
  activeFavorite: {
    color: '#FFD700', // Gold color for favorite stars
  },
  inactiveFavorite: {
    color: '#999',
  },
  
  // Style for the Favorites tab in the category list
  favoriteTab: {
    backgroundColor: '#FFF9E3', // Light yellow background for favorites tab
  },
  activeFavoriteTab: {
    backgroundColor: '#FFD700',
  },
  favoriteTabText: {
    color: '#8B7500',
  },
});

export default Contacts;