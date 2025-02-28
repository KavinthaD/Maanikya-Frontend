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
  Share,
  Platform,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { baseScreenStyles } from "../styles/baseStyles";
import QRCode from "react-native-qrcode-svg";
import { useNavigation, useRoute } from '@react-navigation/native';
import ViewShot from "react-native-view-shot"; // Add this import

import { BackHandler } from 'react-native';  // Add this to your imports

export default function Gem_register_3() {

  const navigation = useNavigation();
  const route = useRoute();
  const { gemId, createdAt } = route.params;
  const [gemData] = useState(null);
  const qrContainerRef = useRef(); // Change qrRef to qrContainerRef

// Disable back navigation
useEffect(() => {

  // Disable hardware back button
  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    () => true  // Return true to prevent default behavior
  );

  // Cleanup on unmount
  return () => backHandler.remove();
}, [navigation]);


  const handleSaveToDevice = async () => {
    try {
      // Request permission

      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: "Gallery permission",
            message:
              "Maanikya needs permission to save QR codes to your gallery",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the camera");
        } else {
          console.log("Camera permission denied");
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

  const handleShare = async () => {
    try {
      // 1. Generate QR code and capture it
      const uri = await qrContainerRef.current.capture();

      // 2. Create a temporary file path
      const shareableUri = `${FileSystem.cacheDirectory}temp_qr.png`;

      // 3. Copy the captured image to the shareable location
      await FileSystem.copyAsync({
        from: uri,
        to: shareableUri,
      });

      // 4. Share the image
      const result = await Share.share({
        message: "Check out this QR code from Maanikya",
        title: "Maanikya Gem QR Code",
        url: Platform.OS === "ios" ? shareableUri : `file://${shareableUri}`,
      });

      // 5. Clean up
      await FileSystem.deleteAsync(shareableUri, { idempotent: true });
      if (uri !== shareableUri) {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      }
    } catch (error) {
      console.error("Share error:", error);
      Alert.alert("Error", "Failed to share QR code");
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
            result: "tmpfile",
            width: 250,
            height: 250,
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

        <TouchableOpacity style={styles.sendButton} onPress={handleShare}>
          <Text style={baseScreenStyles.buttonText}>Share QR code</Text>
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
    marginTop: 50,
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
