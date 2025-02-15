//Screen creator: Thulani

import React, { useEffect, useRef} from "react";
import { View, StyleSheet, Image, Animated } from "react-native";


const WelcomePage = ({ navigation}) => {
    const scaleValue = useRef(new Animated.Value(50)).current;
    const gemTranslateY = useRef(new Animated.Value(0)).current; 

    useEffect(() => {
        Animated.timing(scaleValue, {
            toValue: 0.4,
            duration: 4000,
            useNativeDriver: true,
        }).start(() => {
                Animated.parallel([
                  Animated.timing(gemTranslateY, {
                    toValue: -498, 
                    duration: 1000,
                    useNativeDriver: true,
                  }),
                ]).start(() => {
                navigation.replace('PurposeSelectionPage');
            });
        });
}, [navigation]);

    return(
        <View style={Styles.container}>
            <Animated.Image
            source={require('../assets/logo-gem.png')}
            style={[Styles.logo, {
                transform: 
                [   {scale: scaleValue},
                    {translateY: gemTranslateY},
                ],
            },
        ]}
            resizeMode="contain" />

        </View>
    );
};

const Styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#9CCDDB', 
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 300, 
      height: 204,
      position: 'absolute',
    },
    brandName: {
        width: 200, 
        height: 50,
        position: 'absolute',
        top: '60%',
      },
  });

  export default WelcomePage;