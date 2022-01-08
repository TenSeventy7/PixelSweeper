/*  Pixel Sweeper - TitleScreenController
    Control the title and level select screen within the game, as well as define actions and more.
    For use with vanilla HTML5 games powered by JS

    (C) 2021-2022 John Vincent M. Corcega - TenSeventy7
*/

import {
    audioService,
    dialogController,
    titleScreen,
    progressController,
    aboutScreen,
    levelScreen,
    threedService,
    levelData,
    page
} from './helpers/classes.js';

// Title screen elements
var titleScreenContainer;
var titleBtnSound;
var titleBtnMusic;
var titleBtnAbout;
var titleBtnSave;
var titleBtnPlay;
var lvlSelectScreen;
var lvlSelectBtnBack;

var titleScreenContainer;
var lvlSelectScreenContainer;

var lvlSelectBtnPrevious;
var lvlSelectBtnNext;
var lvlSelectBtnPlay;
var lvlSelectBtnRestart;

var lvlSelectGlRenderer;
var lvlSelectLevelName;
var lvlSelectBestTime;
var lvlSelectBoardSize;
var lvlSelectBombs;
var lvlSelectBg;

var lvlSelectCurrentIndex = 0;

var lvlSelectedData;
var lvlSelectedIsSaveData;
var lvlSelectedBestTime;

function renderSoundIcons() {
    if (audioService.getBgmState()) {
        titleBtnMusic.classList.add("title-btn-enabled");
        titleBtnMusic.innerHTML = '<img src="img/icons/musicOn.png">';
    } else {
        titleBtnMusic.classList.remove("title-btn-enabled");
        titleBtnMusic.innerHTML = '<img src="img/icons/musicOff.png">';
    }

    if (audioService.getSfxState()) {
        titleBtnSound.classList.add("title-btn-enabled");
        titleBtnSound.innerHTML = '<img src="img/icons/audioOn.png">';
    } else {
        titleBtnSound.classList.remove("title-btn-enabled");
        titleBtnSound.innerHTML = '<img src="img/icons/audioOff.png">';
    }
}

const onSoundBtnClick = function (e) {
    let oldState = audioService.getSfxState();
    audioService.setSfxState(!oldState);
    audioService.playSfx("select");
    renderSoundIcons();
}

const onMusicBtnClick = function (e) {
    let oldState = audioService.getBgmState();
    audioService.playSfx("select");
    audioService.setBgmState(!oldState);

    if (audioService.getBgmState()) {
        audioService.playBgm(true);
    } else {
        audioService.stopBgm();
    }

    renderSoundIcons();
}

const onSaveBtnClick = function (e) {
    dialogController.showDialog(5);
}

const onPlayButton = function (e) {
    titleScreenContainer.classList.remove("animate__bounceIn");
    titleScreenContainer.classList.add("animate__bounceOut");
    setTimeout(function () {
        lvlSelectScreenContainer.classList.add("animate__bounceIn");
        lvlSelectScreen.classList.remove("dialog-gone");
        titleScreenContainer.classList.add("dialog-gone");
        titleScreenContainer.classList.remove("animate__bounceOut");
        renderLevel();
    }, 500);
}

const onClickPlayButton = function (e) {
    audioService.playSfx("select");
    onPlayButton(e);
}

const onLvlSelectNext = function (e) {
    lvlSelectCurrentIndex += 1;
    audioService.playSfx("select");
    renderLevel();
}

const onLvlSelectPrev = function (e) {
    lvlSelectCurrentIndex -= 1;
    audioService.playSfx("select");
    renderLevel();
}

const onLvlClickBackButton = function (e) {
    lvlSelectScreenContainer.classList.remove("animate__bounceIn");
    lvlSelectScreenContainer.classList.add("animate__bounceOut");
    audioService.playSfx("close");
    setTimeout(function () {
        titleScreenContainer.classList.add("animate__bounceIn");
        lvlSelectScreen.classList.add("dialog-gone");
        titleScreenContainer.classList.remove("dialog-gone");
        lvlSelectScreenContainer.classList.remove("animate__bounceOut");
        clearLevelsScreen();
    }, 500);
}

