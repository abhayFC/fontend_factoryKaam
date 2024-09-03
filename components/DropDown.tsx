import React from 'react';
import { View, Text } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
type dataProps = {
  key: string;
  value: string;
}
interface DropdownProps {
  label: string;
  data:dataProps [];
  placeholder: string;
  onSelect: (value: string) => void;
  value: string;
  search?: boolean;
  required?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  data,
  placeholder,
  onSelect,
  value,
  search = false,
  required = false,
}) => {
  return (
    <View className='mt-4'>
      <View className="flex-row items-center">
        <Text className="text-base text-black font-pmedium mt-3">{label}</Text>
        {required && <Text className="text-red-500 ml-1">*</Text>}
      </View>
      <SelectList
        data={data}
        save="value"
        placeholder={placeholder}
        setSelected={onSelect}
        search={search}
        defaultOption={{ key: value, value: value }}
        boxStyles={{
          backgroundColor: 'white',
          borderWidth: 2,
          borderColor: '#72bdb8',
          height: 64,
          borderRadius: 16,
          paddingHorizontal: 16,
          display: 'flex',
          alignItems: 'center',
        }}
        inputStyles={{
          fontWeight: '600',
          fontSize: 16,
        }}
      />
    </View>
  );
};

export default Dropdown;