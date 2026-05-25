import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AboutScreen from "../screens/AboutScreen";
import ContactUsScreen from "../screens/ContactUsScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";
import TabNavigator from "./TabNavigator";

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Dashboard" component={TabNavigator} />
      <Drawer.Screen name="About" component={AboutScreen} />
      <Drawer.Screen name="Contact Us" component={ContactUsScreen} />
      <Drawer.Screen name="Privacy Policy" component={PrivacyPolicyScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
