//Screen creator: Dulith

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { baseScreenStyles } from "../../styles/baseStyles";

const Orders = [
  {
    id: 'NB01130',
    name: 'M.D Rathnasiri Navasighe',
    date: '20-12-2024',
    image: require('../../assets/gemimg/user3.jpg'),
  },
  {
    id: 'NB01129',
    name: 'K.D Piyasiri Gunasinghe',
    date: '20-11-2024',
    image: require('../../assets/gemimg/user3.jpg'),
  },
  {
    id: 'NB01128',
    name: 'P.D Supunsiri Subasinghe',
    date: '20-10-2024',
    image: require('../../assets/gemimg/user3.jpg'),
  },
  {
    id: 'NB01127',
    name: 'U.D Gunasiri Lokusighe',
    date: '20-09-2024',
    image: require('../../assets/gemimg/user3.jpg'),
  },
];

const OrderScreen = () => {
  const [activeTab, setActiveTab] = useState('Requested');

  const renderContent = () => {
    switch (activeTab) {
      case 'Requested':
        return (
          <ScrollView style={styles.scrollView}>
            {Orders.map((order) => (
              <View key={order.id} style={styles.orderContainer}>
                <Image source={order.image} style={styles.image} />
                <View style={styles.orderDetails}>
                  <Text style={styles.orderId}>Order#: {order.id}</Text>
                  <Text style={styles.orderName}>{order.name}</Text>
                  <Text style={styles.orderDate}>Order requested on {order.date}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        );
      case 'Ongoing':
        return (
          <View style={styles.contentContainer}>
            <Text>Ongoing orders will be displayed here.</Text> 
          </View>
        );
      case 'History':
        return (
          <View style={styles.contentContainer}>
            <Text>Order history will be displayed here.</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={baseScreenStyles.container}>
      <View style={styles.spacer} /> 
      <Text style={styles.header}>Orders</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setActiveTab('Requested')} style={styles.tab}>
          <Text style={activeTab === 'Requested' ? styles.activeTabText : styles.tabText}>Requested</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('Ongoing')} style={styles.tab}>
          <Text style={activeTab === 'Ongoing' ? styles.activeTabText : styles.tabText}>Ongoing</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveTab('History')} style={styles.tab}>
          <Text style={activeTab === 'History' ? styles.activeTabText : styles.tabText}>History</Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  spacer: {
    backgroundColor: '#b3e5fc',
    height: 20, 
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    backgroundColor: '#072D44',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: '#676765',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#b3e5fc',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b3e5fc',
  },
  orderContainer: {
    flexDirection: 'row',
    backgroundColor: '#457EA0',
    margin: 13,
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    width: '90%',
    alignSelf: 'center',
  },
  image: {
    width: 70,
    height: 70,
    marginRight: 10,
    borderRadius: 10,
  },
  orderDetails: {
    flex: 1,
  },
  orderId: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 20,
  },
  orderName: {
    color: '#fff',
    fontSize: 17,
  },
  orderDate: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
  },
});

export default OrderScreen;
