var timerInterval;
var numCellsRevealed = 0;
var flippedElements = [];
var matching = false;
function revealCell() {
    document.addEventListener("click", handleCellClick);
    if (localStorage.getItem("match") !== null) {
        restoreMatchedCells();
        localStorage.removeItem("attempt");
    }
}
function handleCellClick(e) {
    var target = e.target;
    if (target.className !== "cell-cover" || (numCellsRevealed >= 2 && matching))
        return;
    localStorage.setItem("attempt", "true");
    revealTargetCell(target);
    numCellsRevealed++;
    flippedElements.push(target.parentElement);
    if (numCellsRevealed === 2) {
        matching = true;
        setTimeout(function () {
            handleMatch(flippedElements);
            resetMatchingState();
        }, 400);
    }
}
function resetMatchingState() {
    numCellsRevealed = 0;
    flippedElements = [];
    localStorage.setItem("attempt", "false");
    matching = false;
    document.addEventListener("click", handleCellClick);
}
function revealTargetCell(target) {
    target.style.display = "none";
    var cell = document.getElementById(target.parentElement.id);
    cell.style.backgroundColor = "#fda214";
}
function restoreMatchedCells() {
    if (localStorage.getItem("match") === null)
        return;
    var matchedCells = localStorage.getItem("match");
    if (matchedCells) {
        var cells = JSON.parse(matchedCells);
        cells.forEach(function (cell) {
            var cellDiv = document.getElementById("cell-".concat(cell.id));
            var coverDiv = cellDiv.querySelector(".cell-cover");
            coverDiv.style.display = "none";
            cellDiv.style.backgroundColor = "#BCCED9";
        });
    }
}
function handleMatch(flippedCells) {
    var cells = mapFlippedCells(flippedCells);
    var matchingCells = cells[0].textContent === cells[1].textContent;
    var playerTurn = Number(localStorage.getItem("player-turn"));
    if (matchingCells) {
        handleMatchingCells(flippedCells, cells);
        handleScore();
        handleAttemptCount();
    }
    else {
        handleNonMatchingCells(flippedCells);
        handleAttemptCount();
        handlePlayerTurn((playerTurn += 1));
    }
    localStorage.removeItem("attempt");
}
function mapFlippedCells(flippedCells) {
    return flippedCells.map(function (el) {
        var cell = {
            id: Number(el.id.split("-")[1]),
            textContent: Number(el.textContent),
        };
        return cell;
    });
}
function updatePlayerStat(player, field, value) {
    var playerStats = JSON.parse(localStorage.getItem("player-stats"));
    playerStats[player][field] += value;
    localStorage.setItem("player-stats", JSON.stringify(playerStats));
}
function handleMatchingCells(flippedCells, cells) {
    changeBackgroundColor(flippedCells, "#bcced9");
    var matchedCells = localStorage.getItem("match")
        ? JSON.parse(localStorage.getItem("match"))
        : [];
    localStorage.setItem("match", JSON.stringify(matchedCells.concat(cells)));
}
function changeBackgroundColor(flippedCells, color) {
    for (var i = 0; i < flippedCells.length; i++) {
        flippedCells[i].style.backgroundColor = color;
    }
}
function handleNonMatchingCells(flippedCells) {
    flippedCells.forEach(function (cell) {
        var cover = cell.querySelector(".cell-cover");
        cover.style.display = "block";
    });
}
function handleScore() {
    var playerTurn = localStorage.getItem("player-turn");
    var playerStats = JSON.parse(localStorage.getItem("player-stats"));
    playerStats["player_" + playerTurn].score++;
    localStorage.setItem("player-stats", JSON.stringify(playerStats));
    if (localStorage.getItem("num-player") !== "1") {
        var score = document.getElementById("player-".concat(playerTurn));
        score.innerHTML = playerStats["player_" + playerTurn].score.toString();
    }
    // return score
}
function handleAttemptCount() {
    var playerStats = JSON.parse(localStorage.getItem("player-stats"));
    if (localStorage.getItem("num-player") === "1") {
        playerStats.player_1.attempts++;
        localStorage.setItem("player-stats", JSON.stringify(playerStats));
        var moves = document.getElementById("moves");
        moves.textContent = playerStats.player_1.attempts.toString();
        return;
    }
    else {
        var playerTurn = JSON.parse(localStorage.getItem("player-turn"));
        playerStats["player_".concat(playerTurn)].attempts++;
        localStorage.setItem("player-stats", JSON.stringify(playerStats));
    }
}
function handlePlayerTurn(playerTurn) {
    var numPlayers = localStorage.getItem("num-player");
    if (numPlayers === "1") {
        localStorage.setItem("player-turn", "1");
        return;
    }
    else {
        if (playerTurn > Number(numPlayers)) {
            playerTurn = 1;
        }
        localStorage.setItem("player-turn", playerTurn.toString());
        for (var i = 1; i <= Number(numPlayers); i++) {
            var cardId = "player-".concat(i, "-card"); // Use 'i' instead of 'playerTurn'
            var playerScoreCard = document.getElementById(cardId);
            var turnIndicator = document.createElement("div");
            turnIndicator.className = "turn-indicator";
            if (playerScoreCard) {
                if (i === playerTurn) {
                    playerScoreCard.classList.add("stat-active");
                    playerScoreCard.appendChild(turnIndicator);
                }
                else {
                    playerScoreCard.classList.remove("stat-active");
                    // playerScoreCard.style.backgroundColor = "#DFE7EC";
                    // playerScoreCard.style.removeProperty("color");
                    var indicator = playerScoreCard.querySelector(".turn-indicator");
                    if (indicator) {
                        playerScoreCard.removeChild(indicator);
                    }
                }
            }
        }
    }
}
function handleTimer() {
    if (localStorage.getItem("num-player") !== "1")
        return;
    var timerValue = localStorage.getItem("timer");
    var _a = timerValue
        ? JSON.parse(timerValue)
        : [0, 0, 0], minutes = _a[0], decaseconds = _a[1], seconds = _a[2];
    // Function to update the display
    var updateDisplay = function () {
        var timerElement = document.getElementById("stopwatch");
        if (timerElement) {
            timerElement.textContent = "".concat(minutes, ":").concat(decaseconds).concat(seconds);
        }
    };
    timerInterval = setInterval(function () {
        if (localStorage.getItem("game-status") !== "started")
            return;
        seconds++;
        if (seconds === 10) {
            decaseconds++;
            seconds = 0;
        }
        if (decaseconds === 6) {
            minutes++;
            decaseconds = 0;
        }
        localStorage.setItem("timer", JSON.stringify([minutes, decaseconds, seconds]));
        updateDisplay();
    }, 1000);
    updateDisplay();
    return timerInterval;
}
function handleReset() {
    clearInterval(timerInterval);
    localStorage.removeItem("timer");
    localStorage.removeItem("cells");
    localStorage.removeItem("match");
    var playerStats = JSON.parse(localStorage.getItem("player-stats") || "{}");
    for (var player in playerStats) {
        playerStats[player].score = 0;
        playerStats[player].attempts = 0;
    }
    localStorage.setItem("player-stats", JSON.stringify(playerStats));
    location.reload();
}
timerInterval = handleTimer();
