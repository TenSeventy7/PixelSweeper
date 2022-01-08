/*  Pixel Sweeper - AboutScreenController
    Control the title and level select screen within the game, as well as define actions and more.
    For use with vanilla HTML5 games powered by JS

    (C) 2021-2022 John Vincent M. Corcega - TenSeventy7
*/

import {
    audioService,
    progressController,
    titleScreen,
    aboutScreen,
    page
} from './helpers/classes.js';

// About screen elements
var aboutBtnBack;

const onAboutScreenBack = function (e) {
    audioService.playSfx("close");
    progressController.showLoadingScreen();
    setTimeout(function () {
        progressController.setProgress(20);
        setTimeout(function () {
            progressController.setProgress(40);
            setTimeout(function () {
                aboutScreen.exitAboutScreen();
                page.loadTemplate("/pages/title-screen.html").then(function () {
                    setTimeout(function () {
                        titleScreen.initTitleScreen(false);
                        setTimeout(function () {
                            progressController.setProgress(100);
                            progressController.closeLoadingScreen();
                        }, 2000);
                    }, 100);
                });
            }, 250);
        }, 300);
    }, 200);
}

export default class AboutScreenController {
    initAboutScreen() {
        aboutBtnBack = document.getElementById('about-screen-header-btn-back');
        aboutBtnBack.addEventListener('click', onAboutScreenBack);
    }

    exitAboutScreen() {
        aboutBtnBack.removeEventListener('click', onAboutScreenBack);
    }
}