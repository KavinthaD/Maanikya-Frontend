import { View, Text, StyleSheet } from "react-native";
import { baseScreenStyles } from "../styles/baseStyles";
export default function Header_1({title}) {
return (
      <View style={[styles.container, baseScreenStyles.backgroundColor]}>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
             // Default horizontal padding
        paddingVertical: 30,      
    },
    titleText: {
        fontFamily: "arial",
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',             
        marginBottom: 0,
    },
    title: {
        paddingHorizontal: 0,     
        marginTop: 10,
        fontSize: 24,
       fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 1,
        backgroundColor: '#072D44',
        color: 'white',
        padding: 10,
      },
  });
