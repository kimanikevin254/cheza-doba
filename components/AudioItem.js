import { Text, TouchableOpacity, View } from "react-native";
import { useSelector, useDispatch } from 'react-redux'
import { setCurrentAudio, setCurrentAudioFile, setDuration, setIsPlaying } from "../redux/audioPlayer/audioPlayerSlice";
import { Audio } from 'expo-av'
import { formatDuration } from "../utils/duration";

// Component for each item
export const AudioItem = ({ item: audio }) => {
  const dispatch = useDispatch()

  const { currentAudioFile, currentAudio } = useSelector((state) => state.audioPlayer)
  
  const playAudio = async (audio) => {
    dispatch(setCurrentAudioFile(audio))
    const sound = new Audio.Sound()

    try {
      await sound.loadAsync({
        uri: audio.uri,
      })

      dispatch(setCurrentAudio(sound))

      // Get the duration  of the audio file in seconds
      const { durationMillis } = await sound.getStatusAsync()
      dispatch(setDuration(durationMillis))

      await sound.playAsync()

      dispatch(setIsPlaying(true))
    } catch (error) {
      console.log('error', error)

      // Stop the playing audio
      currentAudio.unloadAsync()
      // setCurrentAudio(null)
      dispatch(setIsPlaying(false))
      dispatch(setDuration(0))
      dispatch(setPosition(0))
    }
  }
  return (
    <TouchableOpacity 
        className={
          currentAudioFile && audio.uri === currentAudioFile.uri ? 
            'bg-[#c7c1f0] mx-4 my-2 p-2 rounded-lg' : 
            'bg-white mx-4 my-2 p-2 rounded-lg'
        }
        onPress={() => playAudio(audio)}
        activeOpacity={0.8}
      >
        <View className='flex-row gap-4 items-center'>
          <View className='h-12 w-12 bg-gray-100 rounded-full items-center justify-center'>
            <Text className='text-2xl font-semibold'>{audio.filename.split('')[0].toUpperCase()}</Text>
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
};