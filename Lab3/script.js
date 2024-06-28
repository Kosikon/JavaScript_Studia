let tracks = [];
let isRecording = false;
let currentTrackIndex = -1;
let startTime = 0;
let loopTimeout;

document.querySelectorAll('.drum-key').forEach(key => {
    key.addEventListener('click', () => {
        const audio = new Audio(key.dataset.sound);
        audio.play();
        if (isRecording && currentTrackIndex !== -1) {
            recordSound(key.dataset.sound);
        }
    });
});

document.getElementById('record').addEventListener('click', () => {
    if (currentTrackIndex === -1) {
        alert("Select a track first!");
        return;
    }
    isRecording = true;
    startTime = Date.now();
    tracks[currentTrackIndex] = []; // Clear the current track if re-recording
    console.log("Recording started on track " + (currentTrackIndex + 1));
});

document.getElementById('stop').addEventListener('click', () => {
    if (isRecording) {
        isRecording = false;
        console.log("Recording stopped.");
    }
});

document.getElementById('play').addEventListener('click', () => {
    if (tracks.length === 0) {
        alert("No tracks to play!");
        return;
    }
    playAllLooped();
});

document.getElementById('add-track').addEventListener('click', () => {
    tracks.push([]);
    currentTrackIndex = tracks.length - 1;
    console.log("Track added. Total tracks: " + tracks.length);
});

document.getElementById('remove-track').addEventListener('click', () => {
    if (tracks.length > 0) {
        tracks.pop();
        currentTrackIndex = tracks.length - 1;
        console.log("Track removed. Total tracks: " + tracks.length);
    }
    if (tracks.length === 0) {
        currentTrackIndex = -1; // No tracks left
    }
});

function recordSound(sound) {
    const timeElapsed = Date.now() - startTime;
    tracks[currentTrackIndex].push({ sound, time: timeElapsed });
}

function playAllLooped() {
    clearInterval(loopTimeout);
    const trackLength = parseInt(document.getElementById('track-length').value);
    if (isNaN(trackLength) || trackLength <= 0) {
        alert("Invalid track length!");
        return;
    }
    loopTimeout = setInterval(() => {
        tracks.forEach(track => {
            track.forEach(note => {
                setTimeout(() => {
                    const audio = new Audio(note.sound);
                    audio.play();
                }, note.time);
            });
        });
    }, trackLength);
}
