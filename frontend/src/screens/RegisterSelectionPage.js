import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import React from 'react';

const RegisterSelectionPage = () => {
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
    backgroundColor: '#97CADB',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 50,
  },

  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },

  buttonContainer: {
    width: '80%',
    alignItems: 'center',
  },

  createAccountButton: {
    backgroundColor: '#170969',
    paddingVertical: 12,
    width: '100%',
    borderRadius: 8,
    marginBottom: 15,
  },
  createAccountText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },

  guestButton: {
    backgroundColor: '#09690F',
    paddingVertical: 12,
    width: '100%',
    borderRadius: 8,
  },
  guestText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },

  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  languageText: {
    fontSize: 14,
    color: '#000',
    marginRight: 8,
  },
  globeIcon: {
    width: 18,
    height: 18,
    tintColor: '#000',
  },

  logoContainer: {
    flex:1,

  }

})


export default RegisterSelectionPage;