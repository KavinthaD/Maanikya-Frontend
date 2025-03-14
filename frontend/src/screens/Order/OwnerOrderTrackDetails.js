//Screen creator: Thulani

import React, {useState} from "react";
import {View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import Header_2 from "../../components/Header_2";
import { SafeAreaView } from "react-native-safe-area-context";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";

const OwnerOrderTrackDetails = () => {
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [orderCanceled, setOrderCanceled]= useState(false);
    const [rating, setRating] = useState(0);
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
        <Header_2 title=" Order#: NB01130"/>
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
            {orderConfirmed && (
            <View style={styles.ratingSection}>
                <View style={styles.ratingContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                        <FontAwesome name="star" size={24} color={star <= rating ? "#70B5DF" : "70B5DF"} />
                    </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
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
                    <Text style={styles.dateText}> Order accepted on 20-12-2014 </Text>
                </View>
            </View>

                {orderConfirmed && (
                    <View style={styles.statusBoxConfirm}>
                        <Image source={require("../../assets/owner-icons/order-confirm.png")} style={styles.statusIcon} />
                        <View>
                            <Text style={styles.statusText}>Order Confirmed</Text>
                            <Text style={styles.dateText}>Order confirmed on 20-12-2024</Text>
                        </View>
                    </View>
                )}

                {orderCanceled && (
                    <View style={styles.statusBoxCancel}>
                        <Image source={require("../../assets/owner-icons/order-decline.png")} style={styles.statusIcon} />
                        <View>
                            <Text style={styles.statusText}>Order Canceled</Text>
                            <Text style={styles.dateText}>Order canceled on 20-12-2024</Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Hide buttons after one is clicked */}
            {!orderConfirmed && !orderCanceled && (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[baseScreenStylesNew.Button1, styles.confirmButton]}
                        onPress={() => {
                            setOrderConfirmed(true);
                            setOrderCanceled(false); // Ensure only one status is shown
                        }}
                    >
                        <Text style={baseScreenStylesNew.buttonText}>Confirm Order</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => {
                            setOrderCanceled(true);
                            setOrderConfirmed(false); // Ensure only one status is shown
                        }}
                    >
                        <Text style={baseScreenStylesNew.buttonText}>Cancel Order</Text>
                    </TouchableOpacity>
                </View>
            )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create ({
    scrollContainer: {
        paddingHorizontal: 10,
    },
    orderNumber: {
        color: "black",
        fontSize: 18,
        fontWeight: "bold"
    },
    gemScroll: {
        flexDirection: "row",
        padding: 10,
    },
    gemContainer: {
        alignItems: "center",
        marginRight: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 13
    },
    gemId: {
        fontSize: 18,
        color: "black",
        fontWeight: "bold",
    },

    price: {
        fontSize: 18,
        color: "black",
        fontWeight: "bold",
    },
    ratingContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 5,
    },

    gemImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },

    orderDet: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#black",
        marginBottom: 15,
    },

    orderStatus: {
        marginTop: 20,
        paddingHorizontal: 10,
    },

    statusBoxRequest: {
        backgroundColor: "#426F88",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },

    statusBoxAccept: {
        backgroundColor: "#1B5172",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        
    },
    statusBoxCancel: {
        backgroundColor: "#620202",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,        
    },
    statusBoxConfirm: {
        backgroundColor: "#185667",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,        
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

    confirmButton: {
        backgroundColor: "#170969",
        borderRadius: 25,
        width: "90%",
        marginTop: "35%",
        marginLeft: 25,
    },
    cancelButton: {
        backgroundColor: "#690909",
        borderRadius: 25,
        width: "90%",
        marginTop: "5%",
        padding: 15,
        marginLeft: 25,
    },

    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: 'black',
    }

});

export default OwnerOrderTrackDetails;