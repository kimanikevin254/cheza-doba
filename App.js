import { Provider } from 'react-redux'
import Home from "./screens/Home";
import { store } from './redux/store';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Player from './screens/Player';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }}>
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='Player' component={Player} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
