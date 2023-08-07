function shuffle(array) {
    var _a;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
    }
    return array;
}
function generatePairs() {
    var gridSize = localStorage.getItem("grid-size");
    var numCells = gridSize === "4x4" ? 16 : 36;
    var numsArray = [];
    for (var i = 1; i <= numCells; i++) {
        numsArray.push(Math.ceil(i / 2));
    }
    return shuffle(numsArray);
}
function createElement(index, cell) {
    var gridVal = localStorage.getItem("grid-size") === "4x4" ? "sm" : "lg";
    var gameBoard = document.getElementById("game-board");
    gameBoard.className =
        gridVal == "sm" ? "game-board board-sm" : "game-board board-lg";
    var div = document.createElement("div");
    gameBoard.appendChild(div);
    div.className =
        gridVal == "sm"
            ? "cell-lg light-gray-text-xlg transition"
            : "cell-sm light-gray-text-lg transition";
    div.id = "cell-".concat(index + 1);
    div.textContent = cell.toString();
    var cellDiv = document.getElementById("cell-".concat(index + 1));
    var coverDiv = div.cloneNode();
    if (coverDiv instanceof HTMLElement) {
        coverDiv.className = "cell-cover";
    }
    cellDiv.appendChild(coverDiv);
}
function setGridFromStorage() {
    JSON.parse(localStorage.getItem("cells")).forEach(function (cell, index) {
        createElement(index, cell);
    });
}
function setGrid() {
    if (localStorage.getItem("game-status") !== "started")
        return;
    else if (localStorage.getItem("cells") || localStorage.getItem("match")) {
        setGridFromStorage();
        return;
    }
    else if (!localStorage.getItem("cells")) {
        var cells = generatePairs();
        localStorage.setItem("cells", JSON.stringify(cells));
        for (var i = 0; i < cells.length; i++) {
            createElement(i, cells[i]);
        }
    }
    if (localStorage.getItem("timer") !== null) {
        localStorage.removeItem("timer");
    }
    return;
}
function createDivWithClass(className, textContent) {
    var div = document.createElement("div");
    div.className = className;
    if (textContent)
        div.textContent = textContent;
    return div;
}
function setPlayerStats(setTimer) {
    var statsDiv = document.getElementById("stats");
    if (localStorage.getItem("num-player") === "1") {
        statsDiv.style.maxWidth = "532px";
        var timerDiv = createDivWithClass("stat-item");
        timerDiv.appendChild(createDivWithClass("stat-label", "Time"));
        var stopwatch = createDivWithClass("time blue-text-32");
        stopwatch.id = "stopwatch";
        timerDiv.appendChild(stopwatch);
        // if (localStorage.getItem("timer")) {
        // 	stopwatch.textContent = JSON.parse(localStorage.getItem("timer")!);
        // } else stopwatch.textContent = "00:00";
        var movesDiv = createDivWithClass("stat-item");
        movesDiv.appendChild(createDivWithClass("", "Moves"));
        var movesCount = createDivWithClass("moves blue-text-32");
        movesCount.id = "moves";
        if (JSON.parse(localStorage.getItem("player-stats"))) {
            movesCount.textContent = JSON.parse(localStorage.getItem("player-stats")).player_1.attempts.toString();
        }
        else
            movesCount.textContent = "0";
        movesDiv.appendChild(movesCount);
        statsDiv.appendChild(timerDiv);
        statsDiv.appendChild(movesDiv);
        setTimer;
    }
}
