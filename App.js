import { useEffect, useState } from "react";
import { Button, SafeAreaView, ScrollView, View, Text, TouchableOpacity, FlatList } from "react-native";
import * as MediaLibrary from 'expo-media-library'
import { Audio, InterruptionModeAndroid } from 'expo-av'
import Slider from '@react-native-community/slider';
import { Entypo } from '@expo/vector-icons';

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

  // Play sound
  async function playAudio(audio){
    setCurrentAudioFile(audio)

    const sound = new Audio.Sound()

    try {
      await sound.loadAsync({
        uri: audio.uri,
      })

      setCurrentAudio(sound)

      // Get the duration  of the audio file in seconds
      const { durationMillis } = await sound.getStatusAsync()
      setDuration(durationMillis)

      await sound.playAsync()

      setIsPlaying(true)
    } catch (error) {
      console.log('error', error)
    }
  }
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
      if(currentAudio){
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

  // Handle audio controls
  const handleAudioControls = async ({ action }) => {
    // Play/pause
    if(action === 'play'){
      // console.log(currentAudioFile, currentAudio)
      const sts = await currentAudio.getStatusAsync()
      console.log(sts)
      const { isPlaying: isCurrentAudioPlaying } = await currentAudio.getStatusAsync()
      if(isCurrentAudioPlaying){
        await currentAudio.pauseAsync()
        // setIsPaused(true)
        setIsPlaying(false)
      } else {
        console.log('play ')
        await currentAudio.playAsync()
        // setIsPaused(false)
        setIsPlaying(true)
      }
    }

    if(action === 'next'){
      // Stop current track
      await currentAudio.stopAsync()

      // Play next track
      // Check the index of the current song in the audio list array
      let currentPosition = audioFiles.indexOf(currentAudioFile)

      // Check if the current audio is the last in the list
      if(currentPosition ===  audioFiles.length - 1){
        // If it's the last one, play the first song
        playAudio(audioFiles[0])
      } else {
        // Play the next audio in the list
        playAudio(audioFiles[currentPosition+1])
      }
    }

    if(action === 'previous'){
      // Stop current track
      await currentAudio.stopAsync()

      // Play previous track
      // Check the index of the current song in the audio list array
      let currentPosition = audioFiles.indexOf(currentAudioFile)

      // Check if the current audio is the first in the list
      if (currentPosition === 0 ){
        // If it's the first one, play the last audio
        playAudio(audioFiles[audioFiles.length-1])
      } else {
        // Play the previous audio
        playAudio(audioFiles[currentPosition-1])
      }      
    }
  } 

  // Format audio duration to hh:mm:ss
  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.round(seconds) % 60;
    
    return `${hours > 0 ? hours.toString().padStart(2, '0') + ':' : ''}${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

  // Component for each item
  const renderItem = ({ item: audio }) => (
    <TouchableOpacity 
      className={currentAudioFile && audio.uri === currentAudioFile.uri ? 'bg-[#c7c1f0] mx-4 my-2 p-2 rounded-lg' : 'bg-white mx-4 my-2 p-2 rounded-lg'}
      onPress={() => playAudio(audio)}
      activeOpacity={0.8}
    >
      <View className='flex-row gap-4 items-center'>
        <View className='h-12 w-12 bg-gray-100 rounded-full items-center justify-center'>
          <Text className='text-2xl font-semibold'>{audio.filename.split('')[0]}</Text>
        </View>
        
        <View>
          <Text className='font-semibold'>
            {
              audio.filename.length > 30 ?
              audio.filename.slice(0, 30) + '...' :
              audio.filename
            }
          </Text>
          <Text className='text-gray-500 text-sm'>{formatDuration(audio.duration)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView className='pt-8 flex-1 bg-white'>
      <View className='py-2 px-4'>
        <Text className='font-bold text-2xl'>NGOMA</Text>
      </View>
      {
        audioFiles ? 
        (
          <>
            <FlatList 
              data={audioFiles}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              className='flex-1 bg-gray-100'
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
                    <TouchableOpacity onPress={() => handleAudioControls({ action: 'previous' })}>
                      <Entypo name="controller-jump-to-start" size={24} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleAudioControls({ action: 'play' })}>
                      { isPlaying ?
                        <Entypo name="controller-paus" size={24} color="white" /> :
                        <Entypo name="controller-play" size={24} color="white" />
                      }
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleAudioControls({ action: 'next' })}>
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
