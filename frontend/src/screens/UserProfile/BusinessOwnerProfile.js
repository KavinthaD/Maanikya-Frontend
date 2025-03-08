//Screen creator: Isum

import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { baseScreenStyles } from "../../styles/baseStyles";
//import AsyncStorage from '@react-native-async-storage/async-storage";

const BusinessOwnerProfile = ({ navigation, route }) => {
  const [user, setUser] = useState(null);

  async function getCurrentUser() {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2M0NWRmMWZlYWFhMzc5YmQzYTMxOGQiLCJ1c2VybmFtZSI6ImpvaG5kb2UiLCJsb2dpblJvbGUiOiJHZW0gYnVzaW5lc3Mgb3duZXIiLCJ0eXBlIjoiYnVzaW5lc3MiLCJpYXQiOjE3NDE0NDA0MDMsImV4cCI6MTc0MTUyNjgwM30.R__Woqu8KAMQHP8PHgroFfWCcMvw17ahlq-90BPkG1g"; // Hardcoded token for testing
    // const token = await AsyncStorage.getItem('authToken'); // Assuming the token is stored in AsyncStorage

    try {
      const response = await axios.get('http://10.0.2.2:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const userData = response.data;
      console.log('User Data:', userData);
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const userData = await getCurrentUser();
      if (userData) {
        setUser(userData);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return <Text>Loading...</Text>;
  }


  return (
    <SafeAreaView style={[baseScreenStyles.container, styles.container]}>
      {/*Handling profile pic and edit button*/}
      <View style={styles.profileContainer}>
        <Image source={{ uri: user.image }} style={styles.profilePic} />
        <TouchableOpacity style={styles.editProfileButton} onPress={() => navigation.navigate("BusinessOwnerEditProfile", { user })}>
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/*displaying information*/}
      <View style={styles.info}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>NAME</Text>
          <Text style={styles.infoText}>{user.firstName} {user.lastName}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>EMAIL</Text>
          <Text style={styles.infoText}>{user.email}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Contact No</Text>
          <Text style={styles.infoText}>{user.phone}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>TITLE</Text>
          <Text style={styles.infoText}>{user.role}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Address</Text>
          <Text style={styles.infoText}>{user.address}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A7D7E7",
  },
  profileContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  editProfileButton: {
    backgroundColor: "#29abe2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  editProfileButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  info: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  infoContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
});

export default BusinessOwnerProfile;
