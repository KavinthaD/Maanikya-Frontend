import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { StyleSheet } from "react-native";

const GradientContainer = ({ children }) => {
  return (
    <LinearGradient
      colors={styles.backgroundGradient.colors}
      locations={styles.backgroundGradient.locations}
      start={styles.backgroundGradient.start}
      end={styles.backgroundGradient.end}
      style={{ flex: 1 }} // Ensure it takes full space
    >
      {children}
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  backgroundGradient: {
    colors: [
      '#6B8391', // 9%
      '#436072', // 23%
      '#25475B', // 47%
      '#163A4F', // 68%
      '#072D44', // 89%
    ],
    locations: [0, 0.23, 0.47, 0.68, 0.89],
    start: { x: 0.5, y: 0 },
    end: { x: 0.5, y: 1 },
  },

});

export default GradientContainer;