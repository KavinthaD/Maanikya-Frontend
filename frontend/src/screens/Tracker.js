import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TextInput, SafeAreaView } from "react-native";

const Tracker = () => {
  //manage the search option
  const [search, setSearch] = useState("");

  //images in the progress gems
  const imageProgress = [
    {
      id: "img1",
      uri: "https://via.placeholder.com/100.png?text=Gem1",
      description: "Beautiful Pink Gem",
    },
    {
      id: "img2",
      uri: "https://via.placeholder.com/100.png?text=Gem2",
      description: "Sparkling Blue Gem",
    },
    {
      id: "img3",
      uri: "https://via.placeholder.com/100.png?text=Gem3",
      description: "Radiant Green Gem",
    },
  ];

  //images in the completed images
  const imageCompleted = [
    {
      id: "img4",
      uri: "https://via.placeholder.com/100.png?text=Gem4",
      description: "Shiny Red Gem",
    },
    {
      id: "img5",
      uri: "https://via.placeholder.com/100.png?text=Gem5",
      description: "Elegant Yellow Gem",
    },
    {
      id: "img6",
      uri: "https://via.placeholder.com/100.png?text=Gem6",
      description: "Majestic Purple Gem",
    },
  ];

  //Give rows of images
  const renderImageRow = (images) => (
    <FlatList
      //Datasource
      data={images}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.uri }} style={styles.image} />
          <Text style={styles.description}>{item.description}</Text>
        </View>
      )}
      //no. of columns that id displays
      numColumns={3}
      //Styles the row
      columnWrapperStyle={styles.row}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/*Heading */}
      <Text style={styles.heading}>Tracker</Text>

      {/*Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Gem code"
        value={search} //Control input values
        onChangeText={setSearch}
      />

      {/*In progress gems*/}
      <Text style={styles.heading}>In Progress</Text>
      {renderImageRow(imageProgress)}

      {/*Completed gems*/}
      <Text style={styles.heading}>Completed</Text>
      {renderImageRow(imageCompleted)}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9CCDDB",
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
