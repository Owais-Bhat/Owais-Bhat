import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import globalStyles from "../styles/globalStyles";

export default function ProfileScreen() {
  return (
    <View>
      <View style={globalStyles.container}>
        <Image source={require("../assets/bg.png")} resizeMode="cover" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
