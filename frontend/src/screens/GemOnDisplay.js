//Screen creator: Isum

import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, FlatList, Image, View, StyleSheet, Modal, TextInput } from "react-native";
import { Plus } from "lucide-react-native";
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; 

const GemOnDisplay = ({}) => {
  const [onDisplay, setOnDisplay] = useState([
    { id: "Gem001", image: require("../assets/logo.png") }
  ]);
  const [sold, setSold] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGem, setSelectedGem] = useState(null);
  const [buyerName, setBuyerName] = useState("");
  const [price, setPrice] = useState("");

  const openModal = (gem) => {
    setSelectedGem(gem);
    setModalVisible(true);
  };

  

  const markSold = () => {
    if (selectedGem && buyerName && gemPrice) {
      setOnDisplay(onDisplay.filter((item) => item.id !== selectedGem.id));
      setSold([...sold, { ...selectedGem, buyer: buyerName, price: price }]);
      setModalVisible(false);
      setBuyerName("");
      setPrice("");
    } else {
      alert("Please enter buyer's name and gem price.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Title */}
      <View style={styles.title}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        <Text style={styles.titleName}>Gem On Display</Text>
        
      </View>


     

      {/* On Display Gems */}
      <Text style={styles.subtopic}>On Display</Text>
      <FlatList
        data={onDisplay}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.gemDisplay}>
            <Image source={item.image} style={styles.gemImg} />
            <Text style={styles.gemId}>{item.id}</Text>
            <TouchableOpacity onPress={() => openModal(item)} style={styles.soldBtn}>
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
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Sale</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Buyer's Name"
              value={buyerName}
              onChangeText={setBuyerName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Gem Price (LKR)"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
            <View style={styles.modalBtn}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={markSold} style={styles.confirmBtn}>
                <Text style={styles.btnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#0a3a5d",
  },
  titleName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    alignItems: "center",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  modalBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  cancelBtn: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  confirmBtn: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default GemOnDisplay;
