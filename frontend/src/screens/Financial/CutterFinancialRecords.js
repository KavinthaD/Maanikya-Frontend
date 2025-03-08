import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { baseScreenStyles } from "../../styles/baseStyles";
import Header_2 from "../../components/Header_2";
import GradientContainer from "../../components/GradientContainer";
import LinearGradient from "react-native-linear-gradient";

const OwnerFinancialRecords = () => {
  return (
    <GradientContainer>
      <View style={[baseScreenStyles.container]}>
        <Header_2 title="Financial Records" />
        <View style={styles.container}>
          <View style={styles.totalProfitContainer}>
            <Text style={styles.totalProfitTitle}>Total profit</Text>
            <Text style={styles.totalProfitAmount}>LKR. 780 000</Text>
          </View>

          {[ 
            { title: "Cutting CS001", amount: "LKR. 100 000" },
            { title: "Cutting CS002 ", amount: "LKR. 20 000" },
            { title: "Cutting CS003", amount: "LKR. 60 000" },
            { title: "Cutting CS004", amount: "LKR. 600 000" }
          ].map((item, index) => (
            <LinearGradient 
              key={index} 
              colors={["#7B96AC", "#323D46"]} 
              start={{x: 0, y: 0}} 
              end={{x: 0, y: 1}} 
              style={styles.recordList}
            >
              <View style={styles.recordItem}>
                <Text style={styles.recordText}>{item.title}</Text>
                <Text style={styles.recordText}>{item.amount}</Text>
              </View>
            </LinearGradient>
          ))}

          <LinearGradient 
            colors={["#7B96AC", "#323D46"]} 
            start={{x: 0, y: 0}} 
            end={{x: 0, y: 1}} 
            style={styles.recordList}
          >
            <View style={[styles.recordItem, styles.lastRecordItem]}>
              <Text style={styles.recordText}>Total</Text>
              <Text style={styles.recordText}>LKR. 780 000</Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    </GradientContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  totalProfitContainer: {
    backgroundColor: "#072D44",
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    borderRadius: 8,
  },
  totalProfitTitle: {
    fontSize: 16,
    color: "#00FF00",
    marginBottom: 5,
  },
  totalProfitAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00FF00",
  },
  recordList: {
    borderRadius: 8,
    marginBottom: 10,
  },
  recordItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  recordText: {
    color: "#fff",
    fontSize: 15,
  },
  lastRecordItem: {
    borderBottomWidth: 0,
  },
});

export default CutterFinancialRecords;