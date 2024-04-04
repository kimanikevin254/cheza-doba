import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatDuration } from './duration';

export async function createNewPlaylistAndAddAudio(playlistName, currentAudio){
    // Retrieve all playslists
    try {
        let myPlaylists = await AsyncStorage.getItem('playlists')

        if(myPlaylists === null){
            // no playlists exist

            // create new playlist and add audio
            let data = {
                playlists: [
                    {
                        name: playlistName,
                        audioFiles: [
                            {
                                ...currentAudio
                            }
                        ]
                    }
                ]
            }

            await AsyncStorage.setItem('playlists', JSON.stringify(data))
        } else {
            // Playlists exist. Modify the existing values and save

            // Convert the retrieved playlists to an object
            let myPlaylistsJson = JSON.parse(myPlaylists)

            // Check if the passed name matches an existing playlist
            const playlistExists = myPlaylistsJson.playlists.find(playlist => playlist.name === playlistName)

            // Playlist name exists. 
            if(playlistExists){
                console.log('exists', playlistExists)
                // Check if the current audio already exists in the playlist
                const audioExistsInPlaylist = playlistExists.audioFiles.find(audio => audio.uri === currentAudio.uri)

                // Audio exists in playlist
                if(audioExistsInPlaylist){
                    console.log('audio exists in playlist')

                    // Close modal and show message
                } else {
                    // Audio does not exist in playlist
                    // Push the audio to the playlist
                    playlistExists.audioFiles.push(currentAudio)

                    // Save the updated playlists
                    await AsyncStorage.setItem('playlists', JSON.stringify(myPlaylistsJson))
                }
            } else {
                // Playlist name does not exist
                myPlaylistsJson.playlists.push({
                    name: playlistName,
                    audioFiles: [currentAudio]
                })

                // Save the updated playlists
                await AsyncStorage.setItem('playlists', JSON.stringify(myPlaylistsJson))
            }
        }
    } catch (error) {
        console.log(error)
    }
}

// playlists = {
//     playlists: [
//         {
//             name: 'myplaylist',
//             audioFiles: [
//                 {
    
//                 }
//             ]
//         },
//         {
//             name: 'myplaylist1',
//             audioFiles: [
//                 {
    
//                 }
//             ]
//         },
//     ]
// }

export function playlistDuration(playlist){
    let duration = 0

    playlist.audioFiles.map(audioFile => duration += audioFile.duration)

    return formatDuration(duration)
} 