/*  Pixel Sweeper - LevelScreenController, Minesweeper, Cell
    Primary level screen code for the Pixel Sweeper game
    Based on code by Nick Arocho: https://github.com/nickarocho/minesweeper
    With lots of improvements:
        - Made code compliant with ES6 as Pixel Sweeper needs to be written in ES6.
        - More dynamic tile generation that doesn't need arbitrary data. Load a game with your own tileset and mine counts!
        - Added behavior where you CANNOT lose on FIRST click. This behavior is seen on Windows versions of the game.
        - Dynamic backgrounds for use within Pixel Sweeper
        - Cleaned code, made optimizations and added documentation on the important stuff.
        - Added the ability to save level data (including HTML data) to localStorage.

    (C) 2017 Nick Arocho
    (C) 2021-2022 John Vincent M. Corcega - TenSeventy7
*/

import {
    titleScreen,
    levelScreen,
    progressController,
    dialogController,
    levelData,
    page,
    audioService,
    gameStorageService
} from './helpers/classes.js';

var adjBombTextColors = [
    '',
    '#1c8cbc',
    '#5bb33b',
    '#cca404',
    '#146c94',
    '#ec6e1c',
    '#e4bc24',
    '#1f1f1f',
    '#acacac',
];

const imgMine = '<img class="level-screen-cell-image" src="img/tile/mine.png">';
const imgMineAnimation = '<img class="level-screen-cell-image" src="img/tile/mineAnimation.gif">';
const imgFlag = '<img class="level-screen-cell-image" src="img/tile/flag.png">';
const imgWrongMine = '<img class="level-screen-cell-image" src="img/tile/wrongMine.png">';
const minesweeperCell = '<div id="level-screen-board-col" class="game-cell"></div>';

// Level info variables
var levelId;
var levelInfo;
var levelCategory;

// Level board data
var lvlBoard;
var lvlRows;
var lvlColumns;
var lvlMines;
var lvlBestTime;

// Level HTML variables
var lvlBackground;
var lvlSweeperBoard;
var lvlTxtTimer;
var lvlMineCount;
var lvlBtnPause;

// Minesweeper class
var lvlMinesweeper;

// Misc variables - for time, first click, and win/lose checking
var lvlRuntime = 0;
var isFirstClick = false;
var isUserLose = false;
var isUserWin = false;
var isFirstPlay = true;

function onPauseButtonClick(e) {
    clearInterval(lvlTxtTimer);
    dialogController.showDialog(2);
}

function setupTimer() {
    lvlRuntime += 1;
    lvlTxtTimer = setInterval(function () {
        lvlRuntime += 1;
        var minutes = Math.floor(lvlRuntime / 60).toString().padStart(2, '0');
        var seconds = (lvlRuntime - minutes * 60).toString().padStart(2, '0');
        document.getElementById('level-screen-time').innerText = minutes + ':' + seconds;
    }, 1000);
}

