import { useSelector, useDispatch } from 'react-redux'
import { setCurrentAudio, setCurrentAudioFile, setDuration, setIsPlaying, setPosition } from '../redux/audioPlayer/audioPlayerSlice'
import { TouchableOpacity, View } from 'react-native'
import { Entypo } from '@expo/vector-icons';
import { Audio } from 'expo-av'

export default function AudioControls(){
    const dispatch = useDispatch()

    const { currentAudio, audioFiles, currentAudioFile, isPlaying } = useSelector((state) => state.audioPlayer)

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
    
    const handleAudioControls = async ({ action }) => {
        // Play/pause
        if(action === 'play'){
          const { isPlaying: isCurrentAudioPlaying } = await currentAudio.getStatusAsync()
          if(isCurrentAudioPlaying){
            await currentAudio.pauseAsync()
            dispatch(setIsPlaying(false))
          } else {
            await currentAudio.playAsync()
            dispatch(setIsPlaying(true))
          }
        }
    
        if(action === 'next'){
          // Stop current track
          await currentAudio.stopAsync()
    
          // Play next track
          // Check the index of the current song in the audio list array
          let currentPosition = audioFiles.indexOf(currentAudioFile)
    
          // Check if the current audio is the last in the list
          if(currentPosition ===  audioFiles.length - 1){
            // If it's the last one, play the first song
            playAudio(audioFiles[0])
          } else {
            // Play the next audio in the list
            playAudio(audioFiles[currentPosition+1])
          }
        }
    
        if(action === 'previous'){
          // Stop current track
          await currentAudio.stopAsync()
    
          // Play previous track
          // Check the index of the current song in the audio list array
          let currentPosition = audioFiles.indexOf(currentAudioFile)
    
          // Check if the current audio is the first in the list
          if (currentPosition === 0 ){
            // If it's the first one, play the last audio
            playAudio(audioFiles[audioFiles.length-1])
          } else {
            // Play the previous audio
            playAudio(audioFiles[currentPosition-1])
          }      
        }
      } 
    return (
        <View className='flex-row items-center w-1/2 justify-around'>
            <TouchableOpacity 
            onPress={() => handleAudioControls({ action: 'previous', currentAudio, setIsPlaying, audioFiles, currentAudioFile, setDuration, setPosition })}
            >
            <Entypo name="controller-jump-to-start" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity 
            onPress={() => handleAudioControls({ action: 'play', currentAudio, setIsPlaying, audioFiles, currentAudioFile })}
            >
            { isPlaying ?
                <Entypo name="controller-paus" size={24} color="white" /> :
                <Entypo name="controller-play" size={24} color="white" />
            }
            </TouchableOpacity>

            <TouchableOpacity 
            onPress={() => handleAudioControls({ action: 'next', currentAudio, setIsPlaying, audioFiles, currentAudioFile, setDuration, setPosition })}
            >
            <Entypo name="controller-next" size={24} color="white" />
            </TouchableOpacity>
        </View>
    )
}