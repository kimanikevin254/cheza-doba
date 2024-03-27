import { Text, TouchableOpacity, View } from "react-native";
import { playAudio } from "../utils/audio";

// Component for each item
export const AudioItem = ({ item: audio, currentAudioFile, setCurrentAudioFile, currentAudio, setCurrentAudio, formatDuration, setDuration, setIsPlaying, setPosition }) => (
    <TouchableOpacity 
        className={
          currentAudioFile && audio.uri === currentAudioFile.uri ? 
            'bg-[#c7c1f0] mx-4 my-2 p-2 rounded-lg' : 
            'bg-white mx-4 my-2 p-2 rounded-lg'
        }
        onPress={() => playAudio(audio, setCurrentAudio, setCurrentAudioFile, setDuration, setIsPlaying, currentAudio, setPosition)}
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
  );