import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TextInput, SafeAreaView, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";


const Tracker = () => {
  const [search, setSearch] = useState("");

  const [progressGem, setprogressGem] = useState([
    {
      id: "gem1",
      code: "AA101",
      image: require("../assets/logo.png"),
    },
    {
      id: "gem2",
      code: "AA101",
      image: require("../assets/logo.png"),
    },
    {
      id: "gem3",
      code: "AA101",
      image: require("../assets/logo.png"),
    },
  ]); 
    


  const [completeGem, setcompleteGem] = useState([
    {
      id: "gem4",
      code: "AA101",
      image: require("../assets/logo.png"),
    },
    {
      id: "gem5",
      code: "AA101",
      image: require("../assets/logo.png"),
    },
    {
      id: "gem6",
      code: "AA101",
      image: require("../assets/logo.png"),
    },
  ]);
    
  const selectedGems = progressGem.filter((gem) =>
    gem.code.toLowerCase().includes(search.toLowerCase())
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
    <SafeAreaView style={styles.container}>

      <View style={styles.topic}>
      <Icon name="arrow-left" size={20} color="white" />
        <Text style={styles.topicName}>Tracker</Text>
      </View>
      

      {/* Custom Search Bar */}
      <View style={styles.searchBar}>
        <Icon name= "search" size={18} color="#888" style={styles.searchIcon}/>
        <TextInput
          style={styles.searchData}
          placeholder="Gem code"
          value={search}
          onChangeText={(text) => setSearch(text)}
        />
      </View>
      

      <Text style={styles.subTopic}>In Progress</Text>
      <FlatList
        data={selectedGems}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({item}) => renderGem({item, action: markedComplete})}
      />


      <Text style={styles.subTopic}>Completed</Text>
      <FlatList
        data={completeGem}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({item}) => renderGem({item, action: () => {} })}
      />
   
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#a9c9d3",
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
