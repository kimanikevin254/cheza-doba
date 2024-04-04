import { useCallback, useEffect } from "react";
import { SafeAreaView, Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux'
import { setPlaylists } from "../redux/audioPlayer/audioPlayerSlice";
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from "@shopify/flash-list";
import PlaylistItem from "../components/PlaylistItem";

export default function PlaylistsScreen(){
    const dispatch = useDispatch()

    // fxn to fetch all playlists
    const fetchAllPlaylists = async () => {
        try {
            const myPlaylists = await AsyncStorage.getItem('playlists')

            if(myPlaylists !== null){
                // update store
                let myPlaylistsJson = JSON.parse(myPlaylists)
                dispatch(setPlaylists(myPlaylistsJson.playlists))
            }
        } catch (error) {
            
        }
    }
    
     // Fetch all playlists from async storage when the screen comes into focus
     useFocusEffect(
        useCallback(() => {
            fetchAllPlaylists();
        }, [])
    );

    const { playlists } = useSelector(state => state.audioPlayer)

    return (
        <SafeAreaView className='flex-1 bg-gray-100'>
            <FlashList 
                data={playlists}
                renderItem={({ item }) => <PlaylistItem 
                item={item} 
                /> }
                contentContainerStyle={{ flex: 1, backgroundColor: 'rgb(243 244 246)'}}
                estimatedItemSize={81}
            />
        </SafeAreaView>
    )
}