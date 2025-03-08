import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Modal, Linking, FlatList, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {Ionicons} from "@expo/vector-icons"
import Header_2 from "../components/Header_2";
import { baseScreenStyles } from "../styles/baseStyles";
import LinearGradient from "react-native-linear-gradient";
import { TouchableWithoutFeedback } from "react-native";

const SellerProfile = () => {
    const navigation = useNavigation();
    const [isPhoneModalVisible, setPhoneModalVisible] = useState(false);
    const [isMailModalVisible, setMailModalVisible] = useState(false);
    const seller = {
        name: "Sunil Gamalath",
        title: "Gamage Gems",
        address: "Nivitigala, Ratnapura",
        phone: "071 796 6856",
        email: "gamagegems@mail.com",
        gems: [
            { id: "BS001", image: require("../assets/Gem1.png") },
            { id: "EM001", image: require("../assets/Gem2.png") },
            { id: "RR001", image: require("../assets/Gem3.png") },
            { id: "YS001", image: require("../assets/Gem4.png") },
            { id: "BS002", image: require("../assets/Gem5.png") },
            { id: "PS001", image: require("../assets/Gem6.png") },
            { id: "BS002", image: require("../assets/Gem1.png") },
            { id: "EM002", image: require("../assets/Gem2.png") },
            { id: "RR002", image: require("../assets/Gem3.png") },
            { id: "YS002", image: require("../assets/Gem4.png") },
            { id: "BS004", image: require("../assets/Gem5.png") },
            { id: "PS003", image: require("../assets/Gem6.png") },
        ],
    };

    return (
        <View style={baseScreenStyles.container}>
            <Header_2 title="My Sellers"/>
            <LinearGradient
                colors={baseScreenStyles.backgroundGradient.colors}
                locations={baseScreenStyles.backgroundGradient.locations}
                start={baseScreenStyles.backgroundGradient.start}
                end={baseScreenStyles.backgroundGradient.end}
                style={{ flex: 1 }}>
            <View style={styles.profileSection}>
                <Image source={require("../assets/seller.png")} style={styles.profileImage} />
                <Text style={styles.name}>{seller.name}</Text>
                <Text style={styles.title}>{seller.title}</Text>
                <View style={styles.addressContainer}>
                    <Ionicons name="location-sharp" size={15} color="white" />
                    <Text style={styles.address}>{seller.address}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => setPhoneModalVisible(true)}>
                        <View style={styles.buttonContent}>
                            <Ionicons name="call" size={16} color="white" />
                            <Text style={styles.buttonText}>Contact</Text>
                            </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => setMailModalVisible(true)}>
                        <View style={styles.buttonContent}>
                            <Ionicons name="mail" size={16} color="white" />
                            <Text style={styles.buttonText}>Mail</Text>
                            </View>
                    </TouchableOpacity>
            </View>
        </View>
            <View style={styles.dividerContainer}>
                      <View style={styles.divider} />
                      <Text style={styles.divText}>Gems On Display</Text>
                      <View style={styles.divider} />
                    </View>
            <FlatList
                data={seller.gems}
                keyExtractor={(item) => item.id}
                numColumns={3}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate("MyGems", { gem: item })}>
                        <Image source={item.image} style={styles.gemImage} />
                        <Text style={styles.gemLabel}>{item.id}</Text>
                    </TouchableOpacity>
                )}
            />
           
            <Modal visible={isPhoneModalVisible} transparent animationType="slide">
                <TouchableWithoutFeedback onPress={() => setPhoneModalVisible(false)}>
                <View style={styles.bottomModalContainer}>
                    <View style={styles.modalContent}>
                    <TouchableOpacity 
                    style={styles.lightBlueButton} 
                    onPress={() => { setPhoneModalVisible(false);
                        Linking.openURL(`tel:${seller.phone}`); }}>
                            <Text style={styles.modalText}>{seller.phone}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </TouchableWithoutFeedback>
            </Modal>

            <Modal visible={isMailModalVisible} transparent animationType="slide">
                <TouchableWithoutFeedback onPress={() => setMailModalVisible(false)}> 
                    <View style={styles.bottomModalContainer}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity 
                                style={styles.lightBlueButton} 
                                onPress={() => {
                                    setMailModalVisible(false);
                                    Linking.openURL(`mailto:${seller.email}`);
                                }}
                            >
                                <Text style={styles.modalText}>{seller.email}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#0C2D48",
        padding: 20 
    },
    profileSection: { 
        alignItems: "center" 
    },
    profileImage: { 
        width: 100, 
        height: 100, 
        borderRadius: 60, 
        marginBottom: 10,
        marginTop: 10, 
    },
    name: { 
        fontSize: 19, 
        fontWeight: "bold", 
        color: "white" 
    },
    title: { 
        fontSize: 16, 
        color: "white" 
    },
    addressContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    address: { 
        fontSize: 15, 
        color: "white",
        marginLeft: 5, 
        marginTop: 13,
        marginBottom: 10 
    },
    icon: {
        marginRight: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.3)', 
        textShadowOffset: { width: 3, height: 4 },
        textShadowRadius: 2,
    },
    buttonContainer: {
        marginTop: 8, 
        flexDirection: "row", 
        gap: 50 
    },
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 20,
    },
    divider: {
        flex: 1,
        height: 2,
        marginLeft: 8,
        marginRight: 8,
        backgroundColor: "#ffffff",
    },
    divText: {
        color: "#fff",
    },
    button: { 
        backgroundColor: " rgba(7, 45, 68, 0.73);", 
        padding: 10,
        borderRadius: 31,
        width: 124,
        height: 41,
        alignItems: "center",
        shadowColor: "rgba(0, 0, 0, 0.8)",
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
        overflow: "hidden"
    },
    buttonText: { 
        color: "white",
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.3)', 
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8, 
    },
    
    sectionTitle: { 
        color: "white", 
        fontSize: 16, 
        fontWeight: "bold", 
        marginVertical: 10 },
    gemImage: { 
        width: 100, 
        height: 100, 
        borderRadius: 10, 
        margin: 10, 
        marginLeft: 24,
        marginTop: 20,
    },
    gemLabel: { 
        color: "white", 
        marginLeft: 55,
        marginTop: -5, 
    },
    bottomModalContainer: {
        flex: 1,
        justifyContent: "flex-end", // Moves it to the bottom
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)", // Transparent background
    },
    modalContent: {
        width: "100%",
        backgroundColor: "#062A4D", // Dark blue container
        paddingVertical: 20,
        alignItems: "center",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    lightBlueButton: {
        backgroundColor: "#170969", // Light blue button
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
    },
    modalText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    
});

export default SellerProfile;
