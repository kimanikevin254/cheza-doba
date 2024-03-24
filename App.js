import { useEffect, useState } from "react";
import { Button, SafeAreaView, ScrollView, View, Text, TouchableOpacity, FlatList } from "react-native";
import * as MediaLibrary from 'expo-media-library'
import { Audio } from 'expo-av'
import Slider from '@react-native-community/slider';
import { Entypo } from '@expo/vector-icons';

export default function App() {
  const [audioList, setAudioList] = useState(null)
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions()
  const [currentAudio, setCurrentAudio] = useState(null)
  const [currentTrack, setCurrentTrack] = useState(null)

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // fetch music on initial page load
  useEffect(() => {
    const fetchAudios = async () => {
      if(permissionResponse.status !== 'granted') {
        try {
          await requestPermission();
        } catch (error) {
          console.log('unable to request permission', error)
        }
      }
  
      try {
        const fetchedAudio = await MediaLibrary.getAssetsAsync({
          mediaType: 'audio',
          first: 9999999999,
        })
        
        setAudioList(fetchedAudio.assets.sort((a, b) => a.filename.localeCompare(b.filename)))
      } catch (error) {
        console.log('error fetching audios', error)
      }
    };
  
    fetchAudios();
  }, [permissionResponse])

  // Play sound
  async function playAudio(audio){
    setCurrentTrack(audio)

    const sound = new Audio.Sound()

    try {
      await sound.loadAsync({
        uri: audio.uri,
      })

      setCurrentAudio(sound)

      const { durationMillis } = await sound.getStatusAsync()
      setDuration(durationMillis)

      await sound.playAsync()

      setIsPlaying(true)
    } catch (error) {
      console.log('error', error)
    }
  }
  // cleanup the sound from memory
  useEffect(() => {
    return currentAudio ?
    () => {
      console.log('Unloading')
      currentAudio.unloadAsync()
    } :
    undefined
  }, [currentAudio])

  const handleSliderChange = (value) => {
    if (!currentAudio) return;

    setPosition(value);
    currentAudio.setPositionAsync(value);
  };

  // Adjust slider position
  useEffect(() => {
    const interval = setInterval(async () => {
      if(currentAudio){
        const { positionMillis } = await currentAudio.getStatusAsync()
        setPosition(positionMillis)
      }
    }, 1000)

    return () => clearInterval(interval);

  }, [currentAudio, isPlaying])

  // Handle audio controls
  const handleAudioControls = async ({ action }) => {
    // Play/pause
    if(action === 'play'){
      const { isPlaying: isCurrentAudioPlaying } = await currentAudio.getStatusAsync()
      if(isCurrentAudioPlaying){
        await currentAudio.pauseAsync()
        setIsPaused(true)
      } else {
        await currentAudio.playAsync()
        setIsPaused(false)
      }
    }

    if(action === 'next'){
      // Stop current track
      await currentAudio.stopAsync()

      // Play next track
      // Check the index of the current song in the audio list array
      let currentPosition = audioList.indexOf(currentTrack)
      
      // Retrieve next song from array and play it
      playAudio(audioList[currentPosition+1])
    }

    if(action === 'previous'){
      // Stop current track
      await currentAudio.stopAsync()

      // Play previous track
      // Check the index of the current song in the audio list array
      let currentPosition = audioList.indexOf(currentTrack)
      
      // Retrieve previous song from array and play it
      playAudio(audioList[currentPosition-1])
    }

  } 

  // Format duration
  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.round(seconds) % 60;
    
    return `${hours > 0 ? hours.toString().padStart(2, '0') + ':' : ''}${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

  // Component for each item
  const renderItem = ({ item: audio, index }) => (
    <TouchableOpacity 
      // className={audio.uri === currentTrack && currentTrack.uri && 'bg-black text-white font-semibold'}
      className={currentTrack && audio.uri === currentTrack.uri ? 'bg-[#c7c1f0] mx-4 my-2 p-2 rounded-lg' : 'bg-white mx-4 my-2 p-2 rounded-lg'}
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
        audioList ? 
        (
          <>
            <FlatList 
              data={audioList}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              className='flex-1 bg-gray-100'
            />

            {
              currentTrack &&
              <View className='px-3 pt-3 bg-[#7539FE] rounded-t-2xl'>
                <View className='flex-row items-center justify-between'>
                  <View className='flex-row w-1/2 gap-2 items-center'>
                    <View className='h-12 w-12 bg-gray-100 rounded-full items-center justify-center'>
                      <Text className='text-2xl font-semibold'>{currentTrack.filename.split('')[0]}</Text>
                    </View>

                    <View>
                      <Text className='font-semibold text-white text-sm'>
                        {
                          currentTrack.filename.length > 15 ?
                          currentTrack.filename.slice(0, 15) + '...' :
                          currentTrack.filename
                        }
                      </Text>
                      <Text className='text-gray-200 text-xs'>{formatDuration(currentTrack.duration)}</Text>
                    </View>
                  </View>

                  <View className='flex-row items-center w-1/2 justify-around'>
                    <TouchableOpacity onPress={() => handleAudioControls({ action: 'previous' })}>
                      <Entypo name="controller-jump-to-start" size={24} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleAudioControls({ action: 'play' })}>
                      { isPaused ?
                        <Entypo name="controller-play" size={24} color="white" /> :
                        <Entypo name="controller-paus" size={24} color="white" />
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
