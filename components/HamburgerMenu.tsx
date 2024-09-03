import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { profileData, images } from "@/constants/profileData";
import { useAuth } from "@/app/contexts/AuthContext";

interface HamburgerMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const slideAnim = useRef(new Animated.Value(-300)).current;

  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get("window").height;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen, slideAnim]);

  if (!isOpen) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <TouchableWithoutFeedback onPress={onClose}>
      <View
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: screenHeight,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1000000,
          overflow: "hidden",
        }}
      >
        <TouchableWithoutFeedback>
          <Animated.View
            style={{
              transform: [{ translateX: slideAnim }],
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 300,
              backgroundColor: "white",
              height: "100%",
              paddingBottom: insets.bottom,
              zIndex: 1000001,
              overflow: "hidden",
            }}
          >
            <SafeAreaView style={{ flex: 1 }}>
              <View className="pt-0 px-2 drop-shadow-lg border-b-2 border-b-[#C1A3A3]">
                <View className="flex-row justify-centre items-center gap-3 mt-4">
                  <Image
                    // source={
                    //   user?.profile_picture
                    //     ? { uri: user.profile_picture }
                    //     : images.profilePicture
                    // }
                    source={images.logo}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      marginBottom: 10,
                    }}
                  />
                  <View>
                    <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                      FactoryKaam
                    </Text>
                  </View>
                </View>
              </View>
              <View style={{ flex: 1, padding: 20 }}>
                <TouchableOpacity
                  style={{ paddingVertical: 10 }}
                  onPress={() => {
                    onClose();
                    router.replace("/home");
                  }}
                >
                  <Text style={{ fontSize: 18 }}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ paddingVertical: 10 }}
                  onPress={() => {
                    onClose();
                    router.push("/home");
                  }}
                >
                  <Text style={{ fontSize: 18 }}>Community</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ paddingVertical: 10 }}
                  onPress={() => {
                    onClose();
                    router.push("/home");
                  }}
                >
                  <Text style={{ fontSize: 18 }}>Notification</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{
                  padding: 20,
                  borderTopWidth: 1,
                  borderTopColor: "#C1A3A3",
                }}
                onPress={handleLogout}
              >
                <Text style={{ fontSize: 18, color: "red" }}>Logout</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default HamburgerMenu;
