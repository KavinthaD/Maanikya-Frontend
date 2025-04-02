//Screen creator: Mehara

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import { baseScreenStyles } from "../../styles/baseStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL, ENDPOINTS } from "../../config/api";
import HeaderBar from "../../components/HeaderBar";
import { debounce } from 'lodash'; // Add lodash as a dependency if not already installed

const AddContact = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);
  
  // Search for users - now with debounce
  const searchUsers = async (query) => {
    if (!query || !query.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      // Search users by username, firstName, or lastName
      const response = await axios.get(
        `${API_URL}${ENDPOINTS.SEARCH_USERS}?query=${encodeURIComponent(query)}`, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Set search results directly from API response
      setSearchResults(response.data);
      setLoading(false);
      
    } catch (err) {
      console.error("Error searching users:", err);
      setError("Failed to search users");
      setLoading(false);
    }
  };

  // Create debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query) => {
      searchUsers(query);
    }, 500), // 500ms delay
    []
  );
  
  // Handle search text changes
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    
    if (text.trim().length >= 2) {
      // Only search if at least 2 characters are entered
      debouncedSearch(text);
    } else if (!text.trim()) {
      // Clear results if search is empty
      setSearchResults([]);
    }
  };

  // Add a contact
  const addContact = async (userId) => {
    try {
      setLoading(true);
      
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      // Add the user to contacts
      await axios.post(
        `${API_URL}${ENDPOINTS.ADD_CONTACT}`,
        { contactId: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setLoading(false);
      Alert.alert("Success", "Contact added successfully");
      navigation.goBack();
      
    } catch (err) {
      console.error("Error adding contact:", err);
      // Show a more specific error message if available
      const errorMessage = err.response?.data?.message || "Failed to add contact";
      Alert.alert("Error", errorMessage);
      setLoading(false);
    }
  };

  // Clean up debounced search when component unmounts
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Render each search result
  const renderSearchResult = ({ item }) => {
    const defaultAvatar = require("../../assets/default-images/user_with_gem.jpeg");
    const avatarSource = item.avatar ? { uri: item.avatar } : defaultAvatar;
    
    return (
      <TouchableOpacity 
        style={styles.resultItem}
        onPress={() => addContact(item.id)}
      >
        <Image source={avatarSource} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.name}</Text>
          <Text style={styles.userUsername}>@{item.username}</Text>
          <Text style={styles.userRole}>{item.role}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.addBtn, { backgroundColor: baseScreenStyles.colors.primary }]}
          onPress={() => addContact(item.id)}
        >
          <MaterialIcons name="person-add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={baseScreenStylesNew.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <HeaderBar 
        title="Add Contact" 
        navigation={navigation} 
        showBack={true} 
      />
      
      <View style={baseScreenStylesNew.container}>
        {/* Search Bar - Using consistent styling */}
        <View style={styles.searchContainer}>
          <View style={baseScreenStylesNew.search}>
            <Ionicons 
              name="search" 
              size={20} 
              color={baseScreenStyles.colors.input.placeholder} 
              style={baseScreenStylesNew.searchIcon} 
            />
            <TextInput
              style={baseScreenStylesNew.searchInput}
              placeholder="Search by name or username"
              placeholderTextColor={baseScreenStyles.colors.input.placeholder}
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoFocus={true}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearchChange("")}>
                <MaterialIcons 
                  name="clear" 
                  size={20} 
                  color={baseScreenStyles.colors.input.placeholder} 
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {/* Instructions - show only when no search is active */}
        {!searchQuery.trim() && !loading && (
          <View style={styles.instructionsContainer}>
            <MaterialIcons 
              name="info-outline" 
              size={24} 
              color={baseScreenStyles.colors.text.medium} 
            />
            <Text style={styles.instructionsText}>
              Search for other users by their name or username to add them as contacts
            </Text>
          </View>
        )}
        
        {/* Loading Indicator */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={baseScreenStyles.colors.accent} />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        )}
        
        {/* Error Message */}
        {error && !loading && (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={24} color={baseScreenStyles.colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {/* Search Results */}
        {!loading && searchResults.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: baseScreenStyles.colors.text.dark }]}>
              Search Results
            </Text>
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={renderSearchResult}
              contentContainerStyle={styles.resultsList}
            />
          </>
        )}
        
        {/* No Results - only show when search has been performed */}
        {!loading && searchQuery.trim().length >= 2 && searchResults.length === 0 && !error && (
          <View style={styles.noResultsContainer}>
            <MaterialIcons 
              name="search-off" 
              size={48} 
              color={baseScreenStyles.colors.input.border} 
            />
            <Text style={styles.noResultsText}>
              No users found matching "{searchQuery}"
            </Text>
            <Text style={styles.noResultsSubText}>
              Try using a different name or username
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: baseScreenStyles.colors.background,
  },
  instructionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: baseScreenStyles.colors.input.background,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: baseScreenStyles.colors.input.border,
  },
  instructionsText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: baseScreenStyles.colors.text.medium,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: baseScreenStyles.colors.text.medium,
  },
  errorContainer: {
    backgroundColor: "#FFF2F2",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  errorText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: baseScreenStyles.colors.error,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: baseScreenStyles.colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: baseScreenStyles.colors.input.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: baseScreenStyles.colors.text.dark,
  },
  userUsername: {
    fontSize: 14,
    color: baseScreenStyles.colors.text.medium,
    marginTop: 2,
  },
  userRole: {
    fontSize: 13,
    color: baseScreenStyles.colors.text.light,
    fontStyle: "italic",
    marginTop: 2,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  noResultsText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
    color: baseScreenStyles.colors.text.dark,
    textAlign: "center",
  },
  noResultsSubText: {
    marginTop: 8,
    fontSize: 14,
    color: baseScreenStyles.colors.text.light,
    textAlign: "center",
  },
});

export default AddContact;