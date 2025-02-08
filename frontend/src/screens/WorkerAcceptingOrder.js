import React from "react";
import { View, Text, Modal, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useState } from "react";

const OrderPopup = ({visible, onClose}) => {
    const [accepted, setAccepted] = useState(false);
    const [serviceFee, setServiceFee] = useState("");

    const handleAccept = () => {
        setAccepted(true);
    };

    const handleSend = () => {
        if (serviceFee.trim() === "") {
            alert("Please enter the order price");
        }else{
            alert("Order Acceptation Sent");
            onClose();
        }
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.popup}>
                    <Text style={styles.orderText}>Order#: NB01130</Text>
                    <Image source={require("../assets/gem-images/gem1.jpeg")} style={styles.gemImage}/>
                    <Text style={styles.detailText}>M.D Rathnasiri Navasinghe</Text>
                    <Text style={styles.detailText}>Gem #: IHP164</Text>
                    <Text style={styles.detailTimeText}>Requested burning period: 2 months</Text>

                    {!accepted ? (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.declineButton} onPress={onClose}>
                                <Text style={styles.buttonText}>Decline</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                                <Text style={styles.buttonText}>Accept</Text>
                            </TouchableOpacity>
                        </View>
                    ): (

                    <View>
                        <TextInput style={styles.input} placeholder="Order Price" placeholderTextColor="#ccc"
                            value={serviceFee}
                            onChangeText={setServiceFee}/>
                        <TouchableOpacity style={styles.acceptButton} onPress={handleSend}>
                            <Text style={styles.buttonText}>Accept</Text>
                        </TouchableOpacity>
                        </View>
                    )}

                </View>
            </View>
        </Modal>
    )
}
const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#9CCDDB",
    },

    popup: {
      width: "50%",
      height: "55%",
      backgroundColor: "#457EA0",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
    },
    orderText: {
      fontSize: 16,
      color: "white",
      fontWeight: "bold",
    },
    
    gemImage: {
      width: 100,
      height: 100,
      borderRadius: 10,
      marginVertical: 10,
    },

    detailText: {
      color: "white",
      textAlign: "center",
      fontWeight: "semibold",
      marginVertical: 3,
    },

    detailTimeText: {
      color: "#FFFDFD",
      textAlign: "center",
      marginVertical: 9,
      fontWeight: "heavy"
    },

    buttonContainer: {
      flexDirection: "row",
      marginTop: 50,
    },

    declineButton: {
      backgroundColor: "#F12E2E",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginRight: 40,
      marginTop: 10,
    },
    acceptButton: {
      backgroundColor: "#09690F",
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginTop: 10,
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
    },

    input: {
      backgroundColor: "#072D44",
      color: "#B9ADAD",
      width: "100%",
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      textAlign: "center",
    },
  });
  

  export default OrderPopup;