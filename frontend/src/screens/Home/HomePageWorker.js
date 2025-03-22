//Screen Creator Tilmi

import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import { homeStyles, HomeScreenComponents } from "../../styles/homeScreenStyles";
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    return <HomeScreenComponents.PermissionRequest onRequestPermission={requestPermission} />;
  }

  const handleQrScan = () => {
    setModalVisible(true);
  };

  const handleBarCodeScanned = ({ data }) => {
    setScanning(false);
    setModalVisible(false);
    // Handle scanned QR code data
    navigation.navigate("Orders", { qrCodeData: data });
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
            navigation.navigate("Orders", { 
              qrCodeData: scannedBarcodes[0].data 
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
      image: require("../../assets/menu-icons/tracker.jpg"),
      screen: "Orders",
      title: "Orders"
    },
    {
      image: require("../../assets/menu-icons/financial.jpg"),
      screen: "WorkerFinancialRecords",
      title: "Financial Records"
    },
    {
      image: require("../../assets/menu-icons/scan-qr.jpg"),
      onPress: handleQrScan,
      title: "Scan QR"
    },
    {
      image: require("../../assets/menu-icons/chat.jpg"),
      screen: "MessageInbox",
      title: "Messages"
    },
  ];

  // Update the handleMenuItemPress function to handle both screen navigation and custom actions
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
            
            <View style={homeStyles.menuGrid}>
              {menuItems.map((item, index) => (
                <HomeScreenComponents.MenuItem
                  key={index}
                  image={item.image}
                  title={item.title}
                  onPress={() => handleMenuItemPress(item.screen, item.onPress)}
                />
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

export default HomeScreen;