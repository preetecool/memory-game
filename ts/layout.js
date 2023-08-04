function getGameBoard() {
    fetch("html/game.html")
        .then(function (response) { return response.text(); })
        .then(function (content) {
        var gameBody = document.getElementById("game-body");
        gameBody.innerHTML = content;
    })
        .catch(function (error) {
        console.error("Error loading game.html:", error);
    });
}
function shuffle(array) {
    var _a;
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [array[j], array[i]], array[i] = _a[0], array[j] = _a[1];
    }
    return array;
}
function generatePairs() {
    var gridSize = localStorage.getItem("grid-size-value");
    var numCells = gridSize === "4x4" ? 16 : 36;
    var numsArray = [];
    for (var i = 1; i <= numCells; i++) {
        numsArray.push(Math.ceil(i / 2));
    }
    return shuffle(numsArray);
}
function createElement(index, cell) {
    var gridVal = localStorage.getItem("grid-size-value") === "4x4" ? "sm" : "lg";
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
    if (localStorage.getItem("cells") !== null) {
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
}
