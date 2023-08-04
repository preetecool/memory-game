function getGameBoard() {
	fetch("html/game.html")
		.then((response) => response.text())
		.then((content) => {
			const gameBody: HTMLElement = document.getElementById("game-body")!;
			gameBody.innerHTML = content;
		})
		.catch((error) => {
			console.error("Error loading game.html:", error);
		});
}

function shuffle(array: number[]): number[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
function generatePairs(): number[] {
	const gridSize = localStorage.getItem("grid-size-value");
	let numCells: number = gridSize === "4x4" ? 16 : 36;
	const numsArray: number[] = [];

	for (let i = 1; i <= numCells; i++) {
		numsArray.push(Math.ceil(i / 2));
	}

	return shuffle(numsArray);
}

function createElement(index: number, cell: number) {
	let gridVal = localStorage.getItem("grid-size-value") === "4x4" ? "sm" : "lg";
	let gameBoard: HTMLElement = document.getElementById("game-board")!;
	gameBoard.className =
		gridVal == "sm" ? "game-board board-sm" : "game-board board-lg";
	let div = document.createElement("div");

	gameBoard.appendChild(div);

	div.className =
		gridVal == "sm"
			? "cell-lg light-gray-text-xlg transition"
			: "cell-sm light-gray-text-lg transition";
	div.id = `cell-${index + 1}`;

	div.textContent = cell.toString();

	let cellDiv = document.getElementById(`cell-${index + 1}`);
	let coverDiv = div.cloneNode();
	if (coverDiv instanceof HTMLElement) {
		coverDiv.className = "cell-cover";
	}
	cellDiv!.appendChild(coverDiv);
}

function setGridFromStorage() {
	JSON.parse(localStorage.getItem("cells")!).forEach(
		(cell: number, index: number) => {
			createElement(index, cell);
		}
	);
}

function setGrid(): undefined {
	if (localStorage.getItem("game-status") !== "started") return;

	if (localStorage.getItem("cells") !== null) {
		setGridFromStorage();
		return;
	} else if (!localStorage.getItem("cells")) {
		const cells = generatePairs();
		localStorage.setItem("cells", JSON.stringify(cells));
		for (let i = 0; i < cells.length; i++) {
			createElement(i, cells[i]);
		}
	}
}
