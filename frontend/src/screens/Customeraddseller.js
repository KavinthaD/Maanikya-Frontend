//Screen Creator : Mehara

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { baseScreenStyles } from "../styles/baseStyles";

const sellers = [
  {
    name: "Sunil Gamalath",
    business: "Gamage Gems",
    rating: 3,
    image: require("../assets/seller.png"),
  },
  {
    name: "Subash Hettiarachchi",
    business: "Pixe; Gems",
    rating: 2,
    image: require("../assets/seller.png"),
  },
  {
    name: "Rashantha Gamage",
    business: "Zodiac Gems",
    rating: 3,
    image: require("../assets/seller.png"),
  },
  {
    name: "Wimalasiri Siriwardana",
    business: "Janatha Gems",
    rating: 4,
    image: require("../assets/seller.png"),
  },
];

export default function MySellersScreen() {
  const [search, setSearch] = useState("");

  return (
    <View style={[baseScreenStyles.container,styles.container]}>
      <Text style={styles.header}>My sellers</Text>
      <TextInput
        placeholder="Search person"
        value={search}
        onChangeText={setSearch}
        style={styles.input}
      />
      <TouchableOpacity style={styles.filterButton}>
        <Text>Filter</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <FlatList
        data={sellers.filter((seller) =>
          seller.name.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.business}>{item.business}</Text>
              <View style={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <Ionicons
                    key={i}
                    name={i < item.rating ? "star" : "star-outline"}
                    size={16}
                    color={i < item.rating ? "#FFD700" : "#CCCCCC"}
                  />
                ))}
              </View>
            </View>
            <TouchableOpacity style={styles.viewButton}>
              <Text style={styles.viewButtonText}>View gems</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  filterButton: {
    padding: 10,
    backgroundColor: "#BBDEFB",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  addButton: {
    alignSelf: "center",
    backgroundColor: "#90CAF9",
    padding: 10,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  addButtonText: { fontSize: 20, fontWeight: "bold", color: "white" },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  image: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  cardContent: { flex: 1 },
  name: { fontSize: 14, fontWeight: "bold" },
  business: { fontSize: 12, color: "gray" },
  rating: { flexDirection: "row", marginTop: 5 },
  viewButton: { padding: 8, borderRadius: 20, backgroundColor: "#ECEFF1" },
  viewButtonText: { color: "black", fontSize: 12, fontWeight: "bold" },
});
