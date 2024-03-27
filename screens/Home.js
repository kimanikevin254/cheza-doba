import { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import * as MediaLibrary from 'expo-media-library'
import { Audio, InterruptionModeAndroid } from 'expo-av'
import { FlashList } from "@shopify/flash-list";
import { useSelector, useDispatch } from 'react-redux'
import { AudioItem } from "../components/AudioItem";
import { setAudioFiles, setDuration, setIsPlaying, setPosition } from "../redux/audioPlayer/audioPlayerSlice";
import MiniPlayer from "../components/MiniPlayer";

export default function Home() {
  // Permissions
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions()

  const dispatch = useDispatch()

  const { audioFiles, currentAudioFile, currentAudio, isPlaying, position, duration } = useSelector((state) => state.audioPlayer)

  // Configure audio exprience on page load
  useEffect(() => {
    const setAudioExprience = async () => {
      await Audio.setAudioModeAsync({
        // shouldDuckAndroid: false,
        staysActiveInBackground: true,
      })
    }

    setAudioExprience()
  }, [])

  // Fetch music on initial screen load
  useEffect(() => {
    const fetchAudios = async () => {
      // Check if necessary permissions are granted
      if(permissionResponse.status !== 'granted') {
        try {
          // No permission granted. Request for permission
          await requestPermission();
        } catch (error) {
          console.log('unable to request permission', error)
        }
      }
      
      // Fetch audio files from the device
      try {
        const fetchedAudioFiles = await MediaLibrary.getAssetsAsync({
          mediaType: 'audio',
          first: 9999999999, // Set a large number here since the library implements pagination and we want to fetch all audio files at once
        })
        
        dispatch(setAudioFiles(fetchedAudioFiles.assets.sort((a, b) => a.filename.localeCompare(b.filename))))
      } catch (error) {
        console.log('error fetching audios', error)
      }
    };
  
    fetchAudios();
  }, [permissionResponse]) // Always fetch all the audio files when permissions are changed

  // Cleanup the sound from memory
  useEffect(() => {
    return currentAudio ?
    () => {
      currentAudio.unloadAsync()
      dispatch(setIsPlaying(false))
      dispatch(setDuration(0))
      dispatch(setPosition(0))
    } :
    undefined
  }, [currentAudio])

  // Sync slider position with the audio position
  useEffect(() => {
    const interval = setInterval(async () => {
      if(currentAudio && isPlaying){
        const { positionMillis } = await currentAudio.getStatusAsync()
        dispatch(setPosition(positionMillis))
      }
    }, 1000)

    return () => clearInterval(interval);

  }, [currentAudio, isPlaying])

  // Check is audio has finished playing
  useEffect(() => {
    if(currentAudio){
      if(position === duration){
        dispatch(setDuration(0))
        dispatch(setPosition(0))
        dispatch(setIsPlaying(false))
      }
    }

  }, [position, duration])

  return (
      <SafeAreaView className='pt-8 flex-1 bg-white'>
        <View className='py-2 px-4'>
          <Text className='font-bold text-2xl'>NGOMA</Text>
        </View>
        {
          audioFiles ? 
          (
            <>
              {/* <FlatList 
                data={audioFiles}
                renderItem={({ item }) => <RenderItem item={item} /> }
                keyExtractor={item => item?.id.toString()}
                className='flex-1 bg-gray-100'
              /> */} 
              <FlashList 
                data={audioFiles}
                renderItem={({ item }) => <AudioItem 
                  item={item} 
                /> }
                contentContainerStyle={{ flex: 1, backgroundColor: 'rgb(243 244 246)'}}
                estimatedItemSize={81}
              />

              {
                currentAudioFile &&
                <MiniPlayer />
              }
            </>
          ) :
          <Text>Loading music...</Text>
        }
      </SafeAreaView>
  );
}
