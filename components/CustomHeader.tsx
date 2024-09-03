import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import HamburgerMenu from "./HamburgerMenu";
import { images } from "@/constants/profileData";
import { useAuth } from "@/app/contexts/AuthContext";

const CustomHeader = () => {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState<boolean>(false);
  const router = useRouter();

  const toggleMenu = (): void => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigateToSearch = (): void => {
    console.log("Search button clicked!");
  };

  return (
    <>
      <SafeAreaView edges={["top"]} className="bg-primary">
        <View className="flex-row justify-between items-center px-4 py-2">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={toggleMenu}>
              <Ionicons name="menu" size={28} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-white text-xl font-semibold">FactoryKaam</Text>
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-4">
              <Image
                // source={user?.profile_picture ? { uri: user.profile_picture } : images.profilePicture}
                source={images.logo}
                className="w-8 h-8 rounded-full"
              />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={navigateToSearch} className="mr-4">
              <Ionicons name="search" size={28} color="white" />
            </TouchableOpacity> */}
            {/* <TouchableOpacity>
              <Ionicons name="person-circle-outline" size={28} color="white" />
            </TouchableOpacity> */}
          </View>
        </View>
      </SafeAreaView>
      <HamburgerMenu isOpen={isMenuOpen} onClose={toggleMenu} />
    </>
  );
};

export default CustomHeader;
