//Screen creator: Kavintha

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  PermissionsAndroid,
  Linking,
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
  const [hasPermission, setHasPermission] = useState(null);

  const handleSaveToDevice = async () => {
    try {
      // Request permission

      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Gallery permission',
            message:
              'Maanikya needs permission to save QR codes to your gallery',
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

      // Capture the QR code container
      const uri = await qrContainerRef.current.capture();

      // Save to media library
      const asset = await MediaLibrary.createAssetAsync(uri);

      // Create album if it doesn't exist and save there
      const album = await MediaLibrary.getAlbumAsync("Maanikya-QRcodes");
      if (album === null) {
        await MediaLibrary.createAlbumAsync("Maanikya-QRcodes", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      Alert.alert(
        "Success",
        "QR Code saved to gallery in Maanikya-QRcodes album"
      );
    } catch (error) {
      console.error("Error saving QR code:", error);
      Alert.alert("Error", "Failed to save QR code");
    }
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
          onPress={handleSaveToDevice}
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
