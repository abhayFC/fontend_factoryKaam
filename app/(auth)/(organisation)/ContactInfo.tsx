import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormWrapper } from '@/components/FormWraper';
import FormField from '@/components/FormField';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { icons } from '@/constants';
import CustomButton from '@/components/CustomButton';
import { useAuth } from '@/app/contexts/AuthContext';
import { router } from 'expo-router';

type MediaFile = {
  uri: string;
  type: string;
  name: string;
  fileInfo: FileSystem.FileInfo;
};

interface FormData {
    contactPersonName: string;
    contactPersonDesignation: string;
    contactPersonEmail: string;
    contactPersonPhone: string;
    companyDescription: string;
}

interface FormErrors {
    contactPersonName?: string;
    contactPersonDesignation?: string;
    contactPersonEmail?: string;
    contactPersonPhone?: string;
    companyDescription?: string;
    companyLogo?: string;
}

const ContactInfo = () => {
    const [form, setForm] = useState<FormData>({
        contactPersonName: '',
        contactPersonDesignation: '',
        contactPersonEmail: '',
        contactPersonPhone: '',
        companyDescription: '',
    });

    const [companyLogo, setCompanyLogo] = useState<MediaFile | null>(null);
    const [errors, setErrors] = useState<FormErrors>({});
    const {ContactInfoUpdate} = useAuth();
    const validateForm = (): boolean => {
        let newErrors: FormErrors = {};
        let isValid = true;

        // Contact Person Name validation
        if (!form.contactPersonName.trim()) {
            newErrors.contactPersonName = "Contact person's name is required";
            isValid = false;
        }

        // Contact Person Phone validation
        if (!form.contactPersonPhone.trim()) {
            newErrors.contactPersonPhone = "Phone number is required";
        } else if (!/^\d{10}$/.test(form.contactPersonPhone)) {
            newErrors.contactPersonPhone = "Please enter a valid 10-digit phone number";
            isValid = false;
        }

        // Contact Person Designation validation
        if (!form.contactPersonDesignation.trim()) {
            newErrors.contactPersonDesignation = "Designation is required";
            isValid = false;
        }

        // Contact Person Email validation
        if (form.contactPersonEmail.trim() && !/\S+@\S+\.\S+/.test(form.contactPersonEmail)) {
            newErrors.contactPersonEmail = "Please enter a valid email address";
            isValid = false;
        }

        // Company Description validation
        if (!form.companyDescription.trim()) {
            newErrors.companyDescription = "Company description is required";
            isValid = false;
        } else if (form.companyDescription.length < 20 && form.companyDescription.length > 200) {
            newErrors.companyDescription = "Company description should be between 20 to 200 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleMediaSelection = async (result: ImagePicker.ImagePickerResult) => {
        if (!result.canceled && result.assets.length > 0) {
            const asset = result.assets[0];
            const fileInfo = await FileSystem.getInfoAsync(asset.uri);
            const fileName = asset.uri.split("/").pop() || `company_logo_${Date.now()}.${asset.uri.split(".").pop()}`;

            // Check file size (20MB = 20 * 1024 * 1024 bytes)
            if (fileInfo.exists && fileInfo.size && fileInfo.size > 20 * 1024 * 1024) {
                Alert.alert("File too large", "Please select an image that is smaller than 20MB.");
                return;
            }

            setCompanyLogo({
                uri: asset.uri,
                type: asset.type || "image/jpeg",
                name: fileName,
                fileInfo: fileInfo,
            });
            setErrors(prev => ({ ...prev, companyLogo: undefined }));
        }
    };

    const openPicker = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Sorry, we need camera roll permissions to make this work!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        handleMediaSelection(result);
    };

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Sorry, we need camera permissions to make this work!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        handleMediaSelection(result);
    };

    const showOptions = () => {
        Alert.alert(
            "Choose an option",
            "Would you like to take a new photo or choose from your gallery?",
            [
                {
                    text: "Camera",
                    onPress: () => openCamera(),
                },
                {
                    text: "Gallery",
                    onPress: () => openPicker(),
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ]
        );
    };

    const customAPI = (form: FormData) => {
        // Implement your API call here
        console.log("API call with form data:", form);
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                formData.append(key, form[key as keyof FormData]);
            });

            if (companyLogo) {
                const photoFile = {
                    uri: companyLogo.uri,
                    type: 'image/jpeg',
                    name: companyLogo.name
                };
                formData.append('profile_picture', photoFile as any);
            }

            try {
                console.log('submitting form', formData);
                const response = await ContactInfoUpdate(formData);
                Alert.alert("Success", "Account Created successfully!");
                router.push({
                    pathname: '/home',
                });
            } catch (err) {
                console.log(err);
                Alert.alert("Error", "There was an error submitting the form. Please try again.");
            }
        } else {
            Alert.alert("Please check entries and try again ", "Please check the highlighted entries and correct any errors to proceed.");
        }
    };

    return (
        <SafeAreaView className="h-full bg-white p-0">
            <View className="w-full flex-row items-center justify-center mt-0 mb-3">
            <Text className="text-xl text-center font-plight text-black">Step </Text>
                <Text className="text-2xl text-center font-pbold text-black">2</Text>
                <Text className="text-xl text-center font-plight text-black"> of 2</Text>
            </View>
            <ScrollView className='flex h-full px-2'>
                <FormWrapper title="Contact Information">
                    <FormField
                        title="Contact Person's Name"
                        value={form.contactPersonName}
                        handleChangeText={(text) => setForm({ ...form, contactPersonName: text })}
                        keyBoardType="default"
                        placeholder="Enter Contact Person Name"
                        required={true}
                        error={errors.contactPersonName}
                    />
                    <FormField
                        title="Contact Person Phone Number"
                        value={form.contactPersonPhone}
                        handleChangeText={(text) => setForm({ ...form, contactPersonPhone: text })}
                        keyBoardType="phone-pad"
                        placeholder="Enter Contact Person Phone Number"
                        required={true}
                        error={errors.contactPersonPhone}
                    />
                    <FormField
                        title="Contact Person Designation"
                        value={form.contactPersonDesignation}
                        handleChangeText={(text) => setForm({ ...form, contactPersonDesignation: text })}
                        keyBoardType="default"
                        placeholder="Enter Contact Person Designation"
                        required={true}
                        error={errors.contactPersonDesignation}
                    />
                    <FormField
                        title="Contact Person Email"
                        value={form.contactPersonEmail}
                        handleChangeText={(text) => setForm({ ...form, contactPersonEmail: text })}
                        keyBoardType="email-address"
                        placeholder="Enter Contact Person Email"
                        error={errors.contactPersonEmail}
                    />
                    <FormField
                        title="Company Description"
                        value={form.companyDescription}
                        handleChangeText={(text) => setForm({ ...form, companyDescription: text })}
                        keyBoardType="default"
                        multiline={true}
                        placeholder="Enter Company Description"
                        required={true}
                        error={errors.companyDescription}
                    />

                    <View className="mt-5 space-y-2">
                        <Text className="text-base text-black font-pmedium">
                            Company Logo
                        </Text>

                        <TouchableOpacity onPress={showOptions}>
                            {companyLogo !== null ? (
                                <View className="relative">
                                    <TouchableOpacity 
                                        className='absolute right-2 top-2 bg-black z-10 w-5 h-5 flex justify-center items-center rounded-lg' 
                                        onPress={() => { setCompanyLogo(null) }}
                                    >
                                        <Text className='text-white'>X</Text>
                                    </TouchableOpacity>
                                    <Image
                                        source={{ uri: companyLogo.uri }}
                                        resizeMode="cover"
                                        className="w-full h-64 rounded-2xl"
                                    />
                                </View>
                            ) : (
                                <View className="w-full h-16 px-4 bg-[#e1daeb] rounded-2xl border-2 border-gray-100  flex justify-center items-center flex-row space-x-2">
                                    <Text className="text-sm text-gray-100 font-pmedium">
                                        Choose Media file
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
                        {errors.companyLogo && (
                            <Text className="text-red-500 text-sm">{errors.companyLogo}</Text>
                        )}
                    </View>
                    <View className="w-full my-5 justify-center items-center">
                        <CustomButton
                            title="Start Hiring"
                            handlePress={handleSubmit}
                            containerStyle="w-4/5 mt-5"
                        />
                    </View>
                </FormWrapper>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ContactInfo;