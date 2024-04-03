import { Text, TouchableOpacity, View } from "react-native";
import AudioControls from "./Controls";
import SliderControl from "./Slider";

import { useSelector } from 'react-redux'
import { formatDuration } from "../utils/duration";
import { useNavigation } from '@react-navigation/native';

export default function MiniPlayer(){
    const { currentAudioFile } = useSelector((state) => state.audioPlayer)

    const navigation = useNavigation()
    return (
        <TouchableOpacity 
            onPress={() => navigation.navigate('Player')}
            activeOpacity={0.8}
            className='px-3 pt-3 bg-[#7539FE] rounded-t-2xl'
        >
            <View className='flex-row items-center justify-between'>
            <View className='flex-row w-1/2 gap-2 items-center'>
                <View className='h-12 w-12 bg-gray-100 rounded-full items-center justify-center'>
                <Text className='text-2xl font-semibold'>{currentAudioFile.filename.split('')[0]}</Text>
                </View>

                <View>
                <Text className='font-semibold text-white text-sm'>
                    {
                    currentAudioFile.filename.length > 15 ?
                    currentAudioFile.filename.slice(0, 15) + '...' :
                    currentAudioFile.filename
                    }
                </Text>
                <Text className='text-gray-200 text-xs'>{formatDuration(currentAudioFile.duration)}</Text>
                </View>
            </View>

            <AudioControls />
            </View>

            <SliderControl />
        </TouchableOpacity>
    )
}