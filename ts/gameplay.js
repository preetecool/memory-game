function revealCell() {
    var numCellsRevealed = 0;
    var flippedElements = [];
    var matching = false;
    document.addEventListener("click", handleCellClick);
    if (localStorage.getItem("match") !== null) {
        restoreMatchedCells();
        localStorage.setItem("attempt", "false");
    }
    function handleCellClick(e) {
        if (numCellsRevealed >= 2 || matching) {
            localStorage.setItem("attempt", "false");
            return;
        }
        var target = e.target;
        if (target.className === "cell-cover") {
            localStorage.setItem("attempt", "true");
            revealTargetCell(target);
            numCellsRevealed++;
            flippedElements.push(target.parentElement);
            if (numCellsRevealed === 2) {
                matching = true;
                setTimeout(function () {
                    handleMatch(flippedElements);
                    numCellsRevealed = 0;
                    flippedElements = [];
                    localStorage.setItem("attempt", "false");
                    matching = false;
                }, 300);
            }
        }
    }
    function revealTargetCell(target) {
        target.style.display = "none";
        var cell = document.getElementById(target.parentElement.id);
        cell.style.backgroundColor = "#fda214";
    }
    function restoreMatchedCells() {
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
    if (localStorage.getItem("attempt") === "false")
        return;
    var cells = mapFlippedCells(flippedCells);
    var matchingCells = cells[0].textContent === cells[1].textContent;
    if (matchingCells) {
        handleMatchingCells(flippedCells, cells);
    }
    else {
        handleNonMatchingCells(flippedCells);
    }
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
    localStorage.removeItem("attempt");
}
function changeBackgroundColor(flippedCells, color) {
    for (var i = 0; i < flippedCells.length; i++) {
        flippedCells[i].style.backgroundColor = color;
    }
}
function handleNonMatchingCells(flippedCells) {
    localStorage.removeItem("attempt");
    flippedCells.forEach(function (cell) {
        var cover = cell.querySelector(".cell-cover");
        cover.style.display = "block";
    });
}
function handleReset(resetGrid) {
    document.addEventListener("click", function (e) {
        var target = e.target;
        if (target.id === "restart") {
            localStorage.removeItem("cells");
            localStorage.removeItem("match");
            resetGrid();
            location.reload();
        }
    });
}
