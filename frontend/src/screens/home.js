// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';



// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
  
// }


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'dodgerblue',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello Rathnasiri,</Text>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button}>
          <Image source={require('../assets/add_gem.png')} style={styles.icon} />
          <Text style={styles.label}>Add Gem</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image source={require('../assets/my_gems.png')} style={styles.icon} />
          <Text style={styles.label}>My Gems</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image source={require('../assets/scan.png')} style={styles.icon} />
          <Text style={styles.label}>Scan</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button}>
          <Image source={require('../assets/financial_records.png')} style={styles.icon} />
          <Text style={styles.label}>Financial Records</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image source={require('./assets/tracker.png')} style={styles.icon} />
          <Text style={styles.label}>Tracker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image source={require('./assets/connect.png')} style={styles.icon} />
          <Text style={styles.label}>Connect</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button}>
          <Image source={require('./assets/gems_on_display.png')} style={styles.icon} />
          <Text style={styles.label}>Gems on display</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B3E5FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 24,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  button: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
  },
});

export default App;

