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
function createDivWithClass(className: string, textContent?: string) {
	const div = document.createElement("div");
	div.className = className;
	if (textContent) div.textContent = textContent;
	return div;
}

function setPlayerStats() {
	console.log("stats function");
	const statsDiv = document.getElementById("stats")!;

	if (localStorage.getItem("num-player") === "1") {
		statsDiv.style.maxWidth = "532px";

		const timerDiv = createDivWithClass("stat-item");
		timerDiv.appendChild(createDivWithClass("stat-label", "Time"));
		const stopwatch = createDivWithClass("time blue-text-32");
		timerDiv.appendChild(stopwatch);

		if (localStorage.getItem("timer") !== null) {
			setInterval(() => {
				stopwatch.textContent = JSON.parse(localStorage.getItem("timer")!);
			}, 1000);
		}

		const movesDiv = createDivWithClass("stat-item");
		movesDiv.appendChild(createDivWithClass("", "Moves"));
		const movesCount = createDivWithClass("moves blue-text-32");
		movesCount.id = "moves";
		movesCount.textContent = "0";
		movesDiv.appendChild(movesCount);

		statsDiv.appendChild(timerDiv);
		statsDiv.appendChild(movesDiv);
	}
}
