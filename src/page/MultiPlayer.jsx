import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { closeWebSocket, getWebSocket } from "../socket";

export default function MultiPlayer() {
  const [playerNumber, setPlayerNumber] = useState(null);
  const [wordList, setWordList] = useState("");
  const [currentWord, setCurrentWord] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [userInput, setUserInput] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [replayCount, setReplayCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const socket = getWebSocket();

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setUserInput(inputValue);

    if (inputValue === currentWord.word) {
      setScore((prevScore) => {
        const newScore = prevScore + 1;

        socket.emit("scoreUpdate", {
          playerNumber: playerNumber,
          score: newScore,
        });
        return newScore;
      });

      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;

        if (nextIndex < wordList.length) {
          setCurrentWord(wordList[nextIndex]);
        }

        return nextIndex;
      });
      setUserInput("");
    }
  };

  const renderWordWithHighlight = () => {
    const word = wordList[currentIndex]?.word || "";
    const splitWord = word.split("");
    const splitInput = userInput.split("");

    return splitWord.map((char, index) => {
      const isCorrect = splitInput[index] === char;
      const hasTyped = index < splitInput.length;
      return (
        <span
          key={index}
          style={{
            color: !hasTyped ? "black" : isCorrect ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {char}
        </span>
      );
    });
  };

  useEffect(() => {
    socket.on("wordList", (words) => {
      setWordList(words);
      setCurrentWord(words[0]);
    });

    socket.on("scoreUpdate", (data) => {
      if (data.playerNumber === playerNumber) {
        setScore(data.score);
      } else {
        setOpponentScore(data.score);
      }
    });

    socket.on("replayStatus", (data) => {
      setReplayCount(data.replayCount);
    });

    socket.on("gameRestart", () => {
      setScore(0);
      setOpponentScore(0);
      setReplayCount(0);
      setCurrentIndex(0);
      setCurrentWord(wordList[0]?.word || "");
      setUserInput("");
      setGameOver(false);

      socket.emit("wordList");
    });

    socket.on("playerLeave", () => {
      alert("Your opponent has left the game.");
      socket.emit("playerLeave");
      closeWebSocket();
      navigate("/");
    });

    socket.on("timeUpdate", ({ remainingTime }) => {
      setTimeLeft(remainingTime);
    });

    socket.on("gameOver", ({ player1Score, player2Score }) => {
      setGameOver(true);
      if (playerNumber === 1) {
        setScore(player1Score);
        setOpponentScore(player2Score);
      } else if (playerNumber === 2) {
        setScore(player2Score);
        setOpponentScore(player1Score);
      }
    });

    return () => {
      socket.off("scoreUpdate");
      socket.off("replayStatus");
      socket.off("gameRestart");
      socket.off("playerLeave");
      socket.off("timeUpdate");
      socket.off("gameOver");
      socket.off("wordList");
    };
  }, [playerNumber]);

  useEffect(() => {
    setPlayerNumber(socket.playerNumber);
    setGameOver(false);

    socket.emit("wordList");
  }, []);

  const handleLeave = () => {
    if (socket) {
      socket.emit("playerLeave");
      closeWebSocket();
    }
    navigate("/");
  };

  const handleReplayRequest = () => {
    if (socket) {
      socket.emit("playerReplay");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <h3>Type the given word within 30 seconds</h3>
      <h1
        style={{ fontSize: "4rem", marginBottom: "20px", userSelect: "none" }}
      >
        {renderWordWithHighlight()}
      </h1>
      <TextField
        label="Start typing..."
        variant="outlined"
        value={userInput}
        onChange={handleInputChange}
        disabled={gameOver}
        style={{ marginBottom: "20px", width: "300px" }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: "0 40px" }}>Time left: {timeLeft}</h2>
        <h2 style={{ margin: "0 40px" }}>Your Score: {score}</h2>
        <h2 style={{ margin: "0 40px" }}>Opponent Score: {opponentScore}</h2>
      </div>
      {gameOver && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h2>Game Over! Final Score: {score}</h2>
          <div>
            <Button
              variant="contained"
              color="error"
              onClick={handleLeave}
              style={{ margin: "10px" }}
            >
              Leave Game
            </Button>
            <Button
              variant="contained"
              onClick={handleReplayRequest}
              style={{ margin: "10px" }}
              color="success"
            >
              Request Replay
            </Button>
            <p>{replayCount}/2 players want a rematch</p>
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "40px",
        }}
      >
        <h2>Instructions</h2>
        <h4>Type each word correctly within the given time to score points!</h4>
      </div>
    </div>
  );
}
