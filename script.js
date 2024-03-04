const player1 = createPlayer("Player1");
const player2 = createPlayer("Player2");

function createPlayer(name) {
    let totalScore = 0;

    function getName(){
        return name;
    }

    function setName(newName){
        name = newName;
    }

    function getScore(){
        return totalScore;
    }

    function addScore(){
        totalScore++;
    }

    return { getName, setName, getScore, addScore }
}

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

    const displayBoard = GameBoard.displayBoard;    // copie display func for return

    function getTurn() {
        return turn;
    }

    function makeMove(row, column) {
        if (winner || turn > 8)
            return;

        let currentPlayerSign = turn % 2 ? "O" : "X";
        if (GameBoard.setCell(row, column, currentPlayerSign)) {
            checkForWinner(row, column, currentPlayerSign);
            turn++;
        }
        endOfGame(player1.getName(), player2.getName());
    }

    function checkForWinner(rowIndex, columnIndex, curPlayerSign) {
        let result = checkInRow(rowIndex, curPlayerSign);
        result ||= checkInColumn(columnIndex, curPlayerSign);
        result ||= checkDiagonals(curPlayerSign);

        if (result)
            winner = turn % 2 ? 2 : 1;
    }

    function endOfGame(player1Name, player2Name) {
        if (winner) {
            let whoWon = winner === 1 ? player1Name : player2Name;
            console.log(`${whoWon} won this round!`)
        }
        else if (turn > 8)
            console.log("It's a tie!");
    }

    function startNewGame(){
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
    return { getTurn, makeMove, displayBoard, startNewGame };
})();