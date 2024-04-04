import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Entypo } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux'
import { setPlaylists, setShowAddToPlaylistModal, setShowCreateNewPlaylistModal } from "../redux/audioPlayer/audioPlayerSlice";
import { FlashList } from "@shopify/flash-list";
import ExistingPlaylistItem from "./ExistingPlaylistItem";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddToPlaylistModal() {
  const dispatch = useDispatch()

  const { playlists } = useSelector(state => state.audioPlayer)

  // fxn to fetch all playlists
  const fetchAllPlaylists = async () => {
    try {
        const myPlaylists = await AsyncStorage.getItem('playlists')

        if(myPlaylists !== null){
            // update store
            let myPlaylistsJson = JSON.parse(myPlaylists)
            dispatch(setPlaylists(myPlaylistsJson.playlists))
        } else {
          dispatch(setPlaylists([]))
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

  const handleCreateNewPlaylist = () => {
    dispatch(setShowAddToPlaylistModal())
    dispatch(setShowCreateNewPlaylistModal())
  }

  return (
    <Modal
      transparent={true}
      animationType="slide"
      onRequestClose={() => dispatch(setShowAddToPlaylistModal())}
    >
      {/* Modal overlay */}
      <TouchableWithoutFeedback onPress={() => dispatch(setShowAddToPlaylistModal())}>
        <View className='absolute top-0 bottom-0 left-0 right-0 bg-gray-100 opacity-50' />
      </TouchableWithoutFeedback>

      <View className='z-50 bg-[#7539FE] absolute bottom-0 w-full p-6 rounded-t-2xl'>
          <Text className='text-white text-xl font-semibold'>Add to playlist</Text>
          
          <TouchableOpacity
              className='flex-row gap-2 items-center mt-4'
              onPress={() => handleCreateNewPlaylist()}
          >
              <View className='bg-white p-1 rounded'>
                  <Entypo name="plus" size={24} color="#7539FE" />
              </View>
              <Text className='text-white text-lg font-semibold'>Create new playlist</Text>
          </TouchableOpacity>

          <View className='mt-4'>
            {
              playlists === null ?
              // Loading message
              <Text className='text-gray-200'>Loading playlists</Text> :

              (
                playlists.length === 0 ?

                <Text className='text-gray-200'>No playlists available</Text> :
                
                <FlashList
                  data={playlists}
                  renderItem={({ item }) => <ExistingPlaylistItem 
                    item={item} 
                  /> }
                  estimatedItemSize={10}
                />
              )
            }
          </View>
      </View>
    </Modal>
  )
}
