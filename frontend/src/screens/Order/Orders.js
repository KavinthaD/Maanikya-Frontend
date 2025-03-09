//Screen creator: Dulith

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
} from "react-native";
import { baseScreenStyles } from "../../styles/baseStyles";
import GradientContainer from "../../components/GradientContainer";
import { LinearGradient } from "expo-linear-gradient";
import { TextInput } from "react-native"
const Orders = [
  {
    id: "NB01130",
    name: "M.D Rathnasiri Navasighe",
    date: "20-12-2024",
    image: require("../../assets/gemimg/user3.jpg"),
  },
  {
    id: "NB01129",
    name: "K.D Piyasiri Gunasinghe",
    date: "20-11-2024",
    image: require("../../assets/gemimg/user3.jpg"),
  },
  {
    id: "NB01128",
    name: "P.D Supunsiri Subasinghe",
    date: "20-10-2024",
    image: require("../../assets/gemimg/user3.jpg"),
  },
  {
    id: "NB01127",
    name: "U.D Gunasiri Lokusighe",
    date: "20-09-2024",
    image: require("../../assets/gemimg/user3.jpg"),
  },
];

const OrderScreen = () => {
  const [activeTab, setActiveTab] = useState("Requested");
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false); // For price input modal
  const [price, setPrice] = useState(""); // Price state

  const handleOrderClick = (order) => {
    setSelectedOrder(order); 
    setIsModalVisible(true); 
  };
  const handleAccept = () => {
    setIsModalVisible(false); // Close the first modal
    setIsPriceModalVisible(true); // Open the price input modal
  };

  

  const handleDecline = () => {
    console.log(`Declined Order: ${selectedOrder.id}`);
    setIsModalVisible(false); 
  };
  const handleSendPrice = () => {
    console.log(`Price for Order ${selectedOrder.id}: ${price}`);
    setIsPriceModalVisible(false); // Close the price input modal
    setPrice(""); // Reset the price input field
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Requested":
        return (
          
          <ScrollView style={styles.scrollView}>
            {Orders.map((order) => (
               <TouchableOpacity
               key={order.id}
               style={styles.orderContainer}
               onPress={() => handleOrderClick(order)}
             >
             
                <Image source={order.image} style={styles.image} />
                <View style={styles.orderDetails}>
                  <Text style={styles.orderId}>Order#: {order.id}</Text>
                  <Text style={styles.orderName}>{order.name}</Text>
                  <Text style={styles.orderDate}>
                    Order requested on {order.date}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );
      case "Ongoing":
        return (
          <View style={styles.contentContainer}>
            <Text>Ongoing orders will be displayed here.</Text>
          </View>
        );
      case "History":
        return (
          <View style={styles.contentContainer}>
            <Text>Order history will be displayed here.</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <GradientContainer>
    <View style={baseScreenStyles.container}>
      <View style={styles.spacer} />
      <Text style={styles.header}>Orders</Text>
      <View style={{ flexWrap: "wrap", flexDirection: "row", justifyContent: "space-around", marginVertical: 15 }}>

        <TouchableOpacity
          onPress={() => setActiveTab("Requested")}
          style={styles.tab}
        >
          <Text
            style={
              activeTab === "Requested" ? styles.activeTabText : styles.tabText
            }
          >
            Requested
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("Ongoing")}
          style={styles.tab}
        >
          <Text
            style={
              activeTab === "Ongoing" ? styles.activeTabText : styles.tabText
            }
          >
            Ongoing
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("History")}
          style={styles.tab}
        >
          <Text
            style={
              activeTab === "History" ? styles.activeTabText : styles.tabText
            }
          >
            History
          </Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
       {/* Modal for Accept/Decline */}
       <Modal visible={isModalVisible} transparent animationType="slide">
       <LinearGradient
    
    colors={["#6B8391", "#072D44"]} 
    style={styles.modalContainer}
  >
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Order#:</Text>
              {selectedOrder && (
                <>
                <Image source={selectedOrder.image} style={styles.modalImage} />
                  <Text style={styles.modalText}>
                     {selectedOrder.name}
                  </Text>
                  <Text style={styles.modalText}>
                    Gem Id: {selectedOrder.id}
                  </Text>
                
                  <Text style={styles.modalText}>
                    Requested Date: {selectedOrder.date}
                  </Text>
                </>
              )}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={handleDecline}
                >
                  <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={handleAccept}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Modal>
 {/* Modal for Price Input */}
 <Modal visible={isPriceModalVisible} transparent animationType="slide">
        <LinearGradient
          colors={["#6B8391", "#072D44"]}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Order#:</Text>
            {selectedOrder && (
              <>
                <Image source={selectedOrder.image} style={styles.modalImage} />
                  <Text style={styles.modalText}>
                     {selectedOrder.name}
                  </Text>
                  <Text style={styles.modalText}>
                    Gem Id: {selectedOrder.id}
                  </Text>
                
                  <Text style={styles.modalText}>
                    Requested Date: {selectedOrder.date}
                  </Text>
              
                <TextInput
                  style={styles.priceInput}
                  placeholder="Service fee"
                  placeholderTextColor="#ffffff99"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
                <TouchableOpacity
                  style={styles.sendButton}
                  onPress={handleSendPrice}
                >
                  <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </LinearGradient>
      </Modal>



    </View>
    </GradientContainer>
  );
};

const styles = StyleSheet.create({
  spacer: {
    
    height: 20,
  },
  
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    backgroundColor: "#072D44",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 10,
  },
 
  tab: {
    backgroundColor: 'transparent',
    alignItems: "center",
    paddingVertical: 5,
   
  },
  tabText: {
    fontWeight: "bold",
    color: "#000", 
    backgroundColor: "#ffffff", 
    paddingHorizontal: 25,
    borderRadius: 20,
    paddingVertical: 15,
    fontSize: 15,
  },
  activeTabText: {
    fontWeight: "bold",
    color: "#ffffff", 
    backgroundColor: "#170969", 
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  orderContainer: {
    flexDirection: "row",
    backgroundColor: 'rgba(123, 150, 172, 0.4)',
    margin: 13,
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 10,
  },
  orderDetails: {
    flex: 1,
  },
  orderId: {
    fontWeight: "bold",
    color: "#fff",
    fontSize: 20,
  },
  orderName: {
    color: "#fff",
    fontSize: 17,
  },
  orderDate: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    height: "50%",
    padding: 20,
    backgroundColor: "rgba(7, 45, 68, 0.5)",
    borderRadius: 15,
    alignItems: "center",
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff",
    
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#fff", 
    marginBottom: 10,
    
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
  },
  declineButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalImage: {
    width: 100, 
    height: 100, 
    borderRadius: 10,
    marginBottom: 25, 
  },
  priceInput: {
    borderWidth: 1,
    borderColor: "#ffffff99",
    color: "#fff",
    width: "80%",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor:"#072D44"
  },
  sendButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
  },

});

export default OrderScreen;
