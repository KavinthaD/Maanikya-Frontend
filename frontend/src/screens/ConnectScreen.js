import React, { useState, useEffect } from "react"; // Import useEffect
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

// Updated categories to match the image
const categories = ["All", "Burner", "Elec. Burner", "Cutter", "Owner"];

const initialPeople = [
  // Renamed to initialPeople
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
  {
    id: "5",
    name: "Amal Perera", // Added a name starting with 'A' for testing search
    role: "Burner",
    rating: 3,
    avatar: require("../assets/seller.png"),
  },
  {
    id: "6",
    name: "Buddika Silva", // Added a name starting with 'B' for testing search
    role: "Owner",
    rating: 5,
    avatar: require("../assets/seller.png"),
  },
];

const ConnectScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("All"); // Default to 'All'
  const [favorites, setFavorites] = useState({});
  const [people, setPeople] = useState(initialPeople); // State for people, initialized with initialPeople
  const [personRatings, setPersonRatings] = useState(() => {
    // Initialize personRatings state
    const ratings = {};
    initialPeople.forEach((person) => {
      ratings[person.id] = person.rating;
    });
    return ratings;
  });
  const [searchText, setSearchText] = useState(""); // State for search text
  const [filteredPeople, setFilteredPeople] = useState(people); // State for filtered people

  useEffect(() => {
    // Function to filter people based on search text and category
    const filterData = () => {
      let currentPeople = initialPeople; // Start with the initial list

      if (selectedCategory !== "All") {
        currentPeople = currentPeople.filter((p) =>
          p.role.includes(selectedCategory)
        );
      }

      if (searchText) {
        const lowerSearchText = searchText.toLowerCase();
        currentPeople = currentPeople.filter((person) =>
          person.name.toLowerCase().startsWith(lowerSearchText)
        );
      }
      setFilteredPeople(currentPeople);
    };

    filterData(); // Call filterData whenever searchText or selectedCategory changes
  }, [searchText, selectedCategory]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleStarRating = (personId, rating) => {
    setPersonRatings((prevRatings) => ({
      ...prevRatings,
      [personId]: rating,
    }));

    // Optionally update the people array if you want to persist rating in the people data
    setPeople((prevPeople) =>
      prevPeople.map((person) =>
        person.id === personId ? { ...person, rating: rating } : person
      )
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("Profile", { person: item })}
    >
      <View style={styles.card}>
        <Image source={item.avatar} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.role}>{item.role}</Text>
          <View style={styles.rating}>
            {[...Array(5)].map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleStarRating(item.id, index + 1)}
              >
                <FontAwesome
                  name={index < personRatings[item.id] ? "star" : "star-o"} // Use personRatings for star display
                  size={16}
                  color="#334D85"
                />
              </TouchableOpacity>
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
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search person"
          value={searchText}
          onChangeText={(text) => setSearchText(text)} // Update searchText state
        />
        <MaterialIcons name="search" size={24} color="#6646ee" />
        {/* Changed to search icon */}
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
        data={filteredPeople} // Use filteredPeople for data
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#9CCDDB",
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

export default ConnectScreen;