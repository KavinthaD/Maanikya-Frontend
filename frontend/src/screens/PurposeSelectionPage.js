import React, {useState} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';

const PurposeSelectionPage = () => {
    const[modalVisible, setModalVisible] = useState(false);
    return (
        <View style={styles.Container}>
                <Image
                source={require('../assets/logo.png')}
                style={styles.logo} 
            />
            <Text style={styles.title}>I'm here to,</Text>

            <View style={styles.card}>
                <TouchableOpacity style={styles.button}>
                    <Text style= {styles.buttonText}>Manage my business</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style= {styles.buttonText}>Look for gems</Text>
                </TouchableOpacity>

                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.orText}>or</Text>
                    <View style={styles.divider} />
                </View>

                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Log in</Text>
                </TouchableOpacity>
            </View>
                <View style={styles.footerContainer}>
                          <TouchableOpacity
                          style={styles.languageSelector}
                          onPress={() => setModalVisible(true)}
                          >
                        <Text style={styles.languageText}>ENG ▼</Text>
                        <Image 
                          source={require('../assets/globe.png')}
                          style={styles.globeIcon}
                        />
                        </TouchableOpacity>
                </View>
                
                        <Modal
                          transparent={true}
                          animationType='fade'
                          visible={modalVisible}
                          onRequestClose={()=> setModalVisible(false)}
                        >
                          <View style={styles.modalOverlay}>
                          <View style={styles.modalContent}>
                            <TouchableOpacity
                              style={styles.languageOption}
                              onPress={() => {
                                console.log('Sinhala selected');
                                setModalVisible(false); // Close modal after selecting
                              }}
                            >
                              <Text style={styles.languageOptionText}>සිංහල</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.languageOption}
                              onPress={() => {
                                console.log('English selected');
                                setModalVisible(false); // Close modal after selecting
                              }}
                            >
                              <Text style={styles.languageOptionText}>English</Text>
                            </TouchableOpacity>
                            </View>
                            </View>
                        </Modal>
        </View>
    );
;}

const styles = StyleSheet.create({

    Container: {
        backgroundColor: '#97CADB',
    },

    logo: {
        width: 280,
        height: 144,
        alignSelf: 'center',
        resizeMode: 'contain',
        marginTop: 130,
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 120,
        marginBottom: 55,
        marginBlockStart: 80,
    },

    subtitle: {
        fontSize: 20,
        color: '#000',
        marginBottom: 20,
    },

    card: {
        backgroundColor: '#C2E9FF',
        marginTop: -30,
        padding: 30,
        borderRadius: 20,
        width: '90%',
        alignItems: 'center',
        marginLeft: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: {width: 0, height: 2},
    },
    button: {
        backgroundColor: '#170969',
        paddingVertical: 12,
        borderRadius: 50,
        width: '100%',
        marginVertical: 5,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#A0A0A0',
    },
    orText: {
        marginHorizontal: 10,
        color: '#000',
        fontWeight: 'bold',
    },
    loginText: {
        fontSize: 14,
        color: '#000',
        fontWeight: 'bold',
        marginTop: 2,
    },
    loginButton: {
        backgroundColor: '#02457A',
        paddingVertical: 8,
        borderRadius: 70,
        width: '80%',
        marginTop: 10,
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '',
        textAlign: 'center',
    },
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
      },
    
      languageSelector: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    
      languageText: {
        fontSize: 14,
        color: '#000',
        marginRight: 8,
      },
      globeIcon: {
        width: 28,
        height: 28,
        tintColor: '#000',
      },
      logoContainer: {
        flex:1,
    
      },
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        backgroundColor: '#FFF',
        width: 200,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
      },
      languageOption: {
        paddingVertical: 10,
        width: '100%',
        alignItems: 'center',
      },
      languageOptionText: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500',
      },
    

});

export default PurposeSelectionPage;