/*  WitzLibs - GameStorageHelper
    Storage APIs ported from my TypeScript projects to JavaScript
    For use with vanilla HTML5 games powered by JS

    (C) 2021-2022 John Vincent M. Corcega - TenSeventy7
*/

const storage = window.localStorage;
import {
    parse,
    stringify
} from '../external/flatted.js';

export default class GameStorageHelper {
    // Save game data to localStorage
    setGameData(key, value) {
        const encodedKey = btoa(key);
        const encodedData = btoa(stringify(value));
        storage.setItem(encodedKey, encodedData);
    }

    // Get game data from localStorage
    getGameData(key) {
        const encodedKey = btoa(key);
        const item = storage.getItem(encodedKey);

        if (item !== null) {
            const decryptedData = atob(item);
            return parse(decryptedData);
        } else {
            return null;
        }
    }

    // Delete given game data from localStorage
    deleteGameData(key) {
        const encodedKey = btoa(key);
        storage.removeItem(encodedKey);
    }

    // Download all game data from localStorage
    downloadGameData() {
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(stringify(localStorage));
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "gameSaveData.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    // Overwrite current game data from a local file
    uploadGameData() {
        var input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = e => {
            var file = e.target.files[0];

            // Read the contents of the file
            var reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            console.log(file);

            reader.onload = readerEvent => {
                var content = readerEvent.target.result;
                var data = parse(content);
                localStorage.clear(); // Clear current localStorage data.
                try {
                    Object.keys(data).forEach(function (k) {
                        localStorage.setItem(k, data[k]);
                    });
                    window.location.reload();
                } catch (e) {
                    console.log("GameStorage: ERR! ", e);
                }
            }
        }

        input.click();
    }
}