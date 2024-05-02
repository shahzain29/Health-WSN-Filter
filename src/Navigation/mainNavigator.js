import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../Screens/Home'
import CheckProcess from '../Screens/CheckProcess'
import ClassifierComponent from '../Functions/decisionTree';


const MainNavigator = ()=> {
    const Stack = createNativeStackNavigator();
 
    return (
        <Stack.Navigator screenOptions={{
            headerShown:false
        }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="CheckProcess" component={CheckProcess} /> 
        {/* <Stack.Screen name="ClassifierComponent" component={ClassifierComponent} />  */}
      </Stack.Navigator>
    );
  }
export default MainNavigator
