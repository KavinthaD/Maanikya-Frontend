//Screen Creator : Mehara

import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const alerts = [
  {
    id: '1',
    name: 'Mehara',
    action: 'just finished the burning process',
    gem: 'BS001 gem',
    image: 'https://via.placeholder.com/50', // Replace with actual image URL
  },
  {
    id: '2',
    name: 'Tilmi',
    action: 'just finished the cutting process',
    gem: 'BS002 gem lot',
    image: 'https://via.placeholder.com/50', // Replace with actual image URL
  },
  {
    id: '3',
    name: 'Thulani',
    action: 'was given your EM002 gem lot one month ago.',
    gem: '',
    image: 'https://via.placeholder.com/50', // Replace with actual image URL
  },
  {
    id: '4',
    name: 'Kavintha',
    action: 'is interested in your',
    gem: 'YS101 gem',
    image: 'https://via.placeholder.com/50', // Replace with actual image URL
  },
  {
    id: '5',
    name: 'Isum',
    action: 'just sent you an update on your',
    gem: 'ER2004 gem lot',
    image: 'https://via.placeholder.com/50', // Replace with actual image URL
  },
  {
    id: '6',
    name: 'Sansidu',
    action: 'just finished the cutting and burning process of your',
    gem: 'ED304 gem lot',
    image: 'https://via.placeholder.com/50', // Replace with actual image URL
  },
  {
    id: '7',
    name: 'Dulith',
    action: 'just sent you an update on your',
    gem: 'JRK185 gem lot',
    image: 'https://via.placeholder.com/50', // Replace with actual image URL
  },
];

const AlertsScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.alertItem}>
      <Image source={{ uri: item.image }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.alertText}>
          <Text style={styles.bold}>{item.name}</Text> {item.action}{' '}
          <Text style={styles.bold}>{item.gem}</Text>
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Alerts</Text>
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default AlertsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 15,
    backgroundColor: '#007BFF',
    color: '#fff',
  },
  alertItem: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 8,
    padding: 10,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  alertText: {
    fontSize: 14,
    color: '#333',
  },
  bold: {
    fontWeight: 'bold',
  },
});
