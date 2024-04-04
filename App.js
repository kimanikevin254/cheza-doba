import { Provider } from 'react-redux'
import Home from "./screens/Home";
import { store } from './redux/store';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Player from './screens/Player';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo } from '@expo/vector-icons';
import PlaylistsScreen from './screens/Playlists';
import PlaylistScreen from './screens/PlaylistScreen';

// const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = createNativeStackNavigator();
const PlaylistsStack = createNativeStackNavigator();

function HomeStackScreen(){
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen 
        name='HomeScreen'
        component={Home}
      />

      <HomeStack.Screen 
        name='PlayerScreen'
        component={Player}
      />
    </HomeStack.Navigator>
  )
}

function PlaylistsStackScreen() {
  return (
    <PlaylistsStack.Navigator>
      <PlaylistsStack.Screen
        name="PlaylistsScreen"
        component={PlaylistsScreen}
        options={{ title: 'Playlists' }}
      />

      <PlaylistsStack.Screen
        name="PlaylistScreen"
        component={PlaylistScreen}
        options={{ title: 'Playlist' }}
      />
    </PlaylistsStack.Navigator>
  );
}

export default function App() {
    return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator 
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if(route.name === 'Home'){
                iconName = focused ?
                'home' :
                'home'
              } else if(route.name === 'Playlists'){
                iconName = focused ?
                'list' :
                'list'
              }

              return <Entypo name={iconName} size={24} color="black" />
            }
          })}
        >
          <Tab.Screen 
            name='Home'
            component={HomeStackScreen}
          />

          <Tab.Screen 
            name='Playlists'
            component={PlaylistsStackScreen}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
