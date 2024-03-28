import { SafeAreaView, Text, View } from "react-native";
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons';
import AudioControls from "../components/Controls";
import SliderControl from "../components/Slider";

export default function Player(){
    const { audioFiles, currentAudioFile } = useSelector((state) => state.audioPlayer)

    // Check the index of the current song in the audio list array
    let currentPosition = audioFiles.indexOf(currentAudioFile) + 1

    return (
        <SafeAreaView className='py-8 px-4 flex-1 bg-white'>
            <View className='flex-1 justify-between'>
                {/* No of the current audio */}
                <Text className='text-right'>{currentPosition} / {audioFiles.length}</Text>

                <View className='h-64 w-64 mx-auto rounded-full items-center justify-center bg-gray-400'>
                    {/* Audio Icon */}
                    <FontAwesome name="music" size={100} color="white" />
                </View>

                <View>
                    {/* Audio info */}
                    <Text className='text-center font-semibold text-lg'>
                        {
                            currentAudioFile.filename.length > 30 ?
                            currentAudioFile.filename.slice(0, 30) + '...' :
                            currentAudioFile.filename
                        }
                    </Text>
                    <SliderControl screen='Player' />
                    {/* Controls */}
                    <AudioControls screen='Player' />
                </View>
            </View>
        </SafeAreaView>
    )
}