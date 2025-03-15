import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * A reusable header component with optional back button
 * @param {string} title - The header title
 * @param {Function} navigation - The navigation object
 * @param {boolean} showBack - Whether to show back button (default: false)
 * @param {Function} onBackPress - Custom back action (optional)
 * @param {React.ReactNode} rightComponent - Optional component to render on the right side
 * @param {Object} style - Additional styles for the header container
 */
const HeaderBar = ({ 
  title, 
  navigation, 
  showBack = false, 
  onBackPress,
  rightComponent,
  style 
}) => {
  
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (navigation) {
      navigation.goBack();
    }
  };
  
  return (
    <View style={[styles.header, style]}>
      {/* Left side - Back button or empty space */}
      <View style={styles.sideContainer}>
        {showBack ? (
          <TouchableOpacity
            onPress={handleBackPress}
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
        ) : null}
      </View>
      
      {/* Middle - Title (always centered) */}
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
      </View>
      
      {/* Right side - Component or empty space */}
      <View style={styles.sideContainer}>
        {rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sideContainer: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  }
});

export default HeaderBar;