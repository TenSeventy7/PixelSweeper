/*  WitzLibs - GameStorageService
    Storage APIs ported from my TypeScript projects to JavaScript
    For use with vanilla HTML5 games powered by JS

    (C) 2021-2022 John Vincent M. Corcega - TenSeventy7
*/

export default class GameStorageService {
    storage = window.localStorage;

    // Save game data to localStorage
    setGameData(key, value) {
        const encodedKey = btoa(key);
        const encodedData = btoa(JSON.stringify(value));
        this.storage.setItem(encodedKey, encodedData);
    }
    
    // Get game data from localStorage
    getGameData(key) {
        const encodedKey = btoa(key);
        const item = this.storage.getItem(encodedKey);
      
        if (item.value !== null) {
            const decryptedData = atob(item);
            return JSON.parse(decryptedData);
        } else {
            return null;
        }
    }
    
    // Delete given game data from localStorage
    deleteGameData(key) {
        this.storage.removeItem(key);
    }
}
