/*  WitzLibs - GameStorageService
    Storage APIs ported from my TypeScript projects to JavaScript
    For use with vanilla HTML5 games powered by JS

    (C) 2021-2022 John Vincent M. Corcega - TenSeventy7
*/

const storage = window.localStorage;

export default class GameStorageService {
    // Save game data to localStorage
    setGameData(key, value) {
        const encodedKey = btoa(key);
        const encodedData = btoa(JSON.stringify(value));
        storage.setItem(encodedKey, encodedData);
    }
    
    // Get game data from localStorage
    getGameData(key) {
        const encodedKey = btoa(key);
        const item = storage.getItem(encodedKey);
      
        if (item !== null) {
            const decryptedData = atob(item);
            return JSON.parse(decryptedData);
        } else {
            return null;
        }
    }
    
    // Delete given game data from localStorage
    deleteGameData(key) {
        storage.removeItem(key);
    }
}
