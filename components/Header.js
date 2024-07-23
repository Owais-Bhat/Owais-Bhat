import React from "react";
import { View, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import globalStyles from "../styles/globalStyles";
import Icon from "react-native-vector-icons/FontAwesome";

const Header = () => {
  const navigation = useNavigation();

  return (
    <View style={globalStyles.header}>
      <Image source={require("../assets/logo.png")} style={globalStyles.logo} />
      <Pressable onPress={() => navigation.openDrawer()}>
        <Icon name="bars" size={24} color="#007bff" />
      </Pressable>
    </View>
  );
};

export default Header;
