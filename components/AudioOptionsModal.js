import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { useSelector, useDispatch } from 'react-redux'
import { formatDuration } from "../utils/duration";
import { MaterialIcons } from '@expo/vector-icons';
import { setShowAddToPlaylistModal, setShowAudioOptionsModal } from "../redux/audioPlayer/audioPlayerSlice";

export default function AudioOptionsModal() {
    const { selectedAudio } = useSelector((state) => state.audioPlayer)

    const dispatch = useDispatch()

    const handleAddToPlaylist = () => {
        dispatch(setShowAudioOptionsModal())
        dispatch(setShowAddToPlaylistModal())
    }
  return (
    <Modal transparent={true} animationType="slide" onRequestClose={() => dispatch(setShowAudioOptionsModal())}>
      <TouchableWithoutFeedback onPress={() => dispatch(setShowAudioOptionsModal())}>
        {/* Modal overlay */}
        <View className='absolute top-0 bottom-0 left-0 right-0 bg-gray-100 opacity-50' />
      </TouchableWithoutFeedback>
      <View className='z-50 bg-[#7539FE] absolute bottom-0 w-full p-6 rounded-t-2xl'>
          {/* Audio details */}
          <View className='flex-row gap-4 items-center'>
              <View className='h-12 w-12 bg-gray-100 rounded-full items-center justify-center'>
                <Text className='text-2xl font-semibold'>{selectedAudio.filename.split('')[0].toUpperCase()}</Text>
              </View>
              
              <View>
                <Text className='font-semibold text-white'>
                  {
                    selectedAudio.filename.length > 27 ?
                    selectedAudio.filename.slice(0, 27) + '...' :
                    selectedAudio.filename
                  }
                </Text>
                <Text className='text-gray-200 text-sm'>{formatDuration(selectedAudio.duration)}</Text>
              </View>
          </View>

          <View className='border-b border-gray-300 my-4' />

          <TouchableOpacity
              className='flex-row gap-2 items-center'
              onPress={() => handleAddToPlaylist()}
          >
              <View className='bg-white p-1 rounded'>
                  <MaterialIcons name="playlist-add" size={24} color="#7539FE" />
              </View>
              <Text className='text-white text-lg font-semibold'>Add to playlist</Text>
          </TouchableOpacity>
      </View>
    </Modal>
  )
}
