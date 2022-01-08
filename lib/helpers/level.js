/*  Pixel Sweeper - LevelDataHelper
    APIs to preload, query, and modfiy level data within the game
    For use with vanilla HTML5 games powered by JS

    (C) 2021-2022 John Vincent M. Corcega - TenSeventy7
*/

import GameStorageHelper from './gamestorage.js';
const gameStorage = new GameStorageHelper();

let gameLevels = [];
const storageNamespace = 'levelData';

async function getLevelsData() {
    const msg = await new Promise(resolve => {
        setTimeout(() => {
            resolve(gameLevels);
        }, 10);
    });

    return msg;
}


export default class LevelDataHelper {
    // Preload levels data from a given JSON file.
    async preloadLevelsData(url, key) {
        let promise = async function () {
            var httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function () {
                if (httpRequest.readyState !== XMLHttpRequest.DONE) {
                    return
                }

                var response = httpRequest.responseText;
                if (response === null) {
                    console.error("Failed fetching file! " + url);
                    return;
                }

                try {
                    const jsonData = JSON.parse(response)
                    gameLevels.push({
                        key: key,
                        data: jsonData
                    });
                } catch (e) {
                    console.error("Failed fetching file! " + url)
                }
            }

            httpRequest.open("GET", url);
            httpRequest.send();
        };

        promise();
    }

    // Get specific level data
    async getLevelData(key, levelId) {
        let promise = async function () {
            return getLevelsData().then(function (msg) {
                var categoryData = msg.find(lvlData => {
                    return lvlData.key == key;
                });

                try {
                    return categoryData.data[levelId];
                } catch (e) {
                    return null;
                }
            });
        };

        return promise();
    }

    // Get total number of levels.
    async getLevelsCount(key) {
        let promise = async function () {
            return getLevelsData().then(function (msg) {
                var categoryData = msg.find(lvlData => {
                    return lvlData.key == key;
                });

                return categoryData.data.length;
            });
        };

        return promise();
    }

    // Get saved level data
    getSavedLevelData(key, levelId) {
        let defData = {
            bestTime: -1
        }

        let data = gameStorage.getGameData(storageNamespace + '/' + key + '/' + levelId);
        return (data == null) ? defData : data;
    }

    // Save level data
    setSavedLevelData(key, levelId, bestTime, newTime) {
        let data = {
            bestTime: (newTime < bestTime) ? newTime : bestTime
        }

        gameStorage.setGameData(storageNamespace + '/' + key + '/' + levelId, data);
        return (newTime < bestTime);
    }

    // Check if a saved game is present on the level
    isSavedGamePresent(key, levelId) {
        let data = this.getSavedGame(key, levelId);
        return (data == null) ? false : true;
    }

    // Get current game data
    getSavedGame(key, levelId) {
        return gameStorage.getGameData(storageNamespace + '/' + key + '/' + levelId + '/saved');
    }

    // Save current game data
    async setSaveGame(key, levelId, board, html, time, mines) {
        let promise = async function () {
            let data = {
                board: board,
                html: html,
                runTime: time,
                mines: mines
            }

            gameStorage.setGameData(storageNamespace + '/' + key + '/' + levelId + '/saved', data);
        };

        return promise();
    }

    // Clear saved game from level
    clearSaveGame(key, levelId) {
        gameStorage.deleteGameData(storageNamespace + '/' + key + '/' + levelId + '/saved');
    }
}