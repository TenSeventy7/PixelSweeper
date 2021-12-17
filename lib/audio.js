/*  WitzLibs - AudioService
    Audio APIs ported from my TypeScript projects to JavaScript
    For use with vanilla HTML5 games powered by JS

    (C) 2021-2022 John Vincent M. Corcega - TenSeventy7
*/

// Import GameStorageService - for setting and retrieving audio states
import GameStorageService from '/lib/gamestorage.js';
const gameStorageService = new GameStorageService();

let sounds = [];
const sfxPlayer = new Audio();
const bgmPlayer = new Audio();

export default class AudioService {
    // Preload SFX to memory
    preloadSfx(key, asset) {
        sounds.push({
            key: key,
            asset: asset,
        });
    }

    // Preload BGM to memory - to save memory, ONLY preload one BGM at a time
    preloadBgm(key, asset) {
        sounds.push({
            key: key,
            asset: asset,
        });

        bgmPlayer.src = asset;
        bgmPlayer.loop = true;
        bgmPlayer.volume = 0.8;
    }

    // Stop BGM and unload from memory
    unloadBgm(key) {
        let bgmAudio = this.sounds.find((sound) => {
            return sound.key === key;
        });

        bgmPlayer.src = bgmAudio.asset;
        bgmPlayer.loop = true;
        this.sounds.pop(key);
    }

    // Play or pause the BGM player
    playBgm(bool) {
        if (this.getBgmState() && bool) {
            bgmPlayer.play();
        } else {
            bgmPlayer.pause();
        }
    }

    // Set volume of the BGM
    setBgmVolume(volume) {
        bgmPlayer.volume = volume;
    }

    // Play an SFX
    playSfx(key) {
        let sfxAudio = this.sounds.find((sound) => {
            return sound.key === key;
        });

        sfxPlayer.src = sfxAudio.asset;
        sfxPlayer.play();
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
        return gameStorageService.getGameData("audio/game_music");
    }

    // Get on/off state of SFX
    getSfxState() {
        return gameStorageService.getGameData("audio/game_audio");
    }

    // Ask the browser if it supports HTML Audio
    isAudioSupported() {
        // https://stackoverflow.com/questions/30151794/how-to-check-if-new-audio-is-supported-by-browser
        return (typeof window.Audio !== "undefined");
    }
}
