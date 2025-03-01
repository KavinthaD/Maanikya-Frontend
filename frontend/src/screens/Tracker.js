import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TextInput, SafeAreaView, TouchableOpacity } from "react-native";

const Tracker = () => {
  //manage the search option
  const [search, setSearch] = useState("");

  //gems in progress
  const [progressGem, setProgressGem] = useState([
    { id: "gem3", code: "DCW030", image: require("../assets/logo.png") },
    { id: "gem2", code: "KDD437", image: require("../assets/logo.png") },
    { id: "gem1", code: "IHP164", image: require("../assets/logo.png") },
  ]);
  //gem completed
  const [completeGem, setCompleteGem] = useState([
    { id: "gem6", code: "TTP467", image: require("../assets/logo.png") },
    { id: "gem5", code: "MW963", image: require("../assets/logo.png") },
    { id: "gem4", code: "TPK476", image: require("../assets/logo.png") },
  ]);

  //Adding new gems and keeping only three gems in row
  const addNewGem = (newGem, setGems) => {
    setGems((prevGems) => [newGem, ...prevGems.slice(0, 2)]);
  };
  //selecting gems in search option
  const selectedGems = progressGem.filter((gem) =>
    gem.code.toLowerCase().includes(search.toLowerCase())
  );
  //functions marks gems as complete
  const markedComplete = (gem) =>{
    setprogressGem(progressGem.filter((item) => item.id !== gem.id));
    setcompleteGem([...completeGem, gem]);
  };
  //render each gem item
  const renderGem = ({item}) => (
    <View style={styles.gemItem}>
      <Image source={item.image} style={styles.gemImage} />
      <Text style={styles.gemCode}>{item.code}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      

      {/*Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Gem code"
        value={search} 
        onChangeText={(text) => setSearch(text)}
      />
      {/*In Progress gems*/}
      <TouchableOpacity style={styles.progressContainer}>
        <Text style={styles.subTitle}>In Progress {'>'}</Text>
        <FlatList
          data={selectedGems} //filter gems on search
          horizontal
          keyExtractor={(item) => item.id}
          renderItem={renderGem}
          showsHorizontalScrollIndicator={false}
        />
      </TouchableOpacity>

      {/*Completed gems*/}
      <TouchableOpacity style={styles.complitedContainer}>
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
    height:40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchData: {
    flex: 1,
    fontSize: 16
  },
  progressContainer: {
    marginBottom: 50,
    marginTop: 30,
    paddingVertical: 10,
    backgroundColor: "#DDD1FF",
    borderRadius: 10,
    marginHorizontal: 16,
    paddingLeft: 16,
    width: "auto",
  },
  complitedContainer: {
    marginBottom: 50,
    marginTop: 30,
    paddingVertical: 10,
    backgroundColor: "#7E7E7E",
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
    width: 80,
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
