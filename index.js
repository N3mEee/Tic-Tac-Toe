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
    const $newGameBtn = document.querySelectorAll(".new-game");
    const $winner = document.querySelector("h1");
    const $roundAnnouncement = document.querySelector("h2");
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
        if (gameWon() && round % 2 === 0) {
            $winner.innerText = `${player1.getPlayerName()} won`;
            $roundAnnouncement.innerText = "";
        } else if (gameWon() && !round % 2 === 0) {
            $roundAnnouncement.innerText = "";
            $winner.innerText = `${player2.getPlayerName()} won`;
        } else if (gameTie()) {
            $winner.innerText = "It's a tie";
            $roundAnnouncement.innerText = "";
        }
    };

    // Reset Game
    const $resetGame = document.querySelector(".reset-game");
    const $resetGameBtn = document.querySelector(".reset-game-btn");
    $resetGameBtn.addEventListener("click", (e) => {
        round = 0;
        $winner.innerText = "";
        for (let i = 0; i < gameBoard.getGameBoard().length; i++) {
            gameBoard.updateGameBoard(i, "");
        }
    });

    // Create a new game (create players and gameBoard)
    $newGameBtn.forEach((item) => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const $form = document.querySelector("form");
            if ($player1.value === "") {
                $roundAnnouncement.textContent = `Please enter a valide username`;
            } else if (e.target.dataset.id === "1") {
                player1 = player($player1.value);
                player2 = player("AI");
                display.createGameBoard();
                $roundAnnouncement.textContent = `Is ${player1.getPlayerName()}'s turn (X)`;
                $form.style.display = "none";
                $resetGame.style.display = "block";
            } else if ($player1.value === "" || $player2.value === "") {
                $roundAnnouncement.textContent = `Please enter a valide username`;
            } else if (e.target.dataset.id === "0") {
                player1 = player($player1.value);
                player2 = player($player2.value);
                display.createGameBoard();
                $roundAnnouncement.textContent = `Is ${player1.getPlayerName()}'s turn (X)`;
                $form.style.display = "none";
                $resetGame.style.display = "block";
            } else {
                round = 0;
                $winner.innerText = "";
                for (let i = 0; i < gameBoard.getGameBoard().length; i++) {
                    gameBoard.updateGameBoard(i, "");
                }
                player1 = null;
                $player1.value = "";
                player2 = null;
                $player2.value = "";
                display.deleteBoard();
                $form.style.display = "flex";
                $resetGame.style.display = "none";
            }
        });
    });

    // Cell click handler
    $gameBoard.addEventListener("click", (e) => {
        if (e.target.innerText === "" && $winner.innerText === "" && e.target.classList.contains("cell")) {
            if (round % 2 === 0) {
                gameBoard.updateGameBoard(e.target.dataset.id, "x");
                $roundAnnouncement.textContent = `Is ${player2.getPlayerName()}'s turn (0)`;
                checkWinner();
                round++;
                if (player2.getPlayerName() === "AI" && $winner.innerText === "") {
                    let random = Math.floor(Math.random() * 9);
                    for (let i = 0; i < 9; i++) {
                        if (gameBoard.valueAt(random) === "") {
                            i = 9;
                        } else {
                            random = Math.floor(Math.random() * 9);
                        }
                    }
                    gameBoard.updateGameBoard(random, "0");
                    $roundAnnouncement.textContent = `Is ${player1.getPlayerName()}'s turn (X)`;
                    checkWinner();
                    round++;
                }
            } else if (!round % 2 === 0) {
                gameBoard.updateGameBoard(e.target.dataset.id, "0");
                $roundAnnouncement.textContent = `Is ${player1.getPlayerName()}'s turn (X)`;
                checkWinner();
                round++;
            }
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

    const deleteBoard = () => {
        for (let i = 0; i < gameBoard.getGameBoard().length; i++) {
            const $cell = document.querySelectorAll(".cell");
            $cell.forEach((item) => {
                item.remove();
            });
        }
    };
    //update cell innerText(called when click on cell)
    const updateCells = () => {
        for (const child of $gameBoard.children) {
            child.innerText = gameBoard.getGameBoard()[child.dataset.id];
        }
    };
    return { updateCells, createGameBoard, deleteBoard };
})();
