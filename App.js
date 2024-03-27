import { useEffect, useState } from "react";
import { SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import * as MediaLibrary from 'expo-media-library'
import { Audio, InterruptionModeAndroid } from 'expo-av'
import Slider from '@react-native-community/slider';
import { Entypo } from '@expo/vector-icons';
import { FlashList } from "@shopify/flash-list";
import { AudioItem } from './components/AudioItem'
import { handleAudioControls } from "./utils/audio";

export default function App() {
  //  The list of audio files.
  const [audioFiles, setAudioFiles] = useState(null)
  // Permissions
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions()
  // The audio file that is playing
  const [currentAudioFile, setCurrentAudioFile] = useState(null)
  // CAudio.Sound instance of the audio file that is playing
  const [currentAudio, setCurrentAudio] = useState(null)

  // Duration of the current audio file in seconds
  const [duration, setDuration] = useState(0)
  // Track the position of the current audio file => For the slider
  const [position, setPosition] = useState(0)

  const [isPlaying, setIsPlaying] = useState(false)

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
        
        setAudioFiles(fetchedAudioFiles.assets.sort((a, b) => a.filename.localeCompare(b.filename)))
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
      console.log('Unloading')
      currentAudio.unloadAsync()
      // setCurrentAudio(null)
      setIsPlaying(false)
      setDuration(0)
      setPosition(0)
    } :
    undefined
  }, [currentAudio])

  // Handle slider interactions
  const handleSliderChange = (value) => {
    if (!currentAudio) return;
    // Adjust slider position
    setPosition(value);

    // Adjust the position of the current audio
    currentAudio.setPositionAsync(value);
  };

  // Sync slider position with the audio position
  useEffect(() => {
    const interval = setInterval(async () => {
      if(currentAudio && isPlaying){
        const { positionMillis } = await currentAudio.getStatusAsync()
        setPosition(positionMillis)
      }
    }, 1000)

    return () => clearInterval(interval);

  }, [currentAudio, isPlaying])

  // Check is audio has finished playing
  useEffect(() => {
    if(currentAudio){
      if(position === duration){
        setDuration(0)
        setPosition(0)
        setIsPlaying(false)
      }
    }

  }, [position, duration])

  // Format audio duration to hh:mm:ss
  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.round(seconds) % 60;
    
    return `${hours > 0 ? hours.toString().padStart(2, '0') + ':' : ''}${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

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
                currentAudioFile={currentAudioFile} 
                setCurrentAudioFile={setCurrentAudioFile} 
                currentAudio={currentAudio} 
                setCurrentAudio={setCurrentAudio} 
                formatDuration={formatDuration}
                setDuration={setDuration}
                setIsPlaying={setIsPlaying}
                setPosition={setPosition} 
              /> }
              contentContainerStyle={{ flex: 1, backgroundColor: 'rgb(243 244 246)'}}
              estimatedItemSize={81}
            />

            {
              currentAudioFile &&
              <View className='px-3 pt-3 bg-[#7539FE] rounded-t-2xl'>
                <View className='flex-row items-center justify-between'>
                  <View className='flex-row w-1/2 gap-2 items-center'>
                    <View className='h-12 w-12 bg-gray-100 rounded-full items-center justify-center'>
                      <Text className='text-2xl font-semibold'>{currentAudioFile.filename.split('')[0]}</Text>
                    </View>

                    <View>
                      <Text className='font-semibold text-white text-sm'>
                        {
                          currentAudioFile.filename.length > 15 ?
                          currentAudioFile.filename.slice(0, 15) + '...' :
                          currentAudioFile.filename
                        }
                      </Text>
                      <Text className='text-gray-200 text-xs'>{formatDuration(currentAudioFile.duration)}</Text>
                    </View>
                  </View>

                  <View className='flex-row items-center w-1/2 justify-around'>
                    <TouchableOpacity 
                      onPress={() => handleAudioControls({ action: 'next', currentAudio, setIsPlaying, audioFiles, currentAudioFile, setCurrentAudio, setCurrentAudioFile, setDuration, setPosition })}
                    >
                      <Entypo name="controller-jump-to-start" size={24} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={() => handleAudioControls({ action: 'play', currentAudio, setIsPlaying, audioFiles, currentAudioFile })}
                    >
                      { isPlaying ?
                        <Entypo name="controller-paus" size={24} color="white" /> :
                        <Entypo name="controller-play" size={24} color="white" />
                      }
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={() => handleAudioControls({ action: 'next', currentAudio, setIsPlaying, audioFiles, currentAudioFile, setCurrentAudio, setCurrentAudioFile, setDuration, setPosition })}
                    >
                      <Entypo name="controller-next" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>

                <Slider 
                  style={{ height: 50 }}
                  minimumValue={0}
                  maximumValue={duration}
                  value={position}
                  onSlidingComplete={handleSliderChange}
                  disabled={!currentAudio}
                />
              </View>
            }
          </>
        ) :
        <Text>Loading music...</Text>
      }
    </SafeAreaView>
  );
}
