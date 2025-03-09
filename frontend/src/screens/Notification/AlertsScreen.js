import React from "react";
import { View, Text, FlatList, Image, StatusBar, StyleSheet } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { baseScreenStyles } from "../../styles/baseStyles";
import GradientContainer from "../../components/GradientContainer";

// Alert data
const alerts = [
  {
    id: "1",
    name: "Mehara Wilfred",
    action: "Updated Order #:",
    gem: "MN30045",
    image: require("../../assets/seller.png"),
  },
  {
    id: "2",
    name: "Tilmi Premarathna",
    action: "Updated Order #:",
    gem: "MN4567",
    image: require("../../assets/seller.png"),
  },
  {
    id: "3",
    name: "Thulani Kalutuwawa",
    action: "was sent Order #: MN5649",
    suffix: "1 Month ago",
    image: require("../../assets/seller.png"),
  },
  {
    id: "4",
    name: "Kavintha Dinushan",
    action: "is interested in your",
    gem: "YS101 gem",
    image: require("../../assets/seller.png"),
  },
  {
    id: "5",
    name: "Isum Perera",
    action: "Updated Order #:",
    gem: "MN9867",
    image: require("../../assets/seller.png"),
  },
  {
    id: "6",
    name: "Dulith Wanigrathne",
    action: "Updated Order#:",
    gem: "MN6789",
    image: require("../../assets/seller.png"),
  },
];

// Alert-specific styles
const alertStyles = StyleSheet.create({
  alertList: {
    flex: 1,
  },
  alertListContent: {
    padding: 16,
  },
  alertContainer: {
    flexDirection: "row",
    marginVertical: 6,
    borderRadius: 12,
    padding: 12,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "center",
  },
  alertText: {
    fontSize: 14,
    color: "#000",
  },
  boldName: {
    fontWeight: "bold",
    color: "#000",
  },
  boldGem: {
    fontWeight: "bold",
    color: "#000",
  },
});

const AlertsScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <LinearGradient
      colors={['#ACB1B7', '#4C4E51']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={alertStyles.alertContainer}
    >
      <Image source={item.image} style={alertStyles.avatar} />
      <View style={alertStyles.textContainer}>
        <Text style={alertStyles.alertText}>
          <Text style={alertStyles.boldName}>{item.name}</Text>
          <Text> {item.action} </Text>
          <Text style={alertStyles.boldGem}>{item.gem}</Text>
          {item.suffix && <Text> {item.suffix}</Text>}
        </Text>
      </View>
    </LinearGradient>
  );

  return (
    <GradientContainer>
    
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaView style={baseScreenStyles.container}>
        
        
        
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          style={alertStyles.alertList}
          contentContainerStyle={alertStyles.alertListContent}
        />

        
        
      </SafeAreaView>
      </GradientContainer>
  );
};

export default AlertsScreen;
