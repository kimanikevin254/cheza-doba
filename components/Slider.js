import Slider from '@react-native-community/slider';
import { useSelector, useDispatch } from 'react-redux'
import { setPosition } from '../redux/audioPlayer/audioPlayerSlice';

export default function SliderControl(){
    const dispatch = useDispatch()

    const { duration, position, currentAudio } = useSelector((state) => state.audioPlayer)
    
    // Handle slider interactions
    const handleSliderChange = (value) => {
        if (!currentAudio) return;
        // Adjust slider position
        dispatch(setPosition(value));

        // Adjust the position of the current audio
        currentAudio.setPositionAsync(value);
    };

    return (
        <Slider 
            style={{ height: 50 }}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            onSlidingComplete={handleSliderChange}
            disabled={!currentAudio}
        />
    )
}