function setupDialogs() {
    // Close dialog on cancel
    const cancel = function () {
        audioService.playSfx("menu");
        dialogController.closeDialog(1);
    }

    // Resume the game and timer
    const resume = function () {
        audioService.playSfx("menu");
        dialogController.closeDialog(2);
        if (lvlTxtTimer) setupTimer();
    }

    const exit = function () {
        const saveLevel = function () {
            levelData.setSaveGame(
                levelCategory,
                levelId,
                lvlBoard, // FIX
                lvlSweeperBoard.innerHTML,
                lvlRuntime, // FIX
                lvlMines
            ).then(function () {
                dialogController.closeDialog(1);
                dialogController.closeDialog(2);
                audioService.stopBgm();
                audioService.playSfx("menu");
                progressController.showLoadingScreen();
    
                setTimeout(function () {
                    audioService.preloadBgm("bgm/title.mp3");
                    progressController.setProgress(40);
                    levelScreen.exitLevelScreen();
                    page.loadTemplate("/pages/title-screen.html").then(function () {
                        setTimeout(function () {
                            progressController.setProgress(80);
                            titleScreen.initTitleScreen(true, levelId);
                            setTimeout(function () {
                                progressController.setProgress(100);
                                progressController.closeLoadingScreen();
                            }, 2000);
                        }, 1000);
                    });
                }, 500);
            });
        }

        dialogController.setDialogMessage(
            "Exit Level",
            "Are you sure you want to exit this level?",
            "Your progress will be saved."
        );
        dialogController.setDialogButtonText(
            "Yes",
            "No"
        );

        dialogController.setDialogButtons(saveLevel, cancel);
        dialogController.showDialog(1);
    }

    const exitLevel = function () {
        dialogController.closeDialog(3);
        levelScreen.exitLevelScreen();
        audioService.playSfx("menu");
        audioService.stopBgm();
        progressController.showLoadingScreen();

        // Exit the level, load the title template, then show levels.
        setTimeout(function () {
            audioService.preloadBgm("bgm/title.mp3");
            progressController.setProgress(40);
            page.loadTemplate("/pages/title-screen.html").then(function () {
                setTimeout(function () {
                    progressController.setProgress(80);
                    titleScreen.initTitleScreen(true, levelId);
                    setTimeout(function () {
                        progressController.setProgress(100);
                        progressController.closeLoadingScreen();
                    }, 2000);
                }, 1000);
            });
        }, 500);
    };

    const restartLevel = function () {
        dialogController.closeDialog(3);
        dialogController.closeDialog(2);
        dialogController.closeDialog(1);
        audioService.playSfx("select");
        levelScreen.exitLevelScreen();
        progressController.showLoadingScreen();

        // Reload level screen then re-init new game.
        setTimeout(function () {
            progressController.setProgress(40);
            audioService.stopBgm();
            page.loadTemplate("/pages/level-screen.html").then(function () {
                setTimeout(function () {
                    progressController.setProgress(80);
                    levelScreen.initLevelScreen(levelCategory, levelInfo, false);
                    setTimeout(function () {
                        progressController.setProgress(100);
                        progressController.closeLoadingScreen();
                    }, 2000);
                }, 1000);
            });
        }, 500);
    }

    const restart = function () {
        dialogController.setDialogMessage(
            "Restart Level",
            "Are you sure you want to restart this level?",
            "All your current progress will be lost!"
        );
        dialogController.setDialogButtonText(
            "Yes",
            "No"
        );

        dialogController.setDialogButtons(restartLevel, cancel);
        dialogController.showDialog(1);
    }

    dialogController.setPauseDialogButtons(resume, restart, exit);
    dialogController.setEndLevelDialogButtons(restartLevel, exitLevel);
}

function showLoseLevel() {
    dialogController.setEndLevelMessage("You Lose!", "img/icons/flag.png", true, false);
    dialogController.showDialog(3);
}

function showWinLevel(isNewRecord) {
    dialogController.setEndLevelMessage("You Win!", "img/icons/time.png", true, isNewRecord);
    dialogController.showDialog(3);
}

// class Cell
// Class for setting and storing metadata on minesweeper cells
class Cell {
    constructor(row, col, board, bomb, revealed, flagged) {
        this.row = row;
        this.col = col;
        this.board = board;
        this.bomb = (typeof bomb !== 'undefined') ? bomb : false;
        this.revealed = (typeof revealed !== 'undefined') ? revealed : false;
        this.flagged = (typeof flagged !== 'undefined') ? flagged : false;
    }

    // Make an array of all adjacent cell data of a given cell.
    getAdjCells() {
        var adjCells = [];
        var lastRow = lvlBoard.length - 1;
        var lastCol = lvlBoard[0].length - 1;

        // Top-left
        if (this.row > 0 && this.col > 0) {
            adjCells.push(lvlBoard[this.row - 1][this.col - 1]);
        }

        // Top
        if (this.row > 0) {
            adjCells.push(lvlBoard[this.row - 1][this.col]);
        }
        
        // Top-right
        if (this.row > 0 && this.col < lastCol) {
            adjCells.push(lvlBoard[this.row - 1][this.col + 1]);
        }

        // Right
        if (this.col < lastCol) {
            adjCells.push(lvlBoard[this.row][this.col + 1]);
        }

        // Bottom-right
        if (this.row < lastRow && this.col < lastCol) {
            adjCells.push(lvlBoard[this.row + 1][this.col + 1]);
        }

        // Bottom
        if (this.row < lastRow) {
            adjCells.push(lvlBoard[this.row + 1][this.col]);
        }
        
        // Bottom-left
        if (this.row < lastRow && this.col > 0) {
            adjCells.push(lvlBoard[this.row + 1][this.col - 1]);
        }

        // Left
        if (this.col > 0) {
            adjCells.push(lvlBoard[this.row][this.col - 1]);
        }

        return adjCells;
    }

