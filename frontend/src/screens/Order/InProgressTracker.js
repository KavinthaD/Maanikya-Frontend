//Screen creator: Dulith

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity
} from "react-native";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import Header_2 from "../../components/Header_2";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const InProgressTracker = [
  {
    id: "IHP164",
    dateTime: "20-12-2024, 3:00 PM",
    type: "Burn",
    estimatedDate: "22/05/2025",
    person: "Mehara Wilfred",
    price: "Rs. 3000",
    gemImage: require("../../assets/gemimg/gem1.jpg"),
  },
  {
    id: "KDD437",
    dateTime: "12-01-2025, 7:00 PM",
    type: "Cut",
    estimatedDate: "23/02/2025",
    person: "Tilmi Thishara",
    price: "Rs. 6000",
    gemImage: require("../../assets/gemimg/gem2.jpg"),
  },
  {
    id: "DCW030",
    dateTime: "06-11-2024, 9:00 AM",
    type: "Cut",
    estimatedDate: "13/03/2025",
    person: "Kavintha Dinushan",
    price: "Rs. 2000",
    gemImage: require("../../assets/gemimg/gem3.jpg"),
  },
];

const NotificationItem = ({ item }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate("OwnerOrderTrackDetails")}>
    <View style={styles.notificationItem}>
    <View style={styles.textContainer}>
      <Text style={[styles.personName,,{ color: "#000" }]}>{item.person}</Text>
      <Text style={[styles.text,{ color: "#000" }]}> {item.price}</Text>
      <Text style={[styles.text,{ color: "#000" }]}> {item.dateTime}</Text>   
      <View style={styles.miniContainer}>
      <Text style={[styles.text,{ color: "#000", fontWeight: "bold", }]}> {item.type}</Text>
      <Text style={[baseScreenStylesNew.themeText, styles.text,{ fontWeight: "bold" }]}>Estimated Date: {item.estimatedDate}</Text>
      </View>
    </View>
    <View style={styles.imageContainer}>
      <Image source={item.gemImage} style={styles.gemImage} />
      <Text style={[styles.text, { fontWeight: "bold", color: "#000" }]}>{item.id}</Text>
    </View>
  </View>
  </TouchableOpacity>
);
};

const InProgressTrackerScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredOrders = InProgressTracker.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[baseScreenStylesNew.container]}>
      <Header_2 title="In Progress"/>
      <View style={styles.container}>
        <View style={baseScreenStylesNew.search}>
          <Ionicons name="search" style={baseScreenStylesNew.searchIcon} />
          <TextInput
            style={styles.searchData}
            placeholder="Search Order ID"
            placeholderTextColor={baseScreenStylesNew.searchIcon.color}
            value={searchQuery}
            onChangeText={setSearchQuery}/>
        </View>
      <FlatList
        data={filteredOrders}
        renderItem={({ item }) => <NotificationItem item={item} />}
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
  
  textContainer: {
    flex: 1,
  },
  miniContainer: {
    flex: 1,
    marginTop: 9
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
    marginLeft: 9
  },
  text: {
    fontSize: 14,
    marginBottom: 2,
    marginLeft: 6,
  },
  
});

export default InProgressTrackerScreen;
