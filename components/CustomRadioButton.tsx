import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CustomRadioProps {
  label: string;
  choices: string[];
  selectedValue: string | null;
  onValueChange: (value: string) => void;
  required?: boolean;
}

const CustomRadio: React.FC<CustomRadioProps> = ({ label, choices, selectedValue, onValueChange,required=false }) => {
  return (
    <View style={styles.container}>
      <View className="flex-row items-center">
      <Text className="text-base text-black font-pmedium my-3">{label}</Text>
      {required && <Text className="text-red-500 ml-1">*</Text>}
      </View>
      <View style={styles.radioGroup}>
        {choices.map((choice) => {
          const isSelected = selectedValue === choice;
          return (
            <TouchableOpacity
              key={choice}
              style={styles.radioButton}
              onPress={() => onValueChange(choice)}
            >
              <View style={[
                styles.radio,
                isSelected && styles.selectedRadio
              ]}>
                {isSelected && <View style={styles.selectedRadioInner} />}
              </View>
              <Text style={[
                styles.radioText,
                isSelected ? styles.selectedRadioText : styles.unselectedRadioText
              ]}>
                {choice}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    marginTop: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 10,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#72BDB8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadio: {
    borderColor: '#1E1E1E',
  },
  selectedRadioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#1E1E1E',
  },
  radioText: {
    marginLeft: 8,
  },
  unselectedRadioText: {
    color: '#72BDB8',
  },
  selectedRadioText: {
    color: '#1E1E1E',
  },
});

export default CustomRadio;