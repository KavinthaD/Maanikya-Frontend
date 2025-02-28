
//recreating navbar from scratch



  import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon, { Icons } from '../components/Icons';

import * as Animatable from 'react-native-animatable';

const TabArr = [
  { route: 'Home', label: 'Home', type: Icons.Feather, Ionicons: 'home', inActiveIcon: 'home-outline'  },
    { route: 'Market', label: 'Cart', type: Icons.Ionicons, activeIcon: 'cart', inActiveIcon: 'cart' },
    { route: 'AddGem', label: 'Gem', type: Icons.FontAwesome5, activeIcon: 'gem', inActiveIcon: 'gem' },
    { route: 'Alerts', label: 'Bell', type: Icons.FontAwesome6, activeIcon: 'bell-alt', inActiveIcon: 'bell'},
    { route: 'Profiles', label: 'User', type: Icons.FontAwesome, activeIcon: 'user', inActiveIcon: 'user' },
];

const Tab = createBottomTabNavigator();

const TabButton = (props) => {
  const { item, onPress, accessibilityState } = props;
  const focused = accessibilityState.selected;
  const viewRef = useRef(null);

  useEffect(() => {
    if (focused) {
      viewRef.current.animate({ 0: { scale: .5, rotate: '0deg' }, 1: { scale: 1.5, rotate: '360deg' } });
    } else {
      viewRef.current.animate({ 0: { scale: 1.5, rotate: '360deg' }, 1: { scale: 1, rotate: '0deg' } });
    }
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[styles.container, { top: 0 }]}
    >
      <Animatable.View
        ref={viewRef}
        duration={1000}
      >
        <Icon
          type={item.type}
          name={focused ? item.activeIcon : item.inActiveIcon}
          color={focused ? Colors.primary : Colors.primaryLite}
        />
      </Animatable.View>
    </TouchableOpacity>
  );
};

export default function AnimTab1() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 60,
            position: 'absolute',
            margin: 16,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
      >
        {TabArr.map((item, index) => (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarButton: (props) => <TabButton {...props} item={item} />,
            }}
          />
        ))}
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
});