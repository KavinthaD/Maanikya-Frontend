// import React from 'react';
// import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet, StatusBar } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// const MenuItem = ({ icon, title, onPress }) => (
//   <TouchableOpacity style={styles.menuItem} onPress={onPress}>
//     <View style={styles.iconContainer}>
//       <Icon name={icon} size={24} color="#000" />
//     </View>
//     <Text style={styles.menuText}>{title}</Text>
//   </TouchableOpacity>
// );

// const HomeScreen = () => {
//   const menuItems = [
//     { icon: 'plus', title: 'Add Gem' },
//     { icon: 'diamond-stone', title: 'My Gems' },
//     { icon: 'qrcode-scan', title: 'Scan' },
//     { icon: 'chart-bar', title: 'Financial\nRecords' },
//     { icon: 'map-marker-question', title: 'Tracker' },
//     { icon: 'account-group', title: 'Connect' },
//     { icon: 'diamond-stone', title: 'Gems on\ndisplay' },
//   ];

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Home</Text>
//       </View>
//       <View style={styles.content}>
//         <Text style={styles.greeting}>Hello Rathnasiri,</Text>
//         <View style={styles.menuGrid}>
//           {menuItems.map((item, index) => (
//             <MenuItem
//               key={index}
//               icon={item.icon}
//               title={item.title}
//             />
//           ))}
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#E3F2FD',
//   },
//   header: {
//     backgroundColor: '#072D44',
//     padding: 16,
//     paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 24 : 40,
//     alignItems: 'center',
//   },
//   headerText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: '500',
//   },
//   content: {
//     flex: 1,
//     padding: 16,
//   },
//   greeting: {
//     fontSize: 16,
//     marginBottom: 20,
//     color: '#000',
//   },
//   menuGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'flex-start',
//     gap: 16,
//   },
//   menuItem: {
//     width: '30%',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   iconContainer: {
//     width: 70,
//     height: 70,
//     backgroundColor: 'white',
//     borderRadius: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 8,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   menuText: {
//     fontSize: 12,
//     textAlign: 'center',
//     color: '#000',
//   },
// });

// const App = () => {
//   return (
//     <>
//       <StatusBar barStyle="light-content" backgroundColor="#072D44" />
//       <HomeScreen />
//     </>
//   );
// };

// export default App;
import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, StyleSheet, StatusBar } from 'react-native';

const MenuItem = ({ image, title, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.iconContainer}>
      <Image 
        source={image} 
        style={styles.imageStyle}
        resizeMode="contain"
      />
    </View>
    <Text style={styles.menuText}>{title}</Text>
  </TouchableOpacity>
);

const HomeScreen = () => {
  const menuItems = [
    { 
      image: require('../assets/menu-icons/addGem.png'),
      title: 'Add Gem' 
    },
    { 
      image: require('../assets/menu-icons/myGems.png'),
      title: 'My Gems' 
    },
    { 
      image: require('../assets/menu-icons/scan.png'),
      title: 'Scan' 
    },
    { 
      image: require('../assets/menu-icons/financialRecords.png'),
      title: 'Financial\nRecords' 
    },
    { 
      image: require('../assets/menu-icons/addGem.png'),
      title: 'Tracker' 
    },
    { 
      image: require('../assets/menu-icons/connect.png'),
      title: 'Connect' 
    },
    { 
      image: require('../assets/menu-icons/addGem.png'),
      title: 'Gems on\ndisplay' 
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.greeting}>Hello Rathnasiri,</Text>
        <View style={styles.menuGrid}>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              image={item.image}
              title={item.title}
              onPress={() => console.log(`Pressed ${item.title}`)}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  
  content: {
    flex: 1,
    padding: 16,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 32,

  },
  greeting: {
    fontSize: 16,
    marginBottom: 20,
    color: '#000',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 16,
  },
  menuItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 70,
    height: 70,
    backgroundColor: 'white',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageStyle: {
    width: 40,
    height: 40,
  },
  menuText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#000',
  },
});

const App = () => {
  return (
    <>
      <HomeScreen />
    </>
  );
};

export default App;