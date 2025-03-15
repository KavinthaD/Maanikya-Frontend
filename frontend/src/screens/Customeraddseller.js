import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header_2 from '../components/Header_2';
import { baseScreenStylesNew } from '../styles/baseStylesNew';
import { LinearGradient } from 'expo-linear-gradient';

const MySeller = ({navigation}) => {
  const [data, setData] = useState([
    {
      id: 1,
      name: 'Sunil Gamalath',
      company: 'Gamage Gems',
      rating: 4,
      image: require('../assets/seller.png'), 
    },
    {
      id: 2,
      name: 'Subash Hettiarachchi',
      company: 'Pixel Gems',
      rating: 3,
      image: require('../assets/seller.png'), 
    },
    {
      id: 3,
      name: 'Rashantha Gamage',
      company: 'Zodiac Gems',
      rating: 2,
      image: require('../assets/seller.png'),  
    },
    {
      id: 4,
      name: 'Wimalasiri Siriwardana',
      company: 'Janatha Gems',
      rating: 1,
      image: require('../assets/seller.png'), 
    },
  ]);

  const renderItem = (item) => (
    <View style={[baseScreenStylesNew.item,styles.itemContainer]}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCompany}>{item.company}</Text>
      </View>
      <TouchableOpacity 
        style={[baseScreenStylesNew.themeColor,styles.viewGemsButton]} 
        onPress={() => navigation.navigate("SellerProfile")}
      >
        <Text style={[baseScreenStylesNew.whiteText, styles.viewGemsText]}>View gems</Text>
      </TouchableOpacity>
    </View>
  );

  return (
      <SafeAreaView style={baseScreenStylesNew.container}>
        <Header_2 title="My Sellers"/>
        <View style={styles.innerContainer}>
          <View style={styles.headerContainer}>
            <View style={baseScreenStylesNew.search}>
              <Ionicons name="search" style={baseScreenStylesNew.searchIcon} />
              <TextInput
                style={baseScreenStylesNew.searchInput}
                placeholder="Search"
                placeholderTextColor="#6B7280"
              />
            </View>
            <Text style={[baseScreenStylesNew.blackText, styles.recentText]}>Recent</Text>
          </View>

          <ScrollView style={styles.scrollContainer}>
            {data.map(item => (
              <View key={item.id} style={styles.itemWrapper}>
                {renderItem(item)}
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  headerContainer: {
    marginBottom: 20,
  },
  recentText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    marginLeft: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  scrollContainer: {
    flex: 1,
  },
  itemWrapper: {
    marginBottom: 16,
  },
  itemContainer: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', 
  },
  itemCompany: {
    fontSize: 14,
    color: '#4B5563', 
  },
  viewGemsButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewGemsText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default MySeller;