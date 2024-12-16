import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react';

const SelectionPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Image
        source={require('../assets/logo.png')}
        style={styles.logo} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.createAccountButton}>
            <Text style={styles.createAccountText}>Create an account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.guestButton}>
            <Text style={styles.guestText}>Continue as a guest</Text>
            </TouchableOpacity>  
        </View>

        <View style={styles.footerContainer}>
        <Text style={styles.languageText}>ENG ▼</Text>
        <Image 
          source={require('../assets/globe.png')}
          style={styles.globeIcon}
        />
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A7D1E6',
  }

})


export default SelectionPage