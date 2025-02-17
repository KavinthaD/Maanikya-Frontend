//Screen creator: Dulith

import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const Alerts = [
  {
    id: '1',
    image: require('../assets/gemimg/user1.jpg'), 
    text: 'Order Request From Mehara Wilfred',
  },
  {
    id: '2',
    image: require('../assets/gemimg/user2.jpg'), 
    text: 'On-going Order From Tilmi Thishara',
  },
  {
    id: '3',
    image: require('../assets/gemimg/user3.jpg'), 
    text: 'Order#: 3098NS Is Completed',
  },
];

const AlertItem = ({ item }) => (
  <View style={styles.alertItem}>
    <Image source={item.image} style={styles.alertImage} />
    <Text style={styles.alertText}>{item.text}</Text>
  </View>
);

const AlertsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Alerts</Text>
      <FlatList
        data={Alerts}
        renderItem={({ item }) => <AlertItem item={item} />}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b3e5fc',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#072D44',
    color: '#ffffff',
    textAlign: 'center', 
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F8FF',
    marginBottom: 10,
    backgroundColor: '#ffffff',
    marginTop: 15, 
  },
  alertImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  alertText: {
    fontSize: 16,
  },
});

export default AlertsScreen;
