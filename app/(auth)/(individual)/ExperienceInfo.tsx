import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { FormWrapper } from "@/components/FormWraper";
import FormField from "@/components/FormField";
import Dropdown from "@/components/DropDown";
import Checkbox from "expo-checkbox";
import DateRangeInput from "@/components/DateRangeInput";
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/app/contexts/AuthContext";

import { IndustryChoicesOptions, rolesByIndustry } from "@/constants/dropdown";

type ExperienceData = {
  pastExperiences: {
    startMonthYear: string;
    lastMonthYear: string;
    establishmentName: string;
    currentIndrustry: string;
    otherIndustry?: string;
    Role: string;
    exitReason: string;
  }[];
  isCurrentlyWorking: boolean;
  salaryDrawn: number;
  totalExperience: string;
  currentExperience: {
    startMonthYear: string;
    establishmentName: string;
    address: {
      city: string;
      state: string;
    };
    currentIndrustry: string;
    Role: string;
  };
};
type CompanyData = {
  LastSalary: string;
  CompanyName: string;
  CurrentIndustry: string;
  otherIndustry?: string;
  CurrentlyEmployed: boolean;
  Role: string;
  StartDate: string;
  EndDate: string;
};

const defaultCompanyData: CompanyData = {
  LastSalary: "",
  CompanyName: "",
  CurrentIndustry: "",
  CurrentlyEmployed: false,
  Role: "",
  StartDate: "",
  EndDate: "",
};

type UserData = {
  CurrentCompany: CompanyData;
  LastCompany: CompanyData;
  PreviousCompany: CompanyData;
  TotalExperienceMonths: string;
  TotalExperienceYears: string;
  lastSalary: string;
};

type UserFormProps = Partial<UserData> & {
  UpdateFields?: (fields: Partial<UserData>) => void;
};

