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
        }, 600);
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
    var playerTurn = Number(localStorage.getItem("player-turn"));
    var cells = mapFlippedCells(flippedCells);
    var matchingCells = false;
    if (localStorage.getItem("theme") === "Icons") {
        if (cells[0].src && cells[1].src) {
            matchingCells = cells[0].src === cells[1].src;
        }
    }
    else {
        matchingCells = cells[0].textContent === cells[1].textContent;
    }
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
    if (checkForMatched()) {
        handleGameOver();
    }
    localStorage.removeItem("attempt");
}
function checkForMatched() {
    var matched = localStorage.getItem("match");
    var allCells = JSON.parse(localStorage.getItem("cells"));
    if (matched && allCells.length === JSON.parse(matched).length) {
        return true;
    }
    return false;
}
function mapFlippedCells(flippedCells) {
    return flippedCells.map(function (el) {
        var _a;
        var cell = {
            id: Number(el.id.split("-")[1]),
            textContent: Number(el.textContent),
            // img: el.querySelector("img"),
            src: (_a = el.querySelector("img")) === null || _a === void 0 ? void 0 : _a.src
        };
        return cell;
    });
}
function updatePlayerStat(player, field, value) {
    var playerStats = JSON.parse(localStorage.getItem("player-stats"));
    var numPlayers = JSON.parse(localStorage.getItem("num-player"));
    // let playerTurn = Number(JSON.parse(localStorage.getItem("player-turn")!));
    playerStats[player][field] += value;
    localStorage.setItem("player-stats", JSON.stringify(playerStats));
    if (field === "score" && numPlayers !== "1") {
        var score = document.getElementById(player);
        if (score) {
            score.textContent = playerStats[player].score;
        }
    }
    if (field === "attempts") {
        var moves = document.getElementById("moves");
        if (moves) {
            moves.textContent = playerStats[player].attempts;
        }
    }
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
    updatePlayerStat("player_".concat(localStorage.getItem("player-turn")), "score", 1);
}
function handleAttemptCount() {
    // updatePlayerStat(`player_${localStorage.getItem("player-turn")}`, "attempts", 1);
    if (localStorage.getItem("num-player") === "1") {
        updatePlayerStat("player_1", "attempts", 1);
        return;
    }
    else {
        updatePlayerStat("player_".concat(localStorage.getItem("player-turn")), "attempts", 1);
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
            var cardId = "player_".concat(i, "-card");
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
    var _a = timerValue ? JSON.parse(timerValue) : [0, 0, 0], minutes = _a[0], decaseconds = _a[1], seconds = _a[2];
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
    localStorage.setItem("game-status", "started");
    localStorage.setItem("timer", "[0,0,0]");
    var playerStats = JSON.parse(localStorage.getItem("player-stats") || "{}");
    for (var player in playerStats) {
        playerStats[player].score = 0;
        playerStats[player].attempts = 0;
    }
    localStorage.setItem("player-stats", JSON.stringify(playerStats));
    var mainDiv = document.getElementById("game-body");
    mainDiv.style.display = "block";
    location.reload();
}
timerInterval = handleTimer();
function newGame() {
    localStorage.clear();
    document.getElementById("game-body").style.display = "block";
    location.reload();
}
function handleGameOver() {
    clearInterval(timerInterval);
    localStorage.setItem("game-status", "finished");
    handleWinners();
}
function handleWinners() {
    var playerStats = JSON.parse(localStorage.getItem("player-stats") || "{}");
    var numPlayers = Number(localStorage.getItem("num-player"));
    var parentDiv = document.getElementById("main");
    var modalBg = createModalBackground(parentDiv);
    var modal = undefined;
    var winners = [];
    if (numPlayers !== 1) {
        var scores = {
            player_1: playerStats.player_1.score,
            player_2: playerStats.player_2.score,
            player_3: playerStats.player_3.score,
            player_4: playerStats.player_4.score
        };
        var sortedScores = Object.entries(scores).sort(function (a, b) { return b[1] - a[1]; });
        var topScore_1 = sortedScores[0][1];
        winners = sortedScores
            .filter(function (_a) {
            var player = _a[0], score = _a[1];
            return score === topScore_1;
        })
            .map(function (_a) {
            var player = _a[0];
            return player;
        });
        modal = createModal(modalBg, numPlayers, winners);
        for (var i = 0; i <= numPlayers; i++) {
            createPlayerResult(modal, "Player ".concat(i + 1), playerStats["player_".concat(i + 1)].score, winners);
        }
    }
    else {
        winners.push(playerStats["player_1"]);
        modal = createModal(modalBg, numPlayers, winners);
        createPlayerResult(modal, "Time Elapsed", document.getElementById("stopwatch").textContent);
        createPlayerResult(modal, "Moves Taken", playerStats["player_1"].attempts);
    }
    var buttonDiv = document.createElement("div");
    buttonDiv.className = "option-buttons_setup";
    buttonDiv.style.height = "52px !important";
    createButton("Restart", buttonDiv, "orange", handleReset);
    createButton("Setup New Game", buttonDiv, "#DFE7EC", newGame, "#304859");
    modal.appendChild(buttonDiv);
    var span = document.createElement("span");
}
function createModalBackground(parent) {
    var modalBg = document.createElement("div");
    modalBg.className = "setup modal-bg";
    parent.insertBefore(modalBg, parent.firstChild);
    return modalBg;
}
function createModal(parent, numPlayers, winners) {
    var modal = document.createElement("div");
    modal.className = "popup_setup game-settings modal";
    parent.appendChild(modal);
    var title = document.createElement("h1");
    var subtitle = document.createElement("span");
    var singleWinner = "Player ".concat(winners[0].charAt(winners[0].length - 1));
    var winner = winners.length > 1 && numPlayers > 1 ? "It's a tie!" : "".concat(singleWinner, " Wins!");
    title.textContent = numPlayers === 1 ? "You Did it!" : winner;
    subtitle.className = "stat-label";
    subtitle.style.color = "#7191a5";
    subtitle.textContent = "Game over! Here are the results:";
    modal.appendChild(title);
    title.appendChild(subtitle);
    return modal;
}
function createPlayerResult(parent, label, score, winners) {
    var div = document.createElement("div");
    var id = label.toLowerCase().replace(" ", "_");
    div.id = id + "_gg";
    div.className = "player-result";
    var labeldiv = document.createElement("div");
    labeldiv.className = "stat-label";
    labeldiv.textContent = label;
    var numPlayers = localStorage.getItem("num-player");
    var scoreElem = document.createElement("div");
    scoreElem.className = "blue-text-32";
    scoreElem.textContent = numPlayers === "1" ? String(score) : String(score) + " Pairs";
    if (winners && winners.includes(id)) {
        div.className += " winner white-text";
        label += " (Winner!)";
    }
    console.log(winners);
    div.appendChild(labeldiv);
    div.appendChild(scoreElem);
    parent.appendChild(div);
}
function createButton(text, parent, bgColor, fn, color) {
    var button = document.createElement("button");
    button.className = "radio-label btn-gameover";
    button.style.backgroundColor = bgColor;
    if (color) {
        button.style.color = color;
    }
    button.textContent = text;
    button.onclick = fn;
    parent.appendChild(button);
}
