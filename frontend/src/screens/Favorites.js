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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import Header_2 from "../components/Header_2";
import { baseScreenStylesNew } from "../styles/baseStylesNew";

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
              'rgb(3, 15, 79)',
              'rgb(11, 10, 43)'
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
              style={[baseScreenStylesNew.cancelButton, modalStyles.button, modalStyles.cancelButton]}
              onPress={onClose}
            >
              <Text style={modalStyles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[baseScreenStylesNew.Button3, modalStyles.button, modalStyles.sendButton]}
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
      image: require("../assets/seller.png"),
      type: "Cutter",
    },
    {
      id: "2",
      name: "Isum Hansaja Perera",
      role: "Cutter",
      image: require("../assets/seller.png"),
      type: "Cutter",
    },
    {
      id: "3",
      name: "Kavintha Dinushan",
      role: "Cutter",
      image: require("../assets/seller.png"),
      type: "Cutter",
    },
    {
      id: "4",
      name: "Nihal Hewarthna",
      role: "Cutter",
      image: require("../assets/seller.png"),
      type: "Cutter",
    },
    {
      id: "5",
      name: "Rajitha Perera",
      role: "Burner",
      image: require("../assets/seller.png"),
      type: "Burner",
    },
    {
      id: "6",
      name: "Tharushi Silva",
      role: "Burner",
      image: require("../assets/seller.png"),
      type: "Burner",
    },
    {
      id: "7",
      name: "Kasun Fernando",
      role: "Elec. Burner",
      image: require("../assets/seller.png"),
      type: "Elec. Burner",
    },
    {
      id: "8",
      name: "Sampath Kumara",
      role: "Elec. Burner",
      image: require("../assets/seller.png"),
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
      style={[ baseScreenStylesNew.item,styles.favoriteItem]}
      onPress={() => handleFavoriteSelect(item)}
    >
      <View style={styles.favoriteContent}>
        <Image source={item.image} style={styles.profileImage} />
        <View style={[baseScreenStylesNew.blackText, styles.textContainer]}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.role}>{item.role}</Text>
        </View>
      </View>
      <View
        style={[
          baseScreenStylesNew.checkBox,
          styles.checkbox,
          selectedPerson?.id === item.id && baseScreenStylesNew.themeColor,
        ]}
      >
        {selectedPerson?.id === item.id && (
          <Ionicons name="checkmark" size={20} color="white" />
        )}
      </View>
    </TouchableOpacity>
  );


  return (
    <View style={[baseScreenStylesNew.container, styles.container]}>
      <Header_2 title ="Favourites"/>
        <SafeAreaView style={styles.safeArea}>
          {/* Search Bar */}
          <View style={baseScreenStylesNew.search}>
            <Ionicons
              name="search"
              size={20}
              style={baseScreenStylesNew.searchIcon}
            />
            <TextInput
              style={baseScreenStylesNew.searchInput}
              placeholder="Send order to?"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* Tab Bar */}
          <View style={baseScreenStylesNew.tabBar}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  baseScreenStylesNew.tabButton,
                  selectedCategory === category ? 
                    baseScreenStylesNew.tabButtonActive : 
                    baseScreenStylesNew.tabButtonInactive
                ]}
                onPress={() => handleCategoryPress(category)}
              >
                <Text 
                  style={[
                    baseScreenStylesNew.tabText, 
                    selectedCategory === category ? 
                      baseScreenStylesNew.tabTextActive : 
                      baseScreenStylesNew.tabTextInactive
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
            <TouchableOpacity style={baseScreenStylesNew.Button1} onPress={handleConfirm}>
              <Text style={baseScreenStylesNew.buttonText}>Confirm</Text>
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
  backButton: {
    padding: 5,
  },
  
  placeholder: {
    width: 24,
  },
  
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  favoriteItem: {
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 16,
    height: 80,
  },
  favoriteContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 61,
    height: 56,
    borderRadius: 32,
    marginRight: 15,
  },
  textContainer: {
    justifyContent: 'center',
  },
  name: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  role: {
    fontFamily: "Inter-Medium",
    fontSize: 14,
    fontWeight: 'bold',
    opacity: 0.8,
  },
  checkbox: {
    width: 40,
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  confirmButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 70, // Increased bottom padding to make space for the navigation bar
    marginTop: 10,
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
    marginRight: 8,
  },
  sendButton: {
    marginLeft: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default FavoritesScreen;