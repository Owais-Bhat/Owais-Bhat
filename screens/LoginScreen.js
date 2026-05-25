import React, { useState } from "react";
import { View, Text, TextInput, ImageBackground, Image, Pressable } from "react-native";
import { Formik } from "formik";
import * as Yup from "yup";
import globalStyles from "../styles/globalStyles";
import { useAuth } from "../contexts/AuthContext";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const LoginScreen = () => {
  const { login } = useAuth();
  const [error, setError] = useState("");

  return (
    <View style={globalStyles.container}>
      <ImageBackground source={require("../assets/bg.png")} resizeMode="contain">
        <View style={globalStyles.view}>
          <Image source={require("../assets/logo.png")} resizeMode="contain" style={globalStyles.image} />
        </View>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm }) => {
            setError("");
            try {
              await login(values);
              resetForm({ values: { email: "", password: "" } });
            } catch (err) {
              setError(err.message || "Unable to login");
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <TextInput
                style={globalStyles.input}
                placeholder="Email"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                autoCapitalize="none"
              />
              {touched.email && errors.email && <Text style={globalStyles.errorText}>{errors.email}</Text>}
              <TextInput
                style={globalStyles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
              {touched.password && errors.password && <Text style={globalStyles.errorText}>{errors.password}</Text>}
              {Boolean(error) && <Text style={globalStyles.errorText}>{error}</Text>}
              <View style={globalStyles.view2}>
                <Pressable onPress={handleSubmit} style={globalStyles.pressText}>
                  <Text>LogIn</Text>
                </Pressable>
              </View>
            </>
          )}
        </Formik>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;
