//Screen creator: Isum

import React from "react";
import { SafeAreaView,View, Text, Image, TouchableOpacity, StyleSheet, Button } from "react-native";

import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; 
import { baseScreenStyles } from "../styles/baseStyles";

const BusinessOwnerProfile = ({ navigation }) => {
  const user = {
    image: "https://static.wikia.nocookie.net/garfield/images/6/60/Garfield_New_Look.jpg/revision/latest/scale-to-width/360?cb=20240328075614", 
    name: "abc",
    email: "rathnasiri.n@hotmail.com",
    phone: "+94 987 654 321",
    title: "Owner of Navarathna Gems",
    address: "602, Kalawana Rd, Nivitigala, Rathnapura, Sri Lanka",
  };

  return (
    <SafeAreaView style={baseScreenStyles.container}>
      
      

      <View style={styles.profileContainer}>
        <Image source={{ uri: user.image }} style={styles.profilePic} />
        <TouchableOpacity style={styles.editProfileButton} onPress={() => navigation.navigate("BusinessOwnerEditProfile")}>
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        
        
      </View>
      <View style={style.info}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>NAME</Text>
          <Text style={styles.infoText}>{user.name}</Text>
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
          <Text style={styles.infoText}>{user.title}</Text>
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
    backgroundColor: '#ffffff', // White Section
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
  editBtn: {
    backgroundColor: "#29abe2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  editBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  info:{
    marginTop: 20,
    marginHorizontal: 16,
  },
  infoContainer: {
    backgroundColor: '#ffffff', // White Background
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
    ffontSize: 16,
    color: '#333',
  },
  
});

export default BusinessOwnerProfile;
