//Screen Creator Tilmi

import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Text,
  Linking
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import { baseScreenStyles } from "../../styles/baseStyles";
import { homeStyles, HomeScreenComponents } from "../../styles/homeScreenStyles";
import { useNavigation } from "@react-navigation/native";
import { Camera } from "expo-camera";

const HomePageCustomer = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  const handleQrScan = async () => {
    try {
          const { status } = await Camera.requestCameraPermissionsAsync();
          if (status !== "granted") {
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
    navigation.navigate("Gems", { 
      qrCodeUrl: data
    });
  };

  const handleScanFromCamera = () => {
    setModalVisible(false);
    setScanning(true);
  };

  const handleScanFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        try {
          const scannedBarcodes = await BarCodeScanner.scanFromURLAsync(
            result.assets[0].uri
          );
          
          if (scannedBarcodes.length > 0) {
            setModalVisible(false);
            navigation.navigate("Gems", { 
              qrCodeUrl: scannedBarcodes[0].data 
            });
          } else {
            Alert.alert('Error', 'No valid QR code found in the image');
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to scan QR code');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to process image');
    }
  };

  const menuItems = [
    {
      image: require("../../assets/menu-icons/scan-qr.jpg"),
      onPress: handleQrScan,
      title: "Scan QR"
    },
    {
      image: require("../../assets/menu-icons/contacts.jpg"),
      screen: "Contacts",
      title: "Contacts"
    },
    {
      image: require("../../assets/menu-icons/chat.jpg"),
      screen: "MessageInbox",
      title: "Messages"
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
          facing="back"
          barcodeScannerSettings={{
            barCodeTypes: ["qr"],
          }}
          onBarcodeScanned={handleBarCodeScanned}
        >
          <HomeScreenComponents.QRScannerOverlay onCancel={() => setScanning(false)} />
        </CameraView>
      ) : (
        <ScrollView 
          style={homeStyles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={homeStyles.content}>
            <Image source={require("../../assets/logo-letter.png")} style={homeStyles.logo}/>
            
            <View style={styles.menuGridTwoColumns}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItemLarge}
                  onPress={() => handleMenuItemPress(item.screen, item.onPress)}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemContentLarge}>
                    <View style={styles.iconContainerLarge}>
                      <Image
                        source={item.image}
                        style={styles.imageStyleLarge}
                        resizeMode="cover"
                        onError={(error) => console.error("Image loading error:", error)}
                      />
                      <View style={styles.overlayContainerLarge}>
                        <Text style={styles.menuTextLarge}>{item.title}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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

// Local styles for larger two-column layout
const styles = StyleSheet.create({
  menuGridTwoColumns: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 25, // Increased space between rows
    marginTop: 25, // More top margin
    paddingBottom: 30,
  },
  menuItemLarge: {
    width: "47%", // Two items per row
    aspectRatio: 1, // Square aspect ratio for larger buttons
    borderRadius: 20,
    overflow: "hidden",
    elevation: 5, // Increased elevation for more prominence
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
  menuItemContentLarge: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  iconContainerLarge: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    position: "relative",
  },
  imageStyleLarge: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
  },
  overlayContainerLarge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Increased opacity for better visibility
    paddingVertical: 12, // Increased padding for larger text area
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextLarge: {
    fontSize: 16, // Larger font size
    textAlign: "center",
    color: baseScreenStyles.colors.primary,
    fontWeight: "600",
  },
});

export default HomePageCustomer;