//Screen Creator Tilmi
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  Platform,
  StatusBar,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { baseScreenStylesNew } from "../../styles/baseStylesNew";
import Header_2 from "../../components/Header_2";
import BS_NavBar from "../../components/BS_NavBar";
import { LinearGradient } from 'expo-linear-gradient';


const gems = [
  { id: "BS001", image: require("../../assets/gems/BS001.png") },
  { id: "EM001", image: require("../../assets/gems/EM001.png") },
  { id: "RR001", image: require("../../assets/gems/RR001.png") },
  { id: "YS001", image: require("../../assets/gems/YS001.png") },
  { id: "BS002", image: require("../../assets/gems/BS002.png") },
  { id: "PS001", image: require("../../assets/gems/PS001.png") },
  { id: "PT001", image: require("../../assets/gems/PT001.png") },
  { id: "EM002", image: require("../../assets/gems/EM002.png") },
  { id: "YS002", image: require("../../assets/gems/YS002.png") },
];

const GemCollectionScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedGems, setSelectedGems] = useState([]);
  const [sortAscending, setSortAscending] = useState(true);
  const [isSellModalVisible, setSellModalVisible] = useState(false);

  const filteredGems = gems.filter((gem) =>
    gem.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedGems = [...filteredGems].sort((a, b) => {
    return sortAscending ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
  });

  const toggleSort = () => {
    setSortAscending(!sortAscending);
  };

  const toggleSelect = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedGems([]);
  };

  const toggleGemSelection = (gemId) => {
    if (!isSelectMode) {
      navigation.navigate("MyGems", { gemId });
      return;
    }
    setSelectedGems((prev) => {
      if (prev.includes(gemId)) {
        return prev.filter((id) => id !== gemId);
      } else {
        return [...prev, gemId];
      }
    });
  };

  const handleSendOrder = () => {
    console.log("Sending order for gems:", selectedGems);
    setIsSelectMode(false);
    setSelectedGems([]);
    navigation.navigate("FavoritesScreen");
  };

  const handleSellPress = () => {
    setSellModalVisible(true);
  };

  const handleSellConfirm = () => {
    console.log("Selling gems:", selectedGems);
    setSellModalVisible(false);
    setIsSelectMode(false);
    setSelectedGems([]);
    navigation.navigate("GemstoneMarketplace");
  };

  const handleSellCancel = () => {
    setSellModalVisible(false);
  };

  const renderSelectedGemItem = ({ item }) => {
    const gemData = gems.find((g) => g.id === item);
    return (
      <View style={styles.modalGemItem}>
        <Image
          source={gemData.image}
          style={styles.modalGemImage}
          resizeMode="cover"
        />
        <Text style={[styles.modalGemId, { marginTop: 0 }]}>{gemData.id}</Text>
      </View>
    );
  };

  const renderGemItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.gemCard,
        isSelectMode &&
          selectedGems.length > 0 && {
            opacity: selectedGems.includes(item.id) ? 1 : 0.7,
          },
      ]}
      onPress={() => toggleGemSelection(item.id)}
    >
      <Image
        source={item.image}
        style={[
          styles.gemImage,
          isSelectMode &&
            selectedGems.length > 0 && {
              opacity: selectedGems.includes(item.id) ? 1 : 0.7,
            },
        ]}
        resizeMode="cover"
      />
      {isSelectMode && (
        <View style={styles.selectionCircle}>
          {selectedGems.includes(item.id) && (
            <View style={styles.selectedDot} />
          )}
        </View>
      )}
      <Text
        style={[
          styles.gemId,
          isSelectMode &&
            selectedGems.length > 0 && {
              opacity: selectedGems.includes(item.id) ? 1 : 0.7,
            },
        ]}
      >
        {item.id}
      </Text>
    </TouchableOpacity>
  );

  return (
      <SafeAreaView style={baseScreenStylesNew.container}>
        <Header_2 title="My Gems" />
        <StatusBar barStyle="light-content" />
        <View style={styles.header}>
          <View style={styles.search}>
            <View style={styles.searchRow}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#888" style={baseScreenStylesNew.searchIcon}/>
                <TextInput
                  placeholder="Search gem id"
                  style={baseScreenStylesNew.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
              <TouchableOpacity style={styles.sortButton} onPress={toggleSort}>
                <Text style={styles.sortButtonText}>
                  Sort {sortAscending ? "↑" : "↓"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.selectButtonContainer}>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={toggleSelect}
              >
                <Text style={styles.selectButtonText}>
                  {isSelectMode ? "Cancel" : "Select"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <FlatList
          data={sortedGems}
          renderItem={renderGemItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.gemGrid}
        />

        <Modal visible={isSellModalVisible} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <LinearGradient
                colors={[
                  'rgb(3, 15, 79)',
                  'rgb(11, 10, 43)'
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.modalContentGradient}
              />
              <FlatList
                data={selectedGems}
                renderItem={renderSelectedGemItem}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalGemList}
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={handleSellCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleSellConfirm}
                >
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {isSelectMode && (
          <View style={styles.selectionActions}>
            <TouchableOpacity style={styles.sellButton} onPress={handleSellPress}>
              <Text style={styles.actionButtonText}>Sell</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sendOrderButton}
              onPress={handleSendOrder}
            >
              <Text style={styles.actionButtonText}>Send Order</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  searchSection: {
    marginBottom: 8,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(172, 168, 168, 0.21)",
    borderRadius: 12,
    padding: 8,
    height: 40,
    marginRight: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#AEA8A8"
  },
  sortButton: {
    backgroundColor: "rgba(130, 130, 130, 0.21)",
    padding: 8,
    borderRadius: 8,
    minWidth: 70,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#AEA8A8"
  },
  sortButtonText: {
    color: "black",
    fontWeight: "500",
  },
  selectButtonContainer: {
    alignItems: "flex-end",
  },
  selectButton: {
    backgroundColor: "#170969",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 70,
    alignItems: "center",
  },
  selectButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  gemGrid: {
    padding: 8,
  },
  gemCard: {
    flex: 1 / 3,
    aspectRatio: 1,
    margin: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  gemImage: {
    width: "80%",
    height: "80%",
    borderRadius: 7,
  },
  selectionCircle: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#170969",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#170969",
  },
  gemId: {
    marginTop: 4,
    fontSize: 12,
    color: "#000",
    fontWeight: "500",
  },
  selectionActions: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    backgroundColor: "rgba(152, 149, 149, 0.35)",
  },
  sellButton: {
    flex: 1,
    backgroundColor: "#170969",
    padding: 16,
    borderRadius: 25,
    marginRight: 8,
    alignItems: "center",
  },
  sendOrderButton: {
    flex: 1,
    backgroundColor: "#170969",
    padding: 16,
    borderRadius: 25,
    marginLeft: 8,
    alignItems: "center",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 288,
    height: 390,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    background: "transparent", // Remove background color since we're using gradient
  },
  modalContentGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
  },
  modalGemList: {
    paddingVertical: 8,
    width: "100%",
    alignItems: "center",
  },
  modalGemItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: "80%",
  },
  modalGemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "white",
    marginRight: 12,
  },
  modalGemId: {
    marginTop: 4,
    fontSize: 14,
    color: "#ffff",
    fontWeight: "500",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    gap: 50,
    width: "100%",
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: "center",
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: 'rgba(172, 168, 168, 0.21)',
  },
  confirmButton: {
    backgroundColor: "#02457A",
  },
  cancelButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default GemCollectionScreen;
