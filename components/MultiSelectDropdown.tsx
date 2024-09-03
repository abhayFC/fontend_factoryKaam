// MultiSelectDropdown.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { MultipleSelectList } from "react-native-dropdown-select-list";

type dataProps = {
  key: string;
  value: string;
  disabled?: boolean;
};

interface MultiSelectDropdownProps {
  label: string;
  data: dataProps[];
  placeholder: string;
  onSelect: (value: string[]) => void;
  value: string[];
  search?: boolean;
  required?: boolean;
  maxSelections?: number;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  data,
  placeholder,
  onSelect,
  value,
  search = false,
  required = false,
  maxSelections = 3,
}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [internalValue, setInternalValue] = useState<string[]>(value);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const updatedData = data.map((item) => ({
      ...item,
      disabled:
        internalValue.length >= maxSelections &&
        !internalValue.includes(item.value),
    }));
    setFilteredData(updatedData);
  }, [internalValue, data, maxSelections]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      // Filter out any values that are no longer in the data options
      const validValues = value.filter((v) => data.some((d) => d.value === v));
      setInternalValue(validValues);
    }
  }, [value, data]);

  const handleSelect = (selected: string[]) => {
    if (selected.length <= maxSelections) {
      setInternalValue(selected);
      onSelect(selected);
    } else {
      const newSelected = selected.slice(0, maxSelections);
      setInternalValue(newSelected);
      onSelect(newSelected);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>
      <MultipleSelectList
        setSelected={handleSelect}
        data={filteredData}
        save="value"
        onSelect={() => null}
        placeholder={placeholder}
        search={search}
        label="Select items"
        badgeStyles={styles.badge}
        boxStyles={styles.box}
        inputStyles={styles.input}
        dropdownStyles={styles.dropdown}
        dropdownItemStyles={styles.dropdownItem}
        dropdownTextStyles={styles.dropdownText}
        checkBoxStyles={styles.checkbox}
        disabledItemStyles={styles.disabledItem}
        labelStyles={styles.hiddenLabel}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
  required: {
    color: "red",
    marginLeft: 4,
  },
  badge: {
    backgroundColor: "#72bdb8",
    paddingVertical: 2,
    paddingHorizontal: 6,
    margin: 2,
    borderRadius: 10,
  } as ViewStyle,
  box: {
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "#72bdb8",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 64,
    alignItems: "center",
  } as ViewStyle,
  input: {
    fontWeight: "600",
    fontSize: 16,
  } as TextStyle,
  dropdown: {
    backgroundColor: "white",
    borderColor: "#72bdb8",
    borderWidth: 2,
    marginTop: 4,
  } as ViewStyle,
  dropdownItem: {
    paddingVertical: 8,
  } as ViewStyle,
  dropdownText: {
    color: "black",
    fontSize: 14,
  } as TextStyle,
  checkbox: {
    backgroundColor: "transparent",
    borderColor: "#298A84",
  } as ViewStyle,
  disabledItem: {
    opacity: 0.5,
  } as ViewStyle,
  hiddenLabel: {
    display: "none",
  } as TextStyle,
});

export default MultiSelectDropdown;
