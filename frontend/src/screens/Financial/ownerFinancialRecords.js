import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import Header_2 from "../../components/Header_2";
import BS_NavBar from "../../components/BS_NavBar";
import LinearGradient from "react-native-linear-gradient";

const OwnerFinancialRecords = () => {
  return (
      <View style={[baseScreenStylesNew.container]}>
        <Header_2 title="Financial Records" />
        <View style={styles.container}>
          <View style={styles.totalProfitContainer}>
            <Text style={styles.totalProfitTitle}>Total profit</Text>
            <Text style={styles.totalProfitAmount}>LKR. 780 000</Text>
          </View>
          {[ 
            { title: "Buying cost", amount: "LKR. 100 000" },
            { title: "Cutting cost", amount: "LKR. 20 000" },
            { title: "Burning cost", amount: "LKR. 60 000" },
            { title: "Sold price", amount: "LKR. 600 000" }
          ].map((item, index) => (
            <View
              key={index} 
              style={styles.recordList}
            >
              <View style={styles.recordItem}>
                <Text style={styles.recordText}>{item.title}</Text>
                <Text style={styles.recordText}>{item.amount}</Text>
              </View>
            </View>
          ))}
            <View style={[styles.recordItem, styles.lastRecordItem]}>
              <Text style={styles.lastRecordText}>Total</Text>
              <Text style={styles.lastRecordText}>LKR. 780 000</Text>
            </View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  totalProfitContainer: {
    backgroundColor: "#170969",
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    borderRadius: 8,
  },
  totalProfitTitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 5,
  },
  totalProfitAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  recordList: {
    backgroundColor:'rgba(172, 168, 168, 0.21)',
    borderWidth: 2,
    borderColor: 'rgba(85, 84, 84, 0.21)',
    borderRadius: 2,
    marginBottom: 14,
  },
  recordItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  recordText: {
    color: "#000",
    fontSize: 15,
  },
  lastRecordText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "bold"
  },
  lastRecordItem: {
    borderBottomWidth: 0,
    backgroundColor: "rgba(130, 130,130, 0.67)",
    borderWidth: 2,
    borderColor: "#AEA8A8",
  },
});

export default OwnerFinancialRecords;