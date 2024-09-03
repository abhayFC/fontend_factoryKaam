

import React, { ReactNode } from "react";
import { View, Text } from "react-native";


type FormWrapperProps = {
  title: string;
  children: ReactNode;
};

export function FormWrapper({ title, children }: FormWrapperProps) {
  return (
    <View className="w-full justify-center px-4 ">
      <Text className="text-center mb-6 text-2xl font-semibold">{title}</Text>
      <View  className="w-full">
        {children}
      </View>
    </View>
  );
}