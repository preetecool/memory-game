function revealCell() {
    var numCellsRevealed = 0;
    var flippedElements = [];
    document.addEventListener("click", function (e) {
        localStorage.setItem("attempt", "true");
        if (numCellsRevealed === 2)
            return;
        var target = e.target;
        if (target.className === "cell-cover") {
            target.style.display = "none";
            var cell = document.getElementById(target.parentElement.id);
            cell.style.backgroundColor = "#fda214";
            numCellsRevealed++;
            flippedElements.push(target.parentElement);
            if (numCellsRevealed === 2) {
                setTimeout(function () {
                    handleMatch(flippedElements);
                    numCellsRevealed = 0;
                    flippedElements = [];
                }, 300);
            }
        }
    });
    if (localStorage.getItem("match") !== null &&
        localStorage.getItem("attempt") == "true") {
        JSON.parse(localStorage.getItem("match")).forEach(function (cell) {
            var cellDiv = document.getElementById("cell-".concat(cell.id));
            var coverDiv = cellDiv.querySelector(".cell-cover");
            coverDiv.style.display = "none";
        });
    }
}
function handleMatch(flippedCells) {
    if (!localStorage.getItem("attempt"))
        return;
    // const cells = flippedCells.map((cell) => Number(cell.textContent));
    var cells = flippedCells.map(function (el) {
        var cell = {
            id: Number(el.id.split("-")[1]),
            textContent: Number(el.textContent),
        };
        return cell;
    });
    var matchingCells = cells[0].textContent === cells[1].textContent;
    if (matchingCells && localStorage.getItem("match") == null) {
        for (var i = 0; i < flippedCells.length; i++) {
            flippedCells[i].style.backgroundColor = " #6395b8";
        }
        localStorage.removeItem("attempt");
        localStorage.setItem("match", JSON.stringify(cells));
    }
    else if (localStorage.getItem("match") !== null && matchingCells) {
        var matchedCells_1 = [];
        var previouslyMatched = localStorage.getItem("match");
        JSON.parse(previouslyMatched).forEach(function (cell, index) {
            return matchedCells_1.push(cell);
        });
        for (var i = 0; i < flippedCells.length; i++) {
            flippedCells[i].style.backgroundColor = " #6395b8";
        }
        localStorage.setItem("match", JSON.stringify(matchedCells_1.concat(cells)));
    }
    else {
        localStorage.removeItem("attempt");
        flippedCells.forEach(function (cell) {
            var cover = cell.querySelector(".cell-cover");
            cover.style.display = "block";
        });
    }
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
