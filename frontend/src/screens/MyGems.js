import React, {useEffect, useState} from 'react';
import { View, Text, FlatList, StyleSheet, Image, ScrollView } from 'react-native';

  
const MyGems = () => {

    
    return(
        <ScrollView>
            <Image
        source={{ uri: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fgecdesigns.com%2Fvisiting-card-templates%2Ffree%2Felegant-visiting-card-design-for-creative-professionals-10042403&psig=AOvVaw2QoG4T7O0dT0R_sJb47CT6&ust=1734164707909000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJCKwYyppIoDFQAAAAAdAAAAABAE' }} // Replace with your image URL
        style={styles.image}
        />
        <FlatList
        renderItems ={({items}) => (
            <view>
            <Text> Date added to system - 9/12/2023</Text>
            <Text> Identification - Natural Blue Sapphire</Text>
            <Text> Weight - 1.96 carets</Text>
            <Text> Measurements - 8.59 x 6.36 x 4.97 mm</Text>
            <Text> Shape - Cushion</Text>
            <Text> Colour - Vivid Blue</Text>
            <Text>Additional Information- </Text>
        </view>
      
          )} 
        />
        <FlatList 
        renderItems= {({items}) => (
            <view>
                <Text>Purchase Price - LKR 60 000</Text>
                <Text>Cost - LKE 20 000</Text>
                <Texr>Sold Price - LKR 100 000</Texr>
            </view>
        )}
        />
        <Image
        source={{ uri: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fgecdesigns.com%2Fvisiting-card-templates%2Ffree%2Felegant-visiting-card-design-for-creative-professionals-10042403&psig=AOvVaw2QoG4T7O0dT0R_sJb47CT6&ust=1734164707909000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCJCKwYyppIoDFQAAAAAdAAAAABAE' }} // Replace with your image URL
        style={styles.image}
        />
    

    </ScrollView>
      
    
    );
};
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    heading: { fontSize: 20, fontWeight: 'bold', marginVertical: 15, textAlign: 'center' },
    sectionHeading: { fontSize: 18, fontWeight: 'bold', marginVertical: 10, color: '#333' },
    detailCard: { padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10, backgroundColor: '#f9f9f9', marginHorizontal: 10 },
    image: { width: '100%', height: 200, resizeMode: 'cover', marginVertical: 10 },
});

export default MyGems;