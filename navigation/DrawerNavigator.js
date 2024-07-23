import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AboutScreen from "../screens/AboutScreen";
import ContactUsScreen from "../screens/ContactUsScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";
import HomeScreen from "../screens/HomeScreen"; // HomeScreen ko Drawer mein add karna.

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
      <Drawer.Screen name="Contact Us" component={ContactUsScreen} />
      <Drawer.Screen name="Privacy Policy" component={PrivacyPolicyScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
