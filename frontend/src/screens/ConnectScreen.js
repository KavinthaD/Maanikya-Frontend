import React, { useState, useEffect } from "react";
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
import GradientContainer from "../components/GradientContainer";
import { baseScreenStyles } from "../styles/baseStyles";
import LinearGradient from "react-native-linear-gradient";
import Header_2 from "../components/Header_2";

// Removed "Owner" from categories
const categories = ["All", "Burner", "Elec. Burner", "Cutter"];

const initialPeople = [
  { id: "1", name: "Dulith Wanigarathne", role: "Cutter", rating: 4, avatar: require("../assets/seller.png") },
  { id: "2", name: "Isum Hansaja Perera", role: "Burner", rating: 3, avatar: require("../assets/seller.png") },
  { id: "3", name: "Kavintha Dinushan", role: "Electric Burner", rating: 5, avatar: require("../assets/seller.png") },
  { id: "4", name: "Sriyanka Sansidu", role: "Business Owner", rating: 4, avatar: require("../assets/seller.png") },
];

const ConnectScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [favorites, setFavorites] = useState({
    "1": true,
    "2": true,
    "3": true,
    "4": true,
  });
  const [personRatings, setPersonRatings] = useState(
    initialPeople.reduce((acc, person) => ({ ...acc, [person.id]: person.rating }), {})
  );
  const [searchText, setSearchText] = useState("");
  const [filteredPeople, setFilteredPeople] = useState(initialPeople);

  useEffect(() => {
    let filteredList = initialPeople;

    if (selectedCategory !== "All") {
      filteredList = filteredList.filter((p) => p.role.includes(selectedCategory));
    }

    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      filteredList = filteredList.filter((p) => p.name.toLowerCase().startsWith(lowerSearchText));
    }

    setFilteredPeople(filteredList);
  }, [searchText, selectedCategory]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("ConnectedUsers", { person: item })}>
      <LinearGradient 
        colors={["#4A6583", "#2D4155"]} 
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 0}} 
        style={styles.card}
      >
        <Image source={item.avatar} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.role}>{item.role}</Text>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
          <FontAwesome name={favorites[item.id] ? "heart" : "heart-o"} size={26} color="#170969" />
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
  

  return (
    <GradientContainer>
      <View style={baseScreenStyles.container}>
        <Header_2 title="Connect" />
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={24} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryTab, 
                selectedCategory === category && styles.activeCategoryTab
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[
                styles.categoryText, 
                selectedCategory === category && styles.activeCategoryText
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Favourites</Text>

        <FlatList 
          data={filteredPeople} 
          keyExtractor={(item) => item.id} 
          renderItem={renderItem} 
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </GradientContainer>
  );
};

const styles = StyleSheet.create({
  searchContainer: { 
    flexDirection: "row", 
    backgroundColor: "#fff", 
    borderRadius: 20, 
    paddingHorizontal: 12, 
    alignItems: "center", 
    marginHorizontal: 15,
    marginTop: 10,
    height: 40, 
    elevation: 2 
  },
  searchIcon: {
    marginRight: 6
  },
  searchInput: { 
    flex: 1, 
    paddingVertical: 5,
    color: "#000"
  },
  categoryContainer: {
    flexDirection: "row",
    marginTop: 15,
    paddingHorizontal: 10,
    marginBottom: 5 
  },
  categoryTab: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#fff",
    height: 32,
    justifyContent: "center",
  },
  activeCategoryTab: {
    backgroundColor: "#0E2A57"
  },
  categoryText: {
    color: "#000",
    fontSize: 14
  },
  activeCategoryText: {
    color: "#fff",
    fontWeight: "500"
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10, // Reduced from 20 to 10
    marginBottom: 10,
    marginLeft: 15
  },
  listContainer: {
    paddingBottom: 20
  },
  card: { 
    flexDirection: "row", 
    marginHorizontal: 15, 
    marginVertical: 5, 
    borderRadius: 12, 
    padding: 12, 
    alignItems: "center", 
  },
  avatar: { 
    width: 44, 
    height: 44, 
    borderRadius: 22 
  },
  textContainer: { 
    flex: 1, 
    marginLeft: 12 
  },
  name: { 
    fontSize: 15, 
    fontWeight: "500",
    color: "#fff"
  },
  role: { 
    fontSize: 13, 
    color: "#B5C7D8",
    marginTop: 2
  }
});

export default ConnectScreen;