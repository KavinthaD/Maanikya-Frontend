import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

const MyGems = () => {
  const gemDetails = [
    {
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

  return (
    <View style={styles.container}>

      <Image
        source={{ uri: 'https://via.placeholder.com/600x200' }} 
        style={styles.image}
      />

    
      <FlatList
        data={gemDetails}
        keyExtractor={(item, index) => `gem-${index}`}
        renderItem={({ item }) => (
          <View style={styles.detailCard}>
            <Text>Date added to system: {item.dateAdded}</Text>
            <Text>Identification: {item.identification}</Text>
            <Text>Weight: {item.weight}</Text>
            <Text>Measurements: {item.measurements}</Text>
            <Text>Shape: {item.shape}</Text>
            <Text>Color: {item.color}</Text>
          </View>
        )}
      />

      <FlatList
        data={financialDetails}
        keyExtractor={(item, index) => `financial-${index}`}
        renderItem={({ item }) => (
          <View style={styles.detailCard}>
            <Text>Purchase Price: {item.purchasePrice}</Text>
            <Text>Cost: {item.cost}</Text>
            <Text>Sold Price: {item.soldPrice}</Text>
          </View>
        )}
      />

      <Image
        source={{ uri: 'https://via.placeholder.com/600x200' }} 
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  image: { width: '50%', height: '50%', resizeMode: 'cover', marginVertical: 10 },
  detailCard: { padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10, backgroundColor: '#f9f9f9' },
});

export default MyGems;
