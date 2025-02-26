//Screen creator: Kavintha

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker"; // Import DropDownPicker
import { baseScreenStyles } from "../styles/baseStyles"; // Import base styles
import { useNavigation, useRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header_1 from "../components/Header_1";
import Header_2 from "../components/Header_2";
import Gem_register_3 from "./GemRegister3"; // Import GemRegister3
import axios from "axios"; // Import axios
import { FormFieldStyles } from "../styles/FormFields";
import { API_URL, ENDPOINTS } from "../config/api-local"; //change api path here

const Stack = createNativeStackNavigator();

export default function GemRegister2({ route }) {
  const { formData } = route.params; // Destructure formData instead of name

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="GemRegister2Main"
        component={GemRegister2Main}
        initialParams={{ formData: formData }} // Pass formData to GemRegister2Main
        options={{
          header: () => <Header_2 title="Gem Register" />,
        }}
      />
      <Stack.Screen
        name="GemRegister3"
        component={Gem_register_3}
        options={{
          header: () => <Header_2 title="QR code" />,
        }}
      />
    </Stack.Navigator>
  );
}

function GemRegister2Main() {
  const navigation = useNavigation();
  const route = useRoute();
  const { formData } = route.params || {};

  const [form, setForm] = useState({
    ownerName: "",
    contactNumber: "",
    dimensions: "",
    weight: "",
    shape: "",
    gemType: "",
    purchasePrice: "",
    extraInfo: "",
  });

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "Ruby", value: "ruby" },
    { label: "Emerald", value: "emerald" },
    { label: "Diamond", value: "diamond" },
    { label: "Sapphire", value: "sapphire" },
  ]);

  const handleInputChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleFinalize = async () => {
    if (!form.ownerName || !form.contactNumber || !form.purchasePrice) {
      Alert.alert(
        "Fill Required Details",
        "Please fill in the required details marked by '*'."
      );
      return;
    }

    const combinedForm = {
      ...formData, // Data from GemRegister1
      ...form, // Data from GemRegister2
    };

    console.log("From Submitted combined with:", form);

    try {
      const response = await axios.post(
        `${API_URL}${ENDPOINTS.REGISTER_GEM}`, //api url is from config file
        combinedForm
      );

      if (response.status === 201) {
        console.log("Gem registered successfully:", response.data);
// Pass the gemId and createdAt from the response to GemRegister3
        navigation.navigate("GemRegister3", { 
          gemId: response.data.gem.gemId,
          createdAt: response.data.gem.createdAt
        });
      } else {
        Alert.alert("Error", "Failed to register gem");
      }
    } catch (error) {
      console.error("Error registering gem:", error); // Log the error for debugging
      if (error.response) {
        console.error("Server responded with:", error.response.data); // Log server response
        Alert.alert(
          "Error",
          `Failed to register gem: ${error.response.data.message}`
        );
      } else {
        Alert.alert("Error", "Failed to register gem");
      }
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[baseScreenStyles.container]}>
      <View style={styles.innerContainer}>
        <TextInput
          style={FormFieldStyles.input}
          placeholder="Gem Owner Name *"
          value={form.ownerName}
          onChangeText={(value) => handleInputChange("ownerName", value)}
        />

        <TextInput
          style={FormFieldStyles.input}
          placeholder="Contact Number *"
          value={form.contactNumber.toString()}
          onChangeText={(value) => {
            const numericValue = value.replace(/[^0-9]/g, "");
            handleInputChange("contactNumber", numericValue);
          }}
          keyboardType="phone-pad"
        />

        <TextInput
          style={FormFieldStyles.input}
          placeholder="Dimensions"
          value={form.dimensions}
          onChangeText={(value) => {
            const numericValue = value
              .replace(/[^0-9.]/g, "")
              .replace(/(\..*)\./g, "$1");
            handleInputChange("dimensions", numericValue);
          }}
          keyboardType="decimal-pad"
        />

        <TextInput
          style={FormFieldStyles.input}
          placeholder="Weight (ct)"
          value={form.weight}
          onChangeText={(value) => {
            const numericValue = value
              .replace(/[^0-9.]/g, "")
              .replace(/(\..*)\./g, "$1");
            handleInputChange("weight", numericValue);
          }}
          keyboardType="decimal-pad"
        />

        <TextInput
          style={FormFieldStyles.input}
          placeholder="Shape"
          value={form.shape}
          onChangeText={(value) => handleInputChange("shape", value)}
        />

        <DropDownPicker
          open={open}
          value={form.gemType}
          items={items}
          setOpen={setOpen}
          setValue={(value) => handleInputChange("gemType", value())}
          setItems={setItems}
          placeholder="Select Gem Type"
          style={FormFieldStyles.dropdown}
          dropDownContainerStyle={FormFieldStyles.dropdownContainer}
          listItemContainerStyle={FormFieldStyles.listItemContainer}
          listItemLabelStyle={FormFieldStyles.listItemLabel}
          placeholderStyle={FormFieldStyles.placeholder}
          textStyle={FormFieldStyles.dropdownText}
        />

        <TextInput
          style={FormFieldStyles.input}
          placeholder="Purchase price *"
          value={form.purchasePrice}
          onChangeText={(value) => {
            const numericValue = value
              .replace(/[^0-9.]/g, "")
              .replace(/(\..*)\./g, "$1");
            handleInputChange("purchasePrice", numericValue);
          }}
          keyboardType="decimal-pad"
        />

        <TextInput
          style={FormFieldStyles.input}
          placeholder="Extra Information"
          value={form.extraInfo}
          onChangeText={(value) => handleInputChange("extraInfo", value)}
          multiline
        />

        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={baseScreenStyles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            baseScreenStyles.blueButton,
            {
              opacity:
                form.ownerName && form.contactNumber && form.purchasePrice
                  ? 1
                  : 0.5,
            },
          ]}
          onPress={handleFinalize}
        >
          <Text style={baseScreenStyles.buttonText}>Finalize</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    padding: 20,
  },

  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 20,
  },
  backButton: {
    marginTop: 10,
    backgroundColor: "#02457A",
    width: "95%",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
  },
});
