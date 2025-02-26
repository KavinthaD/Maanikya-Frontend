//Screen creator: Kavintha

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import { baseScreenStyles } from "../styles/baseStyles";
import QRCode from "react-native-qrcode-svg";
import { useRoute } from "@react-navigation/native";

export default function Gem_register_3() {
  const route = useRoute();
  const { gemId, createdAt } = route.params;
  const [gemData] = useState(null);
  const qrRef = useRef();

  const requestPermissions = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need media library permissions to make this work!');
      return false;
    }
    return true;
  };

  const fetchImageUriFromDB = async () => {
    // Replace with your database fetching logic
    const imageUri = await getImageUriFromDatabase();
    return imageUri;
  };


  const downloadImage = async (uri) => {
    try {
      const fileUri = FileSystem.documentDirectory + uri.split('/').pop();
      const { uri: localUri } = await FileSystem.downloadAsync(uri, fileUri);
      return localUri;
    } catch (error) {
      console.error('Error downloading image:', error);
      return null;
    }
  };

  const saveImageToMediaLibrary = async (localUri) => {
    try {
      const asset = await MediaLibrary.createAssetAsync(localUri);
      await MediaLibrary.createAlbumAsync('MyAppImages', asset, false);
      console.log('Image saved to media library!');
    } catch (error) {
      console.error('Error saving image to media library:', error);
    }
  };

  const handleSaveToDevice = async () => {
    const hasPermission = await requestPermissions();
  if (!hasPermission) return;

  const imageUri = await fetchImageUriFromDB();
  if (!imageUri) {
    console.error('No image URI found in the database.');
    return;
  }

  const localUri = await downloadImage(imageUri);
  if (localUri) {
    await saveImageToMediaLibrary(localUri);
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
                ref={qrRef}
              />
            ) : (
              <Image
                source={require("../assets/qr_test.png")}
                style={styles.testQRImage}
              />
            )}
          </View>
        </View>

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
