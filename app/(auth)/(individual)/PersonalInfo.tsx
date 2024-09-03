import React, { useState } from "react";
import { View, Text, Alert, ScrollView } from "react-native";
import { FormWrapper } from "@/components/FormWraper";
import FormField from "@/components/FormField";
import LocationInput from "@/components/LocationInput";
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/app/contexts/AuthContext";
import { router, useLocalSearchParams } from "expo-router";

type UserData = {
  Name: string;
  DateOfBirth: string;
  Address: string;
};

type ErrorData = {
  Name?: string;
  DateOfBirth?: string;
  Address?: string;
};

const PersonalInfo = () => {
  const [data, setData] = useState<UserData>({
    Name: "",
    DateOfBirth: "",
    Address: "",
  });
  const [errors, setErrors] = useState<ErrorData>({});
  const { PersonalInfoUpdate } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const params = useLocalSearchParams();
  const workerId = params.workerId as string | undefined;
  const totalScreens = params.totalScreens as string | undefined;

  const isValidDateFormat = (dateString: string): boolean => {
    // Regular expression to match DD/MM/YYYY format
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/;
    return regex.test(dateString);
  };

  const parseDate = (dateString: string): Date => {
    const [day, month, year] = dateString.split("/").map(Number);
    return new Date(year, month - 1, day); // month is 0-indexed in JavaScript Date
  };

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const validateForm = (): boolean => {
    let newErrors: ErrorData = {};
    let isValid = true;

    // Name validation
    if (!data.Name.trim()) {
      newErrors.Name = "Name is required";
      isValid = false;
    }
    if (data.Name.length < 2) {
      newErrors.Name = "Name must be at least 2 characters";
      isValid = false;
    }
    const namePattern = /^[a-zA-Z.' ]+$/;
    if (!namePattern.test(data.Name)) {
      newErrors.Name =
        "Name must include only letters, fullstops, apostrophes, and spaces";
      isValid = false;
    }
    // Date of Birth validation
    if (!data.DateOfBirth.trim()) {
      newErrors.DateOfBirth = "Date of Birth is required";
      isValid = false;
    } else if (!isValidDateFormat(data.DateOfBirth)) {
      newErrors.DateOfBirth = "Invalid date format. Please use DD/MM/YYYY";
      isValid = false;
    } else {
      const birthDate = parseDate(data.DateOfBirth);
      const age = calculateAge(birthDate);
      if (age < 18) {
        newErrors.DateOfBirth = "You must be at least 18 years old";
        isValid = false;
      }
    }

    // Address validation
    if (
      !data.Address.trim() &&
      data.Address.length < 7 &&
      data.Address.length > 100
    ) {
      newErrors.Address = "Address is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      // Proceed with form submission
      setIsSubmitting(true);
      try {
        const response = await PersonalInfoUpdate(
          data.Name,
          data.DateOfBirth,
          data.Address,
          totalScreens !== "5" ? true : false
        );
        router.push({
          pathname: "/AcademicInfo",
          params: { workerId: workerId, totalScreens: totalScreens },
        });
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      Alert.alert(
        "Please check entries and try again ",
        "Please check the highlighted entries and correct any errors to proceed."
      );
    }
  };

  return (
    <SafeAreaView className="h-full bg-white p-0">
      <View className="w-full flex-row items-center justify-center mt-0 mb-3">
        <Text className="text-xl text-center font-plight text-black">
          Step{" "}
        </Text>
        <Text className="text-2xl text-center font-pbold text-black">1</Text>
        <Text className="text-xl text-center font-plight text-black">
          {" "}
          of {totalScreens || "5"}
        </Text>
      </View>

      <ScrollView className="flex h-full px-2">
        <FormWrapper title="Personal Information">
          <FormField
            title="Name"
            value={data.Name}
            handleChangeText={(value: string) =>
              setData({ ...data, Name: value })
            }
            placeholder="Full Name"
            otherStyle="mt-7"
            keyBoardType="default"
            error={errors.Name}
            required={true}
          />
          <FormField
            title="Date of Birth"
            value={data.DateOfBirth}
            handleChangeText={(value: string) =>
              setData({ ...data, DateOfBirth: value })
            }
            placeholder="DD/MM/YYYY"
            otherStyle="mt-7"
            keyBoardType="numeric"
            error={errors.DateOfBirth}
            required={true}
          />

          <LocationInput
            onLocationChange={(value) => setData({ ...data, Address: value })}
          />
          {errors.Address && (
            <Text className="text-red-500 text-sm mt-1">{errors.Address}</Text>
          )}

          <View className="w-full my-5 justify-center items-center">
            <CustomButton
              title="Save and Continue"
              handlePress={handleSubmit}
              containerStyle="w-4/5 mt-5"
              isLoading={isSubmitting}
            />
          </View>
        </FormWrapper>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PersonalInfo;
