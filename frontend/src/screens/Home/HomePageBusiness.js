//Screen Creator Tilmi
import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { baseScreenStyles } from "../../styles/baseStyles";
import {
  homeStyles,
  HomeScreenComponents,
} from "../../styles/homeScreenStyles";
import { CameraView, useCameraPermissions } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from "expo-camera";
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { API_URL, ENDPOINTS } from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePushNotifications } from '../../services/pushNotificationService';
import { useNotification } from "../../services/NotificationManager";



const HomeScreen = () => {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  
  // Get the showNotification function from the context
  const { showNotification } = useNotification();

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };
  
  useEffect(() => {
    requestUserPermission();
  }, []);

  const handleQrScan = async () => {
    try {
      // request camera permissions from user
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") { //if denied error message
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

  const { sendTestNotification } = usePushNotifications(navigation);
  
  const testFirebaseNotification = async () => {
    try {
      const success = await sendTestNotification();
      if (success) {
        // Use the notification manager instead of Alert
        showNotification({
          title: 'Test Notification Sent',
          body: 'Check for the notification',
          autoClose: true
        });
      }
    } catch (error) {
      console.error('Error testing notification:', error);
    }
  };

  // Menu items with standardized format
  const menuItems = [
    {
      image: require("../../assets/menu-icons/addGem.png"),
      title: "Add Gem",
      screen: "GemRegister1",
    },
    {
      image: require("../../assets/menu-icons/myGems.png"),
      title: "My Gems",
      screen: "HomeMyGems",
    },
    {
      image: require("../../assets/menu-icons/scan.png"),
      title: "Scan",
    },
    {
      image: require("../../assets/menu-icons/financialRecords.png"),
      title: "Financial\nRecords",
      screen: "OwnerFinancialRecords",
    },
    {
      image: require("../../assets/menu-icons/Tracker.png"),
      title: "Tracker",
      screen: "Tracker",
    },
    {
      image: require("../../assets/menu-icons/connect.png"),
      title: "Connect",
      screen: "ConnectScreen",
    },
    {
      image: require("../../assets/menu-icons/GemsOnDisplay.png"),
      title: "Gems on\ndisplay",
      screen: "GemOnDisplay",
    },
  ];

  const handleMenuItemPress = (screenName) => {
    if (screenName) {
      navigation.navigate(screenName); // Navigate to the specified screen
    } else {
      console.log(`No screen defined for this item`); // Optional: Handle cases where no screen is specified
    }
  };

  return (
    <View style={baseScreenStyles.container}>
      <Header_1 title="Home" />
      <View style={styles.content}>
        <Text style={styles.greeting}>Hello Rathnasiri,</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              image={item.image}
              title={item.title}
              onPress={() => handleMenuItemPress(item.screen)}
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
            <TouchableOpacity 
              style={styles.testButton}
              onPress={testFirebaseNotification}
            >
              <Text style={styles.testButtonText}>Test In-App Notification</Text>
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

const styles = StyleSheet.create({
  

  content: {
    padding: 16,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 32,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 20,
    color: "#000",
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    gap: 16,
  },
  menuItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 70,
    height: 70,
    backgroundColor: "white",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageStyle: {
    width: 40,
    height: 40,
  },
  menuText: {
    fontSize: 12,
    textAlign: "center",
    color: "#000",
  },
  testButton: {
    backgroundColor: '#082f4f',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  testButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
