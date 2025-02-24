//Screen Creator Tilmi

// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   TextInput,
//   FlatList,
//   Platform,
//   StatusBar,
// } from 'react-native';

// // Search icon as base64 (keeping existing base64 string)
// const searchIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAAqklEQVRYhe2UQQ6AIAwEWeL/v6wHY0QK3W0JiYns0VB2h1YUiDQD2oABGdAFaW+AAawR+ybXPQBJupO0SPq6FylBLyeXx56klSkqgCRJc+YARxvQzg1oxwW0E3+PMue8/BR/+wqSZ0B6CpLvgHYKktfAkT+h1eb1i3B1BrRjAO1fB2g/TNqJv0eZc15+ir99BckzID0FyXdAOwXJa+DIn9Bq83oAVx0DTyemB+GeqEUAAAAASUVORK5CYII=';

// const gems = [
//   { id: 'BS001', name: 'Blue Sapphire', image: require('../assets/gems/BS001.png') },
//   { id: 'EM001', name: 'Emerald', image: require('../assets/gems/EM001.png') },
//   { id: 'RR001', name: 'Ruby', image: require('../assets/gems/RR001.png') },
//   { id: 'YS001', name: 'Yellow Sapphire', image: require('../assets/gems/YS001.png') },
//   { id: 'BS002', name: 'Blue Sapphire', image: require('../assets/gems/BS002.png') },
//   { id: 'PS001', name: 'Pink Sapphire', image: require('../assets/gems/PS001.png') },
//   { id: 'PT001', name: 'Pink Topaz', image: require('../assets/gems/PT001.png') },
//   { id: 'EM002', name: 'Emerald', image: require('../assets/gems/EM002.png') },
//   { id: 'YS002', name: 'Yellow Sapphire', image: require('../assets/gems/YS002.png') },
// ];

// const GemCollectionScreen = () => {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isSelectMode, setIsSelectMode] = useState(false);
//   const [selectedGems, setSelectedGems] = useState([]);
//   const [sortAscending, setSortAscending] = useState(true);

//   const filteredGems = gems.filter(gem => 
//     gem.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     gem.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const sortedGems = [...filteredGems].sort((a, b) => {
//     return sortAscending ? 
//       a.id.localeCompare(b.id) : 
//       b.id.localeCompare(a.id);
//   });

//   const toggleSort = () => {
//     setSortAscending(!sortAscending);
//   };

//   const toggleSelect = () => {
//     setIsSelectMode(!isSelectMode);
//     setSelectedGems([]);
//   };

//   const toggleGemSelection = (gemId) => {
//     if (!isSelectMode) return;
    
//     setSelectedGems(prev => {
//       if (prev.includes(gemId)) {
//         return prev.filter(id => id !== gemId);
//       } else {
//         return [...prev, gemId];
//       }
//     });
//   };

//   const handleSendOrder = () => {
//     console.log('Sending order for gems:', selectedGems);
//     setIsSelectMode(false);
//     setSelectedGems([]);
//   };

//   const renderGemItem = ({ item }) => (
//     <TouchableOpacity 
//       style={[styles.gemCard]}
//       onPress={() => toggleGemSelection(item.id)}
//     >
//       <View style={[
//         styles.gemImageContainer,
//         isSelectMode && styles.blurredContainer
//       ]}>
//         <Image 
//           source={item.image}
//           style={styles.gemImage}
//           resizeMode="cover"
//         />
//         {isSelectMode && (
//           <View style={[
//             styles.selectionOverlay,
//             selectedGems.includes(item.id) && styles.selectedOverlay
//           ]}>
//             <View style={[
//               styles.checkmark,
//               selectedGems.includes(item.id) && styles.selectedCheckmark
//             ]}>
//               {selectedGems.includes(item.id) && (
//                 <View style={styles.checkmarkDot} />
//               )}
//             </View>
//           </View>
//         )}
//       </View>
//       <Text style={styles.gemId}>{item.id}</Text>
//     </TouchableOpacity>
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" />
//       <View style={styles.searchContainer}>
//         <View style={styles.searchBar}>
//           <Image
//             source={{ uri: searchIcon }}
//             style={styles.searchIcon}
//           />
//           <TextInput
//             placeholder="Search"
//             style={styles.searchInput}
//             value={searchQuery}
//             onChangeText={setSearchQuery}
//           />
//         </View>
//         <TouchableOpacity 
//           style={styles.sortButton}
//           onPress={toggleSort}
//         >
//           <Text style={styles.sortButtonText}>
//             Sort {sortAscending ? '↑' : '↓'}
//           </Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={[styles.selectButton, isSelectMode && styles.selectButtonActive]}
//           onPress={toggleSelect}
//         >
//           <Text style={styles.selectButtonText}>
//             {isSelectMode ? 'Cancel' : 'Select'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         data={sortedGems}
//         renderItem={renderGemItem}
//         keyExtractor={item => item.id}
//         numColumns={3}
//         contentContainerStyle={styles.gemGrid}
//       />