    // Get adjacent mines
    getAdjMines() {
        var adjCells = this.getAdjCells();
        var adjBombs = 0;

        // For each adjacent cells, check if it is a bomb.
        // If it is, add 1.
        adjCells.forEach(cell => {
            adjBombs += (cell.bomb) ? 1 : 0
        });

        this.adjBombs = adjBombs;
    }

    // Set cells to be 'flagged' if they are not revealed yet.
    flag() {
        if (!this.revealed) {
            this.flagged = !this.flagged;
            return this.flagged;
        }
    }

    // Reveal the cell, its adjacent cells and check if it's a bomb
    // Do not reveal the cell if it is flagged.
    reveal() {
        if (!this.revealed && isUserLose || !this.flagged) {
            this.revealed = true;
            if (this.bomb) return true;
            if (this.adjBombs === 0) {
                var adj = this.getAdjCells();
                adj.forEach(function (cell) {
                    if (!cell.revealed) cell.reveal();
                });
            }
        }
        return false;
    }
}

class Minesweeper {
    // Right-click/Long-tap handler. Hooks into the native
    // browser right-click menu behavior.
    contextMenuHandler = function (e) {
        e.preventDefault();
        isFirstClick = true;
        audioService.playSfx("select");
        if (!lvlTxtTimer) setupTimer();
        var clickedEl = e.target.tagName.toLowerCase() === 'img' ? e.target.parentElement : e.target;
        var row = parseInt(clickedEl.dataset.row);
        var col = parseInt(clickedEl.dataset.col);
        var cell = lvlBoard[row][col];
        if (!cell.revealed && (lvlMines > 0 || cell.flagged)) {
            lvlMines += cell.flag() ? -1 : 1;
        }

        lvlMinesweeper.renderBoard();
    };

    // Main cell click handler. Needs to be a variable so it can be removed as
    // an event listener when de-initing the screen.
    onClickCellHandler = function (e) {
        // Check if user right clicked on the cell. Rare but it happens.
        var isRightMB;
        e = e || window.event;
        if ("which" in e)
            isRightMB = e.which == 3;
        else if ("button" in e)
            isRightMB = e.button == 2;

        if (isUserWin || isUserLose) return;
        var clickedCell = e.target.tagName.toLowerCase() === 'img' ? e.target.parentElement : e.target;

        if (clickedCell.classList.contains('game-cell')) {
            if (!lvlTxtTimer) setupTimer();

            var row = parseInt(clickedCell.dataset.row);
            var col = parseInt(clickedCell.dataset.col);
            var cell = lvlBoard[row][col];

            // Check if the user clicked for the first time.
            // If the user did, check if the cell clicked is a bomb and
            // reset the board so that it won't lose the game immediately.
            // Behavior is similar to how Windows' Minesweeper works.
            if (!isFirstClick && cell.bomb) {
                lvlMinesweeper.runOnAllCells(function (cell) {
                    if (cell.bomb) {
                        cell.bomb = false
                    };
                });

                // Plant bombs again
                lvlMinesweeper.plantBombs(cell);
                isFirstClick = true;
            } else {
                // If it isn't a bomb, set isFirstClick to true
                // so it won't re-assign.
                isFirstClick = true;
            }

            if (isRightMB) {
                this.contextMenuHandler(e);
            } else {
                isUserLose = cell.reveal();
                if (isUserLose) {
                    lvlMinesweeper.runOnAllCells(function (cell) {
                        cell.reveal();
                    });
                    clearInterval(lvlTxtTimer);
                    clickedCell.className = 'clicked-mine';
                }
            }

            isUserWin = true;
            lvlMinesweeper.runOnAllCells(function (cell) {
                if (!cell.revealed && !cell.bomb) {
                    isUserWin = false;
                }
            });

            audioService.playSfx("menu");
            lvlMinesweeper.renderBoard();
        }
    }

