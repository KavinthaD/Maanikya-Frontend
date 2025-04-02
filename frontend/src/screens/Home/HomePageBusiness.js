//Screen Creator Tilmi
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { encode as base64Encode } from "base-64";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ScrollView,
  Linking,
} from "react-native";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import { baseScreenStyles } from "../../styles/baseStyles";
import {
  homeStyles,
  HomeScreenComponents,
} from "../../styles/homeScreenStyles";
import { CameraView, useCameraPermissions } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
import { usePushNotifications } from "../../services/pushNotificationService";
import { useNotification } from "../../services/NotificationManager";
import { requestUserPermission, getFCMToken } from '../../services/pushNotificationService';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  // Use the push notifications hook
  const { sendTestNotification } = usePushNotifications(navigation);

  // Get the showNotification function from the context
  const { showNotification } = useNotification();

  // Add this at the top of your component
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const permissionGranted = await requestUserPermission();
        console.log('Notifications permission status:', permissionGranted ? 'Granted' : 'Denied');
        
        if (permissionGranted) {
          await getFCMToken();
        }
      } catch (error) {
        console.error('Error requesting notifications permission:', error);
      }
    };
    
    requestPermissions();
  }, []);

  // Test notification function
  const testFirebaseNotification = async () => {
    try {
      const success = await sendTestNotification();
      if (success) {
        showNotification({
          title: "Test Notification Sent",
          body: "Check for the notification",
          data: { notificationType: "system" },
          autoClose: true,
        });
      }
    } catch (error) {
      console.error("Error testing notification:", error);
    }
  };

  const handleQrScan = async () => {
    try {
      // request camera permissions from user
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        //if denied error message
        Alert.alert(
          "Permission Required",
          "This app needs camera and gallery access to get QR code. Pleasse go to settings and enable permissions for camera",
          [
            {
              text: "Open Settings",
              onPress: () => Linking.openSettings(),
            },
            { text: "Cancel", style: "cancel" },
          ]
        );
        return;
      }
      setHasPermission(status === "granted");
      setModalVisible(true);
    } catch (error) {
      console.error("Error requesting camera permission:", error);
      Alert.alert(
        "Error",
        "Failed to request camera permissions. Please try again."
      );
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    setScanning(false);
    setModalVisible(false);

    let finalData = data;
    // Check if the data is a data URL and extract base64
    if (data.includes("base64,")) {
      finalData = data.split("base64,")[1];
    }
    // navigate to mygems screen and pass the QR code data
    navigation.navigate("MyGems", {
      qrCodeUrl: finalData,
    });
  };

  const handleScanFromCamera = () => {
    setModalVisible(false);
    setScanning(true);
  };

  const handleScanFromGallery = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "Please grant camera roll permissions"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        base64: true,
        width: 300,
        height: 300,
        aspect: [1, 1],
      });
      // if an image was selected
      if (!result.canceled && result.assets[0]) {
        try {
          //scan the image for barcodes
          const scannedBarcodes = await BarCodeScanner.scanFromURLAsync(
            result.assets[0].uri
          );
          //if found navigate to mygems screen and pass the QR code data
          if (scannedBarcodes.length > 0) {
            const scannedUrl = scannedBarcodes[0].data;
            console.log("Scanned URL:", scannedUrl);

            setModalVisible(false);
            navigation.navigate("MyGems", {
              qrCodeUrl: scannedUrl,
            });
          } else {
            Alert.alert("Error", "No valid QR code found in the image");
          }
        } catch (error) {
          console.error("QR scanning error:", error);
          Alert.alert("Error", "Failed to scan QR code");
        }
      }
    } catch (error) {
      console.error("Gallery error:", error);
      Alert.alert("Error", "Failed to process image");
    }
  };

  // Menu items with standardized format
  const menuItems = [
    {
      image: require("../../assets/menu-icons/gem-inventory.jpg"),
      screen: "HomeMyGems",
      title: "Gems Inventory",
    },
    {
      image: require("../../assets/menu-icons/scan-qr.jpg"),
      onPress: handleQrScan,
      title: "Scan QR",
    },
    {
      image: require("../../assets/menu-icons/financial.jpg"),
      screen: "OwnerFinancialRecords",
      title: "Financial Records",
    },
    {
      image: require("../../assets/menu-icons/tracker.jpg"),
      screen: "Tracker",
      title: "Gem orders",
    },
    {
      image: require("../../assets/menu-icons/contacts.jpg"),
      screen: "Contacts",
      title: "Contacts",
    },
    {
      image: require("../../assets/menu-icons/gems-on-market.jpg"),
      screen: "GemOnDisplay",
      title: "Gems On Market",
    },
    {
      image: require("../../assets/menu-icons/chat.jpg"),
      screen: "MessageInbox",
      title: "Messages",
    },
  ];

  const handleMenuItemPress = (screenName, customOnPress) => {
    if (customOnPress) {
      customOnPress();
    } else if (screenName) {
      navigation.navigate(screenName);
    } else {
      console.log(`No screen defined for this item`);
    }
  };

  return (
    <View style={baseScreenStylesNew.container}>
      {scanning ? (
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back" // use the back camera
          barcodeScannerSettings={{
            barCodeTypes: ["qr"], // only scan QR codes
          }}
          onBarcodeScanned={handleBarCodeScanned}
        >
          <HomeScreenComponents.QRScannerOverlay
            onCancel={() => setScanning(false)} // cancel scanning
          />
        </CameraView>
      ) : (
        // Display the home screen content
        <ScrollView
          style={homeStyles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={homeStyles.content}>
            <Image
              source={require("../../assets/logo-letter.png")}
              style={homeStyles.logo}
            />

            <View style={styles.menuGridThreeColumns}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItemThreeColumn}
                  onPress={() => handleMenuItemPress(item.screen, item.onPress)}
                  activeOpacity={0.7}
                >
                  <View style={homeStyles.menuItemContent}>
                    <View style={homeStyles.iconContainer}>
                      <Image
                        source={item.image}
                        style={styles.imageStyleThreeColumn}
                        resizeMode="cover"
                        onError={(error) =>
                          console.error("Image loading error:", error)
                        }
                      />
                      <View style={homeStyles.overlayContainer}>
                        <Text style={styles.menuTextSmaller}>{item.title}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
                
              ))}
            </View>
            {/* Add a test button somewhere in your UI */}
          <TouchableOpacity
            style={styles.testButton}
            onPress={testFirebaseNotification}
          >
            <Text style={styles.testButtonText}>Test Notification</Text>
          </TouchableOpacity>
          </View>
          {/* Add some padding at the bottom for better scrolling */}
          <View style={{ height: 20 }} />
          
        </ScrollView>
      )}

      <HomeScreenComponents.QRScannerModal
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onCameraPress={handleScanFromCamera}
        onGalleryPress={handleScanFromGallery}
      />
    </View>
  );
};

// Local styles specific to the 3-column layout
const styles = StyleSheet.create({
  menuGridThreeColumns: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 15,
    marginTop: 16,
    paddingBottom: 30,
  },
  menuItemThreeColumn: {
    width: "31%", // Adjusted to fit 3 items per row with spacing
    aspectRatio: 0.78, // Slightly taller for better proportions with smaller width
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  imageStyleThreeColumn: {
    width: "100%",
    height: "100%",
    aspectRatio: 0.78,
    borderRadius: 12,
  },
  menuTextSmaller: {
    fontSize: 12, // Smaller font for the narrower items
    textAlign: "center",
    color: baseScreenStyles.colors.primary,
    fontWeight: "600",
  },
  testButton: {
    backgroundColor: "#082f4f",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
  },
  testButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default HomeScreen;
