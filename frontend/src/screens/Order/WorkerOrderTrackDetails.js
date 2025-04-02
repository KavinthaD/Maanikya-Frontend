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
        <View style={[baseScreenStylesNew.container, baseScreenStylesNew.backgroundColor]}>
            <Header_2 title="Order#: NB01130"/>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={[styles.gemScroll, baseScreenStylesNew.colorGreyLight1]}>
                        {gems.map((gem) => (
                            <View key={gem.id} style={styles.gemContainer}>
                                 <Image source={gem.image} style={styles.gemImage} />
                                        <Text style={[styles.gemId, baseScreenStylesNew.blackText]}>{gem.id}</Text>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.row}>
                        <Text style={[styles.price, baseScreenStylesNew.blackText]}> Rs.7800</Text>
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
                <Text style={[styles.orderDet, baseScreenStylesNew.blackText]}> Order Details </Text>
                <View style={[styles.statusBoxRequest, baseScreenStylesNew.colorBlueTheme5]}>
                    <Image source={require("../../assets/owner-icons/order-request.png")} style={styles.statusIcon}/>
                    <View>
                    <Text style={styles.statusText}>Order Requested </Text>
                    <Text style={styles.dateText}> Order requested on 20-12-2024 </Text>
                    </View>
                </View>
                <View style={[styles.statusBoxAccept, baseScreenStylesNew.colorBlueTheme6]}>
                    <Image source={require("../../assets/owner-icons/order-accept.png")} style={styles.statusIcon}/>
                    <View>
                    <Text style={styles.statusText}>Order Accepted </Text>
                    <Text style={styles.dateText}> Order accepted on 20-12-2024 </Text>
                    </View>
                </View>
                <View style={[styles.statusBoxConfirm, baseScreenStylesNew.colorBlueTheme7]}>
                <Image source={require("../../assets/owner-icons/order-confirm.png")} style={styles.statusIcon}/>
                <View>
                    <Text style={styles.statusText}>Order Confirmed </Text>
                    <Text style={styles.dateText}> Order confirmed on 20-12-2014 </Text>
                </View>
                </View>
                {orderCompleted && (
                    <View style={[styles.statusBoxComplete, baseScreenStylesNew.colorBlueTheme8]}>
                        <Image source={require("../../assets/owner-icons/order-complete.png")} style={styles.statusIcon} />
                        <View>
                            <Text style={styles.statusText}>Order Completed</Text>
                            <Text style={styles.dateText}>Order completed on 20-12-2024</Text>
                        </View>
                    </View>
                )}


                {orderPayment && (
                    <View style={[styles.statusBoxPayment, baseScreenStylesNew.colorBlueTheme9]}>
                        <Image source={require("../../assets/owner-icons/order-paid.png")} style={styles.statusIcon} />
                        <View>
                            <Text style={styles.statusText}>Payment Received</Text>
                            <Text style={styles.dateText}>Received and paid on 20-12-2024</Text>
                        </View>
                    </View>
                )}
            </View>


            {!orderCompleted && (
                <TouchableOpacity style={[styles.completeButton, baseScreenStylesNew.Button1]} onPress={() => setOrderCompleted(true)}>
                    <Text style={[styles.completeButtonText, baseScreenStylesNew.buttonText]}>Mark as Completed</Text>
                </TouchableOpacity>
            )}

            {orderCompleted && !orderPayment && (
                <TouchableOpacity style={[styles.paidButton, baseScreenStylesNew.Button1]} onPress={() => setOrderPayment(true)}>
                    <Text style={[styles.completeButtonText, baseScreenStylesNew.buttonText]}>Confirm Payment and Close the Order</Text>
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
        backgroundColor: 'rgba(172, 168, 168, 0.21)', // Using inline style for gemScroll background
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
        // color: "#000" // Removed, now using base style
    },

    price: {
        fontSize: 18,
        // color: "#000", // Removed, now using base style
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
        // color: "#000", // Removed, now using base style
        marginBottom: 14,
        marginLeft: 10,
    },

    orderStatus: {
        marginTop: 20
    },

    statusBoxRequest: {
        backgroundColor: "#426F88", // Using inline style for statusBoxRequest background
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        marginHorizontal: 40,
    },

    statusBoxAccept: {
        backgroundColor: "#1B5172", // Using inline style for statusBoxAccept background
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        marginHorizontal: 40,
    },

    statusBoxConfirm: {
        backgroundColor: "#185667", // Using inline style for statusBoxConfirm background
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        marginHorizontal: 40,
    },

    statusBoxComplete: {
        backgroundColor: "#2D5481", // Using inline style for statusBoxComplete background
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        marginHorizontal: 40,
    },

    statusBoxPayment: {
        backgroundColor: "rgba(51, 137, 207, 0.8)", // Using inline style for statusBoxPayment background
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
        // backgroundColor: '#02457A', // Removed, now using base style - Button1 handles background
        paddingVertical: 8,
        borderRadius: 10,
        width: '80%',
        marginTop: 20,
        alignSelf: "center"
    },

    completeButtonText: {
         // color: "white", // Removed, now using base style - buttonText handles color
         fontSize: 16,
         fontWeight: "bold",
         textAlign: "center"
    },

    paidButton: {
        // backgroundColor: '#02457A', // Removed, now using base style - Button1 handles background
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