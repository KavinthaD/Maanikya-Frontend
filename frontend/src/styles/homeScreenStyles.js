
import { StyleSheet } from "react-native";
import { baseScreenStyles } from "./baseStyles";
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';

// Common styles for all home screens
export const homeStyles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 25,
    paddingBottom: 25,
  },
  logo: {
    width: 160,
    height: 75,
    resizeMode: "contain",
    marginLeft: 10,
    marginBottom: 5,
  },
  menuGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    rowGap: 20, // Increased spacing between rows
    columnGap: 16,
    marginTop: 16,
    paddingBottom: 30, // More space for bottom nav bar
  },
  menuGridColumn: {
    // Special case for customer page
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    rowGap: 50,
    marginTop: 16,
    paddingBottom: 30,
  },
  menuItem: {
    width: "47%", // Standard grid item width
    aspectRatio: 0.85, // Make slightly taller to accommodate label
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4, // Add shadow for depth
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  menuItemFullWidth: {
    // For single column layout
    width: "85%", // Slightly wider
    aspectRatio: 2.2, // Adjusted ratio
    borderRadius: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    overflow: "hidden", // Ensures the overlay stays within rounded corners
  },
  menuItemContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // For absolute positioning of overlay
  },
  iconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%", // Ensure full height
    position: "relative", // For overlay positioning
  },
  iconContainerFullWidth: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    height: 150,
    width: "100%",
    position: "relative", // For overlay positioning
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    aspectRatio: 0.85,
    borderRadius: 15,
  },
  imageStyleFullWidth: {
    width: "100%",
    height: 150,
    resizeMode: "cover", // Changed to cover for better appearance with overlay
  },
  overlayContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.6)", // Semi-transparent white
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
  },
  menuText: {
    fontSize: 14,
    textAlign: "center",
    color: baseScreenStyles.colors.primary, // Changed to primary color for better visibility
    fontWeight: "600",
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  
  // QR scanning styles
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
  },
  cancelScanButton: {
    padding: 12,
    backgroundColor: '#f8d7da',
    borderRadius: 8,
    marginTop: 20,
  },
  cancelScanButtonText: {
    fontSize: 16,
    color: '#721c24',
  },
  permissionButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  permissionMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  
  // Modal styles for QR scanner options
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    alignItems: "center",
  },
  modalHeader: {
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  modalIndicator: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#ccc",
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#E8F0FE",
    marginBottom: 10,
    width: "100%",
    justifyContent: "center",
  },
  modalButtonText: {
    fontSize: 18,
    color: baseScreenStyles.colors.primary,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#f8d7da",
  },
  cancelButtonText: {
    color: "#721c24",
  },
});

// Common components for home screens
export const HomeScreenComponents = {
  // Menu item for grid layout (Business and Worker screens)
  MenuItem: ({ image, title, onPress }) => (
    <TouchableOpacity
      style={homeStyles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={homeStyles.menuItemContent}>
        <View style={homeStyles.iconContainer}>
          <Image
            source={image}
            style={homeStyles.imageStyle}
            resizeMode="cover" // Changed to cover for better appearance
            onError={(error) => console.error("Image loading error:", error)}
          />
          <View style={homeStyles.overlayContainer}>
            <Text style={homeStyles.menuText}>{title}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  ),
  
  // Menu item for column layout (Customer screen)
  MenuItemFullWidth: ({ image, title, onPress }) => (
    <TouchableOpacity 
      style={homeStyles.menuItemFullWidth} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={homeStyles.iconContainerFullWidth}>
        <Image 
          source={image} 
          style={homeStyles.imageStyleFullWidth} 
          resizeMode="cover" // Changed to cover
        />
        <View style={homeStyles.overlayContainer}>
          <Text style={homeStyles.menuText}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  ),
  
  // QR Scanner Modal
  QRScannerModal: ({ isVisible, onClose, onCameraPress, onGalleryPress }) => (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={homeStyles.modal}
    >
      <View style={homeStyles.modalContent}>
        <View style={homeStyles.modalHeader}>
          <View style={homeStyles.modalIndicator} />
        </View>
        <TouchableOpacity
          style={homeStyles.modalButton}
          onPress={onCameraPress}
        >
          <Icon name="camera-alt" size={24} color={baseScreenStyles.colors.primary} />
          <Text style={homeStyles.modalButtonText}>Scan with Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={homeStyles.modalButton}
          onPress={onGalleryPress}
        >
          <Icon name="photo-library" size={24} color={baseScreenStyles.colors.primary} />
          <Text style={homeStyles.modalButtonText}>Choose QR from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[homeStyles.modalButton, homeStyles.cancelButton]}
          onPress={onClose}
        >
          <Text style={[homeStyles.modalButtonText, homeStyles.cancelButtonText]}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  ),
  
  // QR Scanner Overlay
  QRScannerOverlay: ({ onCancel }) => (
    <View style={homeStyles.scannerOverlay}>
      <Text style={homeStyles.scannerText}>Align QR code within frame</Text>
      <TouchableOpacity
        style={homeStyles.cancelScanButton}
        onPress={onCancel}
      >
        <Text style={homeStyles.cancelScanButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  ),
  
  // Permission Request Screen
  PermissionRequest: ({ onRequestPermission }) => (
    <View style={homeStyles.permissionContainer}>
      <Text style={homeStyles.permissionMessage}>
        We need your permission to use the camera
      </Text>
      <TouchableOpacity
        style={homeStyles.permissionButton}
        onPress={onRequestPermission}
      >
        <Text style={homeStyles.buttonText}>Grant Permission</Text>
      </TouchableOpacity>
    </View>
  )
};

