import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, StyleSheet } from "react-native";
import { FormWrapper } from "@/components/FormWraper";
import Dropdown from "@/components/DropDown";
import QualificationInfo from "@/components/QualificationInfo";
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/app/contexts/AuthContext";
import { router, useLocalSearchParams } from "expo-router";

type QualificationData = {
  InstituteName: string;
  Specialization: string;
  PassingYear: string;
};

type UserData = {
  HighestQualification: string;
  SecondaryQualification: string;
  PrimaryQualification: QualificationData;
  AdditionalQualification: QualificationData;
};

type ErrorState = {
  HighestQualification?: string;
  SecondaryQualification?: string;
  PrimaryQualification: Partial<QualificationData>;
  AdditionalQualification: Partial<QualificationData>;
};

type AcademicInfoEntry = {
  qualificationType: string;
  instituteName: string;
  specialization: string;
  passingYear: string;
};

const defaultQualificationData: QualificationData = {
  InstituteName: "",
  Specialization: "",
  PassingYear: "",
};

const AcademicInfo: React.FC = () => {
  const [data, setData] = useState<UserData>({
    HighestQualification: "",
    SecondaryQualification: "",
    PrimaryQualification: defaultQualificationData,
    AdditionalQualification: defaultQualificationData,
  });

  const [errors, setErrors] = useState<ErrorState>({
    PrimaryQualification: {},
    AdditionalQualification: {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { AcademicInfoUpdate } = useAuth();
  const params = useLocalSearchParams();
  const workerId = params.workerId as string | undefined;
  const totalScreens = params.totalScreens as string | undefined;

  const qualificationOptions = [
    { key: "1", value: "PG (Postgraduate)" },
    { key: "2", value: "Bachelors" },
    { key: "3", value: "12th" },
    { key: "4", value: "Diploma" },
    { key: "5", value: "10th" },
  ];

  const diplomaSecondaryOptions = [
    { key: "3", value: "12th" },
    { key: "5", value: "10th" },
  ];

  const qualificationPrecedence: { [key: string]: number } = {
    "PG (Postgraduate)": 4,
    Bachelors: 3,
    "12th": 2,
    Diploma: 2,
    "10th": 1,
  };

  const getNextLowerQualification = (currentQualification: string): string => {
    const currentPrecedence = qualificationPrecedence[currentQualification];
    const nextLowerQualifications = qualificationOptions
      .filter(
        (option) => qualificationPrecedence[option.value] < currentPrecedence
      )
      .sort(
        (a, b) =>
          qualificationPrecedence[b.value] - qualificationPrecedence[a.value]
      );

    return nextLowerQualifications.length > 0
      ? nextLowerQualifications[0].value
      : "";
  };

  useEffect(() => {
    if (
      data.HighestQualification &&
      data.HighestQualification !== "10th" &&
      data.HighestQualification !== "Diploma"
    ) {
      const nextLowerQualification = getNextLowerQualification(
        data.HighestQualification
      );
      setData((prev) => ({
        ...prev,
        SecondaryQualification: nextLowerQualification,
      }));
    } else if (data.HighestQualification === "Diploma") {
      setData((prev) => ({
        ...prev,
        SecondaryQualification: "",
      }));
    }
  }, [data.HighestQualification]);

  const validateForm = (): boolean => {
    let newErrors: ErrorState = {
      PrimaryQualification: {},
      AdditionalQualification: {},
    };
    let isValid = true;

    const currentYear = new Date().getFullYear();
    const maxAllowedYear = currentYear + 4;

    if (!data.HighestQualification) {
      newErrors.HighestQualification = "Highest qualification is required";
      isValid = false;
    }

    // Validate PrimaryQualification
    const primaryQual = data.PrimaryQualification;
    if (!primaryQual.InstituteName) {
      newErrors.PrimaryQualification.InstituteName =
        "Institute name is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(primaryQual.InstituteName)) {
      newErrors.PrimaryQualification.InstituteName =
        "Institute name should only contain letters and spaces";
      isValid = false;
    }

    if (!primaryQual.Specialization) {
      newErrors.PrimaryQualification.Specialization =
        "Specialization is required";
      isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(primaryQual.Specialization)) {
      newErrors.PrimaryQualification.Specialization =
        "Specialization should only contain letters and spaces";
      isValid = false;
    }

    if (!primaryQual.PassingYear) {
      newErrors.PrimaryQualification.PassingYear = "Passing year is required";
      isValid = false;
    } else {
      const primaryYear = parseInt(primaryQual.PassingYear, 10);
      if (!/^\d{4}$/.test(primaryQual.PassingYear)) {
        newErrors.PrimaryQualification.PassingYear =
          "Passing year should be a 4-digit number";
        isValid = false;
      } else if (primaryYear < 1900 || primaryYear > maxAllowedYear) {
        newErrors.PrimaryQualification.PassingYear = `Passing year should be less than ${maxAllowedYear}`;
        isValid = false;
      }
    }

    // Validate AdditionalQualification only if HighestQualification is not "10th"
    if (data.HighestQualification !== "10th") {
      if (
        data.HighestQualification === "Diploma" &&
        !data.SecondaryQualification
      ) {
        newErrors.SecondaryQualification =
          "Secondary qualification is required for Diploma";
        isValid = false;
      }

      const additionalQual = data.AdditionalQualification;
      if (!additionalQual.InstituteName) {
        newErrors.AdditionalQualification.InstituteName =
          "Institute name is required";
        isValid = false;
      } else if (!/^[a-zA-Z\s]+$/.test(additionalQual.InstituteName)) {
        newErrors.AdditionalQualification.InstituteName =
          "Institute name should only contain letters and spaces";
        isValid = false;
      }

      if (!additionalQual.Specialization) {
        newErrors.AdditionalQualification.Specialization =
          "Specialization is required";
        isValid = false;
      } else if (!/^[a-zA-Z\s]+$/.test(additionalQual.Specialization)) {
        newErrors.AdditionalQualification.Specialization =
          "Specialization should only contain letters and spaces";
        isValid = false;
      }

      if (!additionalQual.PassingYear) {
        newErrors.AdditionalQualification.PassingYear =
          "Passing year is required";
        isValid = false;
      } else {
        const additionalYear = parseInt(additionalQual.PassingYear, 10);
        const primaryYear = parseInt(primaryQual.PassingYear, 10);
        if (!/^\d{4}$/.test(additionalQual.PassingYear)) {
          newErrors.AdditionalQualification.PassingYear =
            "Passing year should be a 4-digit number";
          isValid = false;
        } else if (additionalYear < 1900 || additionalYear > maxAllowedYear) {
          newErrors.AdditionalQualification.PassingYear = `Passing year should be between 1900 and ${maxAllowedYear}`;
          isValid = false;
        } else if (additionalYear > primaryYear) {
          newErrors.AdditionalQualification.PassingYear =
            "Secondary qualification year cannot be later than highest qualification year";
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof UserData, value: any) => {
    setData((prev) => {
      const newData = { ...prev, [field]: value };

      if (field === "HighestQualification") {
        if (value === "10th") {
          newData.SecondaryQualification = "";
          newData.AdditionalQualification = defaultQualificationData;
        } else if (value === "Diploma") {
          newData.SecondaryQualification = "";
        } else {
          newData.SecondaryQualification = getNextLowerQualification(value);
        }
      }

      return newData;
    });
  };

  const updateQualification = (
    qualificationType: "PrimaryQualification" | "AdditionalQualification",
    fields: Partial<QualificationData>
  ) => {
    handleInputChange(qualificationType, {
      ...data[qualificationType],
      ...fields,
    });
  };

  const createAcademicInfoArray = (): AcademicInfoEntry[] => {
    const academicInfo: AcademicInfoEntry[] = [];

    // Add primary qualification
    academicInfo.push({
      qualificationType: data.HighestQualification,
      instituteName: data.PrimaryQualification.InstituteName,
      specialization: data.PrimaryQualification.Specialization,
      passingYear: data.PrimaryQualification.PassingYear,
    });

    // Add secondary qualification if it's not "10th"
    if (data.HighestQualification !== "10th" && data.SecondaryQualification) {
      academicInfo.push({
        qualificationType: data.SecondaryQualification,
        instituteName: data.AdditionalQualification.InstituteName,
        specialization: data.AdditionalQualification.Specialization,
        passingYear: data.AdditionalQualification.PassingYear,
      });
    }

    return academicInfo;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const academicInfoArray = createAcademicInfoArray();
        console.log(academicInfoArray);
        await AcademicInfoUpdate(academicInfoArray);
        router.replace({
          pathname: totalScreens === "5" ? "/ExperienceInfo" : "/Preferences",
          params: { workerId, totalScreens },
        });
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Error", "Failed to update academic information.");
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

  const handleSecondaryQualificationSelect = (value: string) => {
    if (data.HighestQualification === "Diploma") {
      handleInputChange("SecondaryQualification", value);
    }
  };

  const isSecondaryDropdownActive = data.HighestQualification === "Diploma";

  const secondaryDropdownStyle = StyleSheet.create({
    dropdown: {
      opacity: isSecondaryDropdownActive ? 1 : 0.6,
    },
  });

  const getSecondaryQualificationOptions = () => {
    if (data.HighestQualification === "Diploma") {
      return diplomaSecondaryOptions;
    }
    return qualificationOptions.filter(
      (option) =>
        qualificationPrecedence[option.value] <
        qualificationPrecedence[data.HighestQualification]
    );
  };

  return (
    <SafeAreaView className="h-full bg-white p-0">
      <View className="w-full flex-row items-center justify-center mt-0 mb-3">
        <Text className="text-xl text-center font-plight text-black">
          Step{" "}
        </Text>
        <Text className="text-2xl text-center font-pbold text-black">2</Text>
        <Text className="text-xl text-center font-plight text-black">
          {" "}
          of {totalScreens || "5"}
        </Text>
      </View>
      <ScrollView className="flex h-full px-2">
        <FormWrapper title="Academic Information">
          <Dropdown
            label="Highest Qualification"
            data={qualificationOptions}
            placeholder="Select highest qualification"
            onSelect={(value) =>
              handleInputChange("HighestQualification", value)
            }
            value={data.HighestQualification}
            required={true}
            search={true}
          />
          {errors.HighestQualification && (
            <Text className="text-red-500 text-sm">
              {errors.HighestQualification}
            </Text>
          )}
          <QualificationInfo
            qualificationType={data.HighestQualification}
            InstituteName={data.PrimaryQualification.InstituteName}
            Specialization={data.PrimaryQualification.Specialization}
            PassingYear={data.PrimaryQualification.PassingYear}
            UpdateFields={(fields) =>
              updateQualification("PrimaryQualification", fields)
            }
            errors={errors.PrimaryQualification}
          />
          {data.HighestQualification !== "10th" && (
            <>
              <View
                pointerEvents={isSecondaryDropdownActive ? "auto" : "none"}
                style={secondaryDropdownStyle.dropdown}
              >
                <Dropdown
                  label="Secondary Qualification"
                  data={getSecondaryQualificationOptions()}
                  placeholder="Select secondary qualification"
                  onSelect={handleSecondaryQualificationSelect}
                  value={data.SecondaryQualification}
                  required={true}
                  search={isSecondaryDropdownActive}
                />
              </View>
              {errors.SecondaryQualification && (
                <Text className="text-red-500 text-sm">
                  {errors.SecondaryQualification}
                </Text>
              )}
              <QualificationInfo
                qualificationType={data.SecondaryQualification}
                InstituteName={data.AdditionalQualification.InstituteName}
                Specialization={data.AdditionalQualification.Specialization}
                PassingYear={data.AdditionalQualification.PassingYear}
                UpdateFields={(fields) =>
                  updateQualification("AdditionalQualification", fields)
                }
                errors={errors.AdditionalQualification}
              />
            </>
          )}
          <View className="items-center my-6 w-full">
            <CustomButton
              title="Save & Continue"
              handlePress={handleSubmit}
              isLoading={isSubmitting}
              containerStyle="w-4/5"
            />
          </View>
        </FormWrapper>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AcademicInfo;
