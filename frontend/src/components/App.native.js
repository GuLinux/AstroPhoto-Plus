import React from 'react';
import { Subtitle, Container, Content, Icon, Left, Right, Title, Body, Header, Text, Button } from "native-base";
import { createDrawerNavigator, createAppContainer } from "react-navigation";
import { BackendSelectionContainer } from '../BackendSelection/BackendSelectionContainer';

const Navbar = ({navigation, pageName}) => (
    <Header>
        <Left>
            <Button transparent onPress={() => navigation.toggleDrawer()} >
                <Icon name='menu'/>
            </Button>
        </Left>
        <Body>
            <Title>{pageName}</Title>
            <Subtitle>AstroPhoto Plus</Subtitle>
        </Body>
        <Right />
    </Header>
);

const HomeScreen = ({navigation}) => (
    <Container>
        <Navbar navigation={navigation} pageName='Home' />
        <Content>
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

