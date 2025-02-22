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
  const itemSeperator = ()=>(
    <View style={{height: 1, backgroundColor: "e0e0e0", marginVertical: 5}} />
  );

  return (
    <SafeAreaView style={styles.container}>
      

      <View style = {styles.sectionContainer}>
        <View style = {styles.sectionHeader}>
          <View style={styles.headerLine} />
          <Text style={styles.subtopic}>On Display</Text>
          <View style={styles.headerLine} />
        </View>
        <View style={styles.tableHeader}>
          <Text style={styles.columnHeader}>Code</Text>
          <View style={{ flex: 1 }} />  {/* Spacer */}
        </View>
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
        ItemSeparatorComponent={ItemSeparator}
      />
      </View>

      <View style={styles.sectionContainerSold}>
        <View style={styles.sectionHeader}>
          <View style={styles.headerLine} />
            <Text style={styles.sectionTitle}>Sold out</Text>
          <View style={styles.headerLine} /> 
          <View style={styles.tableHeader}>
            <Text style={styles.columnHeader}>Code</Text>
            <Text style={styles.columnHeader}>To</Text>
            <Text style={styles.columnHeader}>Price (LKR)</Text>
          </View>
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
            ItemSeparatorComponent={ItemSeparator}
          />
        </View>
      </View>  
      
      

      
      
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

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9D9D9",
  },

  sectionContainer: {
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
    marginTop: 50,
  },
  sectionContainerSold: {
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
  sectionHeader: {
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
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginBottom: 8,
  },
  columnHeader: {
    fontSize: 14,
    fontWeight: '500',
    color: '#777',
    width: 100,
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
    marginRight: 10,
  },
  gemId: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  soldGems:{
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  soldBtn: {
    backgroundColor: "#003366",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  soldBtnText: {
    color: "white",
    fontSize: 14,
    fontWeight: '500',
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
    fontSize: 16,
    color: '#333',
    width: 100,
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
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  modalBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  cancelBtn: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  confirmBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default GemOnDisplay;
