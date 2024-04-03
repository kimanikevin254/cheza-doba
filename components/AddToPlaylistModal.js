import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Entypo } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux'
import { setShowAddToPlaylistModal } from "../redux/audioPlayer/audioPlayerSlice";

export default function AddToPlaylistModal() {
  const dispatch = useDispatch()

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
          >
              <View className='bg-white p-1 rounded'>
                  <Entypo name="plus" size={24} color="#7539FE" />
              </View>
              <Text className='text-white text-lg font-semibold'>Create new playlist</Text>
          </TouchableOpacity>
      </View>
    </Modal>
  )
}
