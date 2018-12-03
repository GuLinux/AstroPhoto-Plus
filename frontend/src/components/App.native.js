import React from 'react';
//import { Navbar } from '../Navigation/Navbar';
import { View, Text } from 'react-native';

// TODO: delete, and replace with common App.js

const Navbar = () => (
    <View>
        <Text>hello</Text>
    </View>
);

const App = ({location}) => (
    <Navbar location={location}>
    </Navbar>
);

export default App;
