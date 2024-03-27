import { Audio } from 'expo-av'


// Play audio
export async function playAudio(audio, setCurrentAudio, setCurrentAudioFile, setDuration, setIsPlaying, currentAudio, setPosition){
  setCurrentAudioFile(audio)

  const sound = new Audio.Sound()

  try {
    await sound.loadAsync({
      uri: audio.uri,
    })

    setCurrentAudio(sound)

    // Get the duration  of the audio file in seconds
    const { durationMillis } = await sound.getStatusAsync()
    setDuration(durationMillis)

    await sound.playAsync()

    setIsPlaying(true)
  } catch (error) {
    console.log('error', error)

    // Stop the playing audio
    currentAudio.unloadAsync()
    // setCurrentAudio(null)
    setIsPlaying(false)
    setDuration(0)
    setPosition(0)
  }
}

// Handle audio controls
export const handleAudioControls = async ({ action, currentAudio, setIsPlaying, audioFiles, currentAudioFile, setCurrentAudio, setCurrentAudioFile, setDuration, setPosition }) => {
    // Play/pause
    if(action === 'play'){
      const { isPlaying: isCurrentAudioPlaying } = await currentAudio.getStatusAsync()
      if(isCurrentAudioPlaying){
        await currentAudio.pauseAsync()
        setIsPlaying(false)
      } else {
        console.log('play ')
        await currentAudio.playAsync()
        setIsPlaying(true)
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
        playAudio(audioFiles[currentPosition+1], setCurrentAudio, setCurrentAudioFile, setDuration, setIsPlaying, currentAudio, setPosition)
      } else {
        // Play the next audio in the list
        playAudio(audioFiles[currentPosition+1], setCurrentAudio, setCurrentAudioFile, setDuration, setIsPlaying, currentAudio, setPosition)
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
        playAudio(audioFiles[currentPosition+1], setCurrentAudio, setCurrentAudioFile, setDuration, setIsPlaying, currentAudio, setPosition)
      } else {
        // Play the previous audio
        playAudio(audioFiles[currentPosition+1], setCurrentAudio, setCurrentAudioFile, setDuration, setIsPlaying, currentAudio, setPosition)
      }      
    }
  } 