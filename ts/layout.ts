function shuffle(array: number[]): number[] {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
function generatePairs(): number[] {
	const gridSize = localStorage.getItem("grid-size");
	let numCells: number = gridSize === "4x4" ? 16 : 36;
	const numsArray: number[] = [];

	for (let i = 1; i <= numCells; i++) {
		numsArray.push(Math.ceil(i / 2));
	}

	return shuffle(numsArray);
}

function createElement(index: number, cell: number) {
	let gridVal = localStorage.getItem("grid-size") === "4x4" ? "sm" : "lg";
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
	else if (
		localStorage.getItem("cells") !== null ||
		localStorage.getItem("match") !== null
	) {
		setGridFromStorage();
		return;
	} else if (!localStorage.getItem("cells")) {
		const cells = generatePairs();
		localStorage.setItem("cells", JSON.stringify(cells));
		for (let i = 0; i < cells.length; i++) {
			createElement(i, cells[i]);
		}
	}
	setPlayerStats();
	return;
}

function setPlayerStats() {
	console.log("stats function");
	const statsDiv = document.getElementById("stats")!;

	if (localStorage.getItem("num-player") == "1") {
		let timer = document.createElement("div");
		timer.className = "stat-item timer";
		let timerLabel = timer.cloneNode() as HTMLElement;
		timerLabel.textContent = "Time";
		timer.appendChild(timerLabel);
		let stopwatch = timer.cloneNode() as HTMLElement;
		stopwatch.id = "stopwatch";
		stopwatch.textContent = localStorage.getItem("timer")!;

		let moves = timer.cloneNode() as HTMLElement;
		moves.className = "stat-item moves";
		let movesLabel = timer.cloneNode() as HTMLElement;
		movesLabel.textContent = "Moves";
		moves.appendChild(movesLabel);
		statsDiv.appendChild(timer);
		statsDiv.appendChild(moves);
	}
}
