//Screen creator: Dulith
import React, {useState} from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { baseScreenStylesNew } from '../../styles/baseStylesNew';
import Header_1 from '../../components/Header_1';
import { Ionicons } from '@expo/vector-icons';

const Alerts = [
  {
    id: '1',
    image: require('../../assets/gemimg/user1.jpg'), 
    name: "Mehara Wilfred",
    message: "Confirmed Order #: MN30045",
    time: "1:52 PM"
  },
  {
    id: '2',
    image: require('../../assets/gemimg/user2.jpg'), 
    name: "Tilmi Premarathna",
    message: "Sent an order request",
    time: "10:22 AM"
  },
  {
    id: '3',
    image: require('../../assets/gemimg/user3.jpg'), 
    name: "Isum Perera",
    message: "Requested Order #: MN6746",
    time: "Feb 21"
  },
  {
    id: '6',
    image: require('../../assets/gemimg/user2.jpg'),
    name: 'Dulith Wanigarathna',
    message: 'Updated Order #: MN6489',
    time: 'Jan 31',
  },
  {
    id: '7',
    image: require('../../assets/gemimg/user1.jpg'), 
    name: "Thulani Kalatuwawa",
    message: "Confirmed Order #: MN30045",
    time: "Dec 24 2024"
  },
  {
    id: '8',
    image: require('../../assets/gemimg/user2.jpg'), 
    name: "Kavintha Dinushan",
    message: "Sent an order request",
    time: "Dec 18 2024"
  },
  {
    id: '9',
    image: require('../../assets/gemimg/user3.jpg'), 
    name: "Sasindu Repa IIT",
    message: "Requested Order #: MN6746",
    time: "Apr 18 2023"
  },
  {
    id: '10',
    image: require('../../assets/gemimg/user2.jpg'),
    name: 'Malgowa People',
    message: 'Updated Order #: MN6489',
    time: 'Dec 28 2000',
  },
  
];


const AlertsScreen = () => {
  const [notifications, setNotifications] = useState(Alerts);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isEllipsisClicked, setIsEllipsisClicked] = useState(false);

  // Toggle selection mode 
  const handlePress = (id) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  // Toggle select all notifications
  const toggleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([]); // Deselect all
    } else {
      setSelectedIds(notifications.map((item) => item.id)); // Select all
    }
  };

  // Delete selected notifications
  const deleteSelectedNotifications = () => {
    const filteredNotifications = notifications.filter((item) => !selectedIds.includes(item.id));
    setNotifications(filteredNotifications);
    setSelectedIds([]);
    setIsSelectionMode(false);
    setIsEllipsisClicked(false);
  };

  //close the menu when tapped outside
  const handleCloseSelection = () => {
    setIsSelectionMode(false);
    setSelectedIds([]); //deselct the alerts
    setIsEllipsisClicked(false);
  };

  // Render each alert item
  const renderAlertItem = ({ item }) => {
    const isSelected = selectedIds.includes(item.id);

    return (
      <TouchableOpacity
      onPress={() => handlePress(item.id)}  //select and deselect
        style={[styles.alertItem, isSelected && baseScreenStylesNew.themeColor]}
      >
        <Image source={item.image} style={styles.alertImage} />
        <View style={styles.alertTextContainer}>
          <Text style={[styles.alertName, isSelected && styles.selectedText]}>{item.name}</Text>
          <Text style={[styles.alertMessage, isSelected && styles.selectedText]}>{item.message}</Text>
        </View>
        <Text style={[styles.alertTime, isSelected && styles.selectedText]}>{item.time}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={handleCloseSelection}>
    <View style={baseScreenStylesNew.container}>
      <Header_1 title="Alerts" />
      <View style={styles.topBar}>
          <TouchableOpacity onPress={() => setIsEllipsisClicked(!isEllipsisClicked)}>
            <Ionicons name="ellipsis-vertical" size={24} color="black" style={styles.Icon} />
          </TouchableOpacity>
        </View>

        {/* Show delete options only when ellipsis is clicked */}
        {isEllipsisClicked && (
          <View style={styles.deleteMenu}>
            <TouchableOpacity onPress={toggleSelectAll}>
              <Text style={styles.menuText}>{selectedIds.length === notifications.length ? "Deselect All" : "Select All"}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={deleteSelectedNotifications}>
              <Text style={styles.menuText}>Delete </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleCloseSelection()}>
              <Text style={styles.menuText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      
      <FlatList
        data={notifications}
        renderItem={renderAlertItem}
        keyExtractor={item => item.id}
      />
      {/* Delete Button (Visible Only in Selection Mode) */}
      {isSelectionMode && (
        <TouchableOpacity style={[baseScreenStylesNew.themeColor,styles.deleteButton]} onPress={deleteSelectedNotifications}>
          <Ionicons name="trash-outline" size={24} color="white" />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  Icon: {
    left: 360
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  selectAllText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 7,
    marginTop: 2, 
    width:"100%",
    alignSelf: 'center',
  },
  alertImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  alertMessage: {
    fontSize: 14,
    color: '#555',
  },
  alertTime: {
    fontSize: 12,
    color: '#666',
    marginRight: 8
  },
  selectedText: {
    color: 'white', // Change text color when selected
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    position: 'absolute',
    bottom: 20,
    left: '35%',
    right: '35%',
  },
  deleteText: {
    fontSize: 16,
    color: 'white',
    marginLeft: 5,
  },
  deleteMenu: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    borderColor: "rgb(241, 241, 241)",
    borderWidth: 2,
    padding: 10,
    zIndex: 100,
    elevation: 12
  },
  menuText: {
    fontSize: 16,
    paddingVertical: 8,
    color: '#000',
  },
});

export default AlertsScreen;