const onLvlClickRestartButton = function (e) {
    const cancel = function () {
        audioService.playSfx("menu");
        dialogController.closeDialog(1);
    }

    const restart = function () {
        lvlSelectedIsSaveData = false;
        audioService.playSfx("select");
        dialogController.closeDialog(1);
        onLvlClickPlayButton(e);
    }

    dialogController.setDialogMessage(
        "Restart Level",
        "Are you sure you want to restart this level?",
        "All your current progress will be lost!"
    );
    dialogController.setDialogButtonText(
        "Yes",
        "No"
    );

    dialogController.setDialogButtons(restart, cancel);
    dialogController.showDialog(1);
}

const onLvlClickPlayButton = function (e) {
    progressController.showLoadingScreen();
    audioService.stopBgm();
    audioService.playSfx("select");
    setTimeout(function () {
        audioService.preloadBgm(lvlSelectedData.levelMg);
        progressController.setProgress(10);
        setTimeout(function () {
            progressController.setProgress(20);
            setTimeout(function () {
                progressController.setProgress(30);
            }, 1000);
            setTimeout(function () {
                progressController.setProgress(40);
                progressController.setProgress(70);
                titleScreen.exitTitleScreen();
            }, 3000);
            setTimeout(function () {
                page.loadTemplate("/pages/level-screen.html").then(function () {
                    setTimeout(function () {
                        levelScreen.initLevelScreen('seasons', lvlSelectedData, lvlSelectedBestTime, lvlSelectedIsSaveData);
                        setTimeout(function () {
                            progressController.closeLoadingScreen();
                        }, 2000);
                    }, 1000);
                });
            }, 500);
        }, 500);
    }, 500);
}

function renderLevel() {
    levelData.getLevelData('seasons', lvlSelectCurrentIndex).then(function (data) {
        levelData.getLevelsCount('seasons').then(function (totalLevels) {
            lvlSelectedData = data;
            lvlSelectedIsSaveData = levelData.isSavedGamePresent('seasons', lvlSelectCurrentIndex);
            var lvlSelectedSaveData = levelData.getSavedGame('seasons', lvlSelectCurrentIndex);
            lvlSelectLevelName.innerHTML = data.levelName;

            lvlSelectedBestTime = levelData.getSavedLevelData('seasons', lvlSelectCurrentIndex).bestTime;
            if (lvlSelectedBestTime > -1) {
                var minutes = Math.floor(lvlSelectedBestTime / 60).toString().padStart(2, '0');
                var seconds = (lvlSelectedBestTime - minutes * 60).toString().padStart(2, '0');
                lvlSelectBestTime.innerHTML = minutes + ':' + seconds;
            } else {
                lvlSelectBestTime.innerHTML = '--:--';
            }

            lvlSelectBoardSize.innerHTML = data.boardData.columns + 'x' + data.boardData.rows;

            lvlSelectBombs.innerHTML = (lvlSelectedIsSaveData) ? lvlSelectedSaveData.mines + '/' + data.boardData.mines : data.boardData.mines;
            lvlSelectBg.style.backgroundImage = "url(" + data.levelBg + ")"
            lvlSelectGlRenderer.innerHTML = '';
            threedService.preloadModel(data.levelIdName, data.levelFg, 0xFFFFFF, 3);
            threedService.loadModel("#level-select-threed-model", data.levelIdName);
            lvlSelectBtnRestart.style.display = (lvlSelectedIsSaveData) ? 'inherit' : 'none';
            lvlSelectBtnNext.style.visibility = (lvlSelectCurrentIndex >= (totalLevels - 1)) ? 'hidden' : 'visible';
            lvlSelectBtnPrevious.style.visibility = (lvlSelectCurrentIndex <= 0) ? 'hidden' : 'visible';
        });
    });
}

