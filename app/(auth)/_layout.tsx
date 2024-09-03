import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="SignIn"
        options={{
          title: "factorykaam",
          headerStyle: { backgroundColor: "#432C51" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="SendOtp"
        options={{
          title: "factorykaam",
          headerStyle: { backgroundColor: "#432C51" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="(individual)/PersonalInfo"
        options={{
          title: "factorykaam",
          headerStyle: { backgroundColor: "#432C51" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="(individual)/AcademicInfo"
        options={{
          title: "factorykaam",
          headerStyle: { backgroundColor: "#432C51" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="Choice"
        options={{
          title: "factorykaam",
          headerStyle: { backgroundColor: "#432C51" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="(individual)/ExperienceInfo"
        options={{
          title: "factorykaam",
          headerStyle: { backgroundColor: "#432C51" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="(individual)/Preferences"
        options={{
          title: "factorykaam",
          headerStyle: { backgroundColor: "#432C51" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="(individual)/IntroVideo"
        options={{
          title: "factorykaam",
          headerStyle: { backgroundColor: "#432C51" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />

      <Stack.Screen
        name="(organisation)/BasicDetail"
        options={{
          title: "factorykaam",
          headerStyle: { backgroundColor: "#432C51" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="(organisation)/ContactInfo"
        options={{
          title: "factorykaam",
          headerStyle: { backgroundColor: "#432C51" },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </Stack>
  );
};

export default AuthLayout;
