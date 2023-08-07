type cell = {
	id: number;
	textContent: number;
	matched?: boolean;
};

type player = {
	score: number;
	attempts: number;
};

let numCellsRevealed: number = 0;
let flippedElements: HTMLElement[] = [];
let matching = false;

function revealCell() {
	document.addEventListener("click", handleCellClick);

	if (localStorage.getItem("match") !== null) {
		restoreMatchedCells();
		localStorage.removeItem("attempt");
	}
}

function handleCellClick(e: Event) {
	const target = e.target as HTMLElement;
	if (target.className !== "cell-cover" || (numCellsRevealed >= 2 && matching))
		return;

	localStorage.setItem("attempt", "true");
	revealTargetCell(target);
	numCellsRevealed++;
	flippedElements.push(target.parentElement as HTMLElement);

	if (numCellsRevealed === 2) {
		matching = true;
		setTimeout(() => {
			handleMatch(flippedElements);
			resetMatchingState();
		}, 400);
	}
}

function resetMatchingState() {
	numCellsRevealed = 0;
	flippedElements = [];
	localStorage.setItem("attempt", "false");
	matching = false;
	document.addEventListener("click", handleCellClick);
}

function revealTargetCell(target: HTMLElement) {
	target.style.display = "none";
	let cell = document.getElementById(target.parentElement!.id);
	cell!.style.backgroundColor = "#fda214";
}

function restoreMatchedCells() {
	if (localStorage.getItem("match") === null) return;
	const matchedCells = localStorage.getItem("match");
	if (matchedCells) {
		const cells: cell[] = JSON.parse(matchedCells);
		cells.forEach((cell) => {
			let cellDiv = document.getElementById(`cell-${cell.id}`);
			let coverDiv = cellDiv!.querySelector(".cell-cover") as HTMLElement;
			coverDiv.style.display = "none";
			cellDiv!.style.backgroundColor = "#BCCED9";
		});
	}
}

function handleMatch(flippedCells: HTMLElement[]) {
	const cells = mapFlippedCells(flippedCells);
	const matchingCells: boolean = cells[0].textContent === cells[1].textContent;
	let playerTurn = Number(localStorage.getItem("player-turn"));

	if (matchingCells) {
		handleMatchingCells(flippedCells, cells);
		handleScore();
		handleAttemptCount();
	} else {
		console.log(playerTurn);
		handleNonMatchingCells(flippedCells);
		handleAttemptCount();
		handlePlayerTurn((playerTurn += 1));
	}
	localStorage.removeItem("attempt");
}

function mapFlippedCells(flippedCells: HTMLElement[]): cell[] {
	return flippedCells.map((el) => {
		let cell: cell = {
			id: Number(el.id.split("-")[1]),
			textContent: Number(el.textContent),
		};
		return cell;
	});
}

function updatePlayerStat(player: string, field: keyof player, value: number) {
	let playerStats = JSON.parse(localStorage.getItem("player-stats")!);
	playerStats[player][field] += value;
	localStorage.setItem("player-stats", JSON.stringify(playerStats));
}

function handleMatchingCells(flippedCells: HTMLElement[], cells: cell[]) {
	changeBackgroundColor(flippedCells, "#bcced9");

	let matchedCells: cell[] = localStorage.getItem("match")
		? JSON.parse(localStorage.getItem("match")!)
		: [];

	localStorage.setItem("match", JSON.stringify(matchedCells.concat(cells)));
}

function changeBackgroundColor(flippedCells: HTMLElement[], color: string) {
	for (let i = 0; i < flippedCells.length; i++) {
		flippedCells[i].style.backgroundColor = color;
	}
}

function handleNonMatchingCells(flippedCells: HTMLElement[]) {
	flippedCells.forEach((cell) => {
		const cover = cell.querySelector(".cell-cover") as HTMLElement;
		cover.style.display = "block";
	});
}

function handleScore() {
	let playerTurn = localStorage.getItem("player-turn");
	let playerStats = JSON.parse(localStorage.getItem("player-stats")!);
	console.log(playerStats);
	playerStats["player_" + playerTurn].score++;
	localStorage.setItem("player-stats", JSON.stringify(playerStats));
	// return score
}

function handleAttemptCount() {
	const playerStats = JSON.parse(localStorage.getItem("player-stats")!);
	if (localStorage.getItem("num-player") === "1") {
		playerStats.player_1.attempts++;

		localStorage.setItem("player-stats", JSON.stringify(playerStats));
		let moves = document.getElementById("moves")!;
		moves.textContent = playerStats.player_1.attempts.toString();
		return;
	} else {
		const playerTurn = JSON.parse(localStorage.getItem("player-turn")!);
		playerStats[`player_${playerTurn}`].attempts++;
		localStorage.setItem("player-stats", JSON.stringify(playerStats));
	}
}

function handlePlayerTurn(playerTurn: number) {
	let numPlayers = localStorage.getItem("num-player");

	if (numPlayers === "1") {
		localStorage.setItem("player-turn", "1");
		return;
	} else {
		if (playerTurn > Number(numPlayers)) {
			playerTurn = 1;
		}
		localStorage.setItem("player-turn", playerTurn.toString());
	}
}
function handleTimer() {
	if (localStorage.getItem("timer") !== null) return;

	let seconds = 0;
	let minutes = 0;
	let timerInterval = setInterval(() => {
		seconds++;
		if (seconds === 60) {
			minutes++;
			seconds = 0;
		}
		localStorage.setItem("timer", JSON.stringify(`${minutes}:${seconds}`));
	}, 1000);
	return timerInterval;
}

function handleReset() {
	document.addEventListener("click", (e: Event) => {
		let target = e.target as HTMLElement;
		if (target.id === "restart") {
			localStorage.removeItem("cells");
			localStorage.removeItem("match");
			let playerStats = JSON.parse(localStorage.getItem("player-stats")!);

			for (let player in playerStats) {
				playerStats[player].score = 0;
				playerStats[player].attempts = 0;
			}
			localStorage.setItem("player-stats", JSON.stringify(playerStats));
			location.reload();
		}
	});
}
