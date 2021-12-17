/*  WitzLibs - GameStorageService
    Storage APIs ported from my TypeScript projects to JavaScript
    For use with vanilla HTML5 games powered by JS

    (C) 2021-2022 John Vincent M. Corcega - TenSeventy7
*/  

// Save game data to localStorage
function setGameData(key, value) {
    const encodedKey = btoa(key);
    const encodedData = btoa(JSON.stringify(value));
    localStorage.setItem(encodedKey, encodedData);
}
  
// Read game data from localStorage
function getGameData(key) {
    const encodedKey = btoa(key);
    const item = localStorage.getItem(encodedKey);
  
    if (item !== null) {
        const decryptedData = atob(item);
        return JSON.parse(decryptedData);
    } else {
        return null;
    }
}

// Delete given game data from localStorage
function deleteGameData(key) {
    localStorage.removeItem(key);
}
