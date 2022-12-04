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
    const $resetGame = document.querySelector(".reset-game");
    const $resetGameBtn = document.querySelector(".reset-game-btn");
    const $winner = document.querySelector("h1");
    const $roundAnnouncement = document.querySelector("h2");
    let player1;
    let player2;
    let round = 0;
    let winnerLine = [];

    // Check if there is a winner
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
        //check if atleast one combo is true
        const gameWon = () => winnerCombos.some((combo) => allSameSymbol(combo));
        //check if from one combo every index is the same value
        const allSameSymbol = (combo) => {
            return combo.every((item) => {
                if (round % 2 === 0) {
                    return gameBoard.valueAt(item) === "x";
                } else {
                    return gameBoard.valueAt(item) === "O";
                }
            });
        };
        //check for tie
        const gameTie = () => {
            //if the gameboard array is empty and the game was not won then declare it as a tie
            if (!gameBoard.getGameBoard().includes("") && !gameWon()) {
                return true;
            }
        };

        //if the game has a winner return and style the winner line
        if (gameWon()) {
            winnerLine = winnerCombos.find((combo) => {
                return combo.every((item) => {
                    if (round % 2 === 0) {
                        return gameBoard.valueAt(item) === "x";
                    } else {
                        return gameBoard.valueAt(item) === "O";
                    }
                });
            });
            winnerLine.forEach((item) => {
                $gameBoard.children[item].style.backgroundColor = "green";
            });
        }
        // display the winner
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
    $resetGameBtn.addEventListener("click", (e) => {
        round = 0;
        $winner.innerText = "";
        for (let i = 0; i < gameBoard.getGameBoard().length; i++) {
            gameBoard.updateGameBoard(i, "");
            $gameBoard.children[i].style.backgroundColor = "";
        }
    });

    // Create a new game (create players and gameBoard)
    $newGameBtn.forEach((item) => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const $form = document.querySelector("form");
            //if the aigame button from lobby is clicked start a new game vs ai
            if (e.target.dataset.id === "2") {
                if ($player1.value === "") {
                    $roundAnnouncement.textContent = `Please enter a valide username`;
                } else {
                    player1 = player($player1.value);
                    player2 = player("GOD");
                    display.createGameBoard();
                    $roundAnnouncement.textContent = `Is ${player1.getPlayerName()}'s turn (X)`;
                    $form.style.display = "none";
                    $resetGame.style.display = "block";
                }
            } //if the aigame button from lobby is clicked start a new game vs ai
            else if (e.target.dataset.id === "1") {
                if ($player1.value === "") {
                    $roundAnnouncement.textContent = `Please enter a valide username`;
                } else {
                    player1 = player($player1.value);
                    player2 = player("AI");
                    display.createGameBoard();
                    $roundAnnouncement.textContent = `Is ${player1.getPlayerName()}'s turn (X)`;
                    $form.style.display = "none";
                    $resetGame.style.display = "block";
                }
            } //if the newgame button from lobby is clicked start a new game pvp
            else if (e.target.dataset.id === "0") {
                if ($player1.value === "" || $player2.value === "") {
                    $roundAnnouncement.textContent = `Please enter a valide username`;
                } else {
                    player1 = player($player1.value);
                    player2 = player($player2.value);
                    display.createGameBoard();
                    $roundAnnouncement.textContent = `Is ${player1.getPlayerName()}'s turn (X)`;
                    $form.style.display = "none";
                    $resetGame.style.display = "block";
                }
            } //if the newgame button from ingame is clicked reset everything and go to lobby
            else {
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
                $roundAnnouncement.textContent = `Is ${player2.getPlayerName()}'s turn (O)`;
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
                    gameBoard.updateGameBoard(random, "O");
                    $roundAnnouncement.textContent = `Is ${player1.getPlayerName()}'s turn (X)`;
                    checkWinner();
                    round++;
                } else if (player2.getPlayerName() === "GOD" && $winner.innerText === "") {
                    // this is the board flattened and filled with some values to easier asses the Artificial Inteligence.
                    var origBoard = [];
                    for (let i = 0; i < gameBoard.getGameBoard().length; i++) {
                        if (gameBoard.valueAt(i) === "") {
                            origBoard.push(i);
                        } else {
                            origBoard.push(gameBoard.valueAt(i));
                        }
                    }

                    // human
                    var huPlayer = "x";
                    // ai
                    var aiPlayer = "O";

                    // keep track of function calls
                    var fc = 0;

                    // finding the ultimate play on the game that favors the computer
                    var bestSpot = minimax(origBoard, aiPlayer);

                    //loging the results
                    gameBoard.updateGameBoard(bestSpot.index, aiPlayer);
                    console.log("function calls: " + fc);

                    // the main minimax function
                    function minimax(newBoard, player) {
                        //keep track of function calls;
                        fc++;

                        //available spots
                        var availSpots = emptyIndexies(newBoard);

                        // checks for the terminal states such as win, lose, and tie and returning a value accordingly
                        if (winning(newBoard, huPlayer)) {
                            return { score: -10 };
                        } else if (winning(newBoard, aiPlayer)) {
                            return { score: 10 };
                        } else if (availSpots.length === 0) {
                            return { score: 0 };
                        }

                        // an array to collect all the objects
                        var moves = [];

                        // loop through available spots
                        for (var i = 0; i < availSpots.length; i++) {
                            //create an object for each and store the index of that spot that was stored as a number in the object's index key
                            var move = {};
                            move.index = newBoard[availSpots[i]];

                            // set the empty spot to the current player
                            newBoard[availSpots[i]] = player;

                            //if collect the score resulted from calling minimax on the opponent of the current player
                            if (player == aiPlayer) {
                                var result = minimax(newBoard, huPlayer);
                                move.score = result.score;
                            } else {
                                var result = minimax(newBoard, aiPlayer);
                                move.score = result.score;
                            }

                            //reset the spot to empty
                            newBoard[availSpots[i]] = move.index;

                            // push the object to the array
                            moves.push(move);
                        }

                        // if it is the computer's turn loop over the moves and choose the move with the highest score
                        var bestMove;
                        if (player === aiPlayer) {
                            var bestScore = -10000;
                            for (var i = 0; i < moves.length; i++) {
                                if (moves[i].score > bestScore) {
                                    bestScore = moves[i].score;
                                    bestMove = i;
                                }
                            }
                        } else {
                            // else loop over the moves and choose the move with the lowest score
                            var bestScore = 10000;
                            for (var i = 0; i < moves.length; i++) {
                                if (moves[i].score < bestScore) {
                                    bestScore = moves[i].score;
                                    bestMove = i;
                                }
                            }
                        }

                        // return the chosen move (object) from the array to the higher depth
                        return moves[bestMove];
                    }

                    // returns the available spots on the board
                    function emptyIndexies(board) {
                        return board.filter((s) => s != "O" && s != "x");
                    }

                    // winning combinations using the board indexies for instace the first win could be 3 xes in a row
                    function winning(board, player) {
                        if (
                            (board[0] == player && board[1] == player && board[2] == player) ||
                            (board[3] == player && board[4] == player && board[5] == player) ||
                            (board[6] == player && board[7] == player && board[8] == player) ||
                            (board[0] == player && board[3] == player && board[6] == player) ||
                            (board[1] == player && board[4] == player && board[7] == player) ||
                            (board[2] == player && board[5] == player && board[8] == player) ||
                            (board[0] == player && board[4] == player && board[8] == player) ||
                            (board[2] == player && board[4] == player && board[6] == player)
                        ) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                    //gameBoard.updateGameBoard(bestmove, "O");
                    $roundAnnouncement.textContent = `Is ${player1.getPlayerName()}'s turn (X)`;
                    checkWinner();
                    round++;
                }
            } else if (!round % 2 === 0) {
                gameBoard.updateGameBoard(e.target.dataset.id, "O");
                $roundAnnouncement.textContent = `Is ${player1.getPlayerName()}'s turn (X)`;
                checkWinner();
                round++;
            }
        }
    });
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
    //delete every cell from the gameBoard
    const deleteBoard = () => {
        for (let i = 0; i < gameBoard.getGameBoard().length; i++) {
            const $cell = document.querySelectorAll(".cell");
            $cell.forEach((item) => {
                item.remove();
            });
        }
    };

    return { createGameBoard, updateCells, deleteBoard };
})();
