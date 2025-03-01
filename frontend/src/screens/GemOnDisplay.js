//Screen creator: Isum

import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, FlatList, Image, View, StyleSheet, Modal, TextInput, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 

const GemOnDisplay = ({}) => {
  //Store gems on display
  const [onDisplay, setOnDisplay] = useState([
    { id: "Gem001", image: require("../assets/logo.png") },
    { id: "Gem002", image: require("../assets/logo.png") },
    { id: "Gem003", image: require("../assets/logo.png") },
  ]);
  //Store sold gems
  const [sold, setSold] = useState([
    { id: "Gem004", image: require("../assets/logo.png"), buyer: "John Doe", price: "5000" },
    { id: "Gem005", image: require("../assets/logo.png"), buyer: "Jane Doe", price: "8000" },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGem, setSelectedGem] = useState(null);
  const [buyerName, setBuyerName] = useState("");
  const [price, setPrice] = useState("");

  //open modal making gem as sold
  const openModal = (gem) => {
    setSelectedGem(gem);
    setModalVisible(true);
  };

  
  //making gem sold
  const markSold = () => {
    if (selectedGem && buyerName && price) {
      setOnDisplay(onDisplay.filter((item) => item.id !== selectedGem.id));         //remove gem from on display
      setSold([...sold, { ...selectedGem, buyer: buyerName, price: price }]);       //add gem to sold
      setModalVisible(false);     //close modal
      setBuyerName("");
      setPrice("");
    } else {
      alert("Please enter buyer's name and gem price.");
    }
  };

  //seperate the sold and displayed gems 
  const ItemSeperator = () => {
    <View style={{ height: 1, backgroundColor: "#e0e0e0", marginVertical: 5 }} />
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.displayContainer}>

          <View style={styles.header}>
            <View style = {styles.headerLine} />
              < Text style={styles.subTopic}>Gems On Display</Text>
            <View style = {styles.headerLine} />
          </View>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Code</Text>
            <View style={{flex: 1}} />
          </View>  
          {/*Displayed as a list*/}
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
            ItemSeparatorComponent={ItemSeperator}
          />
        </View>  

          {/* Sold Gems */}
        <View style={styles.soldContainer}>
          <View style={styles.header}>
            <View style = {styles.headerLine} />
              <Text style={styles.subtopic}>Sold out</Text>
            <View style = {styles.headerLine} />
          </View>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Code</Text>
            <Text style={styles.tableHeaderText}>To</Text>
            <Text style={styles.tableHeaderText}>Price(LKR)</Text>
          </View>  
          {/*display sold gems as a list*/}
          <FlatList
            data={sold}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.soldGems}>
                <Image source={item.image} style={styles.gemImg} />
                <Text style={styles.soldText}>{item.id} </Text>
                <Text style={styles.soldText}>{item.buyer} </Text>
                <Text style={styles.soldText}>{item.price}</Text>
              </View>
              )}
            ItemSeparatorComponent={ItemSeperator}
          />
        </View> 
          
        {/*modal making sold gem*/}
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirm Sale</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Buyer's Name"
                value={buyerName}
                onChangeText={setBuyerName}
                placeholderTextColor="#888"
              />
              <TextInput
                style={styles.input}
                placeholder="Enter Gem Price (LKR)"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
                placeholderTextColor="#888"
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#9CCDDB",
  },
  displayContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  soldContainer: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#505050',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  subtopic: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginHorizontal: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginBottom: 8,
  },  
  tableHeaderText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#777',
    width: 100,
  },  
  gemDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  gemImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 20,
  },
  gemId: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  soldBtn: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  soldBtnText: {
    color: "white",
    fontSize: 14,
    fontWeight:"500",
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
    fontSize: 16,
    justifyContent: "center",
    alignItems: "center",
  },  
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: '80%',
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  modalBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelBtn: {
    backgroundColor: "#6c757d",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  confirmBtn: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
    textAlign: "center",
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default GemOnDisplay;
