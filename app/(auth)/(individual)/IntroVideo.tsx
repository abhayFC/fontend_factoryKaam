import React, { useState } from "react";
import { ResizeMode, Video, Audio, AVPlaybackStatus } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import { View, Text, Alert, Image, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FormWrapper } from '@/components/FormWraper';
import CustomButton from '@/components/CustomButton';
import * as FileSystem from 'expo-file-system';
import { icons } from "@/constants";
import { useAuth } from '@/app/contexts/AuthContext';
import { router, useLocalSearchParams } from 'expo-router';

type MediaFile = {
  uri: string;
  type: string;
  name: string;
  fileInfo: FileSystem.FileInfo;
}

const IntroVideo: React.FC = () => {
  const [introVideo, setIntroVideo] = useState<MediaFile | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<MediaFile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateUserProfile } = useAuth();
  const params = useLocalSearchParams();
  const totalSteps = params.totalSteps as string;

  const handleMediaSelection = async (result: ImagePicker.ImagePickerResult, mediaType: 'IntroVideo' | 'ProfilePhoto') => {
    if (!result.canceled && result.assets.length > 0) {
      const asset = result.assets[0];
      const fileInfo = await FileSystem.getInfoAsync(asset.uri);
      const fileName = asset.uri.split('/').pop() || `${mediaType}_${Date.now()}.${asset.uri.split('.').pop()}`;
      
      if (mediaType === 'IntroVideo') {
        // Check video duration
        try {
          const { sound } = await Audio.Sound.createAsync(
            { uri: asset.uri },
            { shouldPlay: false }
          );
          const status = await sound.getStatusAsync() as AVPlaybackStatus;
          await sound.unloadAsync();
  
          if ('durationMillis' in status && status.durationMillis && (status.durationMillis < 30000 || status.durationMillis > 45000)) {
            Alert.alert("Invalid video length", "Please select a video that is between 30 and 45 seconds long.");
            return;
          }
        } catch (error) {
          console.error("Error checking video duration:", error);
          Alert.alert("Error", "Unable to process the selected video. Please try another.");
          return;
        }
      }
      
      // Check file size (50MB = 50 * 1024 * 1024 bytes)
      if (fileInfo.exists && fileInfo.size && fileInfo.size > 50 * 1024 * 1024) {
        Alert.alert("File too large", "Please select a file that is smaller than 50MB.");
        return;
      }

      const newMediaFile: MediaFile = {
        uri: asset.uri,
        type: asset.type || (mediaType === 'IntroVideo' ? 'video/mp4' : 'image/jpeg'),
        name: fileName,
        fileInfo: fileInfo
      };

      if (mediaType === 'IntroVideo') {
        setIntroVideo(newMediaFile);
      } else {
        setProfilePhoto(newMediaFile);
      }
    }
  };

  const openPicker = async (type: "video" | "image") => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === "video" ? ImagePicker.MediaTypeOptions.Videos : ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    handleMediaSelection(result, type === "video" ? "IntroVideo" : "ProfilePhoto");
  };

  const openCamera = async (type: "video" | "image") => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Sorry, we need camera permissions to make this work!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: type === "video" ? ImagePicker.MediaTypeOptions.Videos : ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    handleMediaSelection(result, type === "video" ? "IntroVideo" : "ProfilePhoto");
  };

  const showOptions = (type: "video" | "image") => {
    Alert.alert(
      "Choose an option",
      "Would you like to take a new photo/video or choose from your gallery?",
      [
        {
          text: "Camera",
          onPress: () => openCamera(type),
        },
        {
          text: "Gallery",
          onPress: () => openPicker(type),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!profilePhoto) {
      Alert.alert("Error", "Please upload a profile photo.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      const photoFile = {
        uri: profilePhoto.uri,
        type: 'image/jpeg',
        name: profilePhoto.name
      };
      formData.append('profile_picture', photoFile as any);
    //   if (companyLogo) {
    //     const photoFile = {
    //         uri: companyLogo.uri,
    //         type: 'image/jpeg',
    //         name: companyLogo.name
    //     };
    //     formData.append('profile_picture', photoFile as any);
    // }
      if (introVideo) {
        const videoFile = {
          uri: introVideo.uri,
          type: 'video/mp4',
          name: introVideo.name
        };
        formData.append('profile_video',videoFile as any);
      }
      console.log("formData", formData);
      await updateUserProfile(formData);
      Alert.alert("Success", "Profile updated successfully!");
      router.push("/home"); // Navigate to home or next page
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white pb-6">
      <View className="w-full flex-row items-center justify-center mt-0 mb-3">
                <Text className="text-xl text-center font-plight text-black">Step  </Text>
                <Text className="text-2xl text-center font-pbold text-black">{totalSteps || '5'}</Text>
                <Text className="text-xl text-center font-plight text-black"> of {totalSteps || '5'} </Text>
            </View>
      <ScrollView className="flex-1 px-4 pb-4">
        <FormWrapper title="Profile Picture & Resume Video">

           <View className="mt-7 space-y-2">
            <Text className="text-base text-center text-gray-700 font-pbold">
              Profile Image
            </Text>

            <TouchableOpacity onPress={() => showOptions("image")}>
              {profilePhoto ? (
                <Image
                  source={{ uri: profilePhoto.uri }}
                  resizeMode="cover"
                  className="w-full h-64 rounded-2xl"
                />
              ) : (
                <View className="w-full h-16 px-4 bg-[#e1daeb] rounded-2xl border-2 border-[#4477CE] border-dashed flex justify-center items-center flex-row space-x-2">
              
              <Text className="text-sm  text-gray-600 font-pmedium">
                Tap to upload a profile picture
              </Text>
              <Image
                source={icons.upload}
                resizeMode="contain"
                alt="upload"
                className="w-5 h-5"
              />
            </View>
              )}
            </TouchableOpacity>
          </View>
          <View className="mt-7 space-y-2">
          <Text className="text-base text-center text-gray-700 font-pbold">
            Introductory Video
            </Text>
            <Text className="text-base text-center text-gray-700 font-medium">
              Upload a Short Video Introduction about yourself (30-45 seconds)
            </Text>

            <TouchableOpacity onPress={() => showOptions("video")}>
              {introVideo ? (
                <View className="relative">
                <TouchableOpacity 
                    className='absolute right-2 top-2 bg-black z-10 w-5 h-5 flex justify-center items-center rounded-lg' 
                    onPress={() => { setIntroVideo(null) }}
                >
                    <Text className='text-white'>X</Text>
                </TouchableOpacity>
                <Video
                  source={{ uri: introVideo.uri }}
                  className="w-full h-64 rounded-2xl"
                  useNativeControls
                  resizeMode={ResizeMode.COVER}
                  isLooping
                />
                </View>
              ) : (
                <View className="w-full h-40 px-4 bg-[#e1daeb] rounded-2xl border border-[#4477CE] border-dashed flex justify-center items-center">
                  <Text className="text-sm text-gray-600 font-pmedium">
                    Tap to upload a video introduction</Text>
              <View className="w-14 h-14 flex justify-center items-center">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-1/2 h-1/2"
                />
              </View>
            </View>

              )}
            </TouchableOpacity>
          </View>

         

          <View className="w-full justify-center items-center my-10">
            <CustomButton
              title="Start Exploring Jobs"
              handlePress={handleSubmit}
              isLoading={isSubmitting}
              containerStyle="w-4/5"
            />
          </View>
        </FormWrapper>
      </ScrollView>
    </SafeAreaView>
  );
};

export default IntroVideo;