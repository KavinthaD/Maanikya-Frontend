import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { baseScreenStyles } from "../styles/baseStyles";
import Header_2 from "../components/Header_2";

const personData = {
  name: "Dulith Wanigarathne",
  role: "Cutter",
  rating: 3,
  image: require("../assets/seller.png"),
  title: "Wanigarathna Cutters & Co.",
  contact: "+94 765 468 795",
  email: "dulith.wanige@manikhora.com",
  location: "Nivitigala, Rathnapura",
  pastWork: [
    require("../assets/Gem1.png"),
    require("../assets/Gem2.png"),
    require("../assets/Gem3.png"),
    require("../assets/Gem4.png"),
    require("../assets/Gem5.png"),
    require("../assets/Gem6.png"),
  ],
  isFavorite: false, // Added isFavorite property
};

export default function ProfileScreen() {
  const [person, setPerson] = useState(personData);

  const handleStarRating = (rating) => {
    setPerson({ ...person, rating: rating });
  };

  const toggleFavorite = () => {
    setPerson({ ...person, isFavorite: !person.isFavorite }); // Toggle favorite status
  };

  return (
    <View style={[baseScreenStyles.container, styles.container]}>
      <Text style={styles.header}>Connect</Text>

      <View style={styles.profileCard}>
        <Image source={person.image} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{person.name}</Text>
          <Text style={styles.role}>{person.role}</Text>
          <View style={styles.rating}>
            {[...Array(5)].map((_, i) => (
              <TouchableOpacity key={i} onPress={() => handleStarRating(i + 1)}>
                {" "}
                {/* Touchable stars */}
                <Ionicons
                  key={i}
                  name={i < person.rating ? "star" : "star-outline"}
                  size={16}
                  color={"#3B5998"} // Set star color to blue
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity onPress={toggleFavorite}>
          {" "}
          {/* Touchable Heart */}
          <Ionicons
            name={person.isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={"#3B5998"} // Set heart color to blue
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>
          <Text style={styles.bold}>TITLE :</Text> {person.title}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.bold}>CONTACT NO :</Text> {person.contact}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.bold}>E-MAIL :</Text> {person.email}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.bold}>LOCATION :</Text> {person.location}
        </Text>
      </View>
      <Text style={styles.sectionTitle}>PAST WORK</Text>
      <FlatList
        data={person.pastWork}
        numColumns={3}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={item} style={styles.pastWorkImage} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    // Removed input style as TextInput is removed
  },
  profileCard: {
    flexDirection: "row",
    backgroundColor: "#CDE3F9",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  profileInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold" },
  role: { fontSize: 14, color: "black" },
  rating: { flexDirection: "row", marginTop: 5 },
  icon: { marginLeft: 10, color: "#3B5998" }, // Set default heart color to blue
  detailsContainer: {
    backgroundColor: "#CDE3F9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  detail: { fontSize: 14, marginBottom: 5 },
  bold: { fontWeight: "bold" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  pastWorkImage: { width: 100, height: 100, margin: 5, borderRadius: 8 },
});
