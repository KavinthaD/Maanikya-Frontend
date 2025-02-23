import { StyleSheet } from "react-native";

export const FormFieldStyles = StyleSheet.create({     
    innerContainer: {
        padding: 20,
        paddingVertical: 60,
      },
      input: {
        backgroundColor: "#E8F0FE",
        color: "black",
        padding: 13,
        borderRadius: 10,
        marginBottom: 15,
        fontSize: 16,
      },
      dropdown: {
        backgroundColor: "#E8F0FE",
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 0,
        height: 50,
        fontSize: 20,
      },
      dropdownText: {
        fontSize: 16,
        
      },
      dropdownContainer: {
        backgroundColor: "#E8F0FE",
        borderWidth: 0,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listItemContainer: {
    backgroundColor: "#E8F0FE",
  },
  listItemLabel: {
    color: "black",
    fontSize: 16,
  },
  placeholder: {
    color: "grey",
    fontSize: 16,
  },
});