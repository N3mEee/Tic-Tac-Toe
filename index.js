"use strict";

// gameBoard module
const gameBoard = (() => {
    let gameBoard = ["", "", "", "", "", "", "", "", ""];

    const valueAt = (position) => {
        return gameBoard[position];
    };

    const updateGameBoard = (position, value) => {
        gameBoard[position] = value;
        displayGameBoard.updateCells();
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
const game = ((name1, name2) => {
    const $gameBoard = document.querySelector(".gameBoard");
    const $winner = document.querySelector("h1");
    const player1 = player(name1);
    const player2 = player(name2);
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
        return { gameWon, gameTie };
    };

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
})("Marcel", "Caramel");

// displayGameBoard module
const displayGameBoard = (() => {
    const $gameBoard = document.querySelector(".gameBoard");
    for (let i = 0; i < gameBoard.getGameBoard().length; i++) {
        const $cell = document.createElement("div");
        $cell.setAttribute("class", "cell");
        $cell.setAttribute("data-id", i);
        $cell.textContent = gameBoard.getGameBoard()[i];
        $gameBoard.appendChild($cell);
    }

    const updateCells = () => {
        for (const child of $gameBoard.children) {
            child.textContent = gameBoard.getGameBoard()[child.dataset.id];
        }
    };
    return { updateCells };
})();
