//Screen creator: Isum  //this is ownertracker

import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Image, TextInput, SafeAreaView, TouchableOpacity } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import Header_2 from "../../components/Header_2";
import { API_URL, ENDPOINTS } from "../../config/api"; // **Routes are imported from api.js**
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tracker = ({navigation}) => {
  //manage the search option
  const [search, setSearch] = useState("");

  const [progressGem, setProgressGem] = useState([]);
  const [completeGem, setCompleteGem] = useState([]);


  useEffect(() => {
    const fetchGemData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');

        // Fetch In-Progress Gems
        const progressResponse = await fetch(`${API_URL}${ENDPOINTS.OWNER_IN_PROGRESS_ORDERS}`, { // **Route from ENDPOINTS**
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!progressResponse.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const progressData = await progressResponse.json();
        setProgressGem(progressData);

        // Fetch Completed Gems
        const completeResponse = await fetch(`${API_URL}${ENDPOINTS.OWNER_COMPLETED_ORDERS}`, { // **Route from ENDPOINTS**
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!completeResponse.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const completeData = await completeResponse.json();
        setCompleteGem(completeData);

      } catch (error) {
        console.error("Error fetching gem data:", error);
      }
    };

    fetchGemData();
  }, []);


  const selectedGems = progressGem.filter((gem) =>
    gem.id.toLowerCase().includes(search.toLowerCase())
  );


  const handleGemPress = (gem) => {
    navigation.navigate("OwnerOrderTrackDetails", { gem });
  };


  const renderGem = ({item}) => (
    <View style={styles.gemItem}>
      <TouchableOpacity onPress={() => handleGemPress(item)}>
        <Image source={{ uri: item.gemImage }} style={styles.gemImage} />
      </TouchableOpacity>
      <Text style={styles.gemCode}>{item.code}</Text>
    </View>
  );


  return (

      <SafeAreaView style={baseScreenStylesNew.container}>
        <Header_2 title="Tracker"/>
        <View style={baseScreenStylesNew.search}>
          <Ionicons name="search" size={20} color="#888" style={baseScreenStylesNew.searchIcon} />
          <TextInput
            style={styles.searchData}
            placeholder="Search Gem ID"
            value={search}
            onChangeText={(text) => setSearch(text)}
            placeholderTextColor="#888"
          />
        </View>

        {/*In progress gems*/}
        <View style={styles.sectionContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("InProgressTrackerScreen")}>
          <Text style={styles.subTopicProgress}>In Progress {'>'}</Text>
          </TouchableOpacity>
          <FlatList
            data={selectedGems.slice(0, 3)}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={renderGem}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/*Completed gems*/}
        <View style={styles.sectionContainer} >
          <TouchableOpacity onPress ={()=> navigation.navigate("CompletedTrackerScreen")}>
          <Text style={styles.subTopicCompleted}>Completed {'>'}</Text>
          </TouchableOpacity>
          <FlatList
            data={completeGem.slice(0, 3)}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={renderGem}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchData: {
    flex: 1,
    fontSize: 16
  },
  sectionContainer: {
    marginBottom: 50,
    marginTop: 30,
    paddingVertical: 10,
    backgroundColor:'rgb(195, 200, 207)',
    borderRadius: 10,
    marginHorizontal: 16,
    paddingLeft: 16,
    width: "auto",
    elevation: 12
  },
  subTopicProgress: {
    fontSize: 18,
    fontWeight: "bold",
    color:"#000",
    marginBottom: 10,
  },
  subTopicCompleted: {
    fontSize: 18,
    fontWeight: "bold",
    color:"#000",
    marginBottom: 10,
  },
  gemItem: {
    alignItems: "center",
    margin: 16,
  },
  gemImage: {
    width: 90,
    height: 100,
    borderRadius: 12,
  },
  gemCode: {
    marginTop: 5,
    fontSize: 14,
    color: "#000",
  }
});

export default Tracker;