import React from "react";
import { View } from "react-native";
import FormField from "@/components/FormField";

type QualificationData = {
  InstituteName: string;
  Specialization: string;
  PassingYear: string;
};

type QualificationInfoProps = QualificationData & {
  UpdateFields: (fields: Partial<QualificationData>) => void;
  errors: Partial<QualificationData>;
  qualificationType: string; // Add this new prop
};

const QualificationInfo: React.FC<QualificationInfoProps> = ({
  InstituteName,
  Specialization,
  PassingYear,
  UpdateFields,
  errors,
  qualificationType, // Add this new prop
}) => {
  const getLabel = (baseLabel: string) => {
    return qualificationType ? `${qualificationType} ${baseLabel}` : baseLabel;
  };

  return (
    <View>
      <FormField
        title={getLabel("Institute Name")}
        value={InstituteName}
        handleChangeText={(value: string) =>
          UpdateFields({ InstituteName: value })
        }
        placeholder={`Enter Name`}
        otherStyle="mt-7"
        keyBoardType={""}
        error={errors.InstituteName}
        required={true}
      />
      <FormField
        title={getLabel("Specialization")}
        value={Specialization}
        handleChangeText={(value: string) =>
          UpdateFields({ Specialization: value })
        }
        placeholder={`Enter Specialization`}
        otherStyle="mt-7"
        keyBoardType={""}
        error={errors.Specialization}
        required={true}
      />
      <FormField
        title={getLabel("Passing Year")}
        value={PassingYear}
        handleChangeText={(value: string) =>
          UpdateFields({ PassingYear: value })
        }
        placeholder="YYYY (eg. 2015)"
        otherStyle="mt-7"
        keyBoardType="numeric"
        error={errors.PassingYear}
        required={true}
      />
    </View>
  );
};

export default QualificationInfo;
