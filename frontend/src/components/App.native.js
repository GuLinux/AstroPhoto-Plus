import React from 'react';
import { Container, Content, Text, Button } from "native-base";
import { createDrawerNavigator, createAppContainer } from "react-navigation";
import { BackendSelectionContainer } from '../BackendSelection/BackendSelectionContainer';
import { Navbar } from '../Navigation/Navbar.native';


const HomeScreen = ({navigation}) => (
    <Container>
        <Navbar navigation={navigation} pageName='Home' />
        <Content padder>
            <Button onPress={() => navigation.navigate('BackendSelection')}>
                <Text>Go to Backend selection</Text>
            </Button>
        </Content>
    </Container>
);

const AppNavigator = createDrawerNavigator({
    Home: HomeScreen,
    BackendSelection: BackendSelectionContainer,
},{
    initialRouteName: 'Home',
});

export const App = createAppContainer(AppNavigator);

