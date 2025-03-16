//Screen creator: Isum

import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet,Pressable } from "react-native";
import axios from "axios";
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL, ENDPOINTS } from '../../config/api'; 
import HeaderBar from "../../components/HeaderBar";
import { useNavigation } from '@react-navigation/native';

const CustomerProfile = ({ route }) => {
  //state holds user data
  const [user, setUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const navigation = useNavigation();

  async function getCurrentUser() {
        // Get the token from storage
        const token = await AsyncStorage.getItem("authToken");
        if (!token) {
          throw new Error("Authentication token not found");
        }
    try {
      //retrieve data from from specific api endpoint
      const response = await axios.get(`${API_URL}${ENDPOINTS.GET_USER_PROFILE}`, {
        headers: {
          'Authorization': `Bearer ${token}`,  //adding an authorized token
          'Content-Type': 'application/json'    //making content type json
        }
      });

      const userData = response.data;    //extracting user data
      console.log('User Data:', userData);             //help to debug the code
      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const userData = await getCurrentUser();      //calling getCurrent to retrieve data
      if (userData) {
        setUser(userData);           //updating user state
      }
    };

    fetchProfile();    //to initiate user data fetching process
  }, []);

  if (!user) {
    return <Text>Loading...</Text>;
  }

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const navigateToEditProfile = () => {
    setMenuVisible(false);
    navigation.navigate("CustomerProfileEdit", { user });
  };

  return (
    <SafeAreaView style={[baseScreenStylesNew.container, styles.container]}>
      {/*Handling profile pic and edit button*/}
      <HeaderBar 
        title="Profile" 
        rightComponent={
          <Pressable onPress={toggleMenu}>
            <MaterialIcons name="settings" size={28} color="black" />
          </Pressable>
        }
      />
      {menuVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={navigateToEditProfile}>
            <Text>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={navigateToEditProfile}>
            <Text>Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={navigateToEditProfile}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      <Image source={{ uri: user.image }} style={styles.profilePic} />
      <View  style={styles.nameContainer}>
          <Text style={[styles.nameText, baseScreenStylesNew.blackText]}>{user.firstName} {user.lastName}</Text>
      </View>

{/*displaying information*/}
      <View style={styles.info}>
        <View style={[baseScreenStylesNew.Button7, styles.infoContainer]}>
          <View style={styles.iconLabelContainer}>
            <Ionicons name="mail" size={22} style={baseScreenStylesNew.themeText}/>
            <Text style={[styles.label, baseScreenStylesNew.blackText]}>Email</Text>
          </View>
          <Text style={[styles.infoText, baseScreenStylesNew.blackText]}>{user.email}</Text>
        </View>
        <View style={[baseScreenStylesNew.Button7, styles.infoContainer]}>
          <View style={styles.iconLabelContainer}>
            <Ionicons name="call" size={22} style={baseScreenStylesNew.themeText} />
            <Text style={[styles.label, baseScreenStylesNew.blackText]}>Contact No</Text>
          </View>
          <Text style={[styles.infoText, baseScreenStylesNew.blackText]}>{user.phone}</Text>
        </View>
        <View style={[baseScreenStylesNew.Button7, styles.infoContainer]}>
          <View style={styles.iconLabelContainer}>
            <Ionicons name="location" size={22} style={baseScreenStylesNew.themeText} />
            <Text style={[styles.label, baseScreenStylesNew.blackText]}>Address</Text>
          </View>
          <Text style={[styles.infoText, baseScreenStylesNew.blackText]}>{user.address}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileContainer: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 20,
    marginHorizontal: 80,
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
    marginBottom: 6,
    marginTop: 30,
    marginLeft: 140,
  },

  info: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  nameContainer: {
    paddingHorizontal: 150,
    marginBottom: 10,
  },
  nameText: {
    fontSize: 17,
    fontWeight: "bold"
  },
  infoContainer: {
    paddingVertical: 15,
    paddingHorizontal: 3,
    marginBottom: 8,
    gap: 7
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 16,
    color: '#000',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 46,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 2,  // Add a higher zIndex
  },
  iconLabelContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  menuItem: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'flex-start',
  },
});

export default CustomerProfile;
