//Screen creator: Thulani

import React, {useState} from "react";
import {View, Text, Image, StyleSheet, TouchableOpacity, ScrollView} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import Header_2 from "../../components/Header_2";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";

const WorkerOrderTrackDetails = () => {
    const [orderCompleted, setOrderCompleted] = useState(false);
    const [orderPayment, setOrderPayment] = useState(false);
    const gems = [
        { id: "BE002", image: require("../../assets/gem-images/gem1.jpeg")},
        { id: "BS079", image: require("../../assets/gem-images/gem1.jpeg")},
        { id: "RS305", image: require("../../assets/gem-images/gem1.jpeg")},
        { id: "BS001", image: require("../../assets/gem-images/gem1.jpeg")},
        { id: "BS002", image: require("../../assets/gem-images/gem1.jpeg")},
        { id: "BS005", image: require("../../assets/gem-images/gem1.jpeg")},
    ]
    
    return (
        <View style={baseScreenStylesNew.container}>
            <Header_2 title="Order#: NB01130"/>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gemScroll}>
                        {gems.map((gem) => (
                            <View key={gem.id} style={styles.gemContainer}>
                                 <Image source={gem.image} style={styles.gemImage} />
                                        <Text style={styles.gemId}>{gem.id}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.row}>
                        <Text style={styles.price}> Rs.7800</Text>
                        <View style={styles.ratingSection}>
                            <View style={styles.ratingContainer}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FontAwesome key={star} name="star" size={24} color="#70B5DF"/>
                                ))}
                              </View>
                            </View>
                          </View>
            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
            </View>   


            <View style={styles.orderStatus}> 
                <Text style={styles.orderDet}> Order Details </Text>
                <View style={styles.statusBoxRequest}>
                    <Image source={require("../../assets/owner-icons/order-request.png")} style={styles.statusIcon}/>
                    <View>
                    <Text style={styles.statusText}>Order Requested </Text>
                    <Text style={styles.dateText}> Order requested on 20-12-2024 </Text>
                    </View>
                </View>
                <View style={styles.statusBoxAccept}>
                    <Image source={require("../../assets/owner-icons/order-accept.png")} style={styles.statusIcon}/>
                    <View>
                    <Text style={styles.statusText}>Order Accepted </Text>
                    <Text style={styles.dateText}> Order accepted on 20-12-2024 </Text>
                    </View>
                </View>
                <View style={styles.statusBoxConfirm}>
                <Image source={require("../../assets/owner-icons/order-confirm.png")} style={styles.statusIcon}/>
                <View> 
                    <Text style={styles.statusText}>Order Confirmed </Text>
                    <Text style={styles.dateText}> Order confirmed on 20-12-2014 </Text>
                </View>
                </View>
                {orderCompleted && (
                    <View style={styles.statusBoxComplete}>
                        <Image source={require("../../assets/owner-icons/order-complete.png")} style={styles.statusIcon} />
                        <View>
                            <Text style={styles.statusText}>Order Completed</Text>
                            <Text style={styles.dateText}>Order completed on 20-12-2024</Text>
                        </View>
                    </View>
                )}

            
                {orderPayment && (
                    <View style={styles.statusBoxPayment}>
                        <Image source={require("../../assets/owner-icons/order-paid.png")} style={styles.statusIcon} />
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
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create ({
    scrollContainer: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    gemScroll: {
        flexDirection: "row",
        padding: 10,
    },

    gemContainer: {
        alignItems: "center",
        marginRight: 10,
    },

    orderDetails: {
        padding: 20
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 14,
    },

    gemId: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000"
    },

    price: {
        fontSize: 18,
        color: "#000",
        fontWeight: "bold"
    },

    ratingSection: {
        alignItems: "center",
    },

    ratingContainer: {
        flexDirection: "row",
    },

    gemImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },

    orderDet: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 14,
        marginLeft: 10,
    },

    orderStatus: {
        marginTop: 20
    },

    statusBoxRequest: {
        backgroundColor: "#426F88",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        marginHorizontal: 40,
    },

    statusBoxAccept: {
        backgroundColor: "#1B5172",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        marginHorizontal: 40,
    },

    statusBoxConfirm: {
        backgroundColor: "#185667",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        marginHorizontal: 40,
    },

    statusBoxComplete: {
        backgroundColor: "#2D5481",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        marginHorizontal: 40,
    },

    statusBoxPayment: {
        backgroundColor: "rgba(51, 137, 207, 0.8)",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        marginHorizontal: 40,
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
        borderRadius: 10,
        width: '80%',
        marginTop: 20,
        alignSelf: "center"
    },

    completeButtonText: {
         color: "white", 
         fontSize: 16, 
         fontWeight: "bold",
         textAlign: "center"
    },

    paidButton: {
        backgroundColor: '#02457A',
        paddingVertical: 14,
        borderRadius: 10,
        width: '80%',
        marginTop: 20,
        alignSelf: "center"
    },
    divider: {
        height: 1,
        backgroundColor: 'black',
        marginVertical: 5,
    }

});

export default WorkerOrderTrackDetails;