function clearLevelsScreen() {
    lvlSelectGlRenderer.innerHTML = '';
}

const onClickAboutButton = function (e) {
    audioService.playSfx("select");
    progressController.showLoadingScreen();
    setTimeout(function () {
        progressController.setProgress(80);
        titleScreen.exitTitleScreen();
        page.loadTemplate("/pages/about-screen.html").then(function () {
            setTimeout(function () {
                progressController.closeLoadingScreen();
                aboutScreen.initAboutScreen();
            }, 1000);
        });
    }, 1000);
}

export default class TitleScreenController {
    // Initialize our title and level select screen
    initTitleScreen(isLevelScreen, currentLevelId) {
        lvlSelectCurrentIndex = 0;

        titleScreenContainer = document.getElementById('title-screen');
        titleScreenContainer = document.getElementById('title-screen-container');

        lvlSelectScreen = document.getElementById('level-select-screen');
        lvlSelectScreenContainer = document.getElementById('level-select-screen-container');
        lvlSelectBtnBack = document.getElementById('level-select-header-btn-back');

        lvlSelectBtnPrevious = document.getElementById('level-select-back');
        lvlSelectBtnNext = document.getElementById('level-select-next');
        lvlSelectBtnPlay = document.getElementById('level-select-btn-play');
        lvlSelectBtnRestart = document.getElementById('level-select-btn-restart');

        lvlSelectGlRenderer = document.getElementById('level-select-threed-model');
        lvlSelectLevelName = document.getElementById('level-select-name');
        lvlSelectBestTime = document.getElementById('level-select-best-time');
        lvlSelectBoardSize = document.getElementById('level-select-board-size');
        lvlSelectBombs = document.getElementById('level-select-bomb-count');
        lvlSelectBg = document.getElementById('level-select-background');

        titleBtnSound = document.getElementById('title-btn-sound');
        titleBtnMusic = document.getElementById('title-btn-music');
        titleBtnAbout = document.getElementById('title-btn-about');
        titleBtnPlay = document.getElementById('title-btn-play');
        titleBtnSave = document.getElementById('title-btn-save');

        titleBtnSound.addEventListener('click', onSoundBtnClick);
        titleBtnMusic.addEventListener('click', onMusicBtnClick);
        titleBtnAbout.addEventListener('click', onClickAboutButton);
        titleBtnPlay.addEventListener('click', onClickPlayButton);
        lvlSelectBtnBack.addEventListener('click', onLvlClickBackButton);
        lvlSelectBtnNext.addEventListener('click', onLvlSelectNext);
        lvlSelectBtnPrevious.addEventListener('click', onLvlSelectPrev);
        lvlSelectBtnPlay.addEventListener('click', onLvlClickPlayButton);
        lvlSelectBtnRestart.addEventListener('click', onLvlClickRestartButton);
        titleBtnSave.addEventListener('click', onSaveBtnClick);

        if (isLevelScreen) {
            lvlSelectCurrentIndex = currentLevelId;
            audioService.playBgm(audioService.getBgmState());
            onPlayButton();
        }

        renderSoundIcons();
    }

    // Remove all event listeners from title screen
    exitTitleScreen() {
        titleBtnSound.removeEventListener('click', onSoundBtnClick);
        titleBtnMusic.removeEventListener('click', onMusicBtnClick);
        titleBtnAbout.removeEventListener('click', onClickAboutButton);
        titleBtnPlay.removeEventListener('click', onClickPlayButton);
        lvlSelectBtnBack.removeEventListener('click', onLvlClickBackButton);
        lvlSelectBtnNext.removeEventListener('click', onLvlSelectNext);
        lvlSelectBtnPrevious.removeEventListener('click', onLvlSelectPrev);
        lvlSelectBtnPlay.removeEventListener('click', onLvlClickPlayButton);
        lvlSelectBtnRestart.removeEventListener('click', onLvlClickRestartButton);
        titleBtnSave.removeEventListener('click', onSaveBtnClick);
    }
}