import React from "react";
import { View, Text, StyleSheet } from "react-native";

const CutterFinancialRecords = () => {
  return (
    <View style={styles.container}>
      <View style={styles.totalProfitContainer}>
        <Text style={styles.totalProfitTitle}>Total profit</Text>
        <Text style={styles.totalProfitAmount}>LKR. 780 000</Text>
      </View>

      <View style={styles.recordList}>
        <View style={styles.recordItem}>
          <Text>Cutter cs001</Text>
          <Text>LKR. 100 000</Text>
        </View>
      </View>

      <View style={styles.recordList}>
        <View style={styles.recordItem}>
          <Text>Cutter cs002</Text>
          <Text>LKR. 20 000</Text>
        </View>
      </View>

      <View style={styles.recordList}>
        <View style={styles.recordItem}>
          <Text>Cutter PJ004</Text>
          <Text>LKR. 60 000</Text>
        </View>
      </View>

      <View style={styles.recordList}>
        <View style={styles.recordItem}>
          <Text>Cutter IHP006</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    backgroundColor: "#9CCDDB",
    flex: 1,
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

export default CutterFinancialRecords;
