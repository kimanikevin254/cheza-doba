import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function ExistingPlaylistItem({ item: playlist }) {

    return (
        <TouchableOpacity
            onPress={() => console.log('add to this playlist')}
            className='px-4 py-1 border border-white my-1 rounded'
        >
            <Text className='font-semibold text-lg text-white'> {playlist.name} </Text>
        </TouchableOpacity>
    );
}