    // Plant our bombs but avoid a defined cell
    // Especially useful when we are checking for the user's first click.
    plantBombs(cell) {
        var avoidCell = (typeof cell !== 'undefined') ? cell : null
        var currentTotalBombs = lvlMines;
        while (currentTotalBombs !== 0) {
            var row = Math.floor(Math.random() * lvlRows);
            var col = Math.floor(Math.random() * lvlColumns);
            var currentCell = lvlBoard[row][col]
            if (!currentCell.bomb) {
                // If 'cell' is defined, make sure that it
                // isn't defined as a bomb so user won't get one on first click.
                if (currentCell == avoidCell) {
                    cell.bomb = false;
                } else {
                    currentCell.bomb = true
                    currentTotalBombs -= 1
                }
            }
        }

        this.runOnAllCells(function (cell) {
            cell.getAdjMines();
        });
    }

    // Add imagery to the cells on the board
    // Flags, bombs, animations, etc.
    renderBoard() {
        var allCells = Array.from(document.querySelectorAll('[data-row]'));
        allCells.forEach(function (element) {
            var rowIdx = parseInt(element.getAttribute('data-row'));
            var colIdx = parseInt(element.getAttribute('data-col'));
            var cell = lvlBoard[rowIdx][colIdx];
            if (cell.flagged) {
                if ((cell.revealed || isUserWin || isUserLose) && !cell.bomb) {
                    element.innerHTML = imgWrongMine;
                } else {
                    element.innerHTML = imgFlag;
                }
            } else if (cell.revealed) {
                if (cell.bomb) {
                    element.innerHTML = imgMine;

                    setTimeout(function () {
                        element.innerHTML = imgMineAnimation;
                        audioService.playSfx("mine");
                        setTimeout(function () {
                            element.innerHTML = '';
                        }, 200 * rowIdx);
                    }, 200 * colIdx);
                } else if (cell.adjBombs) {
                    element.className = 'revealed'
                    element.style.color = adjBombTextColors[cell.adjBombs];
                    element.innerHTML = cell.adjBombs;
                } else {
                    element.className = 'revealed'
                }
            } else {
                if (isUserWin && cell.bomb) {
                    element.innerHTML = imgMine;
                } else {
                    element.innerHTML = '';
                }
            }
        });

        lvlMineCount.innerHTML = lvlMines;

        if (isUserLose) {
            setTimeout(function () {
                levelData.clearSaveGame(levelCategory, levelId);
                audioService.stopBgm();
                audioService.playSfx("levelLose");
                showLoseLevel();
            }, 300 * lvlMines);
        } else if (isUserWin) {
            clearInterval(lvlTxtTimer);
            levelData.clearSaveGame(levelCategory, levelId);
            let isNewRecord = levelData.setSavedLevelData(levelCategory, levelId, lvlBestTime, lvlRuntime);
            audioService.stopBgm();
            audioService.playSfx("levelWin");
            showWinLevel(isNewRecord);
        }
    };

    // Run a function on all cells
    async runOnAllCells(f) {
        lvlBoard.forEach(function (rowArr) {
            rowArr.forEach(function (cell) {
                f(cell);
            });
        });
    }

    // Generate a new board, then add data for Cell class to be assigned to
    generateBoard() {
        lvlSweeperBoard.innerHTML = `<div id="level-screen-board-row">${minesweeperCell.repeat(lvlColumns)}</div>`.repeat(lvlRows);

        var lvlCells = Array.from(document.querySelectorAll('#level-screen-board-col'));
        lvlCells.forEach(function (cell, index) {
            cell.setAttribute('data-row', Math.floor(index / lvlRows));
            cell.setAttribute('data-col', index % lvlColumns);
        });

        var dataArray = Array(lvlRows).fill(null);
        dataArray = dataArray.map(function () {
            return new Array(lvlColumns).fill(null);
        });

        return dataArray;
    }

    // Remove event listeners and reset all data.
    resetMinesweeperBoard() {
        lvlSweeperBoard.removeEventListener('click', this.onClickCellHandler);
        lvlSweeperBoard.removeEventListener('contextmenu', this.contextMenuHandler);
        clearInterval(lvlTxtTimer);
        lvlRuntime = 0;
        lvlTxtTimer = null;

        lvlBoard = null;
        isUserLose = false;
        isUserWin = false;

        isUserLose = false;
        isUserWin = false;
        isFirstClick = false;
    }

