//Screen Creator : Mehara

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { baseScreenStyles } from "../styles/baseStyles";
import Header_2 from "../components/Header_2";

const BurnerFinancialRecords = () => {
  return (
    <View style={[baseScreenStyles.container]}>
      <Header_2 title="Financial Records"/>
      <View style={styles.container}>
      <View style={styles.totalProfitContainer}>
        <Text style={styles.totalProfitTitle}>Total profit</Text>
        <Text style={styles.totalProfitAmount}>LKR. 780 000</Text>
      </View>

      <View style={styles.recordList}>
        <View style={styles.recordItem}>
          <Text>Burner cs001</Text>
          <Text>LKR. 100 000</Text>
        </View>
      </View>

      <View style={styles.recordList}>
        <View style={styles.recordItem}>
          <Text>Burner cs002</Text>
          <Text>LKR. 20 000</Text>
        </View>
      </View>

      <View style={styles.recordList}>
        <View style={styles.recordItem}>
          <Text>Burner PJ004</Text>
          <Text>LKR. 60 000</Text>
        </View>
      </View>

      <View style={styles.recordList}>
        <View style={styles.recordItem}>
          <Text>Burner IHP006</Text>
          <Text>LKR. 600 000</Text>
        </View>
      </View>

      <View style={styles.recordList}>
        <View style={[styles.recordItem, styles.lastRecordItem]}>
          <Text>Total</Text>
          <Text>LKR. 780 000</Text>
        </View>
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
    backgroundColor: "#000",
    padding: 30,
    marginBottom: 20,
    alignItems: "center", // Center text horizontally
  },
  totalProfitTitle: {
    fontSize: 18,
    color: "#0f0",
  },
  totalProfitAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f0",
  },
  recordList: {
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 10,
  },
  recordItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 60,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  lastRecordItem: {
    borderBottomWidth: 0,
  },
});

export default BurnerFinancialRecords;
