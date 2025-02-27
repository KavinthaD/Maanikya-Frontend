//Screen Creator Tilmi

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
import { baseScreenStyles } from "../styles/baseStyles";
import Header_1 from "../components/Header_1";

const OrderRequestModal = ({ visible, onClose, selectedPerson }) => {
  const [additionalMessage, setAdditionalMessage] = useState("");

  if (!selectedPerson) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.orderId}>Order#: NB01130</Text>

          <View style={styles.gemInfoContainer}>
            <Image source={selectedPerson.image} style={styles.gemImage} />
            <View style={styles.gemDetails}>
              <Text style={styles.personName}>{selectedPerson.name}</Text>
              <Text style={styles.gemId}>Gem #: IHP164</Text>
            </View>
          </View>

          <TextInput
            style={styles.messageInput}
            placeholder="Additional messages (optional)"
            placeholderTextColor="#666"
            multiline
            value={additionalMessage}
            onChangeText={setAdditionalMessage}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.sendButton]}
              onPress={onClose}
            >
              <Text style={styles.sendButtonText}>Send Request</Text>
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

  const categories = ["Cutter", "Burner", "Elec. Burner/Cutter"];

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
      name: "John Burner",
      role: "Burner",
      image: require("../assets/gems/BS001.png"),
      type: "Burner",
    },
    {
      id: "6",
      name: "Sarah Electric",
      role: "Elec. Burner/Cutter",
      image: require("../assets/gems/BS001.png"),
      type: "Elec. Burner/Cutter",
    },
  ];

  const filteredFavorites = allFavorites.filter((item) => {
    const matchesCategory = item.type === selectedCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

  const handleFavoriteSelect = (person) => {
    setSelectedPerson(person);
    setModalVisible(true);
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

  return (
    <SafeAreaView style={baseScreenStyles.container}>
      <Header_1 title="Favourites"/>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#666"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search person"
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => handleCategoryPress(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredFavorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      <OrderRequestModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedPerson(null);
        }}
        selectedPerson={selectedPerson}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    margin: 16,
    padding: 8,
    borderRadius: 8,
  },
  searchIcon: {
    marginHorizontal: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  categoriesContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "white",
  },
  categoryButtonActive: {
    backgroundColor: "#072D44",
  },
  categoryText: {
    color: "#333",
    fontSize: 14,
  },
  categoryTextActive: {
    color: "white",
  },
  list: {
    flex: 1,
  },
  favoriteItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  favoriteContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#ddd",
  },
  textContainer: {
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  role: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#004B64",
    borderColor: "#004B64",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#004B64",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    maxWidth: 400,
  },
  orderId: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  gemInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  gemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  gemDetails: {
    marginLeft: 12,
  },
  personName: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  gemId: {
    color: "#ccc",
    marginTop: 4,
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
  cancelButtonText: {
    color: "white",
    fontWeight: "600",
  },
  sendButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default FavoritesScreen;
