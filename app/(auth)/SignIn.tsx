import { View, Text, ScrollView, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const SignIn =() => {
  const params=useLocalSearchParams();
  const userType=params.userType as string|undefined;
  const { initiateRegistration,initiateRegistrationForEmployer } = useAuth(); 
  const [form, setForm] = useState({
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const Navigate = async(route: string) => {
  if(!form.email){
    Alert.alert("Error",(userType==="employer"?"Please enter valid Email/Phone Number":"Please enter valid 10 digit Phone Number"));
    return;
  }
  if(route === "/SendOtp"){
    if (!/^\d{10}$/.test(form.email)) {
      Alert.alert("Error", "Please enter a valid phone number to receive an OTP");
      return;
    }
    try {
      setIsSubmitting(true);
      let response;
      if(userType==="job_seeker"){ 
        response=await initiateRegistration("+91" + form.email);
        router.push({
          pathname: route,
          params: { email: form.email, sentFrom: "SignIn", workerId: response.userId, userType: userType },  
        });
      }else{
        response=await initiateRegistrationForEmployer("+91"+form.email);
        console.log(response.userId);
        router.push({
          pathname: route,
          params: { email: form.email, sentFrom: "SignIn", workerId: response.userId, userType: userType },  
        });
      }
      
    }
    catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "Failed to send OTP.");
    }
    finally {
      setIsSubmitting(false);
    } 
  }else{
    router.push({
      pathname: route,
      params: { email: form.email, sentFrom: "SignIn" },
    });
  }
    
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="w-full flex-1 items-center px-4">
          <Text className="text-2xl font-semibold text-black mt-10">
            Log In / Sign Up
          </Text>
          <View className="w-full mt-7">
            <FormField
              title={(userType==="employer")?"Email/Phone Number":"Phone Number"}
              value={form.email}
              handleChangeText={(text) => setForm({ ...form, email: text })}
              keyBoardType="email-address"
              placeholder={""}
              required={true}
            />

            <CustomButton
              title="Send OTP"
              handlePress={() => Navigate("/SendOtp")}
              containerStyle="w-full mt-7"
              isLoading={isSubmitting}
            />

            {userType==="employer" &&
            <CustomButton
              title="Continue with Password"
              handlePress={() => Navigate("/VerifyPassword")}
              containerStyle="w-full mt-7"
              isLoading={isSubmitting}
            />}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;