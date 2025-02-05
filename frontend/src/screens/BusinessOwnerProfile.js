import React from "react";
import { SafeAreaView,View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Home, ShoppingBag, PlusCircle, Bell, User } from "lucide-react-native";

const BusinessOwnerProfile = () => {
  const user = {
    image: "https://static.wikia.nocookie.net/garfield/images/6/60/Garfield_New_Look.jpg/revision/latest/scale-to-width/360?cb=20240328075614", 
    name: "abc",
    email: "rathnasiri.n@hotmail.com",
    phone: "+94 987 654 321",
    title: "Owner of Navarathna Gems",
    address: "602, Kalawana Rd, Nivitigala, Rathnapura, Sri Lanka",
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={styles.topic}>
        <Text style={styles.topicName}>Profile</Text>
      </View>

      <View style={styles.profileContainer}>
        <Image source={{ uri: user.image }} style={styles.profilePic} />
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.label}>NAME</Text>
        <Text style={styles.info}>{user.name}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>EMAIL</Text>
        <Text style={styles.info}>{user.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Contact No</Text>
        <Text style={styles.info}>{user.phone}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>TITLE</Text>
        <Text style={styles.info}>{user.title}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.info}>{user.address}</Text>
      </View>

      
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A7D7E7",
  },
  topic: {
    backgroundColor: "#003366",
    padding: 16,
    alignItems: "center",
  },
  topicName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#C5F0EE",
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 20,
  },
  editBtnText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
  },
  infoContainer: {
    padding: 16,
    backgroundColor: "white"
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#003366",
    marginTop: 25,
    borderColor: "black",
    
  },
  info: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  
});

export default BusinessOwnerProfile;
