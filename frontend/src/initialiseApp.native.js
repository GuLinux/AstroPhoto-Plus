import {AppRegistry } from 'react-native';
import {name as appName} from '../app.json';
import React from 'react';


export const initialiseApp = (App) => {
    const RenderApp = () => App;
    AppRegistry.registerComponent(appName, () => RenderApp);
}

