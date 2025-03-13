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
    color: "#000",
    marginBottom: 20,
  },
  title: {
    paddingHorizontal: 0,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#FFFFFF",
    color: "black",
    padding: 10,
    marginTop: 17.5,
    borderWidth: 2,
    borderColor: "rgba(212, 208, 208, 0.3)",
    elevation: 7
  },
});
