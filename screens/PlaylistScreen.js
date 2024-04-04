import { SafeAreaView, Text, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { FlashList } from "@shopify/flash-list";
import { AudioItem } from "../components/AudioItem";
import { useSelector, useDispatch } from 'react-redux'
import MiniPlayer from "../components/MiniPlayer";

export default function PlaylistScreen({ route }){
    const navigation = useNavigation()

    useFocusEffect(
        useCallback(() => {
            navigation.setOptions({ title: route.params.playlistName });
        }, [])
    );

    const { currentAudioFile } = useSelector(state => state.audioPlayer)

    return (
        <SafeAreaView className='flex-1'>
            { route.params.audioFiles &&
                <FlashList 
                    data={route.params.audioFiles}
                    renderItem={({ item }) => <AudioItem 
                    item={item} 
                    /> }
                    contentContainerStyle={{ flex: 1, backgroundColor: 'rgb(243 244 246)'}}
                    estimatedItemSize={81}
                />
            }

            {
                currentAudioFile &&
                <MiniPlayer />
            }
        </SafeAreaView>
    )
}