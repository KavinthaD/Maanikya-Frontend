import { StyleSheet } from "react-native";

export const FormFieldStyles = StyleSheet.create({
  innerContainer: {
    padding: 20,
  },
  input: {
    backgroundColor: "#E8F0FE",
    color: "black",
    padding: 13,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 13,
  },
  dropdown: {
    backgroundColor: "#E8F0FE",
    borderRadius: 10,
    borderWidth: 0,
    height: 50,
    fontSize: 20,
    marginBottom: 12,
  },
  dropdownText: {
    color: "#000",
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
    color: "#000",
    fontSize: 16,
  },
  placeholder: {
    color: "#666",
    fontSize: 16,
  },
});
