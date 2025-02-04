import React from 'react';
import { StyleSheet, View } from 'react-native';
import FinancialRecords from './src/screens/FinancialRecords';
import MySellersScreen from './src/screens/CustomerFinancialRecords';

export default function App() {
  return (
    <View style={styles.container}>
      {/* <FinancialRecords /> */}
      <MySellersScreen/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
