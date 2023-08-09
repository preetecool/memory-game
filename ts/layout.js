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
    gameBoard.className = gridVal == "sm" ? "game-board board-sm" : "game-board board-lg";
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
    var numPlayers = localStorage.getItem("num-player");
    if (!statsDiv)
        return;
    if (numPlayers === "1") {
        statsDiv.style.maxWidth = "532px";
        var timerDiv = createStatItem("Time", "stopwatch", formatTime(localStorage.getItem("timer") || "0:00"));
        var movesDiv = createStatItem("Moves", "moves", getPlayerAttempts());
        statsDiv.appendChild(timerDiv);
        statsDiv.appendChild(movesDiv);
    }
    if (numPlayers !== "1") {
        var stats = JSON.parse(localStorage.getItem("player-stats") || "{}");
        for (var i = 1; i <= Number(numPlayers); i++) {
            statsDiv.appendChild(createStatItem("Player ".concat(i), "player-".concat(i), stats["player_".concat(i)].score || "0"));
        }
        if (localStorage.getItem("player-turn")) {
            var playerTurn = Number(localStorage.getItem("player-turn"));
            var turnIndicator = document.createElement("div");
            var childElement = statsDiv.querySelector("#player-".concat(playerTurn, "-card"));
            childElement === null || childElement === void 0 ? void 0 : childElement.classList.add("stat-active");
            turnIndicator.className = "turn-indicator";
            if (childElement) {
                childElement.appendChild(turnIndicator);
            }
        }
    }
}
function createStatItem(label, id, content) {
    var statItemDiv = createDivWithClass("stat-item");
    statItemDiv.id = id + "-card";
    statItemDiv.appendChild(createDivWithClass("stat-label", label));
    var contentDiv = createDivWithClass("blue-text-32", content);
    contentDiv.id = id;
    statItemDiv.appendChild(contentDiv);
    return statItemDiv;
}
function formatTime(time) {
    try {
        var _a = JSON.parse(time), mins = _a[0], decaseconds = _a[1], seconds = _a[2];
        return "".concat(mins, ":").concat(decaseconds).concat(seconds);
    }
    catch (error) {
        console.error("Error parsing time:", error);
        return "0:00";
    }
}
function getPlayerAttempts() {
    var _a;
    var playerStats = JSON.parse(localStorage.getItem("player-stats") || "{}");
    return (((_a = playerStats.player_1) === null || _a === void 0 ? void 0 : _a.attempts) || 0).toString();
}
function mapIcons() {
    var iconName = [
        "bell",
        "circle",
        "font-awesome",
        "futbol",
        "gem",
        "hand-spock",
        "heart",
        "hourglass",
        "lemon",
        "lightbulb",
        "map",
        "moon",
        "paper-plane",
        "square-full",
        "star",
        "sun",
    ];
    var arr = [];
    for (var i = 0; i < iconName.length; i++) {
        var mappedObj = {
            id: i,
            url: "./assets/icons/".concat(iconName[i], ".svg"),
        };
        arr.push(mappedObj);
    }
    return arr;
}
console.log(mapIcons());
