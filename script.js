const players = [createPlayer("Player1"), createPlayer("Player2")];

const TicTacToe = (function () {
    let turn = 0;   // used to determine which turn is it: even - player1, odd - player2
    let winner = 0; // used to determine winner: 1 - player1, 2 - player2

    const GameBoard = (function () {
        let board;

        function resetBoard() {
            board = [Array(3).fill("-"), Array(3).fill("-"), Array(3).fill("-")];
        }

        function displayBoard() {
            if (Array.isArray(board)) {
                for (let i = 0; i < 3; i++) {
                    console.log(board[i].toString().replace(/,/g, "|"));
                }
            }
            return board;
        }

        // return's used to check if the move was successful/not waste turns on "unavailable"
        function setCell(row, column, playerSign) {
            if (board[row][column] === "-") {
                board[row][column] = playerSign;
                return true;
            }
            else {
                console.log("Unavailable!");
                return false;
            }
        }

        function getCell(row, column) {
            return board[row][column];
        }

        resetBoard();
        return { resetBoard, displayBoard, setCell, getCell };
    })();

    const displayBoard = GameBoard.displayBoard;    // copie functions for return
    const getCell = GameBoard.getCell;

    function getTurn() {
        return turn;
    }

    function getWinner() {
        return winner;
    }

    function makeMove(row, column) {
        if (winner || turn > 8)
            return;

        let currentPlayerSign = turn % 2 ? "O" : "X";
        if (GameBoard.setCell(row, column, currentPlayerSign)) {
            checkForWinner(row, column, currentPlayerSign);
            turn++;
        }
        endOfGame();
    }

    function checkForWinner(rowIndex, columnIndex, curPlayerSign) {
        let result = checkInRow(rowIndex, curPlayerSign);
        result ||= checkInColumn(columnIndex, curPlayerSign);
        result ||= checkDiagonals(curPlayerSign);

        if (result)
            winner = turn % 2 ? 2 : 1;
    }

    function endOfGame() {
        if (winner) {
            let whoWon = winner === 1 ? players[0].getName() : players[1].getName();
            console.log(`${whoWon} won this round!`)
        }
        else if (turn > 8)
            console.log("It's a tie!");
    }

    function startNewGame() {
        turn = 0;
        winner = 0;
        GameBoard.resetBoard();
    }

    function checkInRow(rowIndex, playerSign) {
        for (let i = 0; i < 3; i++) {
            if (GameBoard.getCell(rowIndex, i) !== playerSign)
                return false;
        }
        return true;
    };

    function checkInColumn(columnIndex, playerSign) {
        for (let i = 0; i < 3; i++) {
            if (GameBoard.getCell(i, columnIndex) !== playerSign)
                return false;
        }
        return true;
    };

    function checkDiagonals(playerSign) {
        let count = 0;
        for (let i = 0; i < 3; i++) {                   // check first line
            if (GameBoard.getCell(i, i) === playerSign)
                count++;
        }
        if (count === 3)
            return true;

        for (let i = 0, j = 2; i < 3; i++, j--) {       // check second line
            if (GameBoard.getCell(i, j) !== playerSign)
                return false;
        }
        return true;
    };
    // maybe remove displayBoard from TicTacToe later
    return { getTurn, getWinner, getCell, makeMove, displayBoard, startNewGame };
})();

const displayController = (function () {
    const gameLog = document.querySelector("main>p");
    const playerScores = Array.from(document.querySelectorAll(".playerPanel .scoreValue"));
    const gameboardFields = document.querySelectorAll(".board>div");
    const resetBtn = document.querySelector("main>button");

    Array.from(gameboardFields).forEach(field => {
        field.addEventListener("click", chooseTile
        );
        field.addEventListener("keydown", (event) => {
            if (event.keyCode === 13)
                chooseTile
                    (event);
        });
    });

    function chooseTile(event) {
        let currentWinner = TicTacToe.getWinner();
        // if no winner then make move
        if (!currentWinner) {
            if (TicTacToe.getCell(event.target.dataset.row, event.target.dataset.column) === "-") {
                event.target.textContent = TicTacToe.getTurn() % 2 ? "O" : "X";
                TicTacToe.makeMove(event.target.dataset.row, event.target.dataset.column);
            }
            updateDisplay();
        } else gameLog.textContent = "This round is already over, how about another one?";
    }

    function updateDisplay() {
        // if we have a winner after this move
        currentWinner = TicTacToe.getWinner();
        if (currentWinner) {
            gameLog.textContent = `${players[currentWinner - 1].getName()} won this round!`;
            playerScores[currentWinner-1].textContent = +playerScores[currentWinner-1].textContent + 1;
            players[currentWinner - 1].addScore();

        } else {
            let whosNext = TicTacToe.getTurn() % 2 ? players[1].getName() : players[0].getName();
            gameLog.textContent = `${whosNext} it's your turn!`
        }
    }
    return playerScores;
})();

function createPlayer(name) {
    let totalScore = 0;

    function getName() {
        return name;
    }

    function setName(newName) {
        name = newName;
    }

    function getScore() {
        return totalScore;
    }

    function addScore() {
        totalScore++;
    }

    return { getName, setName, getScore, addScore }
}