//       {isSelectMode && selectedGems.length > 0 && (
//         <View style={styles.sendOrderContainer}>
//           <TouchableOpacity
//             style={styles.sendOrderButton}
//             onPress={handleSendOrder}
//           >
//             <Text style={styles.sendOrderText}>Send Order</Text>
//           </TouchableOpacity>
//         </View>
//       )}
      
//       {Platform.OS === 'ios' && <View style={styles.homeIndicator} />}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#B2E6F0',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     padding: 16,
//     alignItems: 'center',
//     backgroundColor: '#B2E6F0',
//   },
//   searchBar: {
//     flex: 1,
//     flexDirection: 'row',
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 8,
//     marginRight: 8,
//     alignItems: 'center',
//   },
//   searchIcon: {
//     width: 20,
//     height: 20,
//     marginRight: 8,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//   },
//   sortButton: {
//     backgroundColor: 'white',
//     padding: 8,
//     borderRadius: 8,
//     marginRight: 8,
//   },
//   sortButtonText: {
//     color: '#1E3E7B',
//     fontWeight: '500',
//   },
//   selectButton: {
//     backgroundColor: '#1E3E7B',
//     padding: 8,
//     borderRadius: 8,
//   },
//   selectButtonActive: {
//     backgroundColor: '#ff4444',
//   },
//   selectButtonText: {
//     color: 'white',
//     fontWeight: '500',
//   },
//   gemGrid: {
//     padding: 8,
//   },
//   gemCard: {
//     flex: 1/3,
//     aspectRatio: 1,
//     margin: 4,
//     backgroundColor: 'white',
//     borderRadius: 8,
//     padding: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 1,
//     },
//     shadowOpacity: 0.22,
//     shadowRadius: 2.22,
//   },
//   gemImageContainer: {
//     width: '100%',
//     height: '80%',
//     borderRadius: 4,
//     overflow: 'hidden',
//   },
//   blurredContainer: {
//     opacity: 0.7,
//   },
//   gemImage: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 4,
//   },
//   selectionOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(255, 255, 255, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   selectedOverlay: {
//     backgroundColor: 'rgba(255, 255, 255, 0.2)',
//   },
//   checkmark: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: '#1E3E7B',
//     backgroundColor: 'white',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   selectedCheckmark: {
//     backgroundColor: '#1E3E7B',
//   },
//   checkmarkDot: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: 'white',
//   },
//   gemId: {
//     marginTop: 4,
//     fontSize: 12,
//     color: '#1E3E7B',
//     fontWeight: '500',
//   },
//   homeIndicator: {
//     width: 134,
//     height: 5,
//     backgroundColor: '#000',
//     borderRadius: 100,
//     alignSelf: 'center',
//     marginBottom: 8,
//   },
//   sendOrderContainer: {
//     position: 'absolute',
//     bottom: Platform.OS === 'ios' ? 34 : 16,
//     left: 16,
//     right: 16,
//   },
//   sendOrderButton: {
//     backgroundColor: '#1E3E7B',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   sendOrderText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default GemCollectionScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  Platform,
  StatusBar,
  Modal,
} from 'react-native';
import { baseScreenStyles } from "../styles/baseStyles";

const searchIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAAqklEQVRYhe2UQQ6AIAwEWeL/v6wHY0QK3W0JiYns0VB2h1YUiDQD2oABGdAFaW+AAawR+ybXPQBJupO0SPq6FylBLyeXx56klSkqgCRJc+YARxvQzg1oxwW0E3+PMue8/BR/+wqSZ0B6CpLvgHYKktfAkT+h1eb1i3B1BrRjAO1fB2g/TNqJv0eZc15+ir99BckzID0FyXdAOwXJa+DIn9Bq83oAVx0DTyemB+GeqEUAAAAASUVORK5CYII=';

const gems = [
  { id: 'BS001', image: require('../assets/gems/BS001.png') },
  { id: 'EM001', image: require('../assets/gems/EM001.png') },
  { id: 'RR001', image: require('../assets/gems/RR001.png') },
  { id: 'YS001', image: require('../assets/gems/YS001.png') },
  { id: 'BS002', image: require('../assets/gems/BS002.png') },
  { id: 'PS001', image: require('../assets/gems/PS001.png') },
  { id: 'PT001', image: require('../assets/gems/PT001.png') },
  { id: 'EM002', image: require('../assets/gems/EM002.png') },
  { id: 'YS002', image: require('../assets/gems/YS002.png') },
];

const GemCollectionScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [selectedGems, setSelectedGems] = useState([]);
  const [sortAscending, setSortAscending] = useState(true);
  const [isSellModalVisible, setSellModalVisible] = useState(false);

  const filteredGems = gems.filter(gem => 
    gem.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedGems = [...filteredGems].sort((a, b) => {
    return sortAscending ? 
      a.id.localeCompare(b.id) : 
      b.id.localeCompare(a.id);
  });

  const toggleSort = () => {
    setSortAscending(!sortAscending);
  };

  const toggleSelect = () => {
    setIsSelectMode(!isSelectMode);
    setSelectedGems([]);
  };

  const toggleGemSelection = (gemId) => {
    if (!isSelectMode) return;
    
    setSelectedGems(prev => {
      if (prev.includes(gemId)) {
        return prev.filter(id => id !== gemId);
      } else {
        return [...prev, gemId];
      }
    });
  };

  const handleSendOrder = () => {
    console.log('Sending order for gems:', selectedGems);
    setIsSelectMode(false);
    setSelectedGems([]);
    navigation.navigate('FavoritesScreen')
  };

  const handleSellPress = () => {
    setSellModalVisible(true);
  };

  const handleSellConfirm = () => {
    console.log('Selling gems:', selectedGems);
    setSellModalVisible(false);
    setIsSelectMode(false);
    setSelectedGems([]);
  };

  const handleSellCancel = () => {
    setSellModalVisible(false);
  };

  const renderSelectedGemItem = ({ item }) => {
    const gemData = gems.find(g => g.id === item);
    return (
      <View style={styles.modalGemItem}>
        <Image 
          source={gemData.image}
          style={styles.modalGemImage}
          resizeMode="cover"
        />
        <Text style={styles.modalGemId}>{gemData.id}</Text>
      </View>
    );
  };

  const renderGemItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.gemCard}
      onPress={() => toggleGemSelection(item.id)}
    >
      <View style={styles.gemImageContainer}>
        <Image 
          source={item.image}
          style={styles.gemImage}
          resizeMode="cover"
        />
        {isSelectMode && (
          <View style={styles.selectionCircle}>
            {selectedGems.includes(item.id) && (
              <View style={styles.selectedDot} />
            )}
          </View>
        )}
      </View>
      <Text style={styles.gemId}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={baseScreenStyles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Image
            source={{ uri: searchIcon }}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={toggleSort}
        >
          <Text style={styles.sortButtonText}>
            Sort {sortAscending ? '↑' : '↓'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.selectButton}
          onPress={toggleSelect}
        >
          <Text style={styles.selectButtonText}>
            {isSelectMode ? 'Cancel' : 'Select'}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedGems}
        renderItem={renderGemItem}
        keyExtractor={item => item.id}
        numColumns={3}
        contentContainerStyle={styles.gemGrid}
      />

      <Modal
        visible={isSellModalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={selectedGems}
              renderItem={renderSelectedGemItem}
              keyExtractor={item => item}
              numColumns={2}
              contentContainerStyle={styles.modalGemGrid}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleSellCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleSellConfirm}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {isSelectMode && (
        <View style={styles.selectionActions}>
          <TouchableOpacity 
            style={styles.sellButton}
            onPress={handleSellPress}
          >
            <Text style={styles.actionButtonText}>Sell</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.sendOrderButton}
            onPress={handleSendOrder}
          >
            <Text style={styles.actionButtonText}>Send Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({  

  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#B2E6F0',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  sortButton: {
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  sortButtonText: {
    color: '#003366',
    fontWeight: '500',
  },
  selectButton: {
    backgroundColor: '#003366',
    padding: 8,
    borderRadius: 8,
  },
  selectButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  gemGrid: {
    padding: 8,
  },
  gemCard: {
    flex: 1/3,
    aspectRatio: 1,
    margin: 4,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  gemImageContainer: {
    width: '100%',
    height: '80%',
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  gemImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  selectionCircle: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#003366',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#003366',
  },
  gemId: {
    marginTop: 4,
    fontSize: 12,
    color: '#003366',
    fontWeight: '500',
  },
  selectionActions: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  sellButton: {
    flex: 1,
    backgroundColor: '#003366',
    padding: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  sendOrderButton: {
    flex: 1,
    backgroundColor: '#003366',
    padding: 16,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#B2E6F0',
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
  },
  modalGemGrid: {
    paddingVertical: 10,
  },
  modalGemItem: {
    flex: 1/2,
    aspectRatio: 1,
    margin: 8,
    alignItems: 'center',
  },
  modalGemImage: {
    width: '80%',
    height: '80%',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  modalGemId: {
    marginTop: 4,
    fontSize: 14,
    color: '#003366',
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  confirmButton: {
    backgroundColor: '#34C759',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GemCollectionScreen;