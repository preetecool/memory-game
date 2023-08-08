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
        setPlayerStats;
        return;
    }
    else if (!localStorage.getItem("cells")) {
        var cells = generatePairs();
        localStorage.setItem("cells", JSON.stringify(cells));
        for (var i = 0; i < cells.length; i++) {
            createElement(i, cells[i]);
        }
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
function setPlayerStats() {
    var statsDiv = document.getElementById("stats");
    if (!statsDiv || localStorage.getItem("num-player") !== "1")
        return;
    statsDiv.style.maxWidth = "532px";
    var timerDiv = createStatItem("Time", "stopwatch", formatTime(localStorage.getItem("timer") || "0:00"));
    var movesDiv = createStatItem("Moves", "moves", getPlayerAttempts());
    statsDiv.appendChild(timerDiv);
    statsDiv.appendChild(movesDiv);
}
function createStatItem(label, id, content) {
    var statItemDiv = createDivWithClass("stat-item");
    statItemDiv.appendChild(createDivWithClass("stat-label", label));
    var contentDiv = createDivWithClass("blue-text-32", content);
    contentDiv.id = id;
    statItemDiv.appendChild(contentDiv);
    return statItemDiv;
}
function formatTime(time) {
    if (time.indexOf(",") !== -1)
        // return time.replace(",", ":").replace("[", "").replace("]", "");
        return time.replace(/,|\[|\]/g, function (match) { return (match === "," ? ":" : ""); });
    var parsedTime = JSON.parse(time);
    return parsedTime;
}
function getPlayerAttempts() {
    var _a;
    var playerStats = JSON.parse(localStorage.getItem("player-stats") || "{}");
    return (((_a = playerStats.player_1) === null || _a === void 0 ? void 0 : _a.attempts) || 0).toString();
}
