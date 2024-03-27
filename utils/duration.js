  // Format audio duration to hh:mm:ss
  export function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.round(seconds) % 60;
    
    return `${hours > 0 ? hours.toString().padStart(2, '0') + ':' : ''}${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}