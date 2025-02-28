//Screen Creator Tilmi
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { baseScreenStyles } from "../styles/baseStyles";
import Header_2 from "../components/Header_2";

const GemstoneMarketplace = () => {
  const [sortAscending, setSortAscending] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const gemstones = [
    {
      id: "BS001",
      image: require("../assets/gems/BS001.png"),
      color: "#0033CC",
    },
    {
      id: "EM001",
      image: require("../assets/gems/EM001.png"),
      color: "#50C878",
    },
    {
      id: "RR001",
      image: require("../assets/gems/RR001.png"),
      color: "#E0115F",
    },
    {
      id: "YS001",
      image: require("../assets/gems/YS001.png"),
      color: "#FFD700",
    },
    {
      id: "BS002",
      image: require("../assets/gems/BS002.png"),
      color: "#0033CC",
    },
    {
      id: "PS001",
      image: require("../assets/gems/PS001.png"),
      color: "#800080",
    },
    {
      id: "PT001",
      image: require("../assets/gems/PT001.png"),
      color: "#FFC0CB",
    },
    {
      id: "EM002",
      image: require("../assets/gems/EM002.png"),
      color: "#50C878",
    },
    {
      id: "YS002",
      image: require("../assets/gems/YS002.png"),
      color: "#FFD700",
    },
  ];

  const handleSearch = (text) => {
    setSearchQuery(text);
  };

  const handleSort = () => {
    setSortAscending(!sortAscending);
  };

  // Filter and sort gemstones
  const filteredAndSortedGemstones = gemstones
    .filter((gem) => gem.id.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortAscending) {
        return a.id.localeCompare(b.id);
      } else {
        return b.id.localeCompare(a.id);
      }
    });

  return (
    <ScrollView style={baseScreenStyles.container}>
      <Header_2 title="Market" />
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <TouchableOpacity style={styles.sortButton} onPress={handleSort}>
            <Text style={styles.sortButtonText}>
              Sort {sortAscending ? "↓" : "↑"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Popular</Text>

        <View style={styles.gemstoneGrid}>
          {filteredAndSortedGemstones.map((gem) => (
            <TouchableOpacity key={gem.id} style={styles.gemstoneItem}>
              <Image
                source={gem.image}
                style={styles.gemImage}
                resizeMode="cover"
              />
              <Text style={styles.gemId}>{gem.id}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9CCDDB",
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 16,
  },
  sortButton: {
    backgroundColor: "white",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  sortButtonText: {
    color: "#333",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  gemstoneGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gemstoneItem: {
    width: "31%",
    marginBottom: 16,
    alignItems: "center",
  },
  gemImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 4,
  },
  gemId: {
    textAlign: "center",
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
});

export default GemstoneMarketplace;
