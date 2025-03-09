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
  Platform,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { baseScreenStyles } from "../../styles/baseStyles";
import QRCode from "react-native-qrcode-svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import ViewShot from "react-native-view-shot";
import { BackHandler } from "react-native";
import GradientContainer from "../../components/GradientContainer";
import Header_1 from "../../components/Header_1";

export default function Gem_register_3() {
  const navigation = useNavigation();
  const route = useRoute();
  const { gemId, createdAt, qrCode } = route.params;
  const [gemData] = useState(null);
  const qrContainerRef = useRef();

  // Disable back navigation
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, [navigation]);

  const handleSaveToDevice = async () => {
    try {
      // Request permission
      if (Platform.OS === "android") {
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
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Permission denied");
            Alert.alert(
              "Permission Denied",
              "Cannot save QR code without permission"
            );
            return;
          }
        } catch (err) {
          console.warn(err);
          return;
        }
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
      // First check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        Alert.alert(
          "Sharing not available",
          "Sharing is not available on this device"
        );
        return;
      }

      // Capture the QR code
      const uri = await qrContainerRef.current.capture();
      console.log("Captured QR code at:", uri);

      // Create a temporary file with a proper extension
      const tempFile = `${FileSystem.cacheDirectory}qrcode_${gemId}.png`;

      // Copy the captured image to the temporary file
      await FileSystem.copyAsync({
        from: uri,
        to: tempFile,
      });

      console.log("Copied to:", tempFile);

      // Share the file using expo-sharing
      await Sharing.shareAsync(tempFile, {
        mimeType: "image/png",
        dialogTitle: "Share QR Code",
        UTI: "public.png", // For iOS
      });

      // Clean up the temporary file after sharing
      try {
        await FileSystem.deleteAsync(tempFile, { idempotent: true });
        await FileSystem.deleteAsync(uri, { idempotent: true });
      } catch (cleanupError) {
        console.log("Cleanup error (non-critical):", cleanupError);
      }
    } catch (error) {
      console.error("Share error:", error);

      // Fallback to save & manual share if sharing fails
      Alert.alert(
        "Sharing Error",
        "Could not share the QR code directly. Would you like to save it to your gallery?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Save to Gallery",
            onPress: handleSaveToDevice,
          },
        ]
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Loading...";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // This will return YYYY-MM-DD format
  };
  const handleHome = async () => {
    navigation.navigate("BS_NavBar", { screen: "Home" });
  };
  

  return (
    <GradientContainer>
      <Header_1 title="Add gem succes" />
    <View style={baseScreenStyles.container}>
      <View style={styles.innerContainer}>
        <ViewShot
          ref={qrContainerRef}
          options={{
            format: "png",
            quality: 1.0,
            result: "tmpfile",
            width: 1000,
            height: 1000,
          }}
        >
          <View style={styles.qrContainer}>
            <View style={styles.qrPlaceholder}>
              {qrCode ? (
                <Image
                  source={{ uri: qrCode }}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={require("../../assets/qr_test.png")}
                  style={styles.testQRImage}
                />
              )}
            </View>
          </View>
        </ViewShot>
        <View>
          <Text style={baseScreenStyles.helperText}>
            Gem Registered Successfully! Qr code is generated
          </Text>
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
        <View style={styles.buttonContainer}>
        <TouchableOpacity style={baseScreenStyles.Button3} onPress={handleHome}>
          <Text style={baseScreenStyles.buttonText}>Go Back Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={baseScreenStyles.Button2} onPress={handleShare}>
          <Text style={baseScreenStyles.buttonText}>Share QR code</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[baseScreenStyles.Button1, styles.blueButton]}
          onPress={handleSaveToDevice}
        >
          <Text style={baseScreenStyles.buttonText}>Save to device</Text>
        </TouchableOpacity>
        </View>
      </View>
    </View>
    </GradientContainer>
  );
}

const styles = StyleSheet.create({
  blueButton: {},
  innerContainer: {
    padding: 20,
    alignItems: "center",
  },
  qrContainer: {
    marginTop: 10,
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
    marginTop: 10,
    marginBottom: 20,
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
    
  },
  sendButton: {
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "#02457A",
    width: "95%",
    padding: 15,
    borderRadius: 10,
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  qrImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  testQRImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});
