//Screen creator: Isum

import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TextInput, SafeAreaView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { baseScreenStyles } from "../../styles/baseStyles";

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
      id: "gem2",
      code: "B02",
      image: require("../assets/logo.png"),
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

  const markedComplete = (gem) =>{
    setprogressGem(progressGem.filter((item) => item.id !== gem.id));
    setcompleteGem([...completeGem, gem]);
  };

  const renderGem = ({item, action}) => (
    <TouchableOpacity style={styles.gemItem} onPress={() => action(item)} >
      <Image source={item.image} style={styles.gemImage} />
      <Text style={styles.gemCode}>{item.code}</Text>
    </TouchableOpacity>
  );

  

  return (
    <SafeAreaView style={[baseScreenStyles.container,styles.container]}>
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
    padding: 10,
  },
  topic: {
    fontSize: 20,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#082f4f",
    padding: 15,
  },
  topicName: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 8, 
    margin: 10,
    borderRadius: 8
  },
  searchIcon: {
    marginRight: 8,
    alignSelf: "center"
  },
  searchData: {
    flex: 1,
    fontSize: 16
  },
  subTopic: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    marginVertical: 8
  },
  gemItem: {
    alignItems: "center",
    margin: 10
  },
  gemImage: {
    width: 80,
    height: 80,
    borderRadius: 10
  },
  gemCode: {
    marginTop: 5,
    fontsize: 14
  }
});

export default Tracker;
