//Screen creator: Kavintha

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { baseScreenStyles } from "../styles/baseStyles"; // Import base styles
import { useNavigation } from "@react-navigation/native";

export default function Gem_lot_register_2() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    ownerName: "",
    contactNumber: "",
    numGems: "",
    totalWeight: "",
    shape: "",
    gemType: "",
    purchasePrice: "",
    extraInfo: "",
  });

  const handleInputChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleFinalize = () => {
    console.log("Form Submitted:", form);
    navigation.navigate("GemRegister3", { formData: form });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[baseScreenStyles.container, styles.container]}>
      <View style={styles.innerContainer}>
        <TextInput
          style={styles.input}
          placeholder="Gem Owner Name"
          placeholderTextColor={styles.placeholder.color}
          value={form.ownerName}
          onChangeText={(value) => handleInputChange("ownerName", value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Gem Owner Contact Number"
          placeholderTextColor={styles.placeholder.color}
          value={form.contactNumber}
          onChangeText={(value) => handleInputChange("contactNumber", value)}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Number of gems"
          placeholderTextColor={styles.placeholder.color}
          value={form.numGems}
          onChangeText={(value) => handleInputChange("numGems", value)}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Total weight"
          placeholderTextColor={styles.placeholder.color}
          value={form.totalWeight}
          onChangeText={(value) => handleInputChange("totalWeight", value)}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Shape (optional)"
          placeholderTextColor={styles.placeholder.color}
          value={form.shape}
          onChangeText={(value) => handleInputChange("shape", value)}
        />
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={form.gemType}
            onValueChange={(itemValue) =>
              handleInputChange("gemType", itemValue)
            }
            style={form.gemType === "" ? styles.placeholder : styles.picker}
          >
            <Picker.Item
              label="Gem Type"
              value=""
              style={
                form.gemType.value === "" ? styles.placeholder : styles.picker
              } // Apply special style only to placeholder
            />
            <Picker.Item label="Ruby" value="ruby" />
            <Picker.Item label="Emerald" value="emerald" />
            <Picker.Item label="Diamond" value="diamond" />
            <Picker.Item label="Sapphire" value="sapphire" />
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Purchase price"
          placeholderTextColor={styles.placeholder.color}
          value={form.purchasePrice}
          onChangeText={(value) => handleInputChange("purchasePrice", value)}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Extra Information"
          placeholderTextColor={styles.placeholder.color}
          value={form.extraInfo}
          onChangeText={(value) => handleInputChange("extraInfo", value)}
          multiline
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.finalizeButton}
            onPress={handleFinalize}
          >
            <Text style={styles.buttonText}>Finalize</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#E8F0FE",
    color: "black",
    padding: 13,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },

  pickerWrapper: {
    borderRadius: 10,
    overflow: "hidden", // Ensures content stays within the border radius
    backgroundColor: "#E8F0FE",
    marginBottom: 15,
  },
  picker: {
    height: 55,
    fontSize: 18,
    color: "black",
  },
  placeholder: {
    color: "grey", // Apply your desired color to the placeholder text
  },
  buttonContainer: {
    flexDirection: "coloumn",
    justifyContent: "space-between",
    marginTop: 20,
  },
  backButton: {
    marginBottom: 10,
    backgroundColor: "#02457A",
    padding: 10,
    borderRadius: 5,
  },
  finalizeButton: {
    backgroundColor: "#170969",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});
