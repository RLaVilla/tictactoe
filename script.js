function GameBoard () {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const checkWinner = (symbol) => {
        for (let i = 0; i < rows; i++) {
        if (board[i][0].getValue() === symbol && 
                board[i][1].getValue() === symbol &&
                board[i][2].getValue() === symbol) {
                return true;
            }
        }
        
        for (let i = 0; i < columns; i++) {
            if (board[0][i].getValue() === symbol && 
                board[1][i].getValue() === symbol &&
                board[2][i].getValue() === symbol) {
                return true;
            }
        }

        
        if (board[0][0].getValue() === symbol && 
            board[1][1].getValue() === symbol &&
            board[2][2].getValue() === symbol) {
            return true;
        }
        if (board[0][2].getValue() === symbol && 
            board[1][1].getValue() === symbol &&
            board[2][0].getValue() === symbol) {
            return true;
        }

        return false;
}


    const getBoard = () => board;

    const takeSpot = (row, col, player) => {
        if (board[row][col].getValue() === 0) {
            board[row][col].addSymbol(player);
        } else {
            console.log(`Spot not available. Go again.`)
            return
        }
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(boardWithCellValues);
    };
    
    console.log("board:", board);

    return { getBoard, takeSpot, printBoard, checkWinner };

}

function Cell() {
    let value = 0;
    const addSymbol = (player) => {
        value  = player;
    };

    const getValue = () => value;

    return {
        addSymbol,
        getValue
    };
}

function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    const board = GameBoard();

    const players = [
        {
            name: playerOneName,
            symbol: "X"
        },
        {
            name: playerTwoName,
            symbol: "O"
        }
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players [1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, col) => {
        currentBoard = board.getBoard();
        if (currentBoard[row][col].getValue() === 0) {
            console.log(
            `${getActivePlayer().name} has taken row ${row}, column ${col}`
        );
        board.takeSpot(row, col, getActivePlayer().symbol);
        const button = document.querySelector(`button[data-row="${row}"][data-column="${col}"]`);
        button.textContent = getActivePlayer().symbol;
        button.disabled = true;

        const playerTurnDiv = document.querySelector('.turn');

        if (board.checkWinner(getActivePlayer().symbol)) {
            playerTurnDiv.textContent = `${activePlayer.name} wins!`
            
            const cellButtons = document.querySelectorAll(".cell");
            cellButtons.forEach(button => {
                button.disabled = true;
                button.style.backgroundColor = "grey";
            });
            
        }  else {
            switchPlayerTurn();
            printNewRound();
            playerTurnDiv.textContent = `${activePlayer.name}'s turn...`
        }
        
        } else {
            "Spot taken. Try again."
            return
        }

    };

    const updatePlayerNames = (newPlayerOneName, newPlayerTwoName) => {
        players[0].name = newPlayerOneName || players[0].name;
        players[1].name = newPlayerTwoName || players[1].name;
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        updatePlayerNames
    };
}

function ScreenController() {
    const game = GameController()
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');
    const form = document.getElementById("nameForm");

    const updateScreen = () => {
        boardDiv.textContent = "";
    
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

        board.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellButton = document.createElement("button");
                cellButton.classList.add("cell");
                cellButton.addEventListener("click", () => {
                    game.playRound(rowIndex, colIndex);  
                });

                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = colIndex;
                cellButton.textContent = "";
                boardDiv.appendChild(cellButton);
            })
        })
    }
    form.addEventListener('submit', (event) => {
        event.preventDefault(); 
    
        const playerOneName = document.getElementById("playerOneName").value || "Player One";
        const playerTwoName = document.getElementById("playerTwoName").value || "Player Two";
    
        const game = GameController(playerOneName, playerTwoName);

        updateScreen();
    
        form.style.visibility = "hidden";
    });
    
    updateScreen();
}

const clearButton = document.getElementById("clearButton");
    clearButton.addEventListener('click', () => {
        ScreenController();
    });

const closeButton = document.getElementById("closeButton");
const nameButton = document.getElementById("namesButton");
const form = document.getElementById("nameForm");

    closeButton.addEventListener('click', () => {
        form.style.visibility = "hidden";
    });

    nameButton.addEventListener('click', () => {
        form.style.visibility = "visible";
    });



ScreenController();

