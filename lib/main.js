/*  Pixel Sweeper
    Primary game code for the Pixel Sweeper game

    (C) 2021-2022 John Vincent M. Corcega - TenSeventy7
*/

// Import required modules. All of them are ES6/ECMAscript 2017
// because of three.js being an ES6 module
import {
    audioService,
    progressController,
    page,
    titleScreen,
    levelData
} from "./helpers/classes.js";

// Preload images and icons in memory.
function preloadImg(url) {
    var img = new Image();
    img.src = url;
}

const onStartGame = function (e) {
    document.getElementById('start-game').style.display = 'none';
    document.getElementById('game').style.display = 'initial';
    progressController.showLoadingScreen();
    levelData.preloadLevelsData("/leveldata/seasons.json", "seasons").then(function () {
        levelData.getLevelData('seasons', 0).then(function (data) {
            setTimeout(function () {
                preloadImg("img/backgrounds/title-background.png");
                preloadImg("img/backgrounds/seasons-spring.png");
                preloadImg("img/backgrounds/seasons-summer.png");
                preloadImg("img/backgrounds/seasons-fall.png");
                preloadImg("img/backgrounds/seasons-winter.png");
                progressController.setProgress(10);
                setTimeout(function () {
                    audioService.preloadBgm("/bgm/title.mp3");
                    progressController.setProgress(20);
                    setTimeout(function () {
                        audioService.preloadSfx("mine", "sfx/mine.ogg");
                        audioService.preloadSfx("close", "sfx/close.ogg");
                        audioService.preloadSfx("dialog", "sfx/dialog.ogg");
                        audioService.preloadSfx("levelLose", "sfx/levelLose.ogg");
                        audioService.preloadSfx("levelWin", "sfx/levelWin.ogg");
                        audioService.preloadSfx("menu", "sfx/menu.ogg");
                        audioService.preloadSfx("select", "sfx/select.ogg");
                        progressController.setProgress(30);
                        setTimeout(function () {
                            progressController.setProgress(70);
                            setTimeout(function () {
                                page.loadTemplate("/pages/title-screen.html").then(function () {
                                    setTimeout(function () {
                                        progressController.closeLoadingScreen();
                                        titleScreen.initTitleScreen(false);
                                        setTimeout(function () {
                                            audioService.playBgm(audioService.getBgmState());
                                        }, 700);
                                    }, 3000);
                                });
                            }, 1000);
                        }, 3000);
                    }, 1000);
                }, 1000);
            }, 1000);
        });
    });
}

document.getElementById('game').style.display = 'none';
document.getElementById('start-game').style.display = 'flex';
document.getElementById('start-game').addEventListener('click', onStartGame);
