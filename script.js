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

    function setCell(row, column, playerSign) {
        if (board[row][column] === "-")
            board[row][column] = playerSign;
        else console.log("Unavailable!");
    }

    function getCell(row, column) {
        return board[row][column];
    }

    resetBoard();
    return { resetBoard, displayBoard, setCell, getCell };
})();