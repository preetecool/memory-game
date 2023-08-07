function revealCell() {
    if (localStorage.getItem("timer") === null) {
        handleTimer();
    }
    var numCellsRevealed = 0;
    var flippedElements = [];
    var matching = false;
    document.addEventListener("click", handleCellClick);
    if (localStorage.getItem("match") !== null) {
        restoreMatchedCells();
        localStorage.removeItem("attempt");
    }
    function handleCellClick(e) {
        var target = e.target;
        if (numCellsRevealed >= 2 && matching) {
            numCellsRevealed = 2;
            document.removeEventListener("click", handleCellClick);
            return;
        }
        if (target.className === "cell-cover") {
            localStorage.setItem("attempt", "true");
            revealTargetCell(target);
            numCellsRevealed++;
            flippedElements.push(target.parentElement);
            if (numCellsRevealed === 2 &&
                localStorage.getItem("attempt") === "true") {
                if (numCellsRevealed === 2)
                    numCellsRevealed = 2;
                matching = true;
                setTimeout(function () {
                    handleMatch(flippedElements);
                    numCellsRevealed = 0;
                    flippedElements = [];
                    localStorage.setItem("attempt", "false");
                    matching = false;
                    document.addEventListener("click", handleCellClick);
                }, 400);
            }
        }
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
        console.log(playerTurn);
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
    console.log(playerStats);
    playerStats["player_" + playerTurn].score++;
    localStorage.setItem("player-stats", JSON.stringify(playerStats));
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
    }
}
function handleTimer() {
    if (localStorage.getItem("timer") !== null)
        return;
    var seconds = 0;
    var minutes = 0;
    var timerInterval = setInterval(function () {
        seconds++;
        if (seconds === 60) {
            minutes++;
            seconds = 0;
        }
        localStorage.setItem("timer", JSON.stringify(minutes + seconds));
    }, 1000);
    return timerInterval;
}
function handleReset() {
    document.addEventListener("click", function (e) {
        var target = e.target;
        if (target.id === "restart") {
            localStorage.removeItem("cells");
            localStorage.removeItem("match");
            var playerStats = JSON.parse(localStorage.getItem("player-stats"));
            for (var player in playerStats) {
                playerStats[player].score = 0;
                playerStats[player].attempts = 0;
            }
            localStorage.setItem("player-stats", JSON.stringify(playerStats));
            location.reload();
        }
    });
}
