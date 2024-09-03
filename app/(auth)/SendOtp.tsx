import React, { useState, useRef } from "react";
import { View, Text, TextInput, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

const SendOtp = () => {
  const params = useLocalSearchParams();
  const workerId = params.workerId as string | undefined;
  const userType = params.userType as string | undefined;
  const { verifyLoginOTPForJobSeeker, verifyLoginOTPForEmployer } = useAuth();
  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  const inputs = useRef<Array<TextInput | null>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const otpValue = otp.join("");

    if (otpValue.length < 4) {
      return;
    }
    if (!workerId || !userType) {
      Alert.alert("Error", "Missing worker ID or user type.");
      return;
    }
    console.log("new stuffs", workerId, otpValue);
    setIsSubmitting(true);
    try {
      if (userType === "job_seeker") {
        const response = await verifyLoginOTPForJobSeeker(workerId, otpValue);
        console.log(response.user.registrationStep);
        if (response.user.registrationStep === "personal_info") {
          router.push({
            pathname: "/Choice",
            params: { workerId: workerId },
          });
        }
        if (response.user.registrationStep === "academic_info") {
          router.push({
            pathname: "/AcademicInfo",
            params: { workerId: workerId },
          });
        }
        if (response.user.registrationStep === "experiences") {
          router.push({
            pathname: "/ExperienceInfo",
            params: { workerId: workerId },
          });
        }
        if (response.user.registrationStep === "preferences") {
          router.push({
            pathname: "/Preferences",
            params: { workerId: workerId },
          });
        }
        if (response.user.registrationStep === "intro_video") {
          router.push({
            pathname: "/IntroVideo",
            params: { workerId: workerId },
          });
        }
        if (response.user.registrationStep === "completed") {
          router.push({
            pathname: "/home",
            params: { workerId: workerId },
          });
        }
      } else {
        const response = await verifyLoginOTPForEmployer(workerId, otpValue);
        console.log("response", response);
        console.log("resgisteration step", response.user.registrationStep);
        if (response.user.registrationStep === "basic_info") {
          router.push({
            pathname: "/BasicDetail",
            params: { workerId: workerId },
          });
        }
        if (response.user.registrationStep === "company_info") {
          router.push({
            pathname: "/ContactInfo",
            params: { workerId: workerId },
          });
        }
        if (response.user.registrationStep === "completed") {
          router.push({
            pathname: "/home",
            params: { workerId: workerId },
          });
        }
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Alert.alert("Error", "Invalid OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;

    if (text !== "" && index < 3) {
      inputs.current[index + 1]?.focus();
    }

    setOtp(newOtp);
  };

  const handleKeyPress = (nativeEvent: any, index: number) => {
    if (nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus(); // Move focus to previous input
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="w-full flex-1 items-center px-4">
          <Text className="text-2xl font-semibold text-black mt-10">
            Enter OTP
          </Text>
          <View className="w-full mt-5">
            <Text className="text-center text-sm text-black font-pregular">
              We have sent the One Time Password to the given Mobile Number
            </Text>
          </View>

          {/* OTP Input */}
          <View className="w-full mt-7 flex-row justify-between">
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputs.current[index] = ref)}
                className="w-16 h-16 border-2 border-gray-100 focus:border-secondary rounded-3xl text-center text-black text-lg mx-1"
                value={value}
                onChangeText={(text) => handleChange(text, index)}
                maxLength={1}
                keyboardType="numeric"
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent, index)
                }
                editable={true}
              />
            ))}
          </View>

          <CustomButton
            title="Confirm"
            handlePress={handleSubmit}
            containerStyle="w-full mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SendOtp;
