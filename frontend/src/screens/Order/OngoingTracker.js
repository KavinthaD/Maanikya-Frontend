//Screen creator: Dulith

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";
import { baseScreenStyles } from "../../styles/baseStyles";
import Header_2 from "../../components/Header_2";
import GradientContainer from "../../components/GradientContainer";

const OngoingTracker = [
  {
    id: "OHP164",
    dateTime: "20-12-2024, 3:00 PM",
    type: "Burn",
    estimatedDate: "22/05/2025",
    person: "Mehara",
    price: "Rs. 3000",
    gemImage: require("../../assets/gemimg/gem1.jpg"),
  },
  {
    id: "KDD437",
    dateTime: "12-01-2025, 7:00 PM",
    type: "Cut",
    estimatedDate: "23/02/2025",
    person: "Tilmi",
    price: "Rs. 2500",
    gemImage: require("../../assets/gemimg/gem2.jpg"),
  },
  {
    id: "DCW030",
    dateTime: "06-11-2024, 9:00 AM",
    type: "Cut",
    estimatedDate: "13/03/2025",
    person: "Kavintha",
    price: "Rs. 5000",
    gemImage: require("../../assets/gemimg/gem3.jpg"),
  },
];

const NotificationItem = ({ item }) => (
  <View style={styles.notificationItem}>
    <View style={styles.textContainer}>
      <Text style={[styles.text, { fontWeight: "bold", color: "#fff" }]}>{item.id}</Text>
      <Text style={[styles.text,{ color: "#fff" }]}> {item.dateTime}</Text>
      <Text style={[styles.text,{ color: "#fff" }]}> {item.price}</Text>
      <Text style={[styles.text,{ color: "#fff", fontWeight: "bold", }]}> {item.type}</Text>
     <Text style={[styles.text, { color: "#00D4FF" }]}>
        stimated  Date: {item.estimatedDate}
      </Text>
    </View>
    <View style={styles.imageContainer}>
      <Image source={item.gemImage} style={styles.gemImage} />
      <Text style={[styles.personName,{ color: "#fff" }]}>{item.person}</Text>
    </View>
  </View>
);

const OngoingTrackerScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredOrders = OngoingTracker.filter((order) =>
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <GradientContainer>
    <View style={[baseScreenStyles.container]}>
      <Header_2 title="On-going Orders"/>
      <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Order ID"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredOrders}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
    </View>
    </GradientContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    backgroundColor: "#red",
    padding: 16,
    alignItems: "center",
    width: "100%", // Extend header width
    marginBottom: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: "95%", // Slightly reduce search bar width
    alignSelf: "center",
  },
  notificationItem: {
    flexDirection: "row",
    backgroundColor: 'rgba(123, 150, 172, 0.4)',
    padding: 5,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
    width: "100%", // Slightly reduce notification item width
    alignSelf: "center",
    
  },
  textContainer: {
    flex: 1,
   
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  gemImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
    borderRadius: 12,
  },
  personName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  text: {
    fontSize: 14,
    marginBottom: 5,
  },
});

export default OngoingTrackerScreen;
