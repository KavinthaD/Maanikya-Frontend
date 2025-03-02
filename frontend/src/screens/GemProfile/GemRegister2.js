//Screen creator: Kavintha

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker"; // Import DropDownPicker
import { baseScreenStyles } from "../../styles/baseStyles"; // Import base styles
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Header_1 from "../../components/Header_1";
import Header_2 from "../../components/Header_2";
import Gem_register_3 from "./GemRegister3"; // Import GemRegister3
import axios from "axios"; // Import axios
import { FormFieldStyles } from "../../styles/FormFields";
import { API_URL, ENDPOINTS } from "../../config/api"; //change api path here
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

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
          header: () => <Header_1 title="QR code" />,
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

  const scrollViewRef = useRef(null);
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

  // Initialize form state from AsyncStorage
  useFocusEffect(
    React.useCallback(() => {
      const loadSavedForm = async () => {
        try {
          const savedForm = await AsyncStorage.getItem("gemRegister2Form");
          if (savedForm) {
            setForm(JSON.parse(savedForm));
          }
        } catch (error) {
          console.error("Error loading saved form:", error);
        }
      };

      loadSavedForm();
    }, [])
  );

  // Save form data whenever it changes
  useEffect(() => {
    const saveForm = async () => {
      try {
        await AsyncStorage.setItem("gemRegister2Form", JSON.stringify(form));
      } catch (error) {
        console.error("Error saving form:", error);
      }
    };

    saveForm();
  }, [form]);

  // Clear saved form data after successful submission
  const handleFinalize = async () => {
    // Check required fields
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

    console.log("Form Submitted combined with:", combinedForm);

    // Create FormData object
    const formDataToSend = new FormData();

    // Only append photo if it exists
    if (
      combinedForm.photo ||
      (combinedForm.photos && combinedForm.photos.length > 0)
    ) {
      const photoUri = combinedForm.photo || combinedForm.photos[0];
      formDataToSend.append("photo", {
        uri: photoUri,
        type: "image/jpeg",
        name: "gem_photo.jpg",
      });
    }

    // Append other form data
    Object.keys(combinedForm).forEach((key) => {
      if (key !== "photo" && key !== "photos" && combinedForm[key]) {
        formDataToSend.append(key, combinedForm[key]);
      }
    });

    try {
      console.log("API URL:", `${API_URL}${ENDPOINTS.REGISTER_GEM}`);
      console.log("Form Data to Send:", formDataToSend);

      const response = await axios.post(
        `${API_URL}${ENDPOINTS.REGISTER_GEM}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set the content type
          },
          timeout: 10000, // 10 second timeout
        }
      );

      if (response.status === 201) {
        console.log("Gem registered successfully:", response.data);
        await AsyncStorage.removeItem("gemRegister2Form");
        navigation.navigate("GemRegister3", {
          gemId: response.data.gem.gemId,
          createdAt: response.data.gem.createdAt,
        });
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to register gem. Please try again."
      );
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[baseScreenStyles.container, { zIndex: 1 }]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1 }}
        nestedScrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[styles.innerContainer, { zIndex: 2 }]}>
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
            theme="LIGHT"
            showArrowIcon={true}
            showTickIcon={false}
            zIndex={3000}
            zIndexInverse={1000}
            listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
            }}
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
            multiline={true}
            onFocus={() => {
              setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
              }, 200);
            }}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    padding: 20,
    paddingBottom: 10, // Add extra padding at bottom for keyboard
    position: "relative", // Add this
  },

  buttonContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginTop: 20,
  },
  backButton: {
    marginTop: 15,
    marginBottom: 15,
    backgroundColor: "#02457A",
    width: "95%",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
  },
});
