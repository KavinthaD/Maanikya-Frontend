//Screen creator: Isum

import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TextInput, SafeAreaView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { baseScreenStyles } from "../../styles/baseStyles";

const Tracker = () => {
  //manage the search option
  const [search, setSearch] = useState("");

  const [progressGem, setProgressGem] = useState([
    { id: "gem3", code: "DCW030", image: require("../../assets/logo.png") },
    { id: "gem2", code: "KDD437", image: require("../../assets/logo.png") },
    { id: "gem1", code: "IHP164", image: require("../../assets/logo.png") },
  ]);

  const [completeGem, setCompleteGem] = useState([
    { id: "gem6", code: "TTP467", image: require("../../assets/logo.png") },
    { id: "gem5", code: "MW963", image: require("../../assets/logo.png") },
    { id: "gem4", code: "TPK476", image: require("../../assets/logo.png") },
  ]);

  const addNewGem = (newGem, setGems) => {
    setGems((prevGems) => [newGem, ...prevGems.slice(0, 2)]);
  };

  const selectedGems = progressGem.filter((gem) =>
    gem.code.toLowerCase().includes(search.toLowerCase())
  );

  

  const markedComplete = (gem) =>{
    setprogressGem(progressGem.filter((item) => item.id !== gem.id));
    setcompleteGem([...completeGem, gem]);
  };

  const renderGem = ({item}) => (
    <View style={styles.gemItem}>
      <Image source={item.image} style={styles.gemImage} />
      <Text style={styles.gemCode}>{item.code}</Text>
    </View>
  );

  

  return (
    <SafeAreaView style={styles.container}>
      

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchData}
          placeholder="Gem code"
          value={search}
          onChangeText={(text) => setSearch(text)}
          placeholderTextColor="#888"
        />
      </View>

      {/*In progress gems*/}
      <TouchableOpacity style={styles.sectionContainer}>
        <Text style={styles.subTitle}>In Progress {'>'}</Text>
        <FlatList
          data={selectedGems}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={renderGem}
          showsHorizontalScrollIndicator={false}
        />
      </TouchableOpacity>

      {/*Completed gems*/}
      <TouchableOpacity style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Completed {'>'}</Text>
        <FlatList
          data={completeGem}
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={renderGem}
          showsHorizontalScrollIndicator={false}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9CCDDB",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    margin: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchData: {
    flex: 1,
    fontSize: 16
  },
  sectionContainer: {
    marginBottom: 50,
    marginTop: 30,
    paddingVertical: 10,
    backgroundColor: "#DDD1FF",
    borderRadius: 10,
    marginHorizontal: 16,
    paddingLeft: 16,
    width: "auto",
  },
  subTopic: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#082f4f",
  },
  gemItem: {
    alignItems: "center",
    margin: 16,
  },
  gemImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  gemCode: {
    marginTop: 5,
    fontsize: 14,
    color: "#333",
  }
});

export default Tracker;
