import React, { useState, useEffect, useCallback } from "react"; // Import useEffect
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import debounce from 'lodash/debounce';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Updated categories to match the image
const categories = ["All", "Burner", "Elec. Burner", "Cutter", "Owner"];
/*
const initialPeople = [
  // Renamed to initialPeople
  {
    id: "1",
    name: "Dulith Wanigarathne",
    role: "Cutter",
    rating: 4,
    avatar: require("../assets/seller.png"),
  },
  {
    id: "2",
    name: "Isum Hansaja Perera",
    role: "Burner",
    rating: 3,
    avatar: require("../assets/seller.png"),
  },
  {
    id: "3",
    name: "Kavintha Dinushan",
    role: "Electric Burner/Cutter",
    rating: 5,
    avatar: require("../assets/seller.png"),
  },
  {
    id: "4",
    name: "Sriyanka Sansidu",
    role: "Business Owner - Leo Gems",
    rating: 4,
    avatar: require("../assets/seller.png"),
  },
  {
    id: "5",
    name: "Amal Perera", // Added a name starting with 'A' for testing search
    role: "Burner",
    rating: 3,
    avatar: require("../assets/seller.png"),
  },
  {
    id: "6",
    name: "Buddika Silva", // Added a name starting with 'B' for testing search
    role: "Owner",
    rating: 5,
    avatar: require("../assets/seller.png"),
  },
];
*/
const ConnectScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("All"); 
  const [favorites, setFavorites] = useState({});
  const [people, setPeople] = useState(); 
  const [personRatings, setPersonRatings] = useState({});
  const [searchText, setSearchText] = useState(""); 
  const [filteredPeople, setFilteredPeople] = useState(people); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);


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
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        console.error("No auth token found");
        return;
      }

      const response = await fetch(
        `http://10.0.2.2:5000/api/search?query=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((text) => performSearch(text), 300),
    []
  );

  useEffect(() => {
    // Function to filter people based on search text and category
    const filterData = async () => {
      setLoading(true);
      setError(null);
      
      
      try {
        const token = await getAuthToken();
        if (!token) {
          setError("Authentication token not found.");
          return;
        }
        let favoriteData = [];

        //let apiUrl = `http://10.0.2.2:5000/api/persons`; 

        if (searchText || selectedCategory === "All" || selectedCategory === "Owner" || selectedCategory==="Burner"||selectedCategory==="Elec. Burner" ||selectedCategory==="Cutter") {
          let favoritesApiUrl = `http://10.0.2.2:5000/api/favorites`;
  
          if (selectedCategory !== "All" && selectedCategory !== "Owner") {
            favoritesApiUrl = `http://10.0.2.2:5000/api/favorites/${selectedCategory}`; 
          }
  
          const favoritesResponse = await fetch(favoritesApiUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!favoritesResponse.ok) {
            throw new Error(`HTTP error fetching favorites! Status: ${favoritesResponse.status}`);
          }
          
          favoriteData = await favoritesResponse.json();
        }  

        let filteredData = [...favoriteData];

        if (searchText) {
          /*const lowerSearchText = searchText.toLowerCase();
          filteredData = filteredData.filter(person =>
            person.firstName.toLowerCase().startsWith(lowerSearchText) || person.lastName.toLowerCase().includes(lowerSearchText)
          );*/
          filteredData = searchResults;
        }
        
        if (selectedCategory !== "All" && selectedCategory !== "Owner" && !searchText) {
          filteredData = filteredData.filter(person => person.role === selectedCategory);
        }
        setPeople(filteredData);
        setFilteredPeople(filteredData);
        const initialRatings = {};
        filteredData.forEach((person) => {
          initialRatings[person._id] = person.rating || 0; 
        });
        setPersonRatings(initialRatings);

      } catch (e) {
        console.error("Error fetching data:", e);
        setError(e.message || "Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };
    filterData();
  }, [searchText, selectedCategory, searchResults]);

  const toggleFavorite = async(id) => {
    try {
      const token = await getAuthToken();
      if (!token) {
        console.error("No auth token found");
        return;
      }

      setPeople(prevPeople => {
        return prevPeople.map(person => {
          if (person._id === id) {
            return { ...person, isFavorite: !person.isFavorite };
          }
          return person;
        });
      });

      setFilteredPeople(prevFilteredPeople => {
        return prevFilteredPeople.map(person => {
          if (person._id === id) {
            return { ...person, isFavorite: !person.isFavorite };
          }
          return person;
        });
      });

      const response = await fetch(`http://10.0.2.2:5000/api/persons/${id}/favorite`, {  
        method: 'PATCH', 
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isFavorite: !people.find(p => p._id === id).isFavorite }), 
      });

      if (!response.ok) {
        setPeople(prevPeople => {
          return prevPeople.map(person => {
            if (person._id === id) {
              return { ...person, isFavorite: !person.isFavorite };
            }
            return person;
          });
        });
        setFilteredPeople(prevFilteredPeople => {
          return prevFilteredPeople.map(person => {
            if (person._id === id) {
              return { ...person, isFavorite: !person.isFavorite };
            }
            return person;
          });
        });
        throw new Error(`Failed to update favorite status: ${response.status}`);
      }
      fetchData();
    } catch (e) {
      console.error("Error updating favorite status:", e);
      
    }
  };


  const handleStarRating = (personId, rating) => {
    setPersonRatings((prevRatings) => ({
      ...prevRatings,
      [personId]: rating,
    }));

    // Optionally update the people array if you want to persist rating in the people data
    setPeople((prevPeople) =>
      prevPeople.map((person) =>
        person._id === personId ? { ...person, rating: rating } : person
      )
    );
  };

  const renderItem = ({ item }) => (
    
    <TouchableOpacity
      onPress={() => {
        console.log('Navigating to ConnectedUsers with ID:', item._id);
      
        navigation.navigate("ConnectedUsers", { personId: item._id });
        setSearchText('');
        setSearchResults([]);
      }}
    >
      <View style={styles.card}>
        <Image source={item.image ? { uri: item.image } : require('../assets/seller.png')} style={styles.searchImage}
                   defaultSource={require('../assets/seller.png')}
             />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.firstName} {item.lastName}</Text>
          <Text style={styles.role}>{item.role}</Text>
          <View style={styles.rating}>
            {[...Array(5)].map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleStarRating(item._id, index + 1)}
              >
                <FontAwesome
                  name={index < personRatings[item._id] ? "star" : "star-o"} // Use personRatings for star display
                  size={16}
                  color="#334D85"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(item._id)}>
          <FontAwesome
            name={favorites[item._id] ? "heart" : "heart-o"}
            size={26}
            color="#6646ee"
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
  const renderSearchItem = ({ item }) => (
    <TouchableOpacity
        style={styles.searchResultItem}
        onPress={() => {
            navigation.navigate("ConnectedUsers", { personId: item._id });
            setSearchText('');
            setSearchResults([]);
        }}
    >
        <Image
            source={item.image ? { uri: item.image } : require('../assets/seller.png')}
            style={styles.searchResultImage}
        />
        <View style={styles.searchResultTextContainer}>
            <Text style={styles.searchResultName}>
                {item.firstName} {item.lastName}
            </Text>
            <Text style={styles.searchResultRole}>{item.role}</Text>
        </View>
    </TouchableOpacity>
  );
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6646ee" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search person"
          value={searchText}
          onChangeText={(text) => {setSearchText(text); debouncedSearch(text);}} // Update searchText state
        />
        <MaterialIcons name="search" size={24} color="#6646ee" />
        {/* Changed to search icon */}
      </View>
      {searchText.length > 0 && (
        <View style={styles.searchResultsContainer}>
          {isSearching ? (
            <ActivityIndicator style={styles.searchingIndicator} />
          ) : searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item._id}
              renderItem={renderSearchItem}
              style={styles.searchResultsList}
            />
          ) : (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>No results found</Text>
            </View>
          )}
        </View>
      )}
      <View style={styles.addPersonContainer}>
        <View style={styles.addPersonButtonContainer}>
          <TouchableOpacity style={styles.addPersonButton}>
            <FontAwesome name="plus" size={15} color="#C1E8FF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.addPersonLabel}>Add person</Text>
      </View>

      {/* Category Filter Tabs */}
      <View style={{ height: 50 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabs}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.tab,
                selectedCategory === category && styles.activeTab,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedCategory === category && styles.activeTabText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* People List */}
      <FlatList
        data={filteredPeople} // Use filteredPeople for data
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    backgroundColor: "#9CCDDB",
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 15,
    height: 40,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 5,
  },
  addPersonContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  addPersonButtonContainer: {
    width: 50,
    height: 50,
    borderRadius: 29,
    backgroundColor: "#C1E8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  addPersonButton: {
    width: 27,
    height: 27,
    borderRadius: 25,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  addPersonLabel: {
    fontSize: 14,
    marginTop: 5,
  },
  tabs: {
    flexDirection: "row",
    marginHorizontal: 15,
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 2,
    elevation: 2,
    height: 30,
  },
  tab: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#6646ee",
  },
  activeTabText: {
    color: "#6646ee",
    fontWeight: "bold",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  role: {
    fontSize: 14,
    color: "#666",
  },
  rating: {
    flexDirection: "row",
    marginTop: 5,
  },
  searchResultItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchResultImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  searchResultTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  searchResultName: {
    fontSize: 16,
    fontWeight: '500',
  },
  searchResultRole: {
    fontSize: 14,
    color: '#666',
  },
  searchingIndicator: {
    padding: 20,
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#666',
  },
  searchResultsList: {
    maxHeight: 300,
  },
  searchResultsContainer: {
    position: 'absolute',
    top: 60,
    left: 15,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    maxHeight: 300,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default ConnectScreen;