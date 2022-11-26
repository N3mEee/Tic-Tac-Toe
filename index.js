"use strict";

// gameBoard module
const gameBoard = (() => {
    let gameBoard = ["", "", "", "", "", "", "", "", ""];
    const valueAt = (position) => {
        return gameBoard[position];
    };
    const updateGameBoard = (position, value) => {
        gameBoard[position] = value;
        display.updateCells();
    };
    const getGameBoard = () => {
        return gameBoard;
    };
    return { valueAt, getGameBoard, updateGameBoard };
})();

// player factory function
const player = (name) => {
    const playerName = name;
    const getPlayerName = () => {
        return playerName;
    };
    return { getPlayerName };
};

// game module
const game = (() => {
    const $gameBoard = document.querySelector(".gameBoard");
    const $player1 = document.querySelector("#player1");
    const $player2 = document.querySelector("#player2");
    const $newGameBtn = document.querySelector(".new-game");
    const $winner = document.querySelector("h1");
    let player1;
    let player2;
    let round = 0;

    const checkWinner = () => {
        const winnerCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        const gameWon = () => winnerCombos.some((combo) => allSameSymbol(combo));
        const gameTie = () => {
            if (!gameBoard.getGameBoard().includes("") && !gameWon()) {
                return true;
            }
        };
        const allSameSymbol = (combo) => {
            return combo.every((item) => {
                if (round % 2 === 0) {
                    return gameBoard.valueAt(item) === "x";
                } else {
                    return gameBoard.valueAt(item) === "0";
                }
            });
        };
        if (gameWon()) {
            if (round % 2 === 0) {
                $winner.innerText = `${player1.getPlayerName()} won`;
            } else {
                $winner.innerText = `${player2.getPlayerName()} won`;
            }
        } else if (gameTie()) {
            $winner.innerText = "It's a tie";
        } else {
            console.log("no winner yet");
        }
    };

    // Reset Game
    const $resetGame = document.querySelector(".reset-game");
    $resetGame.addEventListener("click", (e) => {
        for (let i = 0; i < gameBoard.getGameBoard().length; i++) {
            gameBoard.updateGameBoard(i, "");
            round = 0;
            $winner.innerText = "";
        }
    });

    // Create a new game (create players and gameBoard)
    $newGameBtn.addEventListener("click", (e) => {
        const $form = document.querySelector("form");
        e.preventDefault();
        player1 = player($player1.value);
        player2 = player($player2.value);
        display.createGameBoard();
        $form.style.display = "none";
        $resetGame.style.display = "block";
    });

    // Cell click handler
    $gameBoard.addEventListener("click", (e) => {
        if (e.target.innerText === "" && $winner.innerText === "") {
            if (round % 2 === 0) {
                gameBoard.updateGameBoard(e.target.dataset.id, "x");
                checkWinner();
            } else {
                gameBoard.updateGameBoard(e.target.dataset.id, "0");
                checkWinner();
            }
            round++;
        }
    });
    return { player1, player2, checkWinner };
})();

// displayGameBoard module
const display = (() => {
    const $gameBoard = document.querySelector(".gameBoard");
    //create and append the cells
    const createGameBoard = () => {
        for (let i = 0; i < gameBoard.getGameBoard().length; i++) {
            const $cell = document.createElement("div");
            $cell.setAttribute("class", "cell");
            $cell.setAttribute("data-id", i);
            $cell.innerText = gameBoard.getGameBoard()[i];
            $gameBoard.appendChild($cell);
        }
    };
    //update cell innerText(called when click on cell)
    const updateCells = () => {
        for (const child of $gameBoard.children) {
            child.innerText = gameBoard.getGameBoard()[child.dataset.id];
        }
    };
    return { updateCells, createGameBoard };
})();
