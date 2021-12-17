/*  WitzLibs - AudioService
    Audio APIs ported from my TypeScript projects to JavaScript
    For use with vanilla HTML5 games powered by JS

    (C) 2021-2022 John Vincent M. Corcega - TenSeventy7
*/

let sounds = [];
let sfxPlayer = new Audio();
let bgmPlayer = new Audio();

// Preload SFX to memory
function preloadSfx(key, asset) {
    sounds.push({
        key: key,
        asset: asset,
    });
}

// Preload BGM to memory - to save memory, ONLY preload one BGM at a time
function preloadBgm(key, asset) {
    sounds.push({
        key: key,
        asset: asset,
    });

    bgmPlayer.src = asset;
    bgmPlayer.loop = true;
    bgmPlayer.volume = 0.8;
}

// Stop BGM and unload from memory
function unloadBgm(key) {
    let bgmAudio = this.sounds.find((sound) => {
        return sound.key === key;
    });

    bgmPlayer.src = bgmAudio.asset;
    bgmPlayer.loop = true;
    sounds.pop(key);
}

// Play or pause the BGM player if BGM state is true
function playBgm(bool) {
    if (getBgmState() && bool) {
        bgmPlayer.play();
    } else {
        bgmPlayer.pause();
    }
}

// Set volume of the BGM
function setBgmVolume(volume) {
    bgmPlayer.volume = volume;
}

// Play an SFX
function playSfx(key) {
    let sfxAudio = this.sounds.find((sound) => {
        return sound.key === key;
    });

    sfxPlayer.src = sfxAudio.asset;
    sfxPlayer.play();
}

// Set state of BGM on/off
function setBgmState(state) {
    setGameData("game_music", state);
}

// Set state of SFX on/off
function setSfxState(state) {
    setGameData("game_audio", state);
}

// Get on/off state of BGM
function getBgmState() {
    return getGameData("game_music");
}

// Get on/off state of SFX
function getSfxState() {
    return getGameData("game_audio");
}

// Ask the browser if it supports HTML Audio
function isAudioSupported() {
    // https://stackoverflow.com/questions/30151794/how-to-check-if-new-audio-is-supported-by-browser
    return (typeof window.Audio !== "undefined");
}
