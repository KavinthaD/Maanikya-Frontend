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
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import { TextInput } from "react-native"
import Header_2 from "../../components/Header_2";
import { useNavigation } from "@react-navigation/native";

const Orders = {
  Requested: [
  {
    id: "NB01130",
    name: "M.D Rathnasiri Navasighe",
    date: "20-12-2024",
    image: require("../../assets/gemimg/user1.jpg"),
  },
  {
    id: "NB01129",
    name: "K.D Piyasiri Gunasinghe",
    date: "20-11-2024",
    image: require("../../assets/gemimg/user2.jpg"),
  },
],
  Ongoing: [
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
    image: require("../../assets/gemimg/user2.jpg"),
  },
  ],
  History: [
    {
      id: "NB01124",
      name: "W.D Perera",
      date: "15-02-2025",
      image: require("../../assets/gemimg/user1.jpg"),
    },
    {
      id: "NB01123",
      name: "S.R Dissanayake",
      date: "10-02-2025",
      image: require("../../assets/gemimg/user3.jpg"),
    },
  ],
};

const OrderScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Requested");
  const [selectedOrder, setSelectedOrder] = useState(null); 
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [isPriceModalVisible, setIsPriceModalVisible] = useState(false); // For price input modal
  const [price, setPrice] = useState(""); // Price state

  const handleOrderClick = (order) => {
    if (activeTab === "Ongoing" || activeTab === "History") {
      navigation.navigate("WorkerOrderTrackDetails", { order });
    } else {
      setSelectedOrder(order);
      setIsModalVisible(true);
    }
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
        return (
          <ScrollView style={styles.scrollView}>
            {Orders[activeTab].map((order) => (
               <TouchableOpacity
               key={order.id}
               style={styles.orderContainer}
               onPress={() => handleOrderClick(order)}
             >
             
                <Image source={order.image} style={styles.image} />
                <View style={styles.orderDetails}>
                  <Text style={styles.orderId}>Order#: {order.id}</Text>
                  <Text style={styles.orderName}>{order.name}</Text>
                  <Text style={[styles.orderDate, baseScreenStylesNew.themeText]}>
                  {activeTab === "Requested" || activeTab === "Ongoing"
                ? `Order requested on ${order.date}`
                : activeTab === "History"
                ? `Order completed on ${order.date}`
                : ""}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );
      };
  return (
    
    <View style={baseScreenStylesNew.container}>
      <Header_2 title="Orders"/>
      <View style={baseScreenStylesNew.tabBar}>
  {["Requested", "Ongoing", "History"].map((tab) => (
    <TouchableOpacity
      key={tab}
      style={[
        baseScreenStylesNew.tabButton,
        activeTab === tab
          ? baseScreenStylesNew.tabButtonActive
          : baseScreenStylesNew.tabButtonInactive,
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Text
        style={[
          baseScreenStylesNew.tabText,
          activeTab === tab
            ? baseScreenStylesNew.tabTextActive
            : baseScreenStylesNew.tabTextInactive,
        ]}
      >
        {tab}
      </Text>
    </TouchableOpacity>
  ))}
</View>

      {renderContent()}
       {/* Modal for Accept/Decline */}
       <Modal visible={isModalVisible} transparent animationType="slide">
       <View style={styles.modalContainer}>
            <View style={[styles.modalContent,]}>
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
                  style={[baseScreenStylesNew.Button1,styles.declineButton]}
                  onPress={handleDecline}
                >
                  <Text style={baseScreenStylesNew.buttonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[ baseScreenStylesNew.Button1, styles.acceptButton]}
                  onPress={handleAccept}
                >
                  <Text style={baseScreenStylesNew.buttonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
 {/* Modal for Price Input */}
 <Modal visible={isPriceModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
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
                  style={[baseScreenStylesNew.Button1,styles.sendButton]}
                  onPress={handleSendPrice}
                >
                  <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
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
    backgroundColor: "rgb(255, 255, 255)",
    margin: 13,
    padding: 10,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "rgba(228, 227, 227, 0.61)",
    elevation: 9,
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
    color: "#000",
    fontSize: 18,
  },
  orderName: {
    color: "#000",
    fontSize: 16,
  },
  orderDate: {
    fontSize: 15,
    fontWeight: "bold"
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  modalContent: {
    backgroundColor: "rgb(220, 220, 220)",
    borderWidth: 2,
    borderColor: "rgba(228, 227, 227, 0.61)",
    width: "80%",
    height: "50%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",

  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#000", 
    marginBottom: 10,
    
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    width: "100%",
  },
  declineButton: {
    borderRadius: 8,
    width: "40%",
  },
  acceptButton: {
    borderRadius: 8,
    width: "40%",
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
    padding: 10,
    borderRadius: 8,
    width: "40%",
    alignItems: "center",
  },

});

export default OrderScreen;
