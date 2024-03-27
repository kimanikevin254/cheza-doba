import { configureStore } from '@reduxjs/toolkit'
import audioPlayerReducer from './audioPlayer/audioPlayerSlice'

export const store = configureStore({
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: ['audioPlayer.currentAudio'],
                ignoredActionPaths: ['payload']
            }
        }),
    reducer: {
        audioPlayer: audioPlayerReducer,
    }
})