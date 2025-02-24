//Screen creator: Isum

import React, { useState } from "react";
import {View, Text, TextInput,Image,TouchableOpacity,StyleSheet, Button} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import BusinessOwnerProfile from "./BusinessOwnerProfile";
import { baseScreenStyles } from "../styles/baseStyles";

const BusinessOwnerEditProfile = ({ navigation }) => {
  // Profile state
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [name, setName] = useState("M.D Rathnasiri Navasinghe");
  const [email, setEmail] = useState("rathnasiri.n@hotmail.com");
  const [contact, setContact] = useState("+94 987 654 321");
  const [title, setTitle] = useState("Owner of Navarathna Gems");
  const [address, setAddress] = useState(
    "602, Kalawana Rd, Nivitigala, Rathnapura, Sri Lanka"
  );

  return (
    <SafeAreaView style={styles.container}>
      

      <View style={styles.profileContainer}>
        <Image
          source={
            profilePhoto ? { uri: profilePhoto } : require("../assets/logo.png")
          }
          style={styles.profilePhoto}
        />
        <TouchableOpacity style={style.editPhotoBtn} >
          <Ionicons name="pencil" size={20} color ="#0a3a5d" />
        </TouchableOpacity>
        
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>NAME</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor="#777" />

        <Text style={styles.label}>EMAIL</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" placeholderTextColor="#777"/>

        <Text style={styles.label}>Contact No</Text>
        <TextInput style={styles.input} value={contact} onChangeText={setContact} keyboardType="phone-pad" placeholderTextColor="#777"/>

        <Text style={styles.label}>TITLE</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={address}
          onChangeText={setAddress}
          multiline
          placeholderTextColor="#777"
        />
      </View>


      <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9CCDDB",
  },
  
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  editPhotoBtn: {
    position: "absolute",
    bottom: 10,
    right: 120,
    backgroundColor: "#dbe9fa",
    borderRadius: 15,
    padding: 5,
  },
  icon:{
    borderRadius: 15,
    padding: 5,
  },
  inputContainer: {
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 15,
    marginBottom: 3,
  },
  input: {
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 5,
    fontSize: 16,
    color: "#333", 
    borderColor: "#ccc",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  saveBtn: {
    backgroundColor: "#0a3a5d",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom:20
  },
  saveBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BusinessOwnerEditProfile;
