import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const SearchHeader = () => {
  const [searchText, setSearchText] = useState<string>("");
  const searchWidth = useState(
    new Animated.Value(Dimensions.get("window").width - 100)
  )[0];
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView edges={["top"]} className="bg-primary">
      <View className="flex-row items-center px-4 py-2">
        <TouchableOpacity onPress={handleBack} className="mr-2">
          <Ionicons name="chevron-back-outline" size={28} color="white" />
        </TouchableOpacity>

        <TouchableOpacity className="ml-2">
          <Ionicons name="search" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SearchHeader;
