import { useEffect, useState } from "react";
import { Button, SafeAreaView, ScrollView, View, Text, TouchableOpacity, FlatList } from "react-native";
import * as MediaLibrary from 'expo-media-library'
import { Audio } from'expo-av'

export default function App() {
  const [audioList, setAudioList] = useState(null)
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions()

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
          first: 9999999999
        })

        setAudioList(fetchedAudio.assets)
      } catch (error) {
        console.log('error fetching audios', error)
      }
    };
  
    fetchAudios();
  }, [permissionResponse])

  return (
    <SafeAreaView className='pt-8'>

      {/* <ScrollView > */}
        {
          audioList ? 
          <FlatList 
            data={audioList}
            renderItem={({ item }) => <AudioItem audio={item} />}
            keyExtractor={item => item.id}
          /> :
          <Text>Loading music...</Text>
        }
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}

function AudioItem({ audio }){
  const [currentAudio, setCurrentAudio] = useState(null)

  // Play sound
  async function playAudio(audio){
    const sound = new Audio.Sound()

    try {
      await sound.loadAsync({
        uri: audio.uri,
      })

      setCurrentAudio(sound)

      await sound.playAsync()
    } catch (error) {
      console.log('error', error)
    }
  }
  

  // cleanup the sound from memory
  useEffect(() => {
    currentAudio ? console.log('audio available') : console.log('no audio')

    return currentAudio ?
    () => {
      console.log('Unloading')
      currentAudio.unloadAsync()
    } :
    undefined
    
  }, [currentAudio])

  return (
    <TouchableOpacity 
      className='' 
      onPress={() => playAudio(audio)}
    >
      <Text 
        className='px-4 py-2 border-b'
      >
        {audio.uri.split('/')[audio.uri.split('/').length-1]}
      </Text>
    </TouchableOpacity>
  )
}
