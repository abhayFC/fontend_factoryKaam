import { View, Text, TextInput, TouchableOpacity, Image, TouchableWithoutFeedback, KeyboardTypeOptions } from 'react-native'
import React, { useState, useRef } from 'react'
import { icons } from '@/constants';

interface FormFieldProps {
    title: string;
    value: string;
    handleChangeText: (text:string) => void;
    otherStyle?: string | string[];
    containerStyle?: string | string[];
    keyBoardType?: string;
    placeholder: string;
    multiline?: boolean;
    error?: string;
    editable?: boolean;
    required?: boolean;
}

const FormField = ({ 
    title = '',
    value = '',
    handleChangeText = () => {},
    otherStyle = '',
    keyBoardType = '',
    placeholder = '',
    containerStyle = '',
    multiline = false,
    error = '',
    editable = true,
    required = false,
}: FormFieldProps) => {
    const [showPassword, setshowPassword] = useState(false)
    const inputRef = useRef<TextInput | null>(null)

    return (
        <View className={`mt-5 ${otherStyle}`}>
            <View className="flex-row items-center">
                <Text className="text-base text-black font-pmedium">{title}</Text>
                {required && <Text className="text-red-500 ml-1">*</Text>}
            </View>
            <View className={`border-2 border-gray-100 w-full ${multiline ? 'h-32' : 'h-16'} px-4 rounded-2xl focus:border-secondary items-center flex-row ${containerStyle} ${!editable ? 'bg-[#e3dfe6]' : ''}`}>
                <TextInput
                    ref={inputRef}
                    className={`flex-1 font-psemibold text-base ${multiline ? 'h-full py-2' : ''}`}
                    value={value}
                    placeholder={placeholder?.length > 0 ? placeholder : title}
                    onChangeText={handleChangeText}
                    secureTextEntry={keyBoardType === 'Password' && !showPassword}
                    multiline={multiline}
                    textAlignVertical={multiline ? 'top' : 'center'}
                    editable={editable}
                    style={multiline ? { height: '100%' } : {}}
                />
                {keyBoardType === 'Password' && (
                    <TouchableOpacity onPress={() => {
                        inputRef.current?.focus()
                        setshowPassword(!showPassword)
                    }}>
                        <Image source={!showPassword ? icons.eye : icons.eyeHide} className='w-6 h-6' resizeMode='contain' />
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text className="text-red-500 text-sm">{error}</Text>}
        </View>
    )
}

export default FormField