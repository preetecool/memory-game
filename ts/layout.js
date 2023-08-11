function shuffle(array) {
    var _a;
    if (localStorage.getItem("theme") === "Icons") {
        array = mapIcons();
    }
    if (!array)
        return [];
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
function createElement(index, cell, url) {
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
    var cellDiv = document.getElementById("cell-".concat(index + 1));
    var coverDiv = createDivWithClass("cell-cover", "");
    if (localStorage.getItem("theme") === "Icons") {
        var icon = document.createElement("img");
        icon.src = url;
        icon.className = gridVal == "sm" ? "icon icon-lg" : "icon icon-sm";
        icon.style.fill = "#fcfcfc";
        div.appendChild(icon);
    }
    if (localStorage.getItem("theme") === "Numbers") {
        div.textContent = cell.toString();
    }
    cellDiv.appendChild(coverDiv);
}
function setGridFromStorage() {
    var icons = localStorage.getItem("theme") === "Icons";
    var cells = JSON.parse(localStorage.getItem("cells"));
    for (var i = 0; i < cells.length; i++) {
        if (icons) {
            createElement(i, undefined, cells[i].url);
        }
        else {
            createElement(i, cells[i]);
        }
    }
    // localStorage.setItem("cells", JSON.stringify(cells));
}
function setGrid() {
    var gameStatus = localStorage.getItem("game-status");
    // if (gameStatus !== "started" || gameStatus !== "finished") return;
    if (localStorage.getItem("cells") || localStorage.getItem("match")) {
        setGridFromStorage();
        setPlayerStats;
        return;
    }
    else if (!localStorage.getItem("cells")) {
        if (localStorage.getItem("theme") === "Icons") {
            var cells = shuffle();
            for (var i = 0; i < cells.length; i++) {
                createElement(i, undefined, cells[i].url);
            }
            localStorage.setItem("cells", JSON.stringify(shuffle()));
        }
        else if (localStorage.getItem("theme") === "Numbers") {
            var cells = generatePairs();
            for (var i = 0; i < cells.length; i++) {
                createElement(i, cells[i]);
            }
            localStorage.setItem("cells", JSON.stringify(cells));
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
    if (localStorage.getItem("game-status") === null) {
        localStorage.removeItem("player-stats");
    }
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
            statsDiv.appendChild(createStatItem("Player ".concat(i), "player_".concat(i), stats["player_".concat(i)].score || "0"));
        }
        if (localStorage.getItem("player-turn")) {
            var playerTurn = Number(localStorage.getItem("player-turn"));
            var turnIndicator = document.createElement("div");
            var childElement = statsDiv.querySelector("#player_".concat(playerTurn, "-card"));
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
    var _a;
    var gridSize = localStorage.getItem("grid-size");
    var icons = [
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
        "compass",
        "newspaper",
    ].map(function (id, idx) { return ({ id: idx, url: "./assets/icons/".concat(id, ".svg") }); });
    var grid16 = (_a = icons.slice(0, 8)).concat.apply(_a, icons.slice(0, 8));
    var grid36 = icons.concat.apply(icons, icons);
    var map = gridSize === "4x4" ? grid16 : grid36;
    return map;
}
