import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TextInput, SafeAreaView } from "react-native";

const Tracker = () => {
  const [search, setSearch] = useState("");

  const imageProgress = [
    {
      id: "1",
      uri: "https://via.placeholder.com/100.png?text=Gem1",
      description: "Beautiful Pink Gem",
    },
    {
      id: "2",
      uri: "https://via.placeholder.com/100.png?text=Gem2",
      description: "Sparkling Blue Gem",
    },
    {
      id: "3",
      uri: "https://via.placeholder.com/100.png?text=Gem3",
      description: "Radiant Green Gem",
    },
  ];

  const imageCompleted = [
    {
      id: "4",
      uri: "https://via.placeholder.com/100.png?text=Gem4",
      description: "Shiny Red Gem",
    },
    {
      id: "5",
      uri: "https://via.placeholder.com/100.png?text=Gem5",
      description: "Elegant Yellow Gem",
    },
    {
      id: "6",
      uri: "https://via.placeholder.com/100.png?text=Gem6",
      description: "Majestic Purple Gem",
    },
  ];

  const renderImageRow = (images) => (
    <FlatList
      data={images}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.uri }} style={styles.image} />
          <Text style={styles.description}>{item.description}</Text>
        </View>
      )}
      numColumns={3}
      columnWrapperStyle={styles.row}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Tracker</Text>

      {/* Custom Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Gem code"
        value={search}
        onChangeText={setSearch}
      />

      <Text style={styles.heading}>In Progress</Text>
      {renderImageRow(imageProgress)}

      <Text style={styles.heading}>Completed</Text>
      {renderImageRow(imageCompleted)}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  row: {
    justifyContent: "space-between",
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    margin: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  description: {
    marginTop: 5,
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
});

export default Tracker;
