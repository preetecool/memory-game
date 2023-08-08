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
	else if (localStorage.getItem("cells") || localStorage.getItem("match")) {
		setGridFromStorage();
		setPlayerStats;
		return;
	} else if (!localStorage.getItem("cells")) {
		const cells = generatePairs();
		localStorage.setItem("cells", JSON.stringify(cells));
		for (let i = 0; i < cells.length; i++) {
			createElement(i, cells[i]);
		}
	}

	return;
}
function createDivWithClass(className: string, textContent?: string) {
	const div = document.createElement("div");
	div.className = className;
	if (textContent) div.textContent = textContent;
	return div;
}

function setPlayerStats() {
	const statsDiv = document.getElementById("stats");

	if (!statsDiv || localStorage.getItem("num-player") !== "1") return;

	statsDiv.style.maxWidth = "532px";

	const timerDiv = createStatItem(
		"Time",
		"stopwatch",
		formatTime(localStorage.getItem("timer") || "0:00")
	);
	const movesDiv = createStatItem("Moves", "moves", getPlayerAttempts());

	statsDiv.appendChild(timerDiv);
	statsDiv.appendChild(movesDiv);
}

function createStatItem(label: string, id: string, content: string) {
	const statItemDiv = createDivWithClass("stat-item");
	statItemDiv.appendChild(createDivWithClass("stat-label", label));

	const contentDiv = createDivWithClass("blue-text-32", content);
	contentDiv.id = id;

	statItemDiv.appendChild(contentDiv);
	return statItemDiv;
}

function formatTime(time: string) {
	if (time.indexOf(",") !== -1)
		// return time.replace(",", ":").replace("[", "").replace("]", "");
		return time.replace(/,|\[|\]/g, (match) => (match === "," ? ":" : ""));
	const parsedTime = JSON.parse(time);
	return parsedTime;
}

function getPlayerAttempts() {
	const playerStats = JSON.parse(localStorage.getItem("player-stats") || "{}");
	return (playerStats.player_1?.attempts || 0).toString();
}
