//Screen creator: Kavintha

import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  PermissionsAndroid,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { baseScreenStyles } from "../styles/baseStyles";
import QRCode from "react-native-qrcode-svg";
import { useRoute } from "@react-navigation/native";
import ViewShot from "react-native-view-shot"; // Add this import

export default function Gem_register_3() {
  const route = useRoute();
  const { gemId, createdAt } = route.params;
  const [gemData] = useState(null);
  const qrContainerRef = useRef(); // Change qrRef to qrContainerRef

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need media library permissions to make this work!");
      return false;
    }
    return true;
  };


  const handleSaveToDevice = async () => {
    
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Loading...";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // This will return YYYY-MM-DD format
  };

  return (
    <View style={[baseScreenStyles.container, styles.container]}>
      <View style={styles.innerContainer}>
        <View>
          <Text style={baseScreenStyles.helperText}>
            Gem Registered Successfully! Qr code is generated below
          </Text>
        </View>
        {/* Wrap QR container with ViewShot */}
        <ViewShot
          ref={qrContainerRef}
          options={{
            format: "png",
            quality: 0.9,
          }}
        >
          <View style={styles.qrContainer}>
            <View style={styles.qrPlaceholder}>
              {gemData ? (
                <QRCode
                  value={JSON.stringify({
                    gemId: gemData.gemId,
                    ownerName: gemData.ownerName,
                    gemType: gemData.gemType,
                    registeredDate: formatDate(gemData.createdAt),
                  })}
                  size={230}
                />
              ) : (
                <Image
                  source={require("../assets/qr_test.png")}
                  style={styles.testQRImage}
                />
              )}
            </View>
          </View>
        </ViewShot>

        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>ID - {gemId || "Loading..."}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Registered date: {formatDate(createdAt)}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.sendButton}>
          <Text style={baseScreenStyles.buttonText}>Send to mail</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={baseScreenStyles.blueButton}
          onPress={requestStoragePermission}
        >
          <Text style={baseScreenStyles.buttonText}>Save to device</Text>
        </TouchableOpacity>
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
    marginTop: 10,
    backgroundColor: "#02457A",
    width: "95%",
    padding: 15,
    borderRadius: 10,
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  testQRImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});
