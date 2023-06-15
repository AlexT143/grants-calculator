import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TransitionSpecs } from '@react-navigation/stack';
import { CardStyleInterpolators } from '@react-navigation/stack';

import NACECodePage from './src/components/NACECodePage';
import ElectricityUsagePage from './src/components/ElectricityUsagePage';
import EBITDAPage from './src/components/EBITDAPage';
import GVAInputPage from './src/components/GVAInputPage';
import ResultsPage from './src/components/ResultsPage';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="NACECodePage"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          transitionSpec: {
            open: TransitionSpecs.TransitionIOSSpec,
            close: TransitionSpecs.TransitionIOSSpec,
          },
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        <Stack.Screen name="NACECodePage" component={NACECodePage} />
        <Stack.Screen name="ElectricityUsagePage" component={ElectricityUsagePage} />
        <Stack.Screen name="EBITDAPage" component={EBITDAPage} />
        <Stack.Screen name="GVAInputPage" component={GVAInputPage} />
        <Stack.Screen name="ResultsPage" component={ResultsPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;