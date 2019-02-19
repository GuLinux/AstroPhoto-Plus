import React from 'react';
import { View} from "react-native";
import { createDrawerNavigator, createAppContainer } from "react-navigation";
import { BackendSelectionContainer } from '../BackendSelection/BackendSelectionContainer';
import { Icon, ThemeProvider, Button, Text, Header } from 'react-native-elements';

const HamburgerMenu = ({navigation}) => (
    <Icon
      color="#fff"
      name="menu"
      onPress={() => navigation.toggleDrawer()}
    />
);

const Navbar = ({navigation}) => (
    <Header
        leftComponent={<HamburgerMenu navigation={navigation} />}
        centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
        rightComponent={{ icon: 'home', color: '#fff' }}
    />
);

const HomeScreen = ({navigation}) => (
  <View> 
    <Navbar navigation={navigation} />
    <Text>Home Screen</Text>
    <Button
      title="Go to Backend selection"
      onPress={() => navigation.navigate('BackendSelection')}
    />
  </View>
);


const AppNavigator = createDrawerNavigator({
    Home: HomeScreen,
    BackendSelection: BackendSelectionContainer,
},{
    initialRouteName: 'Home',
});

export const App = createAppContainer(AppNavigator);
