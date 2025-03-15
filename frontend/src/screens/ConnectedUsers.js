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
import GradientContainer from "../components/GradientContainer";
import { LinearGradient } from "expo-linear-gradient";
import Header_1 from "../components/Header_1";

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
  isFavorite: false,
};

export default function ConnectedUsers() {
  const [person, setPerson] = useState(personData);

  const handleStarRating = (rating) => {
    setPerson((prevPerson) => ({ ...prevPerson, rating }));
  };

  const toggleFavorite = () => {
    setPerson((prevPerson) => ({ ...prevPerson, isFavorite: !prevPerson.isFavorite }));
  };

  return (
    <GradientContainer>
      <View style={[baseScreenStyles.container, styles.container]}>
        <Header_1 title="Connect" />
        <Text style={styles.header}>Connect</Text>

        <LinearGradient
          colors={["#798693", "#E0E5EA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.profileCardWrapper}
        >
          <View style={styles.profileCard}>
            <Image source={person.image} style={styles.profileImage} />
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{person.name}</Text>
              <Text style={styles.role}>{person.role}</Text>
              <View style={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <TouchableOpacity key={i} onPress={() => handleStarRating(i + 1)}>
                    <Ionicons
                      name={i < person.rating ? "star" : "star-outline"}
                      size={16}
                      color={"#170969"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity onPress={toggleFavorite}>
              <Ionicons
                name={person.isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={person.isFavorite ? "#4F30C2" : "#3B5998"}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <LinearGradient
          colors={["#798693", "#E0E5EA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.detailsContainerWrapper}
        >
          <View style={styles.detailsContainer}>
            <Text style={styles.detail}><Text style={styles.bold}>TITLE :</Text> {person.title}</Text>
            <Text style={styles.detail}><Text style={styles.bold}>CONTACT NO :</Text> {person.contact}</Text>
            <Text style={styles.detail}><Text style={styles.bold}>E-MAIL :</Text> {person.email}</Text>
            <Text style={styles.detail}><Text style={styles.bold}>LOCATION :</Text> {person.location}</Text>
          </View>
        </LinearGradient>

        <Text style={styles.sectionTitle}>PAST WORK</Text>
        <FlatList
          data={person.pastWork}
          numColumns={3}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => <Image source={item} style={styles.pastWorkImage} />}
        />
      </View>
    </GradientContainer>
  );
}

const styles = StyleSheet.create({
  container: {
     padding: 16 
    },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  profileCardWrapper: { borderRadius: 8, marginBottom: 10, overflow: "hidden" },
  profileCard: { flexDirection: "row", padding: 10, alignItems: "center" },
  profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  profileInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold", color: "black" },
  role: { fontSize: 14, color: "black" },
  rating: { flexDirection: "row", marginTop: 5 },
  icon: { marginLeft: 10 },
  detailsContainerWrapper: { borderRadius: 8, marginBottom: 10, overflow: "hidden" },
  detailsContainer: { padding: 10 },
  detail: { fontSize: 14, marginBottom: 5 },
  bold: { fontWeight: "bold" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  pastWorkImage: { width: 100, height: 100, margin: 5, borderRadius: 8 },
});
