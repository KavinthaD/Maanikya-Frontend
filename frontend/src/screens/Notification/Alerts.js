//Screen creator: Dulith

import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { baseScreenStyles } from '../../styles/baseStyles';
import Header_1 from '../../components/Header_1';
import GradientContainer from "../../components/GradientContainer";

const Alerts = [
  {
    id: '1',
    image: require('../../assets/gemimg/user1.jpg'), 
    text: 'Order Request From Mehara Wilfred',
  },
  {
    id: '2',
    image: require('../../assets/gemimg/user2.jpg'), 
    text: 'On-going Order From Tilmi Thishara',
  },
  {
    id: '3',
    image: require('../../assets/gemimg/user3.jpg'), 
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
    <GradientContainer>
    <View style={baseScreenStyles.container}>
      <Header_1 title="Alerts"/>
      <FlatList
        data={Alerts}
        renderItem={({ item }) => <AlertItem item={item} />}
        keyExtractor={item => item.id}
      />
    </View>
    </GradientContainer>
  );
};

const styles = StyleSheet.create({
  
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 6,
    borderBottomColor: 'rgba(0, 0, 0, 0.4)',
    marginBottom: 7,
    backgroundColor: 'rgba(123, 150, 172, 0.2)',
    marginTop: 15, 
    borderRadius:12,
    width:"96%",
    alignSelf: 'center',
    
    
  },
  alertImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  alertText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default AlertsScreen;
