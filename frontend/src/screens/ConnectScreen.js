import React from 'react';
import { View, Text, FlatList, Image, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const people = [
  {
    id: '1',
    name: 'Dulith Wanigarathne',
    role: 'Cutter',
    rating: 4,
    avatar: 'https://via.placeholder.com/50', // Replace with actual image URL
    iconColor: '#FFC0CB',
  },
  {
    id: '2',
    name: 'Isum Hansaja Perera',
    role: 'Burner',
    rating: 3,
    avatar: 'https://via.placeholder.com/50', // Replace with actual image URL
    iconColor: '#F5A623',
  },
  {
    id: '3',
    name: 'Kavintha Dinushan',
    role: 'Electric Burner/Cutter',
    rating: 5,
    avatar: 'https://via.placeholder.com/50', // Replace with actual image URL
    iconColor: '#1E90FF',
  },
  {
    id: '4',
    name: 'Sriyanka Sansidu',
    role: 'Business Owner - Leo Gems',
    rating: 4,
    avatar: 'https://via.placeholder.com/50', // Replace with actual image URL
    iconColor: '#32CD32',
  },
];

const ConnectScreen = () => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.role}>{item.role}</Text>
        <View style={styles.rating}>
          {[...Array(5)].map((_, index) => (
            <FontAwesome
              key={index}
              name={index < item.rating ? 'star' : 'star-o'}
              size={16}
              color="#FFD700"
            />
          ))}
        </View>
      </View>
      <View style={[styles.iconContainer, { backgroundColor: item.iconColor }]}>
        <FontAwesome name="handshake-o" size={18} color="#fff" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Connect</Text>
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search person" />
        <TouchableOpacity style={styles.filterButton}>
          <FontAwesome name="filter" size={16} color="#000" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.addPerson}>
        <FontAwesome name="plus" size={24} color="#fff" />
        <Text style={styles.addPersonText}>Add person</Text>
      </TouchableOpacity>
      <FlatList
        data={people}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ConnectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0f7fa',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 15,
    backgroundColor: '#007BFF',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: 10,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderRadius: 8,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
  },
  addPerson: {
    alignItems: 'center',
    marginVertical: 20,
  },
  addPersonText: {
    marginTop: 5,
    fontSize: 16,
    color: '#007BFF',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
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
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 14,
    color: '#666',
  },
  rating: {
    flexDirection: 'row',
    marginTop: 5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
