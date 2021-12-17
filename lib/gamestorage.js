/*  WitzLibs - GameStorageService
    Storage APIs ported from my TypeScript projects to JavaScript
    For use with vanilla HTML5 games powered by JS

    (C) 2021-2022 John Vincent M. Corcega - TenSeventy7
*/  

function setGameData(key, value) {
    const encodedKey = btoa(key);
    const encodedData = btoa(JSON.stringify(value));
    localStorage.setItem(encodedKey, encodedData);
}
  
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
  
function deleteGameData(key) {
    localStorage.removeItem(key);
}
