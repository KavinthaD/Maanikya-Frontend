import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { baseScreenStylesNew } from "../styles/baseStylesNew";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export default function Header_2({ title }) {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, baseScreenStylesNew.backgroundColor]}>
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Icon name="chevron-back" size={28} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    paddingHorizontal: 44,
    fontSize: 24,
    fontWeight: "bold",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    color: "black",
    padding: 10,
    marginTop: 17.5,
    borderWidth: 2,
    borderColor: "rgba(212, 208, 208, 0.3)",
    elevation: 7
  },
  backButton: {
    position: "absolute",
    left: 10,
    top: 30,
    zIndex: 1,
    elevation: 12
  },
});
