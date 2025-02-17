//Screen Creator Tilmi

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

const GemstoneMarketplace = () => {
  const gemstones = [
    { id: 'BS001', image: require('../assets/gems/BS001.png') },
    { id: 'EM001', image: require('../assets/gems/BS001.png') },
    { id: 'RR001', image: require('../assets/gems/BS001.png') },
    { id: 'YS001', image: require('../assets/gems/BS001.png') },
    { id: 'BS002', image: require('../assets/gems/BS001.png') },
    { id: 'PS001', image: require('../assets/gems/BS001.png') },
    { id: 'PT001', image: require('../assets/gems/BS001.png') },
    { id: 'EM002', image: require('../assets/gems/BS001.png') },
    { id: 'YS002', image: require('../assets/gems/BS001.png') },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.sortButton}>
            <Text style={styles.sortButtonText}>Sort ↓↑</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>Popular</Text>
        
        <View style={styles.gemstoneGrid}>
          {gemstones.map((gem) => (
            <TouchableOpacity key={gem.id} style={styles.gemstoneItem}>
              <View style={styles.gemImageContainer}>
                <Image
                  source={gem.image}
                  style={styles.gemImage}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.gemId}>{gem.id}</Text>
            </TouchableOpacity>
          ))}
        </View>

       
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F3F5',
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  sortButton: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  sortButtonText: {
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  gemstoneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gemstoneItem: {
    width: '30%',
    marginBottom: 16,
  },
  gemImageContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    marginBottom: 4,
  },
  gemImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 4,
  },
  gemId: {
    textAlign: 'center',
    fontSize: 12,
    color: '#333',
  },
  banner: {
    width: '100%',
    height: 80,
    marginTop: 16,
  },
});

export default GemstoneMarketplace;