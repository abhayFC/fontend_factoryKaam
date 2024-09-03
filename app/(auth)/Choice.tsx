import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const ExperienceSelectionScreen: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelection = (option: string) => {
    setSelectedOption(option);
    
    // Navigate to the next screen based on the selection
    if (option === 'experienced') {
      router.push({
        pathname: '/PersonalInfo',
        params: { experienceType: 'experienced',totalScreens: "5" }
      });
    } else {
      router.push({
        pathname: '/PersonalInfo',
        params: { experienceType: 'fresher',totalScreens: "4" }
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 gap-6 items-center p-5 bg-white">
      <Text className="text-2xl font-bold mb-10">Choose one</Text>
      
      <TouchableOpacity
        className={`w-full p-5 rounded-lg border-2 mb-5 items-center 
          ${selectedOption === 'experienced' 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-secondary-100'}`}
        onPress={() => handleSelection('experienced')}
      >
        <Text className="text-lg font-bold mb-1">I'm Experienced</Text>
        <Text className="text-sm text-gray-600">I have Industrial work experience</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        className={`w-full p-5 rounded-lg border-2 mb-5 items-center drop-shadow-2xl shadow-2xl shadow-gray-300
          ${selectedOption === 'fresher' 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-secondary-100'}`}
        onPress={() => handleSelection('fresher')}
      >
        <Text className="text-lg font-bold mb-1">I'm a Fresher</Text>
        <Text className="text-sm text-gray-600">Looking for first Job</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ExperienceSelectionScreen;