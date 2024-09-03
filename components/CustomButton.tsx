import { View, Text } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'

interface CustomButtonProps {
  title: string;
  handlePress: () => void;
  textStyle?: string | string[];
  isLoading?: boolean;
  containerStyle?: string | string[];
}

const CustomButton = ({title, handlePress, textStyle, isLoading, containerStyle}: CustomButtonProps) => {
  return (
    <TouchableOpacity 
    className={`items-center justify-center bg-secondary-100 rounded-full min-h-[62px] ${containerStyle} ${isLoading ? 'opacity-50' : ''}`} 
    disabled={isLoading}
    onPress={handlePress}
    activeOpacity={0.7}>
        <Text className={`text-black text-lg font-psemibold ${textStyle}`}>
            {title}
        </Text>
    </TouchableOpacity>
      
  )
}

export default CustomButton