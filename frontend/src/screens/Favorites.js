import React, { useState } from "react";
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
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const OrderRequestModal = ({ visible, onClose, selectedPerson }) => {
  const [additionalMessage, setAdditionalMessage] = useState("");

  if (!selectedPerson) return null;

  const gemImages = [
    { id: "EM001", source: require("../assets/gems/EM001.png") },
    { id: "RR001", source: require("../assets/gems/RR001.png") },
    { id: "YS001", source: require("../assets/gems/YS001.png") },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalContent}>
          <LinearGradient
            colors={[
              'rgba(67, 96, 114, 1)',
              'rgba(7, 45, 68, 1)'
            ]}
            style={modalStyles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <Text style={modalStyles.orderId}>Order#: NB01130</Text>

          <Text style={modalStyles.personName}>{selectedPerson.name}</Text>

          <View style={modalStyles.gemImagesContainer}>
            {gemImages.map((gem) => (
              <Image key={gem.id} source={gem.source} style={modalStyles.gemImage} />
            ))}
          </View>

          <TextInput
            style={modalStyles.messageInput}
            placeholder="Additional messages (optional)"
            placeholderTextColor="#666"
            multiline
            value={additionalMessage}
            onChangeText={setAdditionalMessage}
          />

          <View style={modalStyles.buttonContainer}>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.cancelButton]}
              onPress={onClose}
            >
              <Text style={modalStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[modalStyles.button, modalStyles.sendButton]}
              onPress={onClose}
            >
              <Text style={modalStyles.buttonText}>Send Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const FavoritesScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState("Cutter");
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  // All available categories
  const categories = ["All", "Cutter", "Burner", "Elec. Burner"];

  // Complete list of favorites with their respective types
  const allFavorites = [
    {
      id: "1",
      name: "Dulith Wanigarathne",
      role: "Cutter",
      image: require("../assets/gems/BS001.png"),
      type: "Cutter",
    },
    {
      id: "2",
      name: "Isum Hansaja Perera",
      role: "Cutter",
      image: require("../assets/gems/BS001.png"),
      type: "Cutter",
    },
    {
      id: "3",
      name: "Kavintha Dinushan",
      role: "Cutter",
      image: require("../assets/gems/BS001.png"),
      type: "Cutter",
    },
    {
      id: "4",
      name: "Nihal Hewarthna",
      role: "Cutter",
      image: require("../assets/gems/BS001.png"),
      type: "Cutter",
    },
    {
      id: "5",
      name: "Rajitha Perera",
      role: "Burner",
      image: require("../assets/gems/BS001.png"),
      type: "Burner",
    },
    {
      id: "6",
      name: "Tharushi Silva",
      role: "Burner",
      image: require("../assets/gems/BS001.png"),
      type: "Burner",
    },
    {
      id: "7",
      name: "Kasun Fernando",
      role: "Elec. Burner",
      image: require("../assets/gems/BS001.png"),
      type: "Elec. Burner",
    },
    {
      id: "8",
      name: "Sampath Kumara",
      role: "Elec. Burner",
      image: require("../assets/gems/BS001.png"),
      type: "Elec. Burner",
    },
  ];

  // Filter favorites based on selected category and search query
  // Sort alphabetically when "All" category is selected
  const filteredFavorites = allFavorites
    .filter((item) => {
      const matchesCategory = selectedCategory === "All" || item.type === selectedCategory;
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      // Only sort alphabetically if "All" category is selected
      if (selectedCategory === "All") {
        return a.name.localeCompare(b.name);
      }
      return 0; // Keep original order for other categories
    });

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const handleFavoriteSelect = (person) => {
    setSelectedPerson(person);
  };

  const handleConfirm = () => {
    if (selectedPerson) {
      setModalVisible(true);
    }
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.favoriteItem}
      onPress={() => handleFavoriteSelect(item)}
    >
      <View style={styles.favoriteContent}>
        <Image source={item.image} style={styles.profileImage} />
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.role}>{item.role}</Text>
        </View>
      </View>
      <View
        style={[
          styles.checkbox,
          selectedPerson?.id === item.id && styles.checkboxSelected,
        ]}
      >
        {selectedPerson?.id === item.id && (
          <Ionicons name="checkmark" size={20} color="white" />
        )}
      </View>
    </TouchableOpacity>
  );

  // Updated gradient colors to match the image
  const gradientColors = [
    'rgba(71, 113, 135, 1)',
    'rgba(53, 92, 115, 1)',
    'rgba(40, 78, 103, 1)',
    'rgba(28, 65, 88, 1)',
    'rgba(19, 54, 78, 1)'
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header with increased top margin */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Favourites</Text>
            <View style={styles.placeholder} />
          </View>

          {/* Search Bar */}
          <View style={styles.search}>
            <Ionicons
              name="search"
              size={20}
              color="#828282"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#828282"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Tab Bar */}
          <View style={styles.tabBar}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.tabButton,
                  selectedCategory === category ? 
                    styles.tabButtonActive : 
                    styles.tabButtonInactive
                ]}
                onPress={() => handleCategoryPress(category)}
              >
                <Text 
                  style={[
                    styles.tabText, 
                    selectedCategory === category ? 
                      styles.tabTextActive : 
                      styles.tabTextInactive
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Favorites List */}
          <FlatList
            data={filteredFavorites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.id}
            style={styles.list}
            contentContainerStyle={styles.listContent}
          />

          {/* Confirm Button with increased bottom margin for navbar */}
          <View style={styles.confirmButtonContainer}>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>

          <OrderRequestModal
            visible={modalVisible}
            onClose={() => {
              setModalVisible(false);
              setSelectedPerson(null);
            }}
            selectedPerson={selectedPerson}
          />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    paddingHorizontal: 15,
    backgroundColor: '#072D44',
    marginTop: 10, // Added top margin to match the image
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: "#ffffff",
    fontFamily: "Inter-Regular",
    fontSize: 17,
    fontWeight: "500",
  },
  placeholder: {
    width: 24,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 40,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  tabButton: {
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    minWidth: 70,
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#170969',
  },
  tabButtonInactive: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  tabTextInactive: {
    color: '#333333',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  favoriteItem: {
    backgroundColor: 'rgba(172, 177, 183, 0.21)',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    height: 72,
  },
  favoriteContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    justifyContent: 'center',
  },
  name: {
    color: '#ffffff',
    fontFamily: "Inter-Medium",
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 3,
  },
  role: {
    color: '#ffffff',
    fontFamily: "Inter-Medium",
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.8,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(23, 9, 105, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#170969',
  },
  confirmButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 70, // Increased bottom padding to make space for the navigation bar
    marginTop: 10,
  },
  confirmButton: {
    backgroundColor: '#7daab8',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    color: '#170969',
    fontFamily: "Inter-Medium",
    fontSize: 14,
    fontWeight: '500',
  },
});

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: 288,
    height: 390,
    borderRadius: 10,
    padding: 20,
    backgroundColor: 'transparent', // Remove background color since we'll use gradient
  },
  gradientBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 10,
  },
  orderId: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  personName: {
    color: "white",
    fontSize: 16,
    marginBottom: 16,
  },
  gemImagesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  gemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  messageInput: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#FF3B30",
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#34C759",
    marginLeft: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default FavoritesScreen;