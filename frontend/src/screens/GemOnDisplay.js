import React, { useState } from "react";
import { SafeAreaView, View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const GemOnDisplay = () => {
  //manage gems has been displayed  
  const [onDisplay, setOnDisplay] = useState([
    { id: "img1", uri: "https://www.sujanijewellers.com/wp-content/uploads/2021/09/hessonite-gomed-gemsratna.jpg", code: "GEM001" },
    { id: "img2", uri: "https://www.sujanijewellers.com/wp-content/uploads/2021/09/hessonite-gomed-gemsratna.jpg", code: "GEM002" },
    { id: "img3", uri: "https://www.sujanijewellers.com/wp-content/uploads/2021/09/hessonite-gomed-gemsratna.jpg", code: "GEM003" },
  ]);

  //manage gems has been on sale
  const [onSale, setOnSale] = useState([
    { id: "img4", uri: "https://www.sujanijewellers.com/wp-content/uploads/2021/09/hessonite-gomed-gemsratna.jpg", code: "GEM101", name: "Kamal", price: "$500" },
    { id: "img5", uri: "https://www.sujanijewellers.com/wp-content/uploads/2021/09/hessonite-gomed-gemsratna.jpg", code: "GEM102", name: "Nimal", price: "$800" },
    { id: "img6", uri: "https://www.sujanijewellers.com/wp-content/uploads/2021/09/hessonite-gomed-gemsratna.jpg", code: "GEM103", name: "Sunil", price: "$1,200" },
  ]);

  //Adding gems to the gems on display
  const handleAddGem = () => {
    const newGem = {
      //Creating a unique id to the gems to identified in the code
      id: `img${onDisplay.length + 1}`, 
      uri: "https://cdn-icons-png.flaticon.com/512/2661/2661440.png",
      //Creating a code for the newly added gems
      code: `GEM00${onDisplay.length + 1}`,
    };
    //Add the newly added gems to the list
    setOnDisplay([...onDisplay, newGem]);
  };

  //function of gem on display
  const renderGem = ({ item }) => (
    <View style={styles.row}>
      <Image source={{ uri: item.uri }} style={styles.icon} />
      <Text style={styles.text}>{item.code}</Text>
    </View>
  );

  //function of gem on sale
  const renderGemDetails = ({ item }) => (
    <View style={styles.row}>
      <Image source={{ uri: item.uri }} style={styles.icon} />
      <Text style={[styles.text, { flex: 1 }]}>{item.code}</Text>
      <Text style={[styles.text, { flex: 2 }]}>{item.name}</Text>
      <Text style={styles.text}>{item.price}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/*Heading*/ }  
      <Text style={styles.heading}>Gem On Display</Text>
      
      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddGem}>
        <Ionicons name="add-circle" size={40} color="#007AFF" />
      </TouchableOpacity>

      {/* Gem on display */}
      <Text style={styles.heading}>-- On Display --</Text>
      <FlatList
        data={onDisplay} //data source
        keyExtractor={(item) => item.id} //Extract unique key
        renderItem={renderGem} //Give functions of individual gems
        contentContainerStyle={styles.list}
      />

      {/* Sold Gems */}
      <Text style={styles.heading}>-- Sold Out --</Text>
      <FlatList
        data={onSale}//data source
        keyExtractor={(item) => item.id}//extract unique key
        renderItem={renderGemDetails} //Give functions of individual gems
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#9CCDDB",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15, //VErtical space from heading
  },
  list: {
    paddingVertical: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 5,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
  },
  addButton: {
    alignSelf: "center",
    marginBottom: 15,
  },
});

export default GemOnDisplay;
