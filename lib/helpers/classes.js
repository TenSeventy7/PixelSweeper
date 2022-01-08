/*  Pixel Sweeper - ClassesHelper
    For use with vanilla HTML5 games powered by JS

    (C) 2021-2022 John Vincent M. Corcega - TenSeventy7
*/

// Import needed modules
import AudioHelper from './audio.js';
import ThreedService from './threed.js';
import GameStorageHelper from './gamestorage.js';
import DialogController from './dialog.js';
import ProgressController from './progress.js';
import LevelScreenController from '../minesweeper.js';
import AboutScreenController from '../about.js';
import PagesHelper from './page.js';
import TitleScreenController from '../title.js';
import LevelDataHelper from './level.js';

// Instantiate our classes as variables
export const audioService = new AudioHelper();
export const threedService = new ThreedService();
export const gameStorageService = new GameStorageHelper();
export const dialogController = new DialogController();
export const progressController = new ProgressController()
export const page = new PagesHelper();
export const titleScreen = new TitleScreenController();
export const levelData = new LevelDataHelper();
export const aboutScreen = new AboutScreenController();
export const levelScreen = new LevelScreenController();
