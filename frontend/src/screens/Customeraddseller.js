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

const App = () => {
  const [data, setData] = useState([
    {
      id: 1,
      name: 'Sunil Gamalath',
      company: 'Gamage Gems',
      rating: 4,
      image: require('../assets/seller.png'), // Replace with your actual image path
    },
    {
      id: 2,
      name: 'Subash Hettiarachchi',
      company: 'Pixe; Gems',
      rating: 3,
      image: require('../assets/seller.png'), // Replace with your actual image path
    },
    {
      id: 3,
      name: 'Rashantha Gamage',
      company: 'Zodiac Gems',
      rating: 2,
      image: require('../assets/seller.png'), // Replace with your actual image path
    },
    {
      id: 4,
      name: 'Wimalasiri Siriwardana',
      company: 'Janatha Gems',
      rating: 1,
      image: require('../assets/seller.png'), // Replace with your actual image path
    },
  ]);

  const handleStarPress = (itemId, starIndex) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === itemId ? { ...item, rating: starIndex + 1 } : item
      )
    );
  };

  const renderStars = (itemId, rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => handleStarPress(itemId, i)}>
          <Ionicons
            name={i < rating ? 'star' : 'star-outline'}
            size={18}
            color="#3b82f6"
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.starContainer}>{stars}</View>;
  };

  const renderItem = (item) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemCompany}>{item.company}</Text>
        {renderStars(item.id, item.rating)}
      </View>
      <TouchableOpacity style={styles.viewGemsButton}>
        <Text style={styles.viewGemsText}>View gems</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search person"
          placeholderTextColor="#888"
        />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.addPersonText}>Add person</Text>

      <ScrollView>
        {data.map(item => (
          <React.Fragment key={item.id}>
            {renderItem(item)}
          </React.Fragment>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9CCDDB',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 16,
    marginRight: 10,
    color: '#333',
  },
  filterButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    color: '#333',
    fontWeight: 'bold',
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 5,
  },
  addPersonText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  itemContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
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
    color: '#666',
  },
  viewGemsButton: {
    backgroundColor: '#938FEC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewGemsText: {
    color: '#64748b',
    fontWeight: 'bold',
    fontSize: 12,
  },
  starContainer: {
    flexDirection: 'row',
    marginTop: 4,
  },
});

export default App;