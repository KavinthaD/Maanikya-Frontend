import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { baseScreenStyles } from "../styles/baseStyles";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function Header_2({ title }) {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, baseScreenStyles.backgroundColor]}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Icon name="chevron-back" size={28} color="white" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  
  title: {
    paddingHorizontal: 0,
    marginTop: 0,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 1,
    backgroundColor: "#072D44",
    color: "white",
    padding: 10,
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 15,
    zIndex: 1,
  },
});
