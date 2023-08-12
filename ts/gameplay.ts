type cell = {
	id: number;
	textContent?: number;
	// img?: HTMLImageElement;
	src?: string;
};

type player = {
	score: number;
	attempts: number;
};
let timerInterval: number | undefined;

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
	if (target.className !== "cell-cover" || (numCellsRevealed >= 2 && matching)) return;

	localStorage.setItem("attempt", "true");
	revealTargetCell(target);
	numCellsRevealed++;
	flippedElements.push(target.parentElement as HTMLElement);

	if (numCellsRevealed === 2) {
		matching = true;
		setTimeout(() => {
			handleMatch(flippedElements);
			resetMatchingState();
		}, 600);
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
	let playerTurn = Number(localStorage.getItem("player-turn"));
	const cells = mapFlippedCells(flippedCells);
	let matchingCells: boolean = false;

	if (localStorage.getItem("theme") === "Icons") {
		if (cells[0].src && cells[1].src) {
			matchingCells = cells[0].src === cells[1].src;
		}
	} else {
		matchingCells = cells[0].textContent === cells[1].textContent;
	}

	if (matchingCells) {
		handleMatchingCells(flippedCells, cells);
		handleScore();
		handleAttemptCount();
	} else {
		handleNonMatchingCells(flippedCells);
		handleAttemptCount();
		handlePlayerTurn((playerTurn += 1));
	}
	if (checkForMatched()) {
		handleGameOver();
	}

	localStorage.removeItem("attempt");
}

function checkForMatched(): boolean {
	let matched = localStorage.getItem("match");
	let allCells = JSON.parse(localStorage.getItem("cells")!);
	if (matched && allCells.length === JSON.parse(matched).length) {
		return true;
	}
	return false;
}

function mapFlippedCells(flippedCells: HTMLElement[]): cell[] {
	return flippedCells.map((el) => {
		let cell: cell = {
			id: Number(el.id.split("-")[1]),
			textContent: Number(el.textContent),
			// img: el.querySelector("img"),
			src: el.querySelector("img")?.src
		};
		return cell;
	});
}

function updatePlayerStat(player: string, field: keyof player, value: number) {
	let playerStats = JSON.parse(localStorage.getItem("player-stats")!);
	let numPlayers = JSON.parse(localStorage.getItem("num-player")!);
	// let playerTurn = Number(JSON.parse(localStorage.getItem("player-turn")!));
	playerStats[player][field] += value;
	localStorage.setItem("player-stats", JSON.stringify(playerStats));
	if (field === "score" && numPlayers !== "1") {
		let score = document.getElementById(player);
		if (score) {
			score.textContent = playerStats[player].score;
		}
	}
	if (field === "attempts") {
		let moves = document.getElementById("moves")!;
		if (moves) {
			moves.textContent = playerStats[player].attempts;
		}
	}
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
	updatePlayerStat(`player_${localStorage.getItem("player-turn")}`, "score", 1);
}

function handleAttemptCount() {
	// updatePlayerStat(`player_${localStorage.getItem("player-turn")}`, "attempts", 1);
	if (localStorage.getItem("num-player") === "1") {
		updatePlayerStat("player_1", "attempts", 1);
		return;
	} else {
		updatePlayerStat(`player_${localStorage.getItem("player-turn")}`, "attempts", 1);
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
		for (let i = 1; i <= Number(numPlayers); i++) {
			let cardId = `player_${i}-card`;
			let playerScoreCard = document.getElementById(cardId);
			let turnIndicator = document.createElement("div");
			turnIndicator.className = "turn-indicator";

			if (playerScoreCard) {
				if (i === playerTurn) {
					playerScoreCard.classList.add("stat-active");
					playerScoreCard.appendChild(turnIndicator);
				} else {
					playerScoreCard.classList.remove("stat-active");

					const indicator = playerScoreCard.querySelector(".turn-indicator");
					if (indicator) {
						playerScoreCard.removeChild(indicator);
					}
				}
			}
		}
	}
}
function handleTimer(): number | undefined {
	if (localStorage.getItem("num-player") !== "1") return;
	let timerValue = localStorage.getItem("timer");
	let [minutes, decaseconds, seconds] = timerValue ? JSON.parse(timerValue) : [0, 0, 0];

	const updateDisplay = () => {
		const timerElement = document.getElementById("stopwatch");
		if (timerElement) {
			timerElement.textContent = `${minutes}:${decaseconds}${seconds}`;
		}
	};

	timerInterval = setInterval(() => {
		if (localStorage.getItem("game-status") !== "started") return;
		seconds++;
		if (seconds === 10) {
			decaseconds++;
			seconds = 0;
		}
		if (decaseconds === 6) {
			minutes++;
			decaseconds = 0;
		}

		localStorage.setItem("timer", JSON.stringify([minutes, decaseconds, seconds]));
		updateDisplay();
	}, 1000);

	updateDisplay();

	return timerInterval;
}

