//Screen creator: Thulani

import React, {useState} from "react";
import {View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, FlatList} from "react-native";
import {FontAwesome} from "@expo/vector-icons";
import Header_2 from "../components/Header_2";
import { SafeAreaView } from "react-native-safe-area-context";

const gems = [
    { id: "BE002", image: require("../assets/gem-images/gem1.jpeg")},
    { id: "BS079", image: require("../assets/gem-images/gem1.jpeg")},
    { id: "RS305", image: require("../assets/gem-images/gem1.jpeg")},
    { id: "BS001", image: require("../assets/gem-images/gem1.jpeg")},
    { id: "BS002", image: require("../assets/gem-images/gem1.jpeg")},
    { id: "BS005", image: require("../assets/gem-images/gem1.jpeg")},
]
const OwnerOrderTrackDetails = () => {
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [orderCanceled, setOrderCanceled]= useState(false);
    const [rating, setRating] = useState(0);

    return (
        <SafeAreaView style={styles.container}>
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
                        <FontAwesome name="star" size={24} color={star <= rating ? "#334D85" : "white"} />
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
                    <Text style={styles.dateText}> Order accepted on 20-12-2014 </Text>
                </View>
            </View>

                {orderConfirmed && (
                    <View style={styles.statusBoxConfirm}>
                        <Image source={require("../assets/owner-icons/order-confirm.png")} style={styles.statusIcon} />
                        <View>
                            <Text style={styles.statusText}>Order Confirmed</Text>
                            <Text style={styles.dateText}>Order confirmed on 20-12-2024</Text>
                        </View>
                    </View>
                )}

                {orderCanceled && (
                    <View style={styles.statusBoxCancel}>
                        <Image source={require("../assets/owner-icons/order-decline.png")} style={styles.statusIcon} />
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
                        style={styles.confirmButton}
                        onPress={() => {
                            setOrderConfirmed(true);
                            setOrderCanceled(false); // Ensure only one status is shown
                        }}
                    >
                        <Text style={styles.confirmButtonText}>Confirm Order</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => {
                            setOrderCanceled(true);
                            setOrderConfirmed(false); // Ensure only one status is shown
                        }}
                    >
                        <Text style={styles.cancelButtonText}>Cancel Order</Text>
                    </TouchableOpacity>
                </View>
            )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create ({
    container: {
        flex: 1,
        backgroundColor: "#9CCDDB",
    },
    scrollContainer: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    orderNumber: {
        color: "white",
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
        paddingHorizontal: 15
    },
    gemId: {
        fontSize: 18,
        fontWeight: "bold",
    },

    price: {
        fontSize: 18,
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
        color: "#444",
        marginBottom: 15,
    },

    orderStatus: {
        marginTop: 20,
        paddingHorizontal: 10,
    },

    statusBoxRequest: {
        backgroundColor: "#A4AAFA",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },

    statusBoxAccept: {
        backgroundColor: "#7F87FD",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        
    },
    statusBoxConfirm: {
        backgroundColor: "#5661FF",
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },

    statusBoxCancel: {
        backgroundColor: "#4A0304",
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
        backgroundColor: "#02457A",
        paddingVertical: 10,
        borderRadius: 20,
        width: "60%",
        marginTop: "35%",
        marginLeft: 65,
    },

    confirmButtonText: {
         color: "white", 
         fontSize: 16, 
         fontWeight: "bold",
         textAlign: "center"
    },

    cancelButton: {
        backgroundColor: "#690909",
        paddingVertical: 10,
        borderRadius: 20,
        width: "60%",
        marginLeft: "18%",
        marginTop: "5%",
    },

    cancelButtonText: {
        color: "white", 
        fontSize: 16, 
        fontWeight: "bold",
        textAlign: "center"
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