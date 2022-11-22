// gameBoard module
const gameBoard = (() => {
    const $gameCanvas = document.querySelector(".gameBoard");

    let gameBoard = ["", "", "", "", "", "", "", "", ""];
    let counter = 0;

    const setGameBoard = (position, value) => {
        gameBoard[position] = value;
        displayGameBoard.updateCanvas();
    };

    $gameCanvas.addEventListener("click", (e) => {
        if (e.target.textContent === "") {
            if (counter % 2 === 0) {
                setGameBoard(e.target.dataset.id, "x");
            } else {
                setGameBoard(e.target.dataset.id, "0");
            }
            counter++;
        }
    });
    return { gameBoard };
})();

// player factory function
const player = (name) => {
    const playerName = name;
    let score = 0;
    const getPlayerName = () => {
        return playerName;
    };
    const getPlayerScore = () => {
        return score;
    };
    const setPlayerScore = (value) => {
        score += value;
    };

    return { getPlayerName, getPlayerScore };
};

// game module
const game = ((name1, name2) => {
    const player1 = player(name1);
    const player2 = player(name2);
    const showWinner = () => {
        console.log(`${getPlayerName()} won`);
        setPlayerScore(1);
    };
    return { player1, player2 };
})("Marcel", "Caramel");

// displayGameBoard module
const displayGameBoard = (() => {
    const $gameCanvas = document.querySelector(".gameBoard");
    for (let i = 0; i < gameBoard.gameBoard.length; i++) {
        const $div = document.createElement("div");
        $div.setAttribute("class", "box");
        $div.setAttribute("data-id", i);
        $div.textContent = gameBoard.gameBoard[i];
        $gameCanvas.appendChild($div);
    }

    const updateCanvas = () => {
        for (const child of $gameCanvas.children) {
            child.textContent = gameBoard.gameBoard[child.dataset.id];
        }
    };
    return { updateCanvas };
})();
