/*  Pixel Sweeper - ProgressController
    Control the loading screen within the game.
    For use with vanilla HTML5 games powered by JS

    (C) 2021-2022 John Vincent M. Corcega - TenSeventy7
*/

var ldContainer = document.getElementById('loading-screen');
var ldProgress = document.getElementById('loading-progress');

export default class ProgressController {
    // Set the progress bar value
    setProgress(value) {
        ldProgress.value = value;
    }

    // Show the loading screen
    showLoadingScreen() {
        this.setProgress(0);
        ldContainer.classList.remove("dialog-gone");
        ldContainer.classList.remove("animate__fadeOut");
        ldContainer.classList.add("animate__fadeIn");
    }

    // Close the loading screen
    closeLoadingScreen() {
        ldContainer.classList.remove("animate__fadeIn");
        ldContainer.classList.add("animate__fadeOut");
        setTimeout(function () {
            ldContainer.classList.add("dialog-gone");
        }, 800);
    }
}