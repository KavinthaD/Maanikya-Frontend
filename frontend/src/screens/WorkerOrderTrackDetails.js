//Screen creator: Thulani

import React, {useState} from "react";
import {View, Text, Image, StyleSheet, TouchableOpacity} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import { baseScreenStyles } from "../styles/baseStyles";

const WorkerOrderTrackDetails = () => {
    const [orderCompleted, setOrderCompleted] = useState(false);
    const [orderPayment, setOrderPayment] = useState(false);
    const [rating, setRating] = useState(0);

    return (
        <View style={[baseScreenStyles.container,styles.container]}>
            <View style= {styles.orderDetails}> 
                <View style= {styles.row}>
                    <View>
                        <Text style={styles.gemId}> Gem ID - IHP164 </Text>
                        <Text style={styles.price}> Rs. 7800 </Text>
                        <Text style={styles.ratingLabel}> Rating </Text>
                    </View>
                    <View>
                        <Image source={require("../assets/gem-images/gem1.jpeg")} style={styles.gemImage}/>
                        <View style={styles.ratingContainer}>
                            {[1,2,3,4,5].map((star)=> (
                                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                    <FontAwesome name="star" size={24} color={star <= rating ? "#334D85" : "#fff"} />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
            </View>   
            <View style={styles.orderStatus}> 
                <Text style={styles.orderDet}> Order Details </Text>
                <View style={styles.statusBoxRequest}>
                    <Image source={require("../assets/owner-icons/order-request.png")} style={styles.statusIcon}/>
                    <View>
                    <Text style={styles.statusText}>Order Requested </Text>
                    <Text style={styles.dateText}> Order requested on 20-12-2024 </Text>
                    </View>
                </View>
                <View style={styles.statusBoxAccept}>
                    <Image source={require("../assets/owner-icons/order-accept.png")} style={styles.statusIcon}/>
                    <View>
                    <Text style={styles.statusText}>Order Accepted </Text>
                    <Text style={styles.dateText}> Order accepted on 20-12-2024 </Text>
                    </View>
                </View>
                <View style={styles.statusBoxConfirm}>
                <Image source={require("../assets/owner-icons/order-confirm.png")} style={styles.statusIcon}/>
                <View> 
                    <Text style={styles.statusText}>Order Confirmed </Text>
                    <Text style={styles.dateText}> Order confirmed on 20-12-2014 </Text>
                </View>
                </View>
                {orderCompleted && (
                    <View style={styles.statusBoxComplete}>
                        <Image source={require("../assets/owner-icons/order-complete.png")} style={styles.statusIcon} />
                        <View>
                            <Text style={styles.statusText}>Order Completed</Text>
                            <Text style={styles.dateText}>Order completed on 20-12-2024</Text>
                        </View>
                    </View>
                )}

            
                {orderPayment && (
                    <View style={styles.statusBoxPayment}>
                        <Image source={require("../assets/owner-icons/order-paid.png")} style={styles.statusIcon} />
                        <View>
                            <Text style={styles.statusText}>Payment Received</Text>
                            <Text style={styles.dateText}>Received and paid on 20-12-2024</Text>
                        </View>
                    </View>
                )}
            </View>

        
            {!orderCompleted && (
                <TouchableOpacity style={styles.completeButton} onPress={() => setOrderCompleted(true)}>
                    <Text style={styles.completeButtonText}>Mark as Completed</Text>
                </TouchableOpacity>
            )}

            {orderCompleted && !orderPayment && (
                <TouchableOpacity style={styles.paidButton} onPress={() => setOrderPayment(true)}>
                    <Text style={styles.completeButtonText}>Confirm Payment and Close the Order</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};


const styles = StyleSheet.create ({
    container: {
        paddingTop: 40
    },

    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
        zIndex: 10
    },

    header: {
        backgroundColor: "#022A41",
        padding: 15,
        alignItems: "center",
    },

    orderNumber: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    },

    orderDetails: {
        padding: 20
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    gemId: {
        fontSize: 18,
        fontWeight: "bold"
    },

    price: {
        fontSize: 18,
        color: "#555",
        fontWeight: "bold"
    },


    ratingLabel: {
        fontSize: 16,
        color: "#555",
        marginTop: 40,
        fontWeight: "bold"
    },

    ratingContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },

    gemImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        alignSelf: "center",
        marginTop: 1,
    },

    orderDet: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#444",
        marginBottom: 14,
        marginLeft: 10,
    },

    orderStatus: {
        marginTop: 20
    },

    statusBoxRequest: {
        backgroundColor: "#A4AAFA",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        marginLeft: 40,
        marginRight: 30
    },

    statusBoxAccept: {
        backgroundColor: "#7F87FD",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        marginLeft: 40,
        marginRight: 30
    },

    statusBoxConfirm: {
        backgroundColor: "#5661FF",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        marginLeft: 40,
        marginRight: 30
    },

    statusBoxComplete: {
        backgroundColor: "#0616FF",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        marginLeft: 40,
        marginRight: 30
    },

    statusBoxPayment: {
        backgroundColor: "#000CBB",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        marginLeft: 40,
        marginRight: 30
    },

    statusIcon: {
        width: 50,
        height: 50,
        marginLeft: 20,
        marginRight: 20,
      },

    statusText: {
        color: "white", 
        fontSize: 16, 
        fontWeight: "bold"
    },

    dateText: {
        color: "white", 
        fontSize: 12, 
        marginTop: 5 
    },

    completeButton: {
        backgroundColor: '#02457A',
        paddingVertical: 8,
        borderRadius: 70,
        width: '80%',
        marginTop: 14,
        marginLeft: 40
    },

    completeButtonText: {
         color: "white", 
         fontSize: 16, 
         fontWeight: "bold",
         textAlign: "center"
    },

    paidButton: {
        backgroundColor: '#02457A',
        paddingVertical: 8,
        borderRadius: 70,
        width: '80%',
        marginTop: 14,
        marginLeft: 40
    },

    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 1,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: 'black',
    }

});

export default WorkerOrderTrackDetails;