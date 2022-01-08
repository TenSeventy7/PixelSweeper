/*  WitzLibs - AudioHelper
    Audio APIs ported from my TypeScript projects to JavaScript
    For use with vanilla HTML5 games powered by JS

    (C) 2021-2022 John Vincent M. Corcega - TenSeventy7
*/

// Import GameStorageService - for setting and retrieving audio states
import GameStorageHelper from './gamestorage.js';
const gameStorageService = new GameStorageHelper();

let sounds = [];
const bgmPlayer = new Audio();
var currentBgm;

export default class AudioHelper {
    // Preload SFX to memory
    preloadSfx(key, asset) {
        let audio = new Audio();
        audio.src = asset;
        sounds.push({
            key: key,
            audio: audio,
            asset: asset,
        });
    }

    // Preload BGM to memory - to save memory, ONLY preload one BGM at a time
    preloadBgm(asset) {
        currentBgm = asset;
        bgmPlayer.src = asset;
        bgmPlayer.loop = true;
        bgmPlayer.volume = 0.4;
    }

    // Stop BGM and unload from memory
    unloadBgm() {
        bgmPlayer.src = null;
        bgmPlayer.volume = 0.4;
        bgmPlayer.loop = true;
    }

    // Play or pause the BGM player
    playBgm(bool) {
        if (this.getBgmState() && bool) {
            bgmPlayer.play();
        } else {
            bgmPlayer.pause();
        }
    }

    // Stop the BGM player
    stopBgm() {
        bgmPlayer.src = currentBgm;
        bgmPlayer.volume = 0.4;
        bgmPlayer.loop = true;
    }

    // Set volume of the BGM
    setBgmVolume(volume) {
        bgmPlayer.volume = volume;
    }

    // Play an SFX
    playSfx(key) {
        let sfxAudio = sounds.find((sfxAudio) => {
            return sfxAudio.key === key;
        });

        if (this.getSfxState()) sfxAudio.audio.play();
    }

    // Set state of BGM on/off
    setBgmState(state) {
        gameStorageService.setGameData("audio/game_music", state);
    }

    // Set state of SFX on/off
    setSfxState(state) {
        gameStorageService.setGameData("audio/game_audio", state);
    }

    // Get on/off state of BGM
    getBgmState() {
        let data = gameStorageService.getGameData("audio/game_music");
        return (data == null) ? true : data;
    }

    // Get on/off state of SFX
    getSfxState() {
        let data = gameStorageService.getGameData("audio/game_audio");
        return (data == null) ? true : data;
    }

    // Ask the browser if it supports HTML Audio
    isAudioSupported() {
        // https://stackoverflow.com/questions/30151794/how-to-check-if-new-audio-is-supported-by-browser
        return (typeof window.Audio !== "undefined");
    }
}