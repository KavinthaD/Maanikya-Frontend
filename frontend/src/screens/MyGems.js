//Screen creator: Isum

import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Button, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg'; // Import QR library
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'; // Import icons

const MyGems = ({ route, navigation }) => {
  const [popQRCode, setPopQRCode] = useState(false);

  const sampleDetails = {
    gemId: 'BS001',
    dateAdded: '9/12/2023',
    identification: 'Natural Blue Sapphire',
    weight: '1.96 carats',
    measurements: '6.59 x 6.36 x 4.97 mm',
    shape: 'Cushion',
    color: 'Vivid Blue',
    purchasePrice: 'LKR 60,000',
    cost: 'LKR 20,000 (for cutting)',
    soldPrice: 'LKR 100,000',
  };

  const { gemDetails = sampleDetails } = route.params || {};

  if (!gemDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No Gem Data Available</Text>
      </SafeAreaView>
    );
  }

  const qrCode = JSON.stringify({
    gem: gemDetails.identification,
    weight: gemDetails.weight,
    color: gemDetails.color,
  });

  // QR code value as a stringified JSON object
  const qrValue = JSON.stringify({
    gem: gemDetails[0].identification,
    weight: gemDetails[0].weight,
    color: gemDetails[0].color,
  });

  // Function gives gem details
  const renderGemDetails = ({ item }) => (
    <View style={styles.detailCard}>
      <Text>Date added to system: {item.dateAdded}</Text>
      <Text>Identification: {item.identification}</Text>
      <Text>Weight: {item.weight}</Text>
      <Text>Measurements: {item.measurements}</Text>
      <Text>Shape: {item.shape}</Text>
      <Text>Color: {item.color}</Text>
    </View>
  );

  // Function gives financial details
  const renderFinancialDetails = ({ item }) => (
    <View style={styles.detailCard}>
      <Text>Purchase Price: {item.purchasePrice}</Text>
      <Text>Cost: {item.cost}</Text>
      <Text>Sold Price: {item.soldPrice}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.topic}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.topicName}>My Gems</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://cdn.britannica.com/80/151380-050-2ABD86F2/diamond.jpg' }}
          style={styles.gemPhoto}
        />

        <TouchableOpacity style={styles.qrContainer} onPress={() => setPopQRCode(true)}>
          <QRCode value={qrCode} size={50} />
        </TouchableOpacity>
      </View>

      {/* Gem ID */}
      <Text style={styles.gemId}>Gem ID - {gemDetails.gemId}</Text>

      <View style={styles.detailCard}>
        <Text style={styles.detailTitle}>Date added to system - {gemDetails.dateAdded}</Text>
        <Text style={styles.detailText}>Identification - {gemDetails.identification}</Text>
        <Text style={styles.detailText}>Weight - {gemDetails.weight}</Text>
        <Text style={styles.detailText}>Measurements - {gemDetails.measurements}</Text>
        <Text style={styles.detailText}>Shape - {gemDetails.shape}</Text>
        <Text style={styles.detailText}>Color - {gemDetails.color}</Text>
        <Text style={styles.detailText}>Additional Information - </Text>
      </View>

      <View style={styles.detailCard}>
        <Text style={styles.detailText}>Purchase Price - {gemDetails.purchasePrice}</Text>
        <Text style={styles.detailText}>Cost - {gemDetails.cost}</Text>
        <Text style={styles.detailText}>Sold Price - {gemDetails.soldPrice}</Text>
      </View>

      {/* Certificate Image */}
      <Image
        source={{ uri: 'https://cdn.britannica.com/80/151380-050-2ABD86F2/diamond.jpg' }}
        style={styles.gemCert}
      />
      <TouchableOpacity onPress={() => navigation.navigate('BusinessOwnerProfilePhoto')} style={styles.editBtn}>
        <FontAwesome5 name="pen" size={16} color="white" />
      </TouchableOpacity>

      
      <Modal transparent visible={popQRCode} animationType="fade">
        <View style={styles.popUpContainer}>
          <View style={styles.popUpContent}>
            <Text style={styles.modalTopic}>QR Code</Text>
            <QRCode value={qrCode} size={200} />
            <Button title="Close" onPress={() => setPopQRCode(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9CCDDB',
  },
  topic: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#082f4f',
    padding: 15,
  },
  topicName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 15,
    position: 'relative',
  },
  gemPhoto: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  editBtn: {
    position: 'absolute',
    top: 620,
    left: 150,
    backgroundColor: '#007BFF',
    padding: 5,
    borderRadius: 5,
  },
  qrContainer: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 5,
  },
  gemId: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailText: {
    fontSize: 14,
    marginBottom: 3,
  },
  gemCert: {
    width: 120,
    height: 80,
    marginLeft: 20,
    borderRadius: 5,
  },
  popUpContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popUpContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTopic: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default MyGems;
