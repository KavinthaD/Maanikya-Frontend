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
import { baseScreenStyles } from '../styles/baseStyles';
import GradientContainer from "../components/GradientContainer";
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
    <LinearGradient
      colors={['#CDE3F9', '#798693']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.itemContainer}
    >
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCompany}>{item.company}</Text>
      </View>
      <TouchableOpacity 
        style={styles.viewGemsButton} 
        onPress={() => navigation.navigate("SellerProfile")}
      >
        <Text style={styles.viewGemsText}>View gems</Text>
      </TouchableOpacity>
    </LinearGradient>
  );

  return (
    <GradientContainer>
      <SafeAreaView style={baseScreenStyles.container}>
        <View style={styles.innerContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.recentText}>Recent</Text>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#6B7280"
              />
            </View>
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
    </GradientContainer>
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
    color: '#E5E7EB',
    marginBottom: 10,
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
    backgroundColor: '#312E81',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewGemsText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default MySeller;