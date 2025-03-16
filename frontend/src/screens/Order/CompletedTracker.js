//Screen creator: Dulith

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import Header_2 from "../../components/Header_2";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { API_URL, ENDPOINTS } from "../../config/api"; // **Routes are imported from api.js**
import AsyncStorage from '@react-native-async-storage/async-storage';

const CompletedTrackerItem = ({ item}) => {
  const navigation = useNavigation();

  return(
  <TouchableOpacity onPress={() => navigation.navigate("OwnerOrderTrackDetails")}>
  <View style={styles.notificationItem}>
    <View style={styles.textContainer}>
    <Text style={styles.personName}>{item.person}</Text>
      <Text style={styles.text}>{item.dateTime}</Text>
      <Text style={styles.text}>{item.cost}</Text>
      <View style={styles.miniContainer}>
      <Text style={[styles.text,{fontWeight: "bold", }]}>{item.type}</Text>
      <Text style={[styles.text,baseScreenStylesNew.themeText, {fontWeight: "bold" }]}>Completed Date: {item.completedDate}</Text>
      </View>
    </View>
    <View style={styles.imageContainer}>
      <Image source={{ uri: item.gemImage }} style={styles.gemImage} />
      <Text style={styles.text}>{item.id}</Text>
    </View>
  </View>
  </TouchableOpacity>
);
};

const NotificationScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [completedOrders, setCompletedOrders] = useState([]);

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const response = await fetch(`${API_URL}${ENDPOINTS.OWNER_COMPLETED_ORDERS}`, { // **Route from ENDPOINTS**
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCompletedOrders(data);
      } catch (error) {
        console.error("Error fetching completed orders:", error);
      }
    };

    fetchCompletedOrders();
  }, []);

  const filteredOrders = completedOrders.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={baseScreenStylesNew.container}>
      <Header_2 title="Completed "/>
      <View style={styles.container}>
      <View style={baseScreenStylesNew.search}>
       <Ionicons name="search" size={20} color="#888" style={baseScreenStylesNew.searchIcon} />
      <TextInput
        style={styles.searchData}
        placeholder="Search Order ID"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      </View>
      <FlatList
        data={filteredOrders}
        renderItem={({ item }) => <CompletedTrackerItem item={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  searchData: {
    flex: 1,
    fontSize: 16
  },
  notificationItem: {
    marginTop: 8,
    flexDirection: "row",
    padding: 5,
    backgroundColor: "rgb(255, 255, 255)",
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "rgba(228, 227, 227, 0.61)",
    width: "100%",
    alignSelf: "center",
    elevation: 9
  },
  miniContainer: {
    flex: 1,
    marginTop: 9
  },
  textContainer: {
    flex: 1,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  gemImage: {
    width: 90,
    height: 90,
    marginTop: 8,
    marginBottom: 6,
    marginRight: 5,
    borderRadius: 12,
    elevation: 9
  },
  personName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    marginLeft: 6
  },
  text: {
    fontSize: 14,
    marginBottom: 2,
    color: "black",
    marginLeft: 6,
  },
});

export default NotificationScreen;