    // Restore old board data if asked, or initialize our new board
    initMinesweeperBoard(isRestoreData) {
        const maxWidth = 30; // 30vw max width
        const maxHeight = 30; // 30vw max height
        var height = (maxHeight / lvlRows);
        var width = (maxWidth / lvlColumns);

        if (isRestoreData) {
            const savedData = levelData.getSavedGame(levelCategory, levelId);
            lvlBoard = savedData.board;
            lvlSweeperBoard.innerHTML = savedData.html;
            lvlRuntime = savedData.runTime;
            lvlMines = savedData.mines;

            // This isn't the user's first click. Do NOT re-assign.
            isFirstClick = true;
        } else {
            levelData.clearSaveGame(levelCategory, levelId);
            lvlBoard = this.generateBoard();
        }

        // Resize the cells so they fit our constraints (30vw x 30vw).
        var lvlCells = Array.from(document.querySelectorAll('#level-screen-board-col'));
        lvlCells.forEach(function (cell) {
            cell.style.height = height+'vw';
            cell.style.width = width+'vw';
        });

        // Assign the Cell class for each box of the board
        lvlBoard.forEach(function (rowArr, rowIdx) {
            rowArr.forEach(function (s, colIdx) {
                var isBomb = false;
                var isRevealed = false;
                var isFlagged = false;

                // Restore bomb/revealed/flagged data if we are restoring saved game
                if (isRestoreData) {
                    isBomb = lvlBoard[rowIdx][colIdx].bomb;
                    isRevealed = lvlBoard[rowIdx][colIdx].revealed;
                    isFlagged = lvlBoard[rowIdx][colIdx].flagged;
                }

                lvlBoard[rowIdx][colIdx] = new Cell(rowIdx, colIdx, lvlBoard, isBomb, isRevealed, isFlagged);
            });
        });

        // If we're restoring old board data, just re-get existing bombs
        // Otherwise, plant randomly.
        if (isRestoreData) {
            this.runOnAllCells(function (cell) {
                cell.getAdjMines();
            });
        } else {
            this.plantBombs();
        }

        // Add our event listeners for the board and cells
        // onClick for left click, onContextMenu for right click/long tap
        // onContextMenu should work on long tap for most major browsers including Chrom(e/ium)
        lvlSweeperBoard.addEventListener('click', this.onClickCellHandler);
        lvlSweeperBoard.addEventListener('contextmenu', this.contextMenuHandler);

        // Of course, finally render the board.
        this.renderBoard();
    };

}

export default class LevelScreenController {
    initLevelScreen(key, data, time, loadSavedData) {
        let mineData = data.boardData;

        lvlBestTime = time;
        levelInfo = data;
        levelCategory = key;
        levelId = data.levelId;

        lvlSweeperBoard = document.getElementById('level-screen-board');
        lvlBackground = document.getElementById('level-screen-background');
        lvlMineCount = document.getElementById('level-screen-bomb-count');
        lvlBtnPause = document.getElementById('level-screen-header-btn-back');

        lvlBackground.style.backgroundImage = "url(" + data.levelBg + ")"
        lvlRows = mineData.rows;
        lvlColumns = mineData.columns;
        lvlMines = mineData.mines;

        document.getElementById('level-screen-name').innerHTML = data.levelName;

        lvlMinesweeper = new Minesweeper();
        lvlMinesweeper.initMinesweeperBoard(loadSavedData);

        clearInterval(lvlTxtTimer);

        lvlBtnPause.addEventListener('click', e => onPauseButtonClick(e));
        setupDialogs();

        // Show a mini tutorial if it's the first time the user plays the game.
        isFirstPlay = gameStorageService.getGameData("game/isFirstPlay");
        if (isFirstPlay === null) {
            dialogController.showDialog(4);
            gameStorageService.setGameData("game/isFirstPlay", false);
        }

        // Play background music.
        audioService.playBgm(audioService.getBgmState());
    }

    exitLevelScreen() {
        lvlMinesweeper.resetMinesweeperBoard();
    }
}