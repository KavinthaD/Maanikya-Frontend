import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, FlatList, Image, View, StyleSheet } from "react-native";
import { Plus } from "lucide-react-native";

const GemOnDisplay = () => {
  const [onDisplay, setOnDisplay] = useState([
    { id: "Gem001", image: require("../assets/logo.png") }
  ]);

  const [sold, setSold] = useState([]);

  const markSold = (gem) => {
    setOnDisplay(onDisplay.filter((item) => item.id !== gem.id));
    setSold([...sold, { ...gem, buyer: "Unknown", price: Math.floor(Math.random() * 50000) + 50000 }]);
  };

  const addGem = () => {
    const newGem = {
      id: `Gem00${onDisplay.length + sold.length + 1}`,
      image: require("../assets/logo.png"),
    };
    setOnDisplay([...onDisplay, newGem]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <View style={styles.title}>
        <Text style={styles.titleName}>Gem On Display</Text>
      </View>

      {/* Add Gem Button */}
      <TouchableOpacity onPress={addGem} style={styles.addButton}>
        <Plus size={24} color="black" />
      </TouchableOpacity>

      {/* On Display Gems */}
      <Text style={styles.subtopic}>On Display</Text>
      <FlatList
        data={onDisplay}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.gemDisplay}>
            <Image source={item.image} style={styles.gemImg} />
            <Text style={styles.gemId}>{item.id}</Text>
            <TouchableOpacity onPress={() => markSold(item)} style={styles.soldBtn}>
              <Text style={styles.soldBtnText}>Mark As Sold</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Sold Gems */}
      <Text style={styles.subtopic}>Sold out</Text>
      <FlatList
        data={sold}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.soldGems}>
            <Image source={item.image} style={styles.gemImg} />
            <Text style={styles.soldText}>{item.id} - {item.buyer}</Text>
            <Text style={styles.gemPrice}>LKR {item.price}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A7D7E7",
    padding: 16,
  },
  title: {
    backgroundColor: "#003366",
    padding: 16,
    alignItems: "center",
  },
  titleName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    borderCurve: 25,
    alignItems: "center",
    marginVertical: 10,
    alignSelf: "center",
    width: 50,
    height: 50,
    justifyContent: "center",
  },
  subtopic: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
  },
  gemDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#87CEEB",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  gemImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  gemId: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "black",
  },
  soldBtn: {
    backgroundColor: "#003366",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  soldBtnText: {
    color: "white",
    fontSize: 12,
  },
  soldGems: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5D9CEC",
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
  },
  soldText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "black"
  },
  gemPrice: {
    fontSize: 14,
    color: "#003366",
  },
});

export default GemOnDisplay;
