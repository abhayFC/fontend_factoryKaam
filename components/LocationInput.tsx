import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import FormField from '@/components/FormField';

interface LocationData {
  pincode: string;
  state: string;
  city: string;
  fullLocation: string;
}

interface LocationInputProps {
  onLocationChange: (location: string) => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ onLocationChange }) => {
  const [locationData, setLocationData] = useState<LocationData>({
    pincode: '',
    state: '',
    city: '',
    fullLocation: '',
  });
  const [pincodeError, setPincodeError] = useState<string>("");
  const handlePincodeChange = async (pincode: string) => {
    setLocationData(prev => ({ ...prev, pincode }));
    if (pincode.length === 6) {
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        console.log(data);
        if(data[0].Status === 'Error') {
          throw new Error('Invalid Pincode');
        }
        if (data[0].Status === 'Success') {
          setPincodeError('');
          const postOffice = data[0].PostOffice[0];
          setLocationData(prev => ({
            ...prev,
            state: postOffice.State,
            city: postOffice.District,
          }));
        }
      } catch (error) {
        setLocationData(prev => ({
          ...prev,
          state: "",
          city: "",
        }))
        setPincodeError('Please enter a valid Pincode');
        Alert.alert('Error', 'Please enter a valid Pincode');
        console.error('Error fetching pincode data:', error);
      }
    }else{
      setPincodeError('Please enter a valid Pincode');
      setLocationData(prev => ({
        ...prev,
        state: "",
        city: "",
      }))
    }
  };

  const handleLocationChange = (fullLocation: string) => {
    setLocationData(prev => ({ ...prev, fullLocation }));
    const completeLocation = `${fullLocation}, ${locationData.city}, ${locationData.state}, ${locationData.pincode}`;
    onLocationChange(completeLocation);
  };

  return (
    <View>
      <FormField
        title="Pincode"
        value={locationData.pincode}
        handleChangeText={handlePincodeChange}
        placeholder="Enter Pincode"
        otherStyle="mt-7"
        required={true}
        error={pincodeError}
      />
      <FormField
        title="State"
        value={locationData.state}
        handleChangeText={(state) => setLocationData(prev => ({ ...prev, state }))}
        placeholder="State"
        otherStyle="mt-7"
        editable={false}
      />
      <FormField
        title="City"
        value={locationData.city}
        handleChangeText={(city) => setLocationData(prev => ({ ...prev, city }))}
        placeholder="City"
        otherStyle="mt-7"
        editable={false}
      />
      <FormField
        title="Address"
        value={locationData.fullLocation}
        handleChangeText={handleLocationChange}
        placeholder="Enter Address"
        otherStyle="mt-7"
        multiline={true}
        containerStyle="h-32"
        required={true}
      />
    </View>
  );
};

export default LocationInput;