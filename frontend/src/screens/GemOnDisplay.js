import React, { useState } from "react";
import { SafeAreaView, View, Text, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

const GemOnDisplay = () => {
    const [onDisplay, setonDisplay] = useState([
        { id: 1, uri: 'https://www.sujanijewellers.com/wp-content/uploads/2021/09/hessonite-gomed-gemsratna.jpg', code: 'GEM001' },
        { id: 2, uri: 'https://www.sujanijewellers.com/wp-content/uploads/2021/09/hessonite-gomed-gemsratna.jpg', code: 'GEM002' },
        { id: 3, uri: 'https://www.sujanijewellers.com/wp-content/uploads/2021/09/hessonite-gomed-gemsratna.jpg', code: 'GEM003' },
    ]);

    const [onSale, setonSale] = useState([
        { id: 1, uri: 'https://www.sujanijewellers.com/wp-content/uploads/2021/09/hessonite-gomed-gemsratna.jpg', code: 'GEM101', name: 'Kamal', price: '$500' },
        { id: 2, uri: 'https://www.sujanijewellers.com/wp-content/uploads/2021/09/hessonite-gomed-gemsratna.jpg', code: 'GEM102', name: 'Nimal', price: '$800' },
        { id: 3, uri: 'https://www.sujanijewellers.com/wp-content/uploads/2021/09/hessonite-gomed-gemsratna.jpg', code: 'GEM103', name: 'Sunil', price: '$1,200' },
    ]);

    const handleAddGem = () => {
        const newGem = {
            id: onDisplay.length + 1,
            uri: 'https://cdn-icons-png.flaticon.com/512/2661/2661440.png',
            code: `GEM00${onDisplay.length + 1}`
        };
        setonDisplay([...onDisplay, newGem]);
    };

    const renderGem = ({ item }) => (
        <View style={styles.row}>
            <Image source={{ uri: item.uri }} style={styles.icon} />
            <Text style={styles.text}>{item.code}</Text>
        </View>
    );

    const renderGemDetails = ({ item }) => (
        <View style={styles.row}>
            <Image source={{ uri: item.uri }} style={styles.icon} />
            <Text style={[styles.text, { flex: 1 }]}>{item.code}</Text>
            <Text style={[styles.text, { flex: 2 }]}>{item.name}</Text>
            <Text style={styles.text}>{item.price}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.heading}>Gem On Display</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleAddGem}>
                <Ionicons name="add-circle" size={40} color="#007AFF" />
            </TouchableOpacity>
            
            <Text style={styles.heading}>-- On Display --</Text>
            <FlatList
                data={onDisplay}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderGem}
                contentContainerStyle={styles.list}
            />

            <Text style={styles.heading}>-- Sold Out --</Text>
            <FlatList
                data={onSale}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderGemDetails}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#9CCDDB',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 15,
    },
    list: {
        paddingVertical: 10,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 5,
    },
    icon: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    text: {
        fontSize: 16,
    },
    addButton: {
        alignSelf: 'center',
        marginBottom: 15,
    },
});

export default GemOnDisplay;
