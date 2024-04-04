import { Text, TouchableOpacity, View } from "react-native";
import { playlistDuration } from "../utils/playlists";
import { useNavigation } from '@react-navigation/native';

export default function PlaylistItem({ item: playlist }) {

  const navigation = useNavigation()
  return (
    <TouchableOpacity 
      className='bg-white mx-4 my-2 p-2 rounded-lg'
      onPress={() => navigation.navigate('PlaylistScreen', {
        playlistName: playlist.name,
        audioFiles: playlist.audioFiles
      })}
      activeOpacity={0.8}
    >
        <View className='flex-row gap-3 items-center'>
          <View className='h-12 w-12 bg-gray-100 rounded-full items-center justify-center'>
            <Text className='text-2xl font-semibold'>{playlist.name.split('')[0].toUpperCase()}</Text>
          </View>

          <View>
            <Text className='font-semibold text-lg'>{playlist.name}</Text>
            <Text className='text-gray-500'>{playlist.audioFiles.length} audios • {playlistDuration(playlist)}</Text>
          </View>
        </View>
    </TouchableOpacity>
  )
}

