import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL, ENDPOINTS } from "../config/api";
import HeaderBar from "../components/HeaderBar";
import { baseScreenStylesNew } from "../styles/baseStylesNew";

const FavoritesScreen = ({ route, navigation }) => {
  // 1. State variables
  const selectedGems = route.params?.selectedGems || [];
  
  const [searchQuery, setSearchQuery] = useState("");
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [specialNote, setSpecialNote] = useState("");
  
  // 2. Effect to fetch workers on component mount
  useEffect(() => {
    fetchWorkers();
  }, []);
  
  // 3. Effect to filter workers when search query changes
  useEffect(() => {
    if (workers.length > 0) {
      const filtered = workers.filter(worker => {
        const fullName = `${worker.firstName} ${worker.lastName}`.toLowerCase();
        const username = worker.username?.toLowerCase() || "";
        return fullName.includes(searchQuery.toLowerCase()) || 
               username.includes(searchQuery.toLowerCase());
      });
      setFilteredWorkers(filtered);
    }
  }, [searchQuery, workers]);
  
  // 4. Function to fetch worker contacts
  const fetchWorkers = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Not logged in");
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${API_URL}${ENDPOINTS.GET_CONTACTS}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Filter to only include workers (Cutter, Burner, Electric Burner)
      const workerContacts = response.data.filter(
        contact => ['Cutter', 'Burner', 'Electric Burner'].includes(contact.role)
      );
      
      setWorkers(workerContacts);
      setFilteredWorkers(workerContacts);
    } catch (error) {
      console.error("Error fetching workers:", error);
      Alert.alert("Error", "Failed to load workers");
    } finally {
      setLoading(false);
    }
  };
  
  // 5. Function to handle worker selection
  const handleWorkerSelect = (workerId) => {
    console.log("Selecting worker:", workerId);
    setSelectedWorkerId(selectedWorkerId === workerId ? null : workerId);
  };
  
  // 6. Function to handle order confirmation
  const handleConfirm = () => {
    if (!selectedWorkerId) {
      Alert.alert("Error", "Please select a worker first");
      return;
    }
    
    setOrderModalVisible(true);
  };
  
  // 7. Function to send the order request
  const handleSendOrder = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        Alert.alert("Error", "Not logged in");
        return;
      }
      
      // Use id instead of _id
      const selectedWorker = workers.find(w => w.id === selectedWorkerId);
      if (!selectedWorker) {
        Alert.alert("Error", "Selected worker not found");
        return;
      }
      
      // Check if gems are selected
      if (!selectedGems || selectedGems.length === 0) {
        Alert.alert("Error", "No gems selected");
        return;
      }

      // Determine order type based on worker role
      let orderType = "cutting";
      if (selectedWorker.role === "Burner" || selectedWorker.role === "Electric Burner") {
        orderType = "burning";
      }
      
      // Extract gem IDs more carefully
      const gemIds = selectedGems.map(gem => {
        // Try various property names where ID might be stored
        return gem._id || gem.id || gem.gemId;
      }).filter(id => id); // Remove any undefined/null values
      
      // Check if we have any valid gem IDs
      if (gemIds.length === 0) {
        console.error("Could not extract valid gem IDs");
        Alert.alert("Error", "Could not identify gem IDs");
        return;
      }
      
      const orderData = {
        gemIds: gemIds,
        workerId: selectedWorkerId,
        orderType,
        specialNote
      };
      
      console.log("Sending order data:", orderData);
      
      const response = await axios.post(
        `${API_URL}${ENDPOINTS.CREATE_ORDER || '/api/orders'}`, 
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Order response:", response.data);
      
      // Send alert - using complete URL path
      const response2 = await axios.post(
        `${API_URL}/api/alerts`, // Added /api prefix
        {
          recipient: selectedWorkerId,
          message: "Order request received",
          relatedTo: "order",
          relatedId: response.data.order._id,
          priority: "medium",
          clickAction: "openOrderRequests"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      console.log("Alert response:", response2.data);
     
      
      // Close modal and navigate back
      setOrderModalVisible(false);
      Alert.alert("Success", "Order sent successfully", [
        { text: "OK", onPress: () => navigation.navigate("HomeMyGems") }
      ]);
    } catch (error) {
      console.error("Error sending order:", error.response?.data || error.message);
      Alert.alert("Error", error.response?.data?.message || "Failed to send order");
    }
  };
  
  // 8. Render a worker item
  const renderWorkerItem = ({ item }) => {
    // Use item.id instead of item._id
    const isSelected = selectedWorkerId === item.id;
    
    return (
      <TouchableOpacity 
        style={[
          styles.workerItem,
          isSelected && styles.selectedWorkerItem
        ]}
        onPress={() => handleWorkerSelect(item.id)}
      >
        <Image 
          source={
            item.avatar 
              ? { uri: item.avatar }
              : require("../assets/default-images/user_with_gem.jpeg")
          }
          style={styles.workerImage} 
        />
        
        <View style={styles.workerInfo}>
          <Text style={styles.workerName}>{item.name}</Text>
          <Text style={styles.workerUsername}>
            @{item.username} • {item.role}
          </Text>
        </View>
        
        <View style={[
          styles.selectionIndicator,
          isSelected && [styles.selectedIndicator, baseScreenStylesNew.themeColor]
        ]}>
          {isSelected && <Ionicons name="checkmark" size={20} color="#fff" />}
        </View>
      </TouchableOpacity>
    );
  };
  
  // 9. Render the confirmation modal
  const renderOrderModal = () => {
    // Use id instead of _id
    const selectedWorker = workers.find(w => w.id === selectedWorkerId);
    
    if (!selectedWorker) return null;
    
    return (
      <Modal
        visible={orderModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setOrderModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Order</Text>
              <TouchableOpacity 
                onPress={() => setOrderModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.workerInfoContainer}>
              <Image 
                source={
                  selectedWorker.avatar 
                    ? { uri: selectedWorker.avatar }
                    : require("../assets/default-images/user_with_gem.jpeg")
                }
                style={styles.modalWorkerImage} 
              />
              <View style={styles.workerInfoDetails}>
                <Text style={styles.modalWorkerName}>{selectedWorker.name}</Text>
                <Text style={styles.modalWorkerUsername}>
                  @{selectedWorker.username} • {selectedWorker.role}
                </Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <Text style={styles.sectionTitle}>Selected Gems</Text>
            {selectedGems && selectedGems.length > 0 ? (
              <FlatList
                data={selectedGems}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => {
                  
                  return (
                    <View style={styles.gemCard}>
                      <Image 
                        source={
                          item.photo || item.image
                            ? { uri: item.photo || item.image }
                            : require("../assets/default-images/no_gem.jpeg")
                        }
                        style={styles.gemImage} 
                      />
                      <View style={styles.gemInfo}>
                        <Text style={styles.gemId}>{item.gemId || "Unknown ID"}</Text>
                        <Text style={styles.gemType}>
                          {item.details?.gemType || item.gemType || "Unknown"}
                        </Text>
                      </View>
                    </View>
                  );
                }}
                keyExtractor={(item, index) => item.gemId || item._id || `gem-${index}`}
                contentContainerStyle={styles.gemList}
              />
            ) : (
              <View style={styles.emptyGemsContainer}>
                <Text style={styles.emptyText}>No gems selected</Text>
              </View>
            )}
            
            <View style={styles.divider} />
            
            <TextInput
              style={styles.noteInput}
              placeholder="Special instructions (optional)"
              placeholderTextColor="#999"
              multiline
              value={specialNote}
              onChangeText={setSpecialNote}
            />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setOrderModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sendButton, baseScreenStylesNew.themeColor]}
                onPress={handleSendOrder}
              >
                <Text style={styles.sendButtonText}>Send Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };
  
  // 10. Main render
  return (
    <SafeAreaView style={baseScreenStylesNew.container}>
      <HeaderBar 
        title="Select Worker" 
        navigation={navigation} 
        showBack={true} 
      />
      
      <View style={styles.searchContainer}>
        <View style={baseScreenStylesNew.search}>
          <Ionicons
            name="search"
            size={20}
            style={baseScreenStylesNew.searchIcon}
          />
          <TextInput
            style={baseScreenStylesNew.searchInput}
            placeholder="Search workers..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#9CCDDB" />
          <Text style={styles.loadingText}>Loading workers...</Text>
        </View>
      ) : filteredWorkers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people" size={50} color="#ccc" />
          <Text style={styles.emptyText}>
            {searchQuery ? "No matching workers found" : "No workers found"}
          </Text>
          {searchQuery && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearSearchText}>Clear search</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredWorkers}
          renderItem={renderWorkerItem}
          keyExtractor={(item) => item.id} // Use item.id instead of item._id
          style={styles.workerList}
          contentContainerStyle={styles.workerListContent}
        />
      )}
      
      <View style={styles.confirmButtonContainer}>
        <TouchableOpacity 
          style={[
            baseScreenStylesNew.Button1,
            !selectedWorkerId && styles.disabledButton
          ]}
          onPress={handleConfirm}
          disabled={!selectedWorkerId}
        >
          <Text style={baseScreenStylesNew.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
      
      {renderOrderModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Search and list styles
  searchContainer: {
    padding: 15,
  },
  workerList: {
    flex: 1,
  },
  workerListContent: {
    paddingHorizontal: 15,
  },
  
  // Worker item styles
  workerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedWorkerItem: {
    borderWidth: 2,
    borderColor: '#9CCDDB',
  },
  workerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  workerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  workerName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  workerUsername: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicator: {
    borderColor: 'transparent',
  },
  
  // Bottom confirm button styles
  confirmButtonContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    marginTop: 10,
  },
  disabledButton: {
    opacity: 0.6,
  },
  
  // Loading and empty states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  clearSearchText: {
    color: '#9CCDDB',
    marginTop: 10,
    fontSize: 16,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: "white",
    borderRadius: 15,
    padding: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  workerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  modalWorkerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  workerInfoDetails: {
    marginLeft: 15,
  },
  modalWorkerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalWorkerUsername: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 15,
    marginTop: 5,
  },
  gemList: {
    padding: 15,
  },
  gemCard: {
    width: 120,
    marginRight: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  gemImage: {
    width: '100%',
    height: 100,
  },
  gemInfo: {
    padding: 8,
  },
  gemId: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },
  gemType: {
    fontSize: 12,
    color: '#666',
  },
  noteInput: {
    marginHorizontal: 15,
    marginVertical: 10,
    padding: 12,
    height: 100,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F3F3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  sendButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: 'bold',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyGemsContainer: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FavoritesScreen;