import { Text, View, Image, ScrollView } from "react-native";
import { Link, Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import CarouselComponent from "@/components/Carousel";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { isLoading, user } = useAuth();
  if (user) return <Redirect href="/home" />;
  return (
    <SafeAreaView>
      <ScrollView style={{ backgroundColor: "#FFFFFF" }}>
        <CarouselComponent />
        <View className="w-full items-center justify-center min-h-[45vh] px-3">
          <View className="relative items-center mt-5">
            <Text className="text-2xl text-center font-pbold text-black">
              Welcome To{" "}
              <Text className="text-primary text-centre">factorykaam </Text>
            </Text>
          </View>
          <View className="w-full mt-5">

          </View>
          <CustomButton
            title="Job Seeker"
            handlePress={() => router.push({
              pathname: "/SignIn",
              params: { userType: "job_seeker" }
            })}
            containerStyle={"w-full mt-5"}
          />
          <CustomButton
            title="Employer"
            handlePress={() => router.push({
              pathname: "/SignIn",
              params: { userType: "employer" }
            })}
            containerStyle={"w-full mt-5"}
          />
          <View className="w-full mt-5">
            <Text className="text-center text-sm text-black font-pregular">
              By Signing up, you agree to our terms of use and Privacy Policy <Link href="https://factorykaam.com/privacy-policy/"><Text className="text-[#61b3ed] underline">Read More</Text></Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default App;
