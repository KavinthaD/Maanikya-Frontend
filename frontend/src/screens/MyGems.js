import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

const MyGems = () => {
  const gemDetails = [
    {
      gemId: 'GEM123456',
      dateAdded: '9/12/2023',
      identification: 'Natural Blue Sapphire',
      weight: '1.96 carats',
      measurements: '8.59 x 6.36 x 4.97 mm',
      shape: 'Cushion',
      color: 'Vivid Blue',
    },
  ];

  const financialDetails = [
    {
      purchasePrice: 'LKR 60,000',
      cost: 'LKR 20,000',
      soldPrice: 'LKR 100,000',
    },
  ];

  // QR code value as a stringified JSON object
  const qrValue = JSON.stringify({
    gem: gemDetails[0].identification,
    weight: gemDetails[0].weight,
    color: gemDetails[0].color,
  });

  // Function to render gem details
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

  // Function to render financial details
  const renderFinancialDetails = ({ item }) => (
    <View style={styles.detailCard}>
      <Text>Purchase Price: {item.purchasePrice}</Text>
      <Text>Cost: {item.cost}</Text>
      <Text>Sold Price: {item.soldPrice}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>My Gems</Text>
      {/* QR Code in the top-right corner */}
      <View style={styles.qrContainer}>
        <QRCode value={qrValue} size={100} />
      </View>

      {/* Top Image with Gem ID description */}
      <Image
        source={{ uri: 'https://via.placeholder.com/600x200' }}
        style={styles.topImage}
      />
      <Text style={styles.gemId}>Gem ID: {gemDetails[0].gemId}</Text>

      {/* Gem Details */}
      <FlatList
        data={gemDetails}
        keyExtractor={(item, index) => `gem-${index}`}
        renderItem={renderGemDetails}
      />

      {/* Financial Details */}
      <FlatList
        data={financialDetails}
        keyExtractor={(item, index) => `financial-${index}`}
        renderItem={renderFinancialDetails}
      />

      {/* Bottom Image */}
      <Image
        source={{ uri: 'https://via.placeholder.com/600x200' }}
        style={styles.bottomImage}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9CCDDB',
    padding: 10,
  },
  qrContainer: {
    position: 'absolute',
    top: 150,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1, // Ensure QR code appears on top
  },
  topImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginVertical: 10,
  },
  bottomImage: {
    width: '50%',
    height: 150,
    left:10,
    resizeMode: 'cover',
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 70,
  },  
  gemId: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailCard: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
});

export default MyGems;
