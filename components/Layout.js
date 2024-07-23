import React from "react";
import { View, StyleSheet } from "react-native";
import Header from "./Header";
import TabNavigator from "../navigation/TabNavigator";
import Footer from "./Footer";
import { NavigationContainer } from "@react-navigation/native";

const Layout = ({ children }) => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.content}>{children}</View>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default Layout;
