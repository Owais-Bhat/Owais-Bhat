import React from "react";
import { Platform, useWindowDimensions } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ModulesScreen from "../screens/ModulesScreen";
import AdmissionsScreen from "../screens/AdmissionsScreen";
import StudentsScreen from "../screens/StudentsScreen";
import Icon from "react-native-vector-icons/FontAwesome";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { width } = useWindowDimensions();
  const isWebDesktop = Platform.OS === "web" && width >= 1024;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Dashboard") {
            iconName = "dashboard";
          } else if (route.name === "Profile") {
            iconName = "user";
          } else if (route.name === "Modules") {
            iconName = "th-large";
          } else if (route.name === "Admissions") {
            iconName = "address-book";
          } else if (route.name === "Students") {
            iconName = "graduation-cap";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: "#2f6df6",
        tabBarInactiveTintColor: "#74829f",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarItemStyle: isWebDesktop ? { marginVertical: 6 } : undefined,
        tabBarStyle: isWebDesktop
          ? {
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 220,
              height: "100%",
              borderRightWidth: 1,
              borderTopWidth: 0,
              borderRightColor: "#dbe3f2",
              paddingTop: 18,
            }
          : { height: 64 },
        tabBarLabelPosition: isWebDesktop ? "beside-icon" : "below-icon",
      })}
    >
      <Tab.Screen name="Dashboard" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Admissions" component={AdmissionsScreen} />
      <Tab.Screen name="Students" component={StudentsScreen} />
      <Tab.Screen name="Modules" component={ModulesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
