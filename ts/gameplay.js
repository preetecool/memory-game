function revealCell() {
    var numCellsRevealed = 0;
    var flippedCells = [];
    document.addEventListener("click", function (e) {
        if (numCellsRevealed === 2)
            return;
        var target = e.target;
        if (target.className === "cell-cover") {
            target.style.display = "none";
            numCellsRevealed++;
            flippedCells.push(target.parentElement);
            if (numCellsRevealed === 2) {
                setTimeout(function () {
                    handleMatch(flippedCells);
                    numCellsRevealed = 0;
                    flippedCells = [];
                }, 200);
            }
        }
    });
}
function handleMatch(flippedCells) {
    var cells = flippedCells.map(function (cell) { return cell.textContent; });
    if (cells[0] === cells[1]) {
        console.log("match");
    }
    else {
        console.log("no match");
        flippedCells.forEach(function (cell) {
            var cover = cell.querySelector(".cell-cover");
            cover.style.display = "block";
        });
    }
}
