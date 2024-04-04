import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    audioFiles: null,   //  The list of audio files.
    currentAudioFile: null, // The audio file that is playing
    currentAudio: null, // Audio.Sound instance of the audio file that is playing
    duration: 0, // Duration of the current audio file in seconds
    position: 0, // Track the position of the current audio file => For the slider
    isPlaying: false, // Is the current audio
    selectedAudio: null,
    showAudioOptionsModal: false,
    showAddToPlayListModal: false,
    showCreateNewPlayListModal: false,

    playlists: null,
}

export const counterSlice = createSlice({
    name: 'audioPlayer',
    initialState,
    reducers: {
      setAudioFiles: (state, action) => {
        state.audioFiles = action.payload
      }, 
      setCurrentAudioFile: (state, action) => {
        state.currentAudioFile = action.payload
      },
      setCurrentAudio: (state, action) => {
        state.currentAudio = action.payload
      },
      setDuration: (state, action) => {
        state.duration = action.payload
      },
      setPosition: (state, action) => {
        state.position = action.payload
      },
      setIsPlaying: (state, action) => {
        state.isPlaying = action.payload
      },
      setSelectedAudio: (state, action) => {
        state.selectedAudio = action.payload
      },
      setShowAudioOptionsModal: (state) => {
        state.showAudioOptionsModal = !state.showAudioOptionsModal
      },
      setShowAddToPlaylistModal: (state) => {
        state.showAddToPlayListModal = !state.showAddToPlayListModal
      },
      setShowCreateNewPlaylistModal: (state) => {
        state.showCreateNewPlayListModal = !state.showCreateNewPlayListModal
      },
      setPlaylists: (state, action) => {
        state.playlists = action.payload
      },
      // createNewPlaylistAndAddAudio: (action) => {
        
      // },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { setAudioFiles, setCurrentAudioFile, setCurrentAudio, setDuration, setPosition, setIsPlaying, setSelectedAudio, setShowAudioOptionsModal,
    setShowAddToPlaylistModal, setShowCreateNewPlaylistModal, setPlaylists
  } = counterSlice.actions
  
  export default counterSlice.reducer