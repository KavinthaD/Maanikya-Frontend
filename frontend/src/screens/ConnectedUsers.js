import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { baseScreenStyles } from "../styles/baseStyles";
import Header_2 from "../components/Header_2";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
/*
const personData = {
  name: "Dulith Wanigarathne",
  role: "Cutter",
  rating: 3,
  image: require("../assets/seller.png"),
  title: "Wanigarathna Cutters & Co.",
  contact: "+94 765 468 795",
  email: "dulith.wanige@manikhora.com",
  location: "Nivitigala, Rathnapura",
  pastWork: [
    require("../assets/Gem1.png"),
    require("../assets/Gem2.png"),
    require("../assets/Gem3.png"),
    require("../assets/Gem4.png"),
    require("../assets/Gem5.png"),
    require("../assets/Gem6.png"),
  ],
  isFavorite: false, // Added isFavorite property
};*/

const ConnectedUsers = ({route, navigation}) => {
  const personId = route.params.personId; 
  console.log('Received personId in ConnectedUsers:', personId);
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const handleStarRating = (rating) => {
    setPerson({ ...person, rating: rating });
  };

  const getAuthToken = async () => {
    try {
      //const token = await AsyncStorage.getItem('authToken'); 
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2QxYmYzZTgyYjBjZWUxNWQ2NTM0ZjQiLCJ1c2VybmFtZSI6ImpvaG4yMiIsImxvZ2luUm9sZSI6IkdlbSBidXNpbmVzcyBvd25lciIsImlhdCI6MTc0MjAxODYwNSwiZXhwIjoxNzQyMTA1MDA1fQ.diYw99aTzlECPdcOnpCz-i5_0O5ELbWCmvNfNxsZYrE"
      return token;
    } catch (e) {
      console.error("Failed to retrieve auth token:", e);
      return null;
    }
  };

  useEffect(() => {
    const fetchPersonData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getAuthToken(); 
        console.log('Token:', token);
        console.log('PersonId:', personId); 
        
        if (!token) { 
          setError("Authentication token not found."); 
          return; 
        }

        const response = await fetch(
          `http://10.0.2.2:5000/api/connect/${personId}`,{
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Response status:', response.status); 

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched data:', data);

        if (!data) {
          throw new Error('No data received from server');
        }

        setPerson(data);
      } catch (error) {
        console.error("Error fetching person data:", error);
        setError(error.message || "Failed to fetch person data");
      } finally {
        setLoading(false);
      }
    };

    if (personId) { 
      fetchPersonData();
    } else {
      setError("No person ID provided");
    }
  }, [personId]);

  /*if (!person) {
    return (
      <View style={styles.errorContainer}>
        <Text>No user data found</Text>
      </View>
    );
  }  */
  const toggleFavorite = async() => {
    try {
      const token = await getAuthToken(); 
      if (!token) { 
        console.error("No auth token found"); 
        return; 
      }
      const response = await fetch(`http://10.0.2.2:5000/api/persons/${person._id}/favorite`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFavorite: !person.isFavorite }), // Use `id` here
      });

      if (!response.ok) {
        throw new Error(`Failed to update favorite status: ${response.status}`);
      }
    } catch (e) {
      console.error("Error updating favorite status:", e);
    }
    setPerson({ ...person, isFavorite: !person.isFavorite }); 
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3B5998" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error || !person) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>
          {error || "No user data found"}
        </Text>
      </View>
    );
  }

  // Add this check before accessing person properties
  if (!person.image && !person.firstName) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Invalid user data received</Text>
      </View>
    );
  }

  return (
    <View style={[baseScreenStyles.container, styles.container]}>
      <Text style={styles.header}>Connect</Text>

      <View style={styles.profileCard}>
       <Image source={person.image ? { uri: person.image } : require('../assets/seller.png')} style={styles.image}
            defaultSource={require('../assets/seller.png')}
      />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{person.firstName} {person.lastName}</Text>
          <Text style={styles.role}>{person.role}</Text>
          <View style={styles.rating}>
            {[...Array(5)].map((_, i) => (
              <TouchableOpacity key={i} onPress={() => handleStarRating(i + 1)}>
                <Ionicons
                  key={i}
                  name={i < person.rating ? "star" : "star-outline"}
                  size={16}
                  color={"#3B5998"} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity onPress={toggleFavorite}>
          <Ionicons
            name={person.isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={"#3B5998"} 
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.detail}>
          <Text style={styles.bold}>TITLE :</Text> {person.title || "N/A"}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.bold}>CONTACT NO :</Text> {person.contact || "N/A"}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.bold}>E-MAIL :</Text> {person.email || "N/A"}
        </Text>
        <Text style={styles.detail}>
          <Text style={styles.bold}>LOCATION :</Text> {person.location || "N/A"}
        </Text>
      </View>
      <Text style={styles.sectionTitle}>PAST WORK</Text>
      <FlatList
        data={person.pastWork}
        numColumns={3}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={item} style={styles.pastWorkImage} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {},
  profileCard: {
    flexDirection: "row",
    backgroundColor: "#CDE3F9",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  profileImage: { width: 50, height: 50, borderRadius: 25, marginRight: 10 },
  profileInfo: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold" },
  role: { fontSize: 14, color: "black" },
  rating: { flexDirection: "row", marginTop: 5 },
  icon: { marginLeft: 10, color: "#3B5998" }, 
  detailsContainer: {
    backgroundColor: "#CDE3F9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  detail: { fontSize: 14, marginBottom: 5 },
  bold: { fontWeight: "bold" },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  pastWorkImage: { width: 100, height: 100, margin: 5, borderRadius: 8 },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  }
});


export default ConnectedUsers;