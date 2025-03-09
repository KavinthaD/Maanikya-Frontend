import { View, Text, StyleSheet } from "react-native";
import { baseScreenStyles } from "../styles/baseStyles";
export default function Header_1({ title }) {
  return (
    <View style={[styles.container, baseScreenStyles.backgroundColor]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  titleText: {
    fontFamily: "arial",
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  title: {
    paddingHorizontal: 0,
    marginTop: 0,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
    backgroundColor: "#072D44",
    color: "white",
    padding: 10,
  },
});
