import React, { useState } from "react";
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const GemOnDisplay = () => {

    const navigation = useNavigation();

    const [onDisplay, setonDisplay] = useState([
        { id: "G001", image: require("../assets/logo.png"), sold: false  },
        { id: "G002", image: require("../assets/logo.png"), sold: false  },
    ]);

    const [onSold, setonSold] = useState([
        { id: "G003", image: require("../assets/logo.png"), buyer: "Kamal", price: "60000"  },
        { id: "G004", image: require("../assets/logo.png"), buyer: "Amal", price: "20000"  },
    ]);

    const soldGem = (id) => {
        Alert.alert("Confirm","Want to make this gem as sold?",[
            {text: "Cancel", style: "cancel"},
            {
                text: "Yes",
                onPress: () =>{
                    const soldGem = onDisplay.find((gem) => gem.id ==id);
                    setonSold([...soldGem, {...soldGem, buyer: "Unknown" , price: "0"}]);
                    setonDisplay(onDisplay.filter((gem) => gem.id !==id));
                },
            },
        ]);
    };

    

    return (
        <View style={styles.container}>
            <View style={styles.topic}>
                <Text style={styles.topicName}>Gem On Display</Text>
            </View>
            
            <TouchableOpacity style={styles.addButton} onPress= {() => naviagation.navigate("AddGem")}>
                <Ionicons name="add-circle" size={40} color="#007AFF" />
            </TouchableOpacity>
            
            <Text style={styles.subTopic}>On Display </Text>
            <FlatList
                data={onDisplay}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <View style={styles.displayList}>
                        <Image source={item.image} style={styles.gemImage}/>
                        <Text style={styles.gemCode}>#{item.id}</Text>

                        <TouchableOpacity style={styles.soldButton} onPress={() => soldGem(item.id)}>
                            <Text style={styles.soldButtonText}> Mark as sold</Text>
                        </TouchableOpacity>
                    </View>
                )}
              
            />

            <Text style={styles.subTopic}>Sold Out </Text>
            <FlatList
                data={onSold}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <View style={styles.soldList}>
                        <Image source={item.image} style={styles.gemImage} />
                        <Text style={styles.gemCode}>#{item.id}</Text>
                        <Text style={styles.buyerName}>{item.buyer}</Text>
                        <Text style={price}>LKR {item.price}</Text>
                    </View>
                
                )}

            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#a9c9d3",
        padding: 15,
    },
    topic:{
        width: "100%",
        backgroundColor: "#082f4f",
        padding:15,
        alignItems: "center",
        position: "absolute",
        top: 0,
    },
    topicName:{
      color:"#fff",
      fontSize: 18,
      fontWeight: "bold",  
    },
    addButton:{
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "center",
    },
    subTopic: {
        fontSize: 18, 
        fontWeight: "bold" , 
        marginTop:10, 
        marginBottom: 5,
    },
    gemImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10,
    },
    gemCode: {
        flex: 1,
        fontSize: 16,
    },
    soldButton: {
        backgroundColor: "083b80",
        padding: 5,
        borderRadius: 5,
    },
    soldButtonText: {
        color: "#fff",
        fontSize: 14,
    },
    displayList: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#c7dffd",
        padding: 10,
        borderRadius: 10,
        marginBottom: 5,
    },
    soldGem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#b5c9f3",
        padding: 10,
        borderRadius: 10,   
        marginBottom: 5,
    },
    buyerName: {
        flex: 1,
        fontSize: 16
    },
    price: {
        fontSize: 16,
        fontWeight: "bold"
    },
    
});

export default GemOnDisplay;
