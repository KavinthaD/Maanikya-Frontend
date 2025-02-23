//Screen Creator : Mehara

import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { baseScreenStyles } from "../styles/baseStyles";

const categories = ["Cutter", "Burner", "Elec. Burner/Cutter", "Owner"];

const people = [
  {
    id: "1",
    name: "Dulith Wanigarathne",
    role: "Cutter",
    rating: 4,
    avatar: require("../assets/seller.png"),
  },
  {
    id: "2",
    name: "Isum Hansaja Perera",
    role: "Burner",
    rating: 3,
    avatar: require("../assets/seller.png"),
  },
  {
    id: "3",
    name: "Kavintha Dinushan",
    role: "Electric Burner/Cutter",
    rating: 5,
    avatar: require("../assets/seller.png"),
  },
  {
    id: "4",
    name: "Sriyanka Sansidu",
    role: "Business Owner - Leo Gems",
    rating: 4,
    avatar: require("../assets/seller.png"),
  },
];

const ConnectScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("Cutter");
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ProfileScreen", { person: item })}
    >
      <View style={styles.card}>
        <Image source={item.avatar} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.role}>{item.role}</Text>
          <View style={styles.rating}>
            {[...Array(5)].map((_, index) => (
              <FontAwesome
                key={index}
                name={index < item.rating ? "star" : "star-o"}
                size={16}
                color="#FFD700"
              />
            ))}
          </View>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
          <FontAwesome
            name={favorites[item.id] ? "heart" : "heart-o"}
            size={26}
            color="#6646ee"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[baseScreenStyles.container,styles.container]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search person" />
        <MaterialIcons name="person" size={28} color="#6646ee" />
      </View>

      <View style={styles.addPersonContainer}>
        <View style={styles.addPersonButtonContainer}>
          <TouchableOpacity style={styles.addPersonButton}>
            <FontAwesome name="plus" size={15} color="#C1E8FF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.addPersonLabel}>Add person</Text>
      </View>

      {/* Category Filter Tabs */}
      <View style={{ height: 50 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabs}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.tab,
                selectedCategory === category && styles.activeTab,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedCategory === category && styles.activeTabText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* People List */}
      <FlatList
        data={people.filter((p) => p.role.includes(selectedCategory))}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ConnectScreen;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 15,
    height: 40,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 5,
  },
  addPersonContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  addPersonButtonContainer: {
    width: 50,
    height: 50,
    borderRadius: 29,
    backgroundColor: "#C1E8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  addPersonButton: {
    width: 27,
    height: 27,
    borderRadius: 25,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  addPersonLabel: {
    fontSize: 14,
    marginTop: 5,
  },
  tabs: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 2,
    elevation: 2,
    height: 30,
  },
  tab: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#6646ee",
  },
  activeTabText: {
    color: "#6646ee",
    fontWeight: "bold",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  role: {
    fontSize: 14,
    color: "#666",
  },
  rating: {
    flexDirection: "row",
    marginTop: 5,
  },
});
