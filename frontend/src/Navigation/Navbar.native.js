import React from 'react';
import { Header, Left, Button, Icon, Body, Title, Subtitle, Right } from "native-base";

export const Navbar = ({navigation, pageName}) => (
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