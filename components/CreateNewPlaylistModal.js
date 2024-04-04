import { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useSelector, useDispatch } from 'react-redux'
import { setShowCreateNewPlaylistModal } from "../redux/audioPlayer/audioPlayerSlice";
import { createNewPlaylistAndAddAudio } from "../utils/playlists";

export default function CreateNewPlaylistModal(){
    const [playlistName, onChangePLaylistName] = useState('')

    const { selectedAudio } = useSelector(state => state.audioPlayer)

    const handleCreateNewPlaylistAndAddAudio = async () => {
        await createNewPlaylistAndAddAudio(playlistName, selectedAudio)
    }

    const dispatch = useDispatch()
    return (
        <Modal
            transparent={true}
            animationType="slide"
            onRequestClose={() => dispatch(setShowCreateNewPlaylistModal())}
        >
        {/* Modal overlay */}
        <TouchableWithoutFeedback 
            onPress={() => dispatch(setShowCreateNewPlaylistModal())}
        >
            <View className='absolute top-0 bottom-0 left-0 right-0 bg-gray-100 opacity-50' />
        </TouchableWithoutFeedback>

        <View className='z-50 bg-[#7539FE] absolute bottom-0 w-full p-6 rounded-t-2xl space-y-3'>
            <Text className='text-white text-xl font-semibold'>Create new Playlist</Text>

            <TextInput 
                value={playlistName}
                onChangeText={onChangePLaylistName}
                placeholder="Playlist name"
                className='bg-white px-4 py-2 rounded'
            />

            <View className='flex-row justify-around'>
                <TouchableOpacity 
                    className='px-6 py-2 rounded bg-gray-200'
                    onPress={() => dispatch(setShowCreateNewPlaylistModal())}
                >
                    <Text>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    className='px-6 py-1 rounded border border-white'
                    onPress={() => handleCreateNewPlaylistAndAddAudio()}
                >
                    <Text className='text-white font-semibold text-lg'>Create</Text>
                </TouchableOpacity>
            </View>
        </View>
        </Modal>
    )
}