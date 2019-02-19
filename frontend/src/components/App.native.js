import React from 'react';
import { View, Text, Button } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";
import { BackendSelectionContainer } from '../BackendSelection/BackendSelectionContainer';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Home Screen</Text>
        <Button
          title="Go to Backend selection"
          onPress={() => this.props.navigation.navigate('BackendSelection')}
        />
      </View>
    );
  }
}

const AppNavigator = createStackNavigator({
    Home: HomeScreen,
    BackendSelection: BackendSelectionContainer,
},{
    initialRouteName: 'Home',
});

export const App = createAppContainer(AppNavigator);

