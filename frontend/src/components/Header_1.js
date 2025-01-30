import { View, Text, StyleSheet } from "react-native";
import { baseScreenStyles } from "../styles/baseStyles";
export default function Header_1({title}) {
return (
      <View style={[styles.container, baseScreenStyles.container]}>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
             // Default horizontal padding
        paddingVertical: 30,       // Default vertical padding
    },
    titleText: {
        fontFamily: "arial",
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',             // Default title text color
        marginBottom: 20,
    },
    title: {
        paddingHorizontal: 0,     // Default horizontal padding for titles
        marginTop: 30,
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        backgroundColor: '#072D44',
        color: 'white',
        padding: 10,
      },
  });
