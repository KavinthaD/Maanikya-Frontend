import React, { useState } from "react"; // **Import useState**
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { baseScreenStyles } from "../styles/baseStyles";

export default function Gem_lot_register_2() {
  const [form, setForm] = useState({
    color: "",
    description: "",
  });
  const handleInputChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };
  const handleFinalize = () => {
    console.log("Form Submitted:", form);
  };
  const handleBackPress = () => {
    return <GemLotRegister1 />;
  };
  return (
    <View style={[baseScreenStyles.container, styles.container]}>
      <View style={styles.innerContainer}>
        <View style={styles.buttonContent}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => {
              /* Handle button press here */
            }}
          >
            <Image
              source={require("../assets/camera.png")}
              style={styles.iconImage}
              resizeMode="contain" // Or 'cover', 'stretch', 'repeat', 'center' as needed
            />
          </TouchableOpacity>

          <Text style={styles.addPhotoButtonText}>Add photos</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Gem lot name (optional)"
          value={form.ownerName}
          onChangeText={(value) => handleInputChange("ownerName", value)}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={form.ownerName}
          onChangeText={(value) => handleInputChange("ownerName", value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Color"
          value={form.contactNumber}
          onChangeText={(value) => handleInputChange("contactNumber", value)}
          keyboardType="phone-pad"
        />
        <TouchableOpacity
          style={styles.finalizeButton}
          onPress={handleFinalize}
        >
          <TouchableOpacity style={styles.finalizeButton} onPress={handleFinalize}>
                      <Text style={styles.buttonText}>Finalize</Text>
                    </TouchableOpacity>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  finalizeButton: {
    backgroundColor: "#170969",
    padding: 10,
    borderRadius: 5,
  },
  innerContainer: {
    padding: 20,
    paddingVertical: 90,
    flex: 1,
  },
  input: {
    backgroundColor: "#E8F0FE",
    color: "black",
    padding: 13,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    borderRadius: 10,
    padding: 3,
    backgroundColor: "#E8F0FE",
  },
  buttonContent: {
    marginBottom: 80,
    alignItems: "center",
  },
});
