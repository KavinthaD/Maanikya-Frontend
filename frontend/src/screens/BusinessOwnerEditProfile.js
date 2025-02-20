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
/*
  const selectProfilePhoto = () => {
    launchImageLibrary({ mediaType: "photo", quality: 1 }, (response) => {
      if (!response.didCancel && !response.errorCode) {
        setProfilePhoto(response.assets[0].uri);
      }
    });
  };*/

  return (
    <SafeAreaView style={baseScreenStyles.container}>
      {/* Header */}
      <View style={styles.topic}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.topicName}>Edit Profile</Text>
      </View>

      <View style={styles.profileContainer}>
        <Image
          source={
            profilePhoto ? { uri: profilePhoto } : require("../assets/logo.png")
          }
          style={styles.profilePhoto}
        />
         <Button title="Edit Profile" onPress={() => navigation.navigate("BusinessOwnerProfilePhoto")} />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>NAME</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>EMAIL</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Text style={styles.label}>Contact No</Text>
        <TextInput style={styles.input} value={contact} onChangeText={setContact} keyboardType="phone-pad" />

        <Text style={styles.label}>TITLE</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Address</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={address}
          onChangeText={setAddress}
          multiline
        />
      </View>


      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  
  topic: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#0a3a5d",
  },
  topicName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    alignItems:"center",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
    position: "relative",
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editPhotoButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#0a3a5d",
    borderRadius: 20,
    padding: 5,
  },
  inputContainer: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  input: {
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    fontSize: 16,
  },
  textArea: {
    height: 60,
  },
  saveBtn: {
    backgroundColor: "#0a3a5d",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
  },
  saveBtnText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BusinessOwnerEditProfile;