const ExperienceInfo: React.FC<UserFormProps> = ({
  CurrentCompany = defaultCompanyData,
  LastCompany = defaultCompanyData,
  PreviousCompany = defaultCompanyData,
  TotalExperienceMonths = "",
  TotalExperienceYears = "",
  lastSalary = "",
  UpdateFields = () => {},
}) => {
  const { updateExperience, getExperiences } = useAuth();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentlyEmployed, setIsCurrentlyEmployed] = useState(
    CurrentCompany.CurrentlyEmployed
  );

  const [localCompanyData, setLocalCompanyData] = useState({
    CurrentCompany,
    LastCompany,
    PreviousCompany,
  });

  const [localExperience, setLocalExperience] = useState({
    TotalExperienceMonths,
    TotalExperienceYears,
    lastSalary,
  });

  const [currentCompanyRoles, setCurrentCompanyRoles] = useState<
    { key: string; value: string }[]
  >([]);
  const [lastCompanyRoles, setLastCompanyRoles] = useState<
    { key: string; value: string }[]
  >([]);
  const [previousCompanyRoles, setPreviousCompanyRoles] = useState<
    { key: string; value: string }[]
  >([]);

  const monthOptions = Array.from({ length: 11 }, (_, i) => ({
    key: (i + 1).toString(),
    value: (i + 1).toString().padStart(2),
  }));

  const yearOptions = Array.from({ length: 31 }, (_, i) => ({
    key: i.toString(),
    value: i.toString(),
  }));
  const params = useLocalSearchParams();
  const totalScreens = params.totalScreens as string | undefined;

  // const updateCompanyField = (
  //   companyType: "CurrentCompany" | "LastCompany" | "PreviousCompany",
  //   field: keyof CompanyData,
  //   value: any
  // ) => {
  //   setLocalCompanyData((prevData) => ({
  //     ...prevData,
  //     [companyType]: {
  //       ...prevData[companyType],
  //       [field]: value,
  //     },
  //   }));

  //   UpdateFields({
  //     [companyType]: {
  //       ...localCompanyData[companyType],
  //       [field]: value,
  //     },
  //   });

  //   const fieldKey = `${companyType}-${field}`;
  //   setTouched((prev) => ({ ...prev, [fieldKey]: true }));

  //   validateField(field, value, companyType);

  //   if (field === "CurrentlyEmployed") {
  //     setIsCurrentlyEmployed(value);
  //   }
  // };

  const updateCompanyField = (
    companyType: "CurrentCompany" | "LastCompany" | "PreviousCompany",
    field: keyof CompanyData,
    value: any
  ) => {
    setLocalCompanyData((prevData) => ({
      ...prevData,
      [companyType]: {
        ...prevData[companyType],
        [field]: value,
      },
    }));

    UpdateFields({
      [companyType]: {
        ...localCompanyData[companyType],
        [field]: value,
      },
    });

    const fieldKey = `${companyType}-${field}`;
    setTouched((prev) => ({ ...prev, [fieldKey]: true }));

    validateField(field, value, companyType);

    if (field === "CurrentlyEmployed") {
      setIsCurrentlyEmployed(value);
    }

    if (field === "CurrentIndustry") {
      const roles = rolesByIndustry[value] || [];
      const roleOptions = roles.map((role, index) => ({
        key: index.toString(),
        value: role,
      }));
      switch (companyType) {
        case "CurrentCompany":
          setCurrentCompanyRoles(roleOptions);
          break;
        case "LastCompany":
          setLastCompanyRoles(roleOptions);
          break;
        case "PreviousCompany":
          setPreviousCompanyRoles(roleOptions);
          break;
      }
    }
  };

  const validateField = (field: string, value: any, companyType: string) => {
    let newErrors = { ...errors };
    const fieldKey = `${companyType}-${field}`;

    if (!value && touched[fieldKey]) {
      newErrors[fieldKey] = `${field} is required`;
    } else {
      switch (field) {
        case "CompanyName":
        case "Role":
          if (!/^[a-zA-Z\s.,'-]+$/.test(value)) {
            newErrors[
              fieldKey
            ] = `Invalid ${field}. Please use only letters, spaces, and basic punctuation.`;
          } else {
            delete newErrors[fieldKey];
          }
          break;
        case "LastSalary":
          if (!/^\d+(\.\d{1,2})?$/.test(value)) {
            newErrors[fieldKey] = "Please enter a valid amount";
          } else {
            delete newErrors[fieldKey];
          }
          break;
        case "StartDate":
        case "EndDate":
          if (value.includes("(")) {
            const errorStart = value.indexOf("(");
            newErrors[fieldKey] = value.slice(errorStart + 1, -1);
          } else {
            delete newErrors[fieldKey];
          }
          break;
        default:
          delete newErrors[fieldKey];
      }
    }
    setErrors(newErrors);
  };

  const renderCompanyForm = (
    companyType: "CurrentCompany" | "LastCompany" | "PreviousCompany",
    title: string,
    previousEndDate?: string,
    nextStartDate?: string
  ) => {
    const company = localCompanyData[companyType];
    const isRequired = isCurrentlyEmployed
      ? true
      : companyType !== "PreviousCompany";
    const showEndDate = companyType !== "CurrentCompany";

    let roleOptions;
    switch (companyType) {
      case "CurrentCompany":
        roleOptions = currentCompanyRoles;
        break;
      case "LastCompany":
        roleOptions = lastCompanyRoles;
        break;
      case "PreviousCompany":
        roleOptions = previousCompanyRoles;
        break;
    }

    return (
      <View>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={[styles.underline, { width: title.length * 8 }]} />
        </View>

        <FormField
          title="Company Name"
          value={company.CompanyName}
          handleChangeText={(companyName: string) => {
            updateCompanyField(companyType, "CompanyName", companyName);
            validateField("CompanyName", companyName, companyType);
          }}
          placeholder="Company Name"
          otherStyle="mt-7"
          keyBoardType="default"
          error={errors[`${companyType}-CompanyName`]}
          required={isRequired}
        />

        <Dropdown
          label="Industry"
          data={[...IndustryChoicesOptions, { key: "other", value: "Other" }]}
          placeholder="Select Industry"
          onSelect={(value) => {
            updateCompanyField(companyType, "CurrentIndustry", value);
          }}
          value={company.CurrentIndustry}
          required={isRequired}
          search={true}
        />

        {company.CurrentIndustry === "Other" && (
          <FormField
            title="Other Industry"
            value={company.otherIndustry || ""}
            handleChangeText={(industry: string) => {
              updateCompanyField(companyType, "otherIndustry", industry);
            }}
            placeholder="Specify your Industry"
            otherStyle="mt-7"
            keyBoardType="default"
            error={errors[`${companyType}-otherIndustry`]}
            required={isRequired}
          />
        )}

        {company.CurrentIndustry && company.CurrentIndustry !== "Other" ? (
          <Dropdown
            label="Role/Profile"
            data={roleOptions}
            placeholder="Select Role"
            onSelect={(value) => {
              updateCompanyField(companyType, "Role", value);
            }}
            value={company.Role}
            required={isRequired}
            search={true}
          />
        ) : (
          <FormField
            title="Role/Profile"
            value={company.Role}
            handleChangeText={(role: string) => {
              updateCompanyField(companyType, "Role", role);
            }}
            placeholder="Enter Role"
            otherStyle="mt-7"
            keyBoardType="default"
            error={errors[`${companyType}-Role`]}
            required={isRequired}
          />
        )}

        <DateRangeInput
          startDate={company.StartDate}
          endDate={showEndDate ? company.EndDate : undefined}
          onStartDateChange={(date) =>
            updateCompanyField(companyType, "StartDate", date)
          }
          onEndDateChange={
            showEndDate
              ? (date) => updateCompanyField(companyType, "EndDate", date)
              : undefined
          }
          startDateError={errors[`${companyType}-StartDate`]}
          endDateError={
            showEndDate ? errors[`${companyType}-EndDate`] : undefined
          }
          validateDate={(field, value) =>
            validateField(field, value, companyType)
          }
          previousEndDate={previousEndDate}
          nextStartDate={nextStartDate}
          required={isRequired}
          showEndDate={showEndDate}
        />
      </View>
    );
  };
  const validateForm = (): boolean => {
    let isValid = true;
    let newErrors: { [key: string]: string } = {};

    // Validate total experience
    if (
      !localExperience.TotalExperienceYears ||
      !localExperience.TotalExperienceMonths
    ) {
      newErrors["totalExperience"] = "Total experience is required";
      isValid = false;
    }

    // Validate current or last company based on employment status
    const companyToValidate = isCurrentlyEmployed
      ? "CurrentCompany"
      : "LastCompany";
    const company = localCompanyData[companyToValidate];
    function containsOnlyDigits(str: string) {
      return /^\d+$/.test(str);
    }
    if (!containsOnlyDigits(localExperience.lastSalary)) {
      newErrors["CurrentCompany-LastSalary"] = "Last Salary should be a number";
      isValid = false;
    }
    if (!localExperience.lastSalary) {
      newErrors["CurrentCompany-LastSalary"] = "Last Salary is required";
      isValid = false;
    }
    if (!company.CompanyName) {
      newErrors[`${companyToValidate}-CompanyName`] =
        "Company name is required";
      isValid = false;
    }

    if (!company.CurrentIndustry) {
      newErrors[`${companyToValidate}-CurrentIndustry`] =
        "Industry is required";
      isValid = false;
    }

    if (!company.Role) {
      newErrors[`${companyToValidate}-Role`] = "Role is required";
      isValid = false;
    }

    if (!company.StartDate) {
      newErrors[`${companyToValidate}-StartDate`] = "Start date is required";
      isValid = false;
    }

    if (!isCurrentlyEmployed && !company.EndDate) {
      newErrors[`${companyToValidate}-EndDate`] = "End date is required";
      isValid = false;
    }

    // Update errors state
    setErrors(newErrors);

    return isValid;
  };
  //fetching the experience form UAN number
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setIsFetching(true);
      const experiencesData = await getExperiences();
      console.log("Fetched experiences:", experiencesData);

      // Update the component state with the fetched data
      if (experiencesData.pastExperiences.length > 0) {
        const latestExperience = experiencesData.pastExperiences[0];
        setLocalCompanyData((prevData) => ({
          ...prevData,
          CurrentCompany: {
            LastSalary: "", // You might want to add this field to your API response
            CompanyName: latestExperience.establishmentName,
            CurrentIndustry: "", // You might want to add this field to your API response
            CurrentlyEmployed: latestExperience.lastMonthYear === null,
            Role: "", // You might want to add this field to your API response
            StartDate: latestExperience.startMonthYear || "",
            EndDate: latestExperience.lastMonthYear || "",
          },
        }));

        if (experiencesData.pastExperiences.length > 1) {
          const previousExperience = experiencesData.pastExperiences[1];
          setLocalCompanyData((prevData) => ({
            ...prevData,
            LastCompany: {
              LastSalary: "",
              CompanyName: previousExperience.establishmentName,
              CurrentIndustry: "",
              CurrentlyEmployed: false,
              Role: "",
              StartDate: previousExperience.startMonthYear || "",
              EndDate: previousExperience.lastMonthYear || "",
            },
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching experiences:", error);
      Alert.alert(
        "Error",
        "Failed to fetch experience data. Please try again."
      );
    } finally {
      setIsFetching(false);
    }
  };
  if (isFetching) {
    return (
      <SafeAreaView className="h-full bg-white p-0">
        <View className="flex-1 justify-center items-center">
          <Text>Loading experience data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Submiting the form
  const handleSaveAndContinue = async () => {
    if (!validateForm()) {
      Alert.alert(
        "Please check entries and try again ",
        "Please check the highlighted entries and correct any errors to proceed."
      );
      return;
    }

    setIsLoading(true);
    try {
      console.log("Local Experience:", localCompanyData);
      const experienceData: ExperienceData = {
        pastExperiences: [],
        isCurrentlyWorking: isCurrentlyEmployed,
        salaryDrawn: parseInt(localExperience.lastSalary) || 0,
        totalExperience: `${localExperience.TotalExperienceYears} Years- ${localExperience.TotalExperienceMonths} Months`,
        currentExperience: {
          startMonthYear: localCompanyData.CurrentCompany.StartDate,
          establishmentName: localCompanyData.CurrentCompany.CompanyName,
          address: {
            city: "",
            state: "",
          },
          currentIndrustry:
            localCompanyData.CurrentCompany.CurrentIndustry !== "Other"
              ? localCompanyData.CurrentCompany.CurrentIndustry
              : localCompanyData.CurrentCompany.otherIndustry || "",
          Role: localCompanyData.CurrentCompany.Role,
        },
      };

      if (!isCurrentlyEmployed) {
        experienceData.pastExperiences.push({
          startMonthYear: localCompanyData.LastCompany.StartDate,
          lastMonthYear: localCompanyData.LastCompany.EndDate,
          establishmentName: localCompanyData.LastCompany.CompanyName,
          currentIndrustry:
            localCompanyData.LastCompany.CurrentIndustry !== "Other"
              ? localCompanyData.LastCompany.CurrentIndustry
              : localCompanyData.LastCompany.otherIndustry || "",
          Role: localCompanyData.LastCompany.Role,
          exitReason: "",
        });
      }

      experienceData.pastExperiences.push({
        startMonthYear: localCompanyData.PreviousCompany.StartDate,
        lastMonthYear: localCompanyData.PreviousCompany.EndDate,
        establishmentName: localCompanyData.PreviousCompany.CompanyName,
        currentIndrustry:
          localCompanyData.PreviousCompany.CurrentIndustry !== "Other"
            ? localCompanyData.PreviousCompany.CurrentIndustry
            : localCompanyData.PreviousCompany.otherIndustry || "",
        Role: localCompanyData.PreviousCompany.Role,
        exitReason: "",
      });
      console.log("Experience data to update:", experienceData);
      const response = await updateExperience(experienceData);
      console.log("Experience updated successfully:", response);
      router.push({
        pathname: "/Preferences",
        params: { totalScreens: totalScreens },
      });
      // Handle successful update (e.g., show a success message, navigate to next screen)
    } catch (error) {
      console.error("Error updating experience:", error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="h-full bg-white p-0">
      <View className="w-full flex-row items-center justify-center mt-0 mb-3">
        <Text className="text-xl text-center font-plight text-black">
          Step{" "}
        </Text>
        <Text className="text-2xl text-center font-pbold text-black">3</Text>
        <Text className="text-xl text-center font-plight text-black">
          {" "}
          of {totalScreens || "5"}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <FormWrapper title="Work Experience">
          <View style={styles.totalExperienceContainer}>
            <Text style={styles.totalExperienceText}>Total Experience</Text>
            <View style={styles.experienceContainer}>
              <View style={styles.dropdownWrapper}>
                <Dropdown
                  label="Years"
                  data={yearOptions}
                  placeholder="Years"
                  onSelect={(value) => {
                    setLocalExperience((prev) => ({
                      ...prev,
                      TotalExperienceYears: value,
                    }));
                    UpdateFields({ TotalExperienceYears: value });
                    setTouched((prev) => ({
                      ...prev,
                      TotalExperienceYears: true,
                    }));
                  }}
                  value={localExperience.TotalExperienceYears}
                  required={true}
                  search={false}
                />
              </View>

              <View style={styles.separator} />
              <View style={styles.dropdownWrapper}>
                <Dropdown
                  label="Months"
                  data={monthOptions}
                  placeholder="Months"
                  onSelect={(value) => {
                    setLocalExperience((prev) => ({
                      ...prev,
                      TotalExperienceMonths: value,
                    }));
                    UpdateFields({ TotalExperienceMonths: value });
                    setTouched((prev) => ({
                      ...prev,
                      TotalExperienceMonths: true,
                    }));
                  }}
                  value={localExperience.TotalExperienceMonths}
                  required={true}
                  search={false}
                />
              </View>
            </View>
          </View>
          {errors.totalExperience && (
            <Text className="text-red-500 text-sm mt-1">
              {errors.totalExperience}
            </Text>
          )}

          <View style={styles.checkboxContainer}>
            <Checkbox
              value={isCurrentlyEmployed}
              onValueChange={(newValue: boolean) => {
                setIsCurrentlyEmployed(newValue);
                updateCompanyField(
                  "CurrentCompany",
                  "CurrentlyEmployed",
                  newValue
                );
                setLocalCompanyData((prevData) => ({
                  ...prevData,
                  CurrentCompany: defaultCompanyData,
                  PreviousCompany: defaultCompanyData,
                  LastCompany: defaultCompanyData,
                }));
              }}
              color={isCurrentlyEmployed ? "#4630EB" : undefined}
            />
            <Text style={styles.checkboxLabel}>Currently Employed</Text>
          </View>
          <FormField
            title="Last Salary Drawn (per month)"
            value={localExperience.lastSalary}
            handleChangeText={(salary: string) => {
              setLocalExperience((prev) => ({
                ...prev,
                lastSalary: salary,
              }));
              validateField("LastSalary", salary, "CurrentCompany");
            }}
            placeholder="Enter Last Salary"
            otherStyle="mt-7"
            keyBoardType="numeric"
            error={errors["CurrentCompany-LastSalary"]}
            required={true}
          />

          {isCurrentlyEmployed ? (
            <>
              {renderCompanyForm(
                "CurrentCompany",
                "Current Experience",
                localCompanyData.LastCompany.EndDate
              )}
              {renderCompanyForm(
                "PreviousCompany",
                "Previous Experience",
                undefined,
                localCompanyData.CurrentCompany.StartDate
              )}
            </>
          ) : (
            <>
              {renderCompanyForm(
                "LastCompany",
                "Last Experience",
                localCompanyData.PreviousCompany.EndDate
              )}
              {renderCompanyForm(
                "PreviousCompany",
                "Previous Experience",
                undefined,
                localCompanyData.LastCompany.StartDate
              )}
            </>
          )}

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Save & Continue"
              handlePress={handleSaveAndContinue}
              containerStyle="w-4/5"
              isLoading={isLoading}
            />
          </View>
        </FormWrapper>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  totalExperienceContainer: {
    marginBottom: 15,
  },
  totalExperienceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    marginBottom: 0,
  },
  experienceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 0,
  },
  dropdownWrapper: {
    flex: 1,
  },
  separator: {
    width: 16,
  },
  sectionTitleContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  underline: {
    height: 1,
    backgroundColor: "black",
    marginTop: 5,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "black",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
});

export default ExperienceInfo;
