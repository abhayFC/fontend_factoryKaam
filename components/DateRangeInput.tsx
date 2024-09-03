import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import FormField from "@/components/FormField";

type DateRangeInputProps = {
  startDate: string;
  endDate?: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange?: (date: string) => void;
  startDateError?: string;
  endDateError?: string;
  validateDate: (field: string, value: string) => void;
  showEndDate?: boolean;
  previousEndDate?: string;
  nextStartDate?: string;
  required?: boolean;
};

const DateRangeInput: React.FC<DateRangeInputProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  startDateError,
  endDateError,
  validateDate,
  showEndDate = true,
  previousEndDate,
  nextStartDate,
  required = true,
}) => {
  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localEndDate, setLocalEndDate] = useState(endDate || "");

  const parseDate = (dateString: string): Date | null => {
    const [month, year] = dateString.split("/").map(Number);
    if (isNaN(month) || isNaN(year)) return null;
    return new Date(year, month - 1);
  };

  const validateDateInput = (
    value: string,
    isStartDate: boolean
  ): string | undefined => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const [month, year] = value.split("/").map(Number);

    if (isNaN(month) || isNaN(year)) {
      return "Invalid date format. Use MM/YYYY";
    }

    if (month < 1 || month > 12) {
      return "Month should be between 01 and 12";
    }

    if (year < 1900) {
      return "Invalid Year";
    }

    if (year > currentYear || (year === currentYear && month > currentMonth)) {
      return "Date should not exceed current month and year";
    }

    if (!isStartDate && showEndDate) {
      const startDateObj = parseDate(localStartDate);
      const endDateObj = parseDate(value);
      if (startDateObj && endDateObj && endDateObj <= startDateObj) {
        return "End date should be after start date";
      }
    }

    if (isStartDate && previousEndDate) {
      const prevEndDateObj = parseDate(previousEndDate);
      const startDateObj = parseDate(value);
      if (prevEndDateObj && startDateObj && startDateObj <= prevEndDateObj) {
        return "Start date should be after previous end date";
      }
    }

    if (!isStartDate && nextStartDate) {
      const endDateObj = parseDate(value);
      const nextStartDateObj = parseDate(nextStartDate);
      if (endDateObj && nextStartDateObj && endDateObj >= nextStartDateObj) {
        return "End date should be before next section's start date";
      }
    }

    return undefined;
  };

  const handleDateChange = (
    text: string,
    setLocalDate: React.Dispatch<React.SetStateAction<string>>,
    onDateChange: (date: string) => void,
    field: string,
    isStartDate: boolean
  ) => {
    setLocalDate(text);
    onDateChange(text);

    const error = validateDateInput(text, isStartDate);

    if (error) {
      validateDate(field, `${text} (${error})`);
    } else {
      validateDate(field, text);
    }
  };

  const renderDateInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    error: string | undefined,
    localValue: string,
    setLocalValue: React.Dispatch<React.SetStateAction<string>>,
    isStartDate: boolean
  ) => (
    <FormField
      title={label}
      value={value}
      handleChangeText={(text: string) => {
        handleDateChange(
          text,
          setLocalValue,
          onChangeText,
          label.replace(" ", ""),
          isStartDate
        );
      }}
      placeholder="MM/YYYY"
      otherStyle={showEndDate ? "flex-1" : "flex-1 w-full"}
      keyBoardType="numeric"
      error={error}
      required={required}
    />
  );

  return (
    <View
      style={[styles.dateContainer, !showEndDate && styles.singleDateContainer]}
    >
      {renderDateInput(
        "Start Date",
        startDate,
        onStartDateChange,
        startDateError,
        localStartDate,
        setLocalStartDate,
        true
      )}
      {showEndDate && onEndDateChange && (
        <>
          <View style={styles.dateSeparator} />
          {renderDateInput(
            "End Date",
            endDate || "",
            onEndDateChange,
            endDateError,
            localEndDate,
            setLocalEndDate,
            false
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  singleDateContainer: {
    flexDirection: "column",
  },
  dateSeparator: {
    width: 16,
  },
});

export default DateRangeInput;
