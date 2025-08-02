const Gameboard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => [...board];

  const setCell = (index, marker) => {
    if (board[index] === "") {
      board[index] = marker;
      return true;
    }
    return false;
  };

  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { getBoard, setCell, resetBoard };
})();

const Player = (name, marker) => {
  return { name, marker };
};

const GameController = (() => {
  let player1 = null;
  let player2 = null;
  let currentPlayer = null;
  let gameOver = false;
  let resultMessage = "";

  const setPlayers = (name1, name2) => {
    player1 = Player(name1, "X");
    player2 = Player(name2, "O");
    currentPlayer = player1;
  };

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
  };

  const checkWin = (marker) => {
    const b = Gameboard.getBoard();
    const winPatterns = [
      [0,1,2], [3,4,5], [6,7,8],
      [0,3,6], [1,4,7], [2,5,8],
      [0,4,8], [2,4,6]
    ];
    return winPatterns.some(pattern =>
      pattern.every(index => b[index] === marker)
    );
  };

  const checkTie = () => {
    return Gameboard.getBoard().every(cell => cell !== "");
  };

  const playRound = (index) => {
    if (gameOver || !Gameboard.setCell(index, currentPlayer.marker)) return;

    if (checkWin(currentPlayer.marker)) {
      resultMessage = `${currentPlayer.name} wins!`;
      gameOver = true;
    } else if (checkTie()) {
      resultMessage = "It's a tie!";
      gameOver = true;
    } else {
      switchPlayer();
    }
  };

  const getCurrentPlayer = () => currentPlayer;
  const isGameOver = () => gameOver;
  const getResultMessage = () => resultMessage;

  const resetGame = () => {
    Gameboard.resetBoard();
    currentPlayer = player1;
    gameOver = false;
    resultMessage = "";
  };

  return {
    setPlayers,
    playRound,
    getCurrentPlayer,
    isGameOver,
    getResultMessage,
    resetGame
  };
})();


const DisplayController = (() => {
  const cells = document.querySelectorAll(".cell");
  const startBtn = document.querySelector("#start-btn");
  const player1Input = document.querySelector("#player1");
  const player2Input = document.querySelector("#player2");
  const message = document.querySelector("#message");

  const render = () => {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  const handleClick = (event) => {
    const index = parseInt(event.target.dataset.index);
    GameController.playRound(index);
    render();
    updateMessage();
  };

  const setupListeners = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell, index) => {
      cell.dataset.index = index;
      cell.removeEventListener("click", handleClick);
      cell.addEventListener("click", handleClick);
    });

    startBtn.addEventListener("click", () => {
      const name1 = player1Input.value || "Player 1";
      const name2 = player2Input.value || "Player 2";
      GameController.setPlayers(name1, name2);
      GameController.resetGame();
      render();
      updateMessage();
      setupListeners();
    });
  };

  const updateMessage = () => {
    if (GameController.isGameOver()) {
      message.textContent = GameController.getResultMessage();
    } else {
      message.textContent = `${GameController.getCurrentPlayer().name}'s turn`;
    }
  };

  const init = () => {
    setupListeners();
    render();
    updateMessage();
  };

  return { init };
})();

DisplayController.init();

