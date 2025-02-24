//Screen creator: Kavintha

import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { baseScreenStyles } from "../styles/baseStyles";

export default function Gem_register_3() {
  return (
    <View style={[baseScreenStyles.container, styles.container]}>
      <View style={styles.innerContainer}>
        {/* QR Code placeholder */}
        <View style={styles.qrContainer}>
          <View style={styles.qrPlaceholder}>
            {/* QR code will be generated here */}
          </View>
        </View>

        {/* ID and Date Container */}
        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>ID - BS001</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Registered date: 10/10/2025</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.buttonText}>Send to mail</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.buttonText}>Save to device</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    padding: 20,
    alignItems: "center",
  },
  qrContainer: {
    marginTop: 20,
    padding: 20,
  },
  qrPlaceholder: {
    width: 250,
    height: 250,
    backgroundColor: "#E8F0FE",
    borderWidth: 1,
    borderColor: "#072D44",
    borderRadius: 10,
  },
  infoContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  infoBox: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    minWidth: 150,
    alignItems: "center",
  },
  infoText: {
    color: "#072D44",
    fontSize: 16,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 30,
    gap: 10,
  },
  sendButton: {
    backgroundColor: "#02457A",
    padding: 15,
    borderRadius: 5,
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#170969",
    padding: 15,
    borderRadius: 5,
    width: "100%",
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
