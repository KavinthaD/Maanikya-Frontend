//Screen creator: Dulith

import React, { useState } from "react";
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

const CompletedTracker = [
  {
    id: "TPK476",
    dateTime: "20-12-2024, 3:00 PM",
    cost: "Rs.2500",
    type: "Burn",
    completedDate: "22/05/2025",
    person: "Mehara Wilfred",
    gemImage: require("../../assets/gemimg/gem1.jpg"),
  },
  {
    id: "MW963",
    dateTime: "12-01-2025, 7:00 PM",
    cost: "Rs.1800",
    type: "Burn",
    completedDate: "23/02/2025",
    person: "Tilmi Thishara",
    gemImage: require("../../assets/gemimg/gem2.jpg"),
  },
  {
    id: "DCW030",
    dateTime: "06-11-2024, 9:00 AM",
    cost: "Rs.12000",
    type: "Cut",
    completedDate: "13/03/2025",
    person: "Kavintha Dinushan",
    gemImage: require("../../assets/gemimg/gem3.jpg"),
  },
  {
    id: "TGK476",
    dateTime: "20-12-2024, 3:00 PM",
    cost: "Rs.2500",
    type: "Cut",
    completedDate: "22/05/2025",
    person: "Dulith Wanigarathna",
    gemImage: require("../../assets/gemimg/gem4.jpg"),
  },
];

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
      <Image source={item.gemImage} style={styles.gemImage} />
      <Text style={styles.text}>{item.id}</Text>
    </View>
  </View>
  </TouchableOpacity>
);
};

const NotificationScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const filteredOrders = CompletedTracker.filter((order) =>
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
