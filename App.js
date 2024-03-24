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

  // Component for each item
  const renderItem = ({ item: audio, index }) => (
    <TouchableOpacity 
      className={audio.uri === currentTrack.uri && 'bg-black text-white font-semibold'}
      onPress={() => playAudio(audio)}
    >
      <Text 
        className={audio.uri === currentTrack.uri ? 'bg-black text-white font-semibold px-4 py-2 border-b' : 'px-4 py-2 border-b'}
      >
        {index + 1}. {audio.filename}
      </Text>
    </TouchableOpacity>
  )

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

  useEffect(() => {
    console.log(position)
  }, [position])

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
  return (
    <SafeAreaView className='pt-8 flex-1'>
      {
        audioList ? 
        (
          <>
            <FlatList 
              data={audioList}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              className='flex-1'
            />

            {
              currentAudio &&
              <View className='pb-4'>
                <Slider 
                  style={{ height: 50 }}
                  minimumValue={0}
                  maximumValue={duration}
                  value={position}
                  onSlidingComplete={handleSliderChange}
                  disabled={!currentAudio}
                />
                <View className='flex-row justify-around'>
                  <TouchableOpacity onPress={() => handleAudioControls({ action: 'previous' })}>
                    <Entypo name="controller-jump-to-start" size={24} color="black" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleAudioControls({ action: 'play' })}>
                    { isPaused ?
                      <Entypo name="controller-play" size={24} color="black" /> :
                      <Entypo name="controller-paus" size={24} color="black" />
                    }
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleAudioControls({ action: 'next' })}>
                    <Entypo name="controller-next" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            }
          </>
        ) :
        <Text>Loading music...</Text>
      }
    </SafeAreaView>
  );
}
