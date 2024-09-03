import React, { useState, useEffect } from "react";
import { View, Text, Alert, ScrollView } from "react-native";
import { FormWrapper } from "@/components/FormWraper";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  IndustryChoicesOptions,
  PreferredLocationOptions,
  rolesByIndustry,
} from "@/constants/dropdown";

type UserData = {
  IndustryChoices: string[];
  PreferredRoles: string[];
  PreferredLocations: string[];
  ExpectedSalary: string;
};
interface JobPreferences {
  preferredIndustries: string[];
  preferredRoles: string[];
  preferredLocations: string[];
  expectedSalaries: number;
}
type ErrorData = {
  [K in keyof UserData]: string;
};

const MAX_SELECTIONS = 3;

const Preferences = () => {
  const [localData, setLocalData] = useState<UserData>({
    IndustryChoices: [],
    PreferredRoles: [],
    PreferredLocations: [],
    ExpectedSalary: "",
  });
  const { updateJobPreferences } = useAuth(); // Add this line to get the API function
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<ErrorData>({
    IndustryChoices: "",
    PreferredRoles: "",
    PreferredLocations: "",
    ExpectedSalary: "",
  });

  const [availableRoles, setAvailableRoles] = useState<
    Array<{ key: string; value: string }>
  >([]);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const params = useLocalSearchParams();
  const totalScreens = params.totalScreens as string | undefined;

  const updateFields = (fields: Partial<UserData>) => {
    console.log("Updating fields:", fields);
    setLocalData((prevData) => {
      const newData = { ...prevData, ...fields };
      console.log("New local data:", newData);
      return newData;
    });
  };

  useEffect(() => {
    updateAvailableRoles();
  }, [localData.IndustryChoices]);

  const updateAvailableRoles = () => {
    const allRoles = new Set<string>();

    localData.IndustryChoices.forEach((industry) => {
      if (rolesByIndustry[industry]) {
        rolesByIndustry[industry].forEach((role) => allRoles.add(role));
      }
    });

    const newRoleOptions = Array.from(allRoles).map((role, index) => ({
      key: String(index + 1),
      value: role,
    }));

    setAvailableRoles(newRoleOptions);

    // Clear selected roles that are no longer available
    const validRoles = localData.PreferredRoles.filter((role) =>
      allRoles.has(role)
    );
    updateFields({ PreferredRoles: validRoles });
  };

  const validateForm = (): ErrorData => {
    let newErrors: ErrorData = {
      IndustryChoices: "",
      PreferredRoles: "",
      PreferredLocations: "",
      ExpectedSalary: "",
    };

    // Validation is removed as all fields are optional

    return newErrors;
  };

  const transformData = (data: UserData): JobPreferences => {
    const industryMap: { [key: string]: string } = {
      "Textile Industry": "TEXTILE",
      "CNC (Computer Numerical Control)": "CNC",
      "Packaging Industry": "PACKAGING",
      "Auto Parts Industry": "AUTO_PARTS",
      "Printing Industry": "PRINTING",
    };

    return {
      preferredIndustries: data.IndustryChoices.map(
        (industry) => industryMap[industry] || industry.toUpperCase()
      ),
      preferredRoles: data.PreferredRoles,
      preferredLocations: data.PreferredLocations,
      expectedSalaries: parseInt(data.ExpectedSalary, 10) || 0,
    };
  };

  const handleContinue = async () => {
    const newErrors = validateForm();
    setErrors(newErrors);
    setFormSubmitted(true);

    if (Object.values(newErrors).every((error) => error === "")) {
      console.log("Form Data:", localData);
      setIsSubmitting(true);

      try {
        const transformedData = transformData(localData);
        console.log("Transformed Data:", transformedData);

        const response = await updateJobPreferences(transformedData);
        console.log("API Response:", response);

        router.push({
          pathname: "/IntroVideo",
          params: { totalScreens: totalScreens },
        }); // Replace with your next page route
      } catch (error) {
        console.error("API Error:", error);
        Alert.alert(
          "Error",
          "Failed to update job preferences. Please try again."
        );
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

  const handleMultiSelect = (
    field: keyof UserData,
    selectedItems: any
  ): void => {
    console.log(`Raw selected ${field}:`, selectedItems);
    let selectedValues: string[] = [];

    if (typeof selectedItems === "function") {
      const result = selectedItems(localData[field]);
      if (Array.isArray(result)) {
        selectedValues = result.map((item) =>
          typeof item === "object" && item !== null ? item.value : String(item)
        );
      }
    } else if (Array.isArray(selectedItems)) {
      selectedValues = selectedItems.map((item) =>
        typeof item === "object" && item !== null ? item.value : String(item)
      );
    } else if (typeof selectedItems === "object" && selectedItems !== null) {
      selectedValues = [String(selectedItems.value)];
    } else if (selectedItems !== null && selectedItems !== undefined) {
      selectedValues = [String(selectedItems)];
    }

    console.log(`Processed Selected ${field}:`, selectedValues);

    // If more than MAX_SELECTIONS are selected, remove the first item
    if (selectedValues.length > MAX_SELECTIONS) {
      selectedValues = selectedValues.slice(-MAX_SELECTIONS);
    }

    if (field === "IndustryChoices") {
      updateFields({ IndustryChoices: selectedValues, PreferredRoles: [] });
    } else {
      updateFields({ [field]: selectedValues } as Partial<UserData>);
    }
  };

  const getSelectedString = (field: keyof UserData) => {
    if (localData[field] && localData[field].length > 0) {
      return (localData[field] as string[]).join(", ");
    }
    return `Select ${field}`;
  };

  const ErrorMessage = ({ message }: { message: string }) =>
    formSubmitted && message ? (
      <Text style={{ color: "red", marginTop: 5 }}>{message}</Text>
    ) : null;
  const intScreens = parseInt(totalScreens || "5");
  const currentScreen = (intScreens - 1).toString();
  return (
    <SafeAreaView className="h-full bg-white p-0">
      <View className="w-full flex-row items-center justify-center mt-0 mb-3">
        <Text className="text-xl text-center font-plight text-black">
          Step{" "}
        </Text>
        <Text className="text-2xl text-center font-pbold text-black">
          {currentScreen}
        </Text>
        <Text className="text-xl text-center font-plight text-black">
          {" "}
          of {totalScreens || "5"}
        </Text>
      </View>
      <FormWrapper title="Job Preferences">
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
          <MultiSelectDropdown
            label="Preferred Industry"
            data={IndustryChoicesOptions}
            placeholder={getSelectedString("IndustryChoices")}
            onSelect={(items) => handleMultiSelect("IndustryChoices", items)}
            value={localData.IndustryChoices}
            search={true}
          />
          <ErrorMessage message={errors.IndustryChoices} />

          <MultiSelectDropdown
            label="Preferred Role"
            data={availableRoles}
            placeholder={getSelectedString("PreferredRoles")}
            onSelect={(items) => handleMultiSelect("PreferredRoles", items)}
            value={localData.PreferredRoles}
            search={true}
          />
          <ErrorMessage message={errors.PreferredRoles} />

          <MultiSelectDropdown
            label="Preferred Location"
            data={PreferredLocationOptions}
            placeholder={getSelectedString("PreferredLocations")}
            onSelect={(items) => handleMultiSelect("PreferredLocations", items)}
            value={localData.PreferredLocations}
            search={true}
          />
          <ErrorMessage message={errors.PreferredLocations} />

          <FormField
            title="Expected Salary (per month)"
            value={localData.ExpectedSalary}
            handleChangeText={(value: string) =>
              updateFields({ ExpectedSalary: value })
            }
            placeholder="Enter Salary in ₹ per month"
            otherStyle="mt-7"
            keyBoardType="numeric"
            error={formSubmitted ? errors.ExpectedSalary : ""}
          />

          <View className="items-center my-8">
            <CustomButton
              title="Save & Continue"
              handlePress={handleContinue}
              containerStyle="w-4/5"
            />
          </View>
        </ScrollView>
      </FormWrapper>
    </SafeAreaView>
  );
};

export default Preferences;
