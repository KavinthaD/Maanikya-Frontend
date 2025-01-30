import { View, Text, StyleSheet,TouchableOpacity } from "react-native";
import { baseScreenStyles } from "../styles/baseStyles";
import { useNavigation } from '@react-navigation/native'; // **Import useNavigation hook**
import Icon from 'react-native-vector-icons/Ionicons';

export default function Header_1() {
    const navigation = useNavigation(); // **Get the navigation object using useNavigation**

    const handleBackPress = () => {
        navigation.goBack(); // **Use navigation.goBack() to go to the previous screen**
    };
return (
      <View style={[styles.container, baseScreenStyles.container]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
      <Icon name="chevron-back" size={28} color="white" />
      </TouchableOpacity>
        <Text style={styles.title}>title here</Text>
      </View>
    );
  };
  const styles = StyleSheet.create({
    innerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
        flex: 1,
        paddingHorizontal: 0,     // Default horizontal padding
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
