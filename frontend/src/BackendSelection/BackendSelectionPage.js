import React from 'react';
import { View, TextInput, Button } from 'react-native';

export const BackendSelectionPage = () => (
    <View>
        <TextInput placeholder='Backend server' />
        <Button title='Set' />
    </View>
);