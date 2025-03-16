//Screen creator: Isum

import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TextInput, SafeAreaView, TouchableOpacity } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import Header_2 from "../../components/Header_2";

const Tracker = ({navigation}) => {
  //manage the search option
  const [search, setSearch] = useState("");

  const [progressGem, setProgressGem] = useState([
    { id: "gem3", code: "DCW030", image: require("../../assets/Gem1.png") },
    { id: "gem2", code: "KDD437", image: require("../../assets/Gem2.png") },
    { id: "gem1", code: "IHP164", image: require("../../assets/Gem3.png") },
  ]);

  const [completeGem, setCompleteGem] = useState([
    { id: "gem6", code: "TTP467", image: require("../../assets/Gem4.png") },
    { id: "gem5", code: "MW963", image: require("../../assets/Gem5.png") },
    { id: "gem4", code: "TPK476", image: require("../../assets/Gem6.png") },
  ]);

  const addNewGem = (newGem, setGems) => {
    setGems((prevGems) => [newGem, ...prevGems.slice(0, 2)]);
  };

  const selectedGems = progressGem.filter((gem) =>
    gem.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleGemPress = (gem) => {
    navigation.navigate("OwnerOrderTrackDetails", { gem });
  };

  const markedComplete = (gem) =>{
    setProgressGem(progressGem.filter((item) => item.id !== gem.id));
    setCompleteGem([...completeGem, gem]);
  };

  const renderGem = ({item}) => (
    <View style={styles.gemItem}>
      <TouchableOpacity onPress={() => handleGemPress(item)}>
        <Image source={item.image} style={styles.gemImage} />
      </TouchableOpacity>
      <Text style={styles.gemCode}>{item.code}</Text>
    </View>
  );

  

  return (
  
      <SafeAreaView style={baseScreenStylesNew.container}>
        <Header_2 title="Tracker"/>
        <View style={baseScreenStylesNew.search}>
          <Ionicons name="search" size={20} color="#888" style={baseScreenStylesNew.searchIcon} />
          <TextInput
            style={styles.searchData}
            placeholder="Search Gem ID"
            placeholderTextColor={baseScreenStylesNew.searchIcon.color}
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
        </View>

        {/*In progress gems*/}
        <View style={styles.sectionContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("InProgressTrackerScreen")}>
          <Text style={styles.subTopicProgress}>In Progress {'>'}</Text>
          </TouchableOpacity>
          <FlatList
            data={selectedGems}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={renderGem}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/*Completed gems*/}
        <View style={styles.sectionContainer} >
          <TouchableOpacity onPress ={()=> navigation.navigate("CompletedTrackerScreen")}>
          <Text style={styles.subTopicCompleted}>Completed {'>'}</Text>
          </TouchableOpacity>
          <FlatList
            data={completeGem}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={renderGem}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchData: {
    flex: 1,
    fontSize: 16
  },
  sectionContainer: {
    marginBottom: 50,
    marginTop: 30,
    paddingVertical: 10,
    backgroundColor:'rgb(195, 200, 207)',
    borderRadius: 10,
    marginHorizontal: 16,
    paddingLeft: 16,
    width: "auto",
    elevation: 12
  },
  subTopicProgress: {
    fontSize: 18,
    fontWeight: "bold",
    color:"#000",
    marginBottom: 10,
  },
  subTopicCompleted: {
    fontSize: 18,
    fontWeight: "bold",
    color:"#000",
    marginBottom: 10,
  },
  gemItem: {
    alignItems: "center",
    margin: 16,
  },
  gemImage: {
    width: 90,
    height: 100,
    borderRadius: 12,
  },
  gemCode: {
    marginTop: 5,
    fontSize: 14,
    color: "#000",
  }
});

export default Tracker;