function handleReset() {
	clearInterval(timerInterval);
	localStorage.removeItem("timer");
	localStorage.removeItem("cells");
	localStorage.removeItem("match");
	localStorage.setItem("game-status", "started");
	localStorage.setItem("timer", "[0,0,0]");

	let playerStats = JSON.parse(localStorage.getItem("player-stats") || "{}");
	for (let player in playerStats) {
		playerStats[player].score = 0;
		playerStats[player].attempts = 0;
	}
	localStorage.setItem("player-stats", JSON.stringify(playerStats));
	let mainDiv = document.getElementById("game-body");
	mainDiv!.style.display = "block";
	location.reload();
}
timerInterval = handleTimer();

function newGame() {
	localStorage.clear();
	document.getElementById("game-body")!.style.display = "block";
	location.reload();
}
function handleGameOver() {
	clearInterval(timerInterval);
	localStorage.setItem("game-status", "finished");

	handleWinners();
}
function handleWinners() {
	let playerStats = JSON.parse(localStorage.getItem("player-stats") || "{}");
	let numPlayers = Number(localStorage.getItem("num-player"));
	let parentDiv = document.getElementById("main")!;

	let modalBg = createModalBackground(parentDiv);
	let modal = undefined;
	let winners: string[] = [];
	if (numPlayers !== 1) {
		let scores = {
			player_1: playerStats.player_1.score,
			player_2: playerStats.player_2.score,
			player_3: playerStats.player_3.score,
			player_4: playerStats.player_4.score
		};
		let sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
		let topScore = sortedScores[0][1];

		winners = sortedScores
			.filter(([player, score]) => score === topScore)
			.map(([player]) => player);

		modal = createModal(modalBg, numPlayers, winners);
		for (let i = 0; i <= numPlayers; i++) {
			createPlayerResult(
				modal,
				`Player ${i + 1}`,
				playerStats[`player_${i + 1}`].score,
				winners
			);
		}
	} else {
		winners.push(playerStats["player_1"]);
		modal = createModal(modalBg, numPlayers, winners);
		createPlayerResult(
			modal,
			"Time Elapsed",
			document.getElementById("stopwatch")!.textContent
		);
		createPlayerResult(modal, "Moves Taken", playerStats[`player_1`].attempts);
	}
	let buttonDiv = document.createElement("div");
	buttonDiv.className = "option-buttons_setup";
	buttonDiv.style.height = "52px !important";

	createButton("Restart", buttonDiv, "orange", handleReset);
	createButton("Setup New Game", buttonDiv, "#DFE7EC", newGame, "#304859");
	modal.appendChild(buttonDiv);

	let span = document.createElement("span");
}
function createModalBackground(parent: HTMLElement) {
	let modalBg = document.createElement("div");
	modalBg.className = "setup modal-bg";
	parent.insertBefore(modalBg, parent.firstChild);
	return modalBg;
}

function createModal(parent: HTMLElement, numPlayers: number, winners: string[]) {
	let modal = document.createElement("div");
	modal.className = "popup_setup game-settings modal";
	parent.appendChild(modal);
	let title = document.createElement("h1");
	let subtitle = document.createElement("span");
	let singleWinner = `Player ${winners[0].charAt(winners[0].length - 1)}`;

	let winner =
		winners.length > 1 && numPlayers > 1 ? "It's a tie!" : `${singleWinner} Wins!`;
	title.textContent = numPlayers === 1 ? "You Did it!" : winner;
	subtitle.className = "stat-label";
	subtitle.style.color = "#7191a5";
	subtitle.textContent = "Game over! Here are the results:";
	modal.appendChild(title);
	title.appendChild(subtitle);

	return modal;
}

function createPlayerResult(
	parent: HTMLElement,
	label: string,
	score: number | string | null,
	winners?: string[]
) {
	let div = document.createElement("div");
	let id = label.toLowerCase().replace(" ", "_");
	div.id = id + "_gg";
	div.className = "player-result";

	let labeldiv = document.createElement("div");
	labeldiv.className = "stat-label";
	labeldiv.textContent = label;

	let numPlayers = localStorage.getItem("num-player");
	let scoreElem = document.createElement("div");
	scoreElem.className = "blue-text-32";
	scoreElem.textContent = numPlayers === "1" ? String(score) : String(score) + " Pairs";

	if (winners && winners.includes(id)) {
		div.className += " winner white-text";
		label += " (Winner!)";
	}

	console.log(winners);

	div.appendChild(labeldiv);
	div.appendChild(scoreElem);
	parent.appendChild(div);
}

function createButton(
	text: string,
	parent: HTMLElement,
	bgColor: string,
	fn: (this: GlobalEventHandlers, ev: MouseEvent) => any,
	color?: string
) {
	let button = document.createElement("button");
	button.className = "radio-label btn-gameover";
	button.style.backgroundColor = bgColor;
	if (color) {
		button.style.color = color;
	}
	button.textContent = text;
	button.onclick = fn;
	parent.appendChild(button);
}
