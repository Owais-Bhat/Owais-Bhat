import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import CartScreen from "../screens/CartScreen";
import TabNavigator from "../navigation/TabNavigator";
const Footer = () => {
  const navigation = useNavigation();

  return (
    <View>
      <TabNavigator />
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    height: 50,
    backgroundColor: "#5CE1E6",
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
  },
});

export default Footer;
