import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import FormField from '@/components/FormField';

interface SalaryInputProps {
  onSalaryChange: (min: string, max: string) => void;
  error?: string;
  initialMinSalary?: string;
  initialMaxSalary?: string;
}

const SalaryInput: React.FC<SalaryInputProps> = ({ onSalaryChange, error, initialMinSalary = '', initialMaxSalary = '' }) => {
  const [minSalary, setMinSalary] = useState(initialMinSalary);
  const [maxSalary, setMaxSalary] = useState(initialMaxSalary);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    validateSalary();
  }, [minSalary, maxSalary]);

  const validateSalary = () => {
    if (minSalary && maxSalary) {
      const min = parseInt(minSalary);
      const max = parseInt(maxSalary);
      if (min >= max) {
        setLocalError('Maximum salary should be greater than minimum salary');
      } else {
        setLocalError('');
      }
    } else {
      setLocalError('');
    }
  };

  const handleMinSalaryChange = (value: string) => {
    setMinSalary(value);
    onSalaryChange(value, maxSalary);
  };

  const handleMaxSalaryChange = (value: string) => {
    setMaxSalary(value);
    onSalaryChange(minSalary, value);
  };

  return (
    <View className='mt-5'>
      <Text className="text-base text-black font-pmedium mb-1">Enter salary (per month in INR)</Text>
      <View className="flex-row justify-between">
        <FormField
          title="Minimum"
          value={minSalary}
          handleChangeText={handleMinSalaryChange}
          placeholder="Min salary"
          otherStyle="w-[48%]"
          keyBoardType="numeric"
          error={error && !minSalary ? 'Required' : ''}
          required={true}
        />
        <FormField
          title="Maximum"
          value={maxSalary}
          handleChangeText={handleMaxSalaryChange}
          placeholder="Max salary"
          otherStyle="w-[48%]"
          keyBoardType="numeric"
          error={error && !maxSalary ? 'Required' : ''}
          required={true}
        />
      </View>
      {(localError || error) && (
        <Text className="text-red-500 text-sm mt-1">{localError || error}</Text>
      )}
    </View>
  );
};

export default SalaryInput;