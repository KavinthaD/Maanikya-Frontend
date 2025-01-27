import React from "react";
import { SafeAreaView, Text, StyleSheet, Image, View } from "react-native";

const BusinessOwnerProfile = ({ route }) => {
  //Provide default values, if details or route.params is not defined and access the defaullt object
  const details = route?.params?.details || {
    name: "N/A",
    email: "N/A",
    contact: "N/A",
    address: "N/A",
    title: "N/A",
  };

  return (
    <SafeAreaView style={styles.container}>
      {/*Heading*/ }  
      <Text style={styles.heading}>Profile</Text>

      {/* Profile Image */}
      <View style={styles.card}>
        <Image
          source={{
            uri: "https://static.wikia.nocookie.net/garfield/images/9/9f/GarfieldCharacter.jpg/revision/latest?cb=20180421131132",
          }}
          style={styles.profileImage}
        />
      </View>

      {/* Profile Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Name</Text>
        <Text style={styles.cardContent}>{details.name}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Email</Text>
        <Text style={styles.cardContent}>{details.email}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contact</Text>
        <Text style={styles.cardContent}>{details.contact}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Address</Text>
        <Text style={styles.cardContent}>{details.address}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Title</Text>
        <Text style={styles.cardContent}>{details.title}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#9CCDDB",
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3, // For Android shadow
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    marginBottom: 5,
  },
  cardContent: {
    fontSize: 16,
    color: "#333",
  },
});

export default BusinessOwnerProfile;
