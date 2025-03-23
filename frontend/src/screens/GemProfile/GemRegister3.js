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
  ScrollView,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import { baseScreenStyles } from "../../styles/baseStyles"; // Add this import
import QRCode from "react-native-qrcode-svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import ViewShot from "react-native-view-shot";
import { BackHandler } from "react-native";
import HeaderBar from "../../components/HeaderBar";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Gem_register_3() {
  const navigation = useNavigation();
  const route = useRoute();
  // Add default values to prevent undefined errors
  const { gemId = "", createdAt = "", qrCode = "" } = route.params || {};
  const [gemData] = useState(null);
  const qrContainerRef = useRef();
  const [showEnlargedQR, setShowEnlargedQR] = useState(false);


  // LOGGING RETRIEVED DATA 
  // console.log("Received Data from GemRegister2:", { gemId, createdAt, qrCode });

  
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
      const shareResponse = await Sharing.shareAsync(tempFile, {
        mimeType: "image/png",
        dialogTitle: "Share QR Code",
        UTI: "public.png", // For iOS
      });

      console.log("Share response:", shareResponse); // Log the share response

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

  // Format date with a safe check
  const formatDate = (dateString) => {
    if (!dateString) return "Not available";
    try {
      const date = new Date(dateString);
      return date.toISOString().split("T")[0]; // This will return YYYY-MM-DD format
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  const handleHome = async () => {
    navigation.navigate("BS_NavBar", { screen: "Home" });
  };

  const toggleEnlargedQR = () => {
    setShowEnlargedQR(!showEnlargedQR);
  };

  // Replace the existing handleRegisterAnother function
  const handleRegisterAnother = async () => {
    try {
      // Clear previous form data from AsyncStorage
      await AsyncStorage.removeItem("gemRegister2Form");
      
      // Navigate to BS_NavBar with AddGem tab active
      navigation.reset({
        index: 0,
        routes: [{ 
          name: 'BS_NavBar', 
          params: { screen: 'AddGem' } // This ensures AddGem tab is active
        }],
      });
    } catch (error) {
      console.error("Error clearing form data:", error);
      // Still try to navigate even if clearing fails
      navigation.navigate("BS_NavBar", { screen: 'AddGem' });
    }
  };

  return (
    <SafeAreaView
      style={[
        baseScreenStylesNew.backgroundColor,
        baseScreenStylesNew.container,
      ]}
      edges={["bottom"]}
    >
      <HeaderBar title="Registration Complete" />

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.successContainer}>
          {/* Use a safe color reference that definitely exists */}
          <Icon 
            name="check-circle" 
            size={60} 
            color={baseScreenStyles.colors.success || "#4CAF50"} 
          />
          <Text style={styles.successTitle}>
            Gem Registered Successfully!
          </Text>
          <Text style={styles.successSubtitle}>
            Your gem has been registered with ID {gemId || "Not available"}
          </Text>
        </View>

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
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={toggleEnlargedQR}
            style={styles.qrTouchable}
          >
            <View style={styles.qrContainer}>
              {qrCode ? (
                <Image
                  source={{ uri: qrCode }}
                  style={styles.qrImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.qrPlaceholder}>
                  {/* Use a safe color reference */}
                  <Icon 
                    name="qr-code" 
                    size={80} 
                    color={baseScreenStyles.colors.primary || "#1976D2"} 
                  />
                  <Text style={styles.loadingText}>Loading QR Code...</Text>
                </View>
              )}
              
              {/* Add a hint that QR is clickable */}
              {qrCode && (
                <View style={styles.expandHintContainer}>
                  <Icon name="fullscreen" size={16} color="#757575" />
                  <Text style={styles.expandHintText}>Tap to enlarge</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </ViewShot>

        {/* Add the modal for the enlarged QR code */}
        {showEnlargedQR && (
          <TouchableOpacity
            style={styles.enlargedQROverlay}
            activeOpacity={1}
            onPress={toggleEnlargedQR}
          >
            <View style={styles.enlargedQRContainer}>
              <Image
                source={{ uri: qrCode }}
                style={styles.enlargedQRImage}
                resizeMode="contain"
              />
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={toggleEnlargedQR}
              >
                <Icon name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.enlargedQRText}>
                Position QR code in front of scanner
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.infoCards}>
          <View style={styles.infoCard}>
            {/* Use a safe color reference */}
            <Icon 
              name="badge" 
              size={22} 
              color={baseScreenStyles.colors.primary || "#1976D2"} 
              style={styles.infoIcon} 
            />
            <Text style={styles.infoLabel}>Gem ID</Text>
            <Text style={styles.infoValue}>{gemId || "Not available"}</Text>
          </View>

          <View style={styles.infoCard}>
            {/* Use a safe color reference */}
            <Icon 
              name="event" 
              size={22} 
              color={baseScreenStyles.colors.primary || "#1976D2"} 
              style={styles.infoIcon} 
            />
            <Text style={styles.infoLabel}>Registration Date</Text>
            <Text style={styles.infoValue}>{formatDate(createdAt)}</Text>
          </View>
        </View>

        <Text style={styles.instructionText}>
          Save or share this QR code for easy authentication of your gem in the future
        </Text>

        {/* Replace the existing buttons with this layout */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSaveToDevice}
          >
            <Icon 
              name="save-alt" 
              size={24} 
              color="#FFFFFF" 
            />
            <Text style={styles.actionButtonText}>Save to Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleShare}
          >
            <Icon 
              name="share" 
              size={24} 
              color="#FFFFFF" 
            />
            <Text style={styles.actionButtonText}>Share QR Code</Text>
          </TouchableOpacity>
        </View>

        {/* Navigation buttons in a row */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={styles.registerAnotherButton}
            onPress={handleRegisterAnother}
          >
            <Icon 
              name="add-circle" 
              size={20} 
              color={baseScreenStyles.colors.primary || "#170969"} 
              style={styles.buttonIcon}
            />
            <Text style={styles.registerAnotherText}>Register Another</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={handleHome}
          >
            <Icon 
              name="home" 
              size={20} 
              color={baseScreenStyles.colors.text?.dark || "#212121"} 
              style={styles.buttonIcon}
            />
            <Text style={styles.homeButtonText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Update the styles to avoid undefined color references
const styles = StyleSheet.create({
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: baseScreenStyles.colors.text?.dark || "#212121",
    marginTop: 8,
    marginBottom: 5,
  },
  successSubtitle: {
    fontSize: 16,
    color: baseScreenStyles.colors.text?.medium || "#757575",
    textAlign: 'center',
  },
  qrContainer: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginVertical: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  qrImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  qrPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#757575",
  },
  infoCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    margin: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  infoIcon: {
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: "#757575",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: "#212121",
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: "#757575",
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '103%',
    marginBottom: 25,
  },
  actionButton: {
    flex: 1,
    backgroundColor: baseScreenStyles.colors.primary || "#1976D2",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    margin: 8,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  homeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  homeButtonIcon: {
    marginRight: 8,
  },
  homeButtonText: {
    fontSize: 14,  // Slightly smaller to fit in the button
    fontWeight: '500',
    color: "#212121",
  },

qrTouchable: {
  alignItems: 'center',
},

expandHintContainer: {
  position: 'absolute',
  bottom: 8,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255,255,255,0.8)',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 12,
},
expandHintText: {
  fontSize: 12,
  color: "#757575",
  marginLeft: 4,
},
enlargedQROverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.85)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
},
enlargedQRContainer: {
  width: '80%',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
},
enlargedQRImage: {
  width: 300,
  height: 300,
  borderWidth: 10, 
  borderColor: '#FFFFFF',
  borderRadius: 8,
  backgroundColor: '#FFFFFF',
},
closeButton: {
  position: 'absolute',
  top: -40,
  right: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  width: 36,
  height: 36,
  borderRadius: 18,
  alignItems: 'center',
  justifyContent: 'center',
},
enlargedQRText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '500',
  marginTop: 20,
  textAlign: 'center',
},
registerAnotherButton: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: "rgba(230, 240, 255, 0.8)",
  borderWidth: 1,
  borderColor: baseScreenStyles.colors.primary || "#170969",
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 12,
  marginRight: 8,
},
registerAnotherIcon: {
  marginRight: 8,
},
registerAnotherText: {
  fontSize: 14,  // Slightly smaller to fit in the button
  fontWeight: '500',
  color: baseScreenStyles.colors.primary || "#170969",
},
navigationButtons: {
  bottom: 15,
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: 20,
},
buttonIcon: {
  marginRight: 8,
},
});
