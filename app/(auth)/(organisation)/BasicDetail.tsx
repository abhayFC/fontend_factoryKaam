import React, { useState } from 'react'
import { View, Text, ScrollView, Alert } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router'
import { FormWrapper } from '@/components/FormWraper'
import FormField from '@/components/FormField'
import Dropdown from '@/components/DropDown'
import CustomButton from '@/components/CustomButton'
import { useAuth } from '@/app/contexts/AuthContext'
import LocationInput from '@/components/LocationInput';

const industryData = [
    { key: "1", value: "Textile Industry" },
    { key: "2", value: "CNC" },
    { key: "3", value: "Packaging Industry" },
    { key: "4", value: "Auto Parts Industry" },
    { key: "5", value: "Printing Industry" },
    { key: "6", value: "Other" },
];

interface Form {
    gstNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
    companyName: string;
    industry: string;
    otherIndustry: string;
    pincode: string;
    city: string;
    state: string;
    address: string;
}

interface FormErrors {
    gstNumber?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    companyName?: string;
    industry?: string;
    otherIndustry?: string;
    pincode?: string;
    city?: string;
    state?: string;
    address?: string;
}

const BasicDetail: React.FC = () => {
    const [form, setForm] = useState<Form>({
        gstNumber: '',
        email: "",
        password: "",
        confirmPassword: "",
        companyName: "",
        industry: "",
        otherIndustry: "",
        pincode: "",
        city: "",
        state: "",
        address: "",
    })

    const [errors, setErrors] = useState<FormErrors>({});
    const [isVerifyingGST, setIsVerifyingGST] = useState(false);
    const {BasicDetailsUpdate} = useAuth();
    const [gstVerified, setGstVerified] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { VerifyGST } = useAuth();
    const [fetchesAddress, setFetchesAddress] = useState(true);
    const [address, setAddress] = useState<string>("");

    const handleIndustryChange = (selectedIndustry: string) => {
        setForm(prevForm => ({
            ...prevForm,
            industry: selectedIndustry,
            otherIndustry: selectedIndustry !== "Other" ? "" : prevForm.otherIndustry
        }));
        setErrors(prev => ({ ...prev, industry: undefined, otherIndustry: undefined }));
    };

    const validateGstNumber = (gstNumber: string): boolean => {
        return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gstNumber);
    }

    const handleGstChange = async (text: string) => {
        setForm(prevForm => ({ ...prevForm, gstNumber: text }));
        
        if (validateGstNumber(text) && !gstVerified) {
            setIsVerifyingGST(true);
            try {
                const GSTResponse = await VerifyGST(text);
                console.log("GST Verification Response:", GSTResponse);
                if(Object.keys(GSTResponse.gstInfo.adadr).length === 0) {
                    setFetchesAddress(false);
                }else{
                    setFetchesAddress(true);
                }
                setForm(prevForm => ({
                    ...prevForm,
                    companyName: GSTResponse.gstInfo.lgnm || '',
                    pincode: GSTResponse.gstInfo.adadr?.pncd || '',
                    city: GSTResponse.gstInfo.adadr?.loc || '',
                    state: GSTResponse.gstInfo.adadr?.stcd || '',
                    address: GSTResponse.gstInfo.adadr?.bnm && GSTResponse.gstInfo.adadr?.bno && GSTResponse.gstInfo.adadr?.st
                        ? `${GSTResponse.gstInfo.adadr.bnm}, ${GSTResponse.gstInfo.adadr.bno}, ${GSTResponse.gstInfo.adadr.st}`
                        : ''
                }));
    
                setGstVerified(true);
                setErrors(prev => ({ ...prev, gstNumber: undefined }));
            } catch (error) {
                console.error("GST Verification Error:", error);
                setErrors(prev => ({ ...prev, gstNumber: "Failed to verify GST number" }));
                // Clear fields on verification failure
                setForm(prevForm => ({
                    ...prevForm,
                    companyName: '',
                    pincode: '',
                    city: '',
                    state: '',
                    address: ''
                }));
            } finally {
                setIsVerifyingGST(false);
            }
        } else if (!validateGstNumber(text)) {
            setGstVerified(false);
            setErrors(prev => ({ ...prev, gstNumber: "Invalid GST Number format" }));
            // Clear fields when GST number is invalid
            setForm(prevForm => ({
                ...prevForm,
                companyName: '',
                pincode: '',
                city: '',
                state: '',
                address: ''
            }));
        }
    };
    

    const validateForm = (): boolean => {
        let newErrors: FormErrors = {};
        let isValid = true;

        if (!form.gstNumber.trim() || !gstVerified) {
            newErrors.gstNumber = "Valid GST Number is required";
            isValid = false;
        }

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Invalid email format";
            isValid = false;
        }

        if (!form.password) {
            newErrors.password = "Password is required";
            isValid = false;
        } else if (form.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
            isValid = false;
        }

        if (!form.confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required";
            isValid = false;
        } else if (form.confirmPassword !== form.password) {
            newErrors.confirmPassword = "Passwords do not match";
            isValid = false;
        }

        if (!form.companyName.trim()) {
            newErrors.companyName = "Company Name is required";
            isValid = false;
        }

        if (!form.industry) {
            newErrors.industry = "Industry is required";
            isValid = false;
        }

        if (form.industry === "Other" && !form.otherIndustry.trim()) {
            newErrors.otherIndustry = "Please specify your industry";
            isValid = false;
        }

        if (!form.pincode.trim()) {
            newErrors.pincode = "Pincode is required";
            isValid = false;
        } else if (!/^\d{6}$/.test(form.pincode)) {
            newErrors.pincode = "Pincode must be 6 digits";
            isValid = false;
        }

        if (!form.city.trim()) {
            newErrors.city = "City is required";
            isValid = false;
        }

        if (!form.state.trim()) {
            newErrors.state = "State is required";
            isValid = false;
        }

        if (!form.address.trim()) {
            newErrors.address = "Address is required";
            isValid = false;
        }
        if(!fetchesAddress && address.trim() === "" && address.length < 7 && address.length > 100){
            newErrors.address = "Address is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            setIsSubmitting(true);
            let AddressForSubmision =(fetchesAddress)?`${form.address}, ${form.city}, ${form.state}, ${form.pincode}`:address;
            try {
                const industry = form.industry === "Other" ? form.otherIndustry : form.industry;
                const response = await BasicDetailsUpdate(
                    form.gstNumber,
                    form.email,
                    form.password,
                    form.companyName,
                    industry,
                    `${form.address}, ${form.city}, ${form.state}, ${form.pincode}`
                );

                console.log("Form submitted successfully:", response);
                Alert.alert("Success", "Basic details updated successfully!");
                router.push("/ContactInfo"); // Navigate to the next page
            } catch (error) {
                console.error("Error submitting form:", error);
                Alert.alert("Error", "An error occurred while submitting the form. Please try again.");
            } finally {
                setIsSubmitting(false);
            }
        } else {
            Alert.alert("Please check entries and try again ", "Please check the highlighted entries and correct any errors to proceed.");
        }
    };


    return (
        <SafeAreaView className="h-full bg-white p-0">
            <View className="w-full flex-row items-center justify-center mt-0 mb-3">
                <Text className="text-xl text-center font-plight text-black">Step </Text>
                <Text className="text-2xl text-center font-pbold text-black">1</Text>
                <Text className="text-xl text-center font-plight text-black"> of 2</Text>
            </View>

            <ScrollView className='flex h-full px-2'>
                <FormWrapper title='Basic Details'>
                    <FormField
                        title='GST Number'
                        value={form.gstNumber}
                        handleChangeText={handleGstChange}
                        keyBoardType='default'
                        placeholder='Enter GST Number'
                        required={true}
                        error={errors.gstNumber}
                    />
                    {isVerifyingGST && <Text className="text-blue-500 text-sm">Verifying GST...</Text>}
                    {gstVerified && <Text className="text-green-500 text-sm">GST Verified</Text>}
                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(text) => setForm({ ...form, email: text })}
                        keyBoardType="email-address"
                        placeholder={""}
                        required={true}
                        error={errors.email}
                    />
                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(text) => setForm({ ...form, password: text })}
                        keyBoardType='Password'
                        placeholder='Enter Password'
                        required={true}
                        error={errors.password}
                    />
                    <FormField
                        title="Confirm Password"
                        value={form.confirmPassword}
                        handleChangeText={(text) => setForm({ ...form, confirmPassword: text })}
                        keyBoardType='Password'
                        placeholder='Re-Enter Password'
                        required={true}
                        error={errors.confirmPassword}
                    />
                    <FormField
                        title="Company Name"
                        value={form.companyName}
                        handleChangeText={(text) => setForm({ ...form, companyName: text })}
                        keyBoardType="default"
                        placeholder="Enter Company Name"
                        required={true}
                        error={errors.companyName}
                    />
                    <Dropdown
                        label="Industry"
                        value={form.industry}
                        search={true}
                        onSelect={handleIndustryChange}
                        data={industryData}
                        placeholder='Select Industry'
                        required={true}
                    />
                    {errors.industry && <Text className="text-red-500 text-sm">{errors.industry}</Text>}
                    {form.industry === "Other" && (
                        <FormField
                            title="Other Industry"
                            value={form.otherIndustry}
                            handleChangeText={(text) => setForm({ ...form, otherIndustry: text })}
                            keyBoardType="default"
                            placeholder="Specify your industry"
                            required={true}
                            error={errors.otherIndustry}
                        />
                    )}
                    {fetchesAddress?<>
                        <FormField
                        title="Pincode"
                        value={form.pincode}
                        handleChangeText={(text) => setForm({ ...form, pincode: text })}
                        keyBoardType="numeric"
                        placeholder="Enter Pincode"
                        required={true}
                        error={errors.pincode}
                    />
                    <FormField
                        title="City"
                        value={form.city}
                        handleChangeText={(text) => setForm({ ...form, city: text })}
                        keyBoardType="default"
                        placeholder="Enter City"
                        required={true}
                        error={errors.city}
                    />
                    <FormField
                        title="State"
                        value={form.state}
                        handleChangeText={(text) => setForm({ ...form, state: text })}
                        keyBoardType="default"
                        placeholder="Enter State"
                        required={true}
                        error={errors.state}
                    />
                    <FormField
                        title="Address"
                        value={form.address}
                        handleChangeText={(text) => setForm({ ...form, address: text })}
                        multiline={true}
                        keyBoardType="default"
                        placeholder="Enter Address"
                        required={true}
                        error={errors.address}
                    />
                    </>:<>
                    <LocationInput onLocationChange={setAddress}/>
                    {errors.address && <Text className="text-red-500 text-sm mt-1">{errors.address}</Text>}
                    </>}

                    <View className="w-full my-5 justify-center items-center mb-3">
                        <CustomButton
                            title="Save and Continue"
                            handlePress={handleSubmit}
                            containerStyle="w-4/5 mt-5"
                        />
                    </View>
                </FormWrapper>
            </ScrollView>
        </SafeAreaView>
    )
}

export default BasicDetail