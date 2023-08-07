type FormElements = {
	theme: string;
	numPlayers: string;
	grid: string;
};

function checkGameStatus() {
	const gameStatus = localStorage.getItem("game-status");
	if (gameStatus === "started") {
		const setupScreen = document.getElementById("setup-screen");
		if (!setupScreen) {
			throw new Error(`Setup Screen not Found`);
		}
		setupScreen.style.display = "none";
	}
}

function createRadioButtons(id: string, numButtons: number, labels: string[]) {
	const divElement = document.getElementById(id);
	if (!divElement) {
		throw new Error(`Element with ID "${id}" not found.`);
	}

	for (let i = 0; i < numButtons; i++) {
		const label = document.createElement("label");
		label.htmlFor = `${id}_${i + 1}`;
		label.textContent = labels[i];
		label.className = "radio-label";

		const radio = document.createElement("input");
		radio.type = "radio";
		radio.name = id;
		radio.id = `${id}_${i + 1}`;
		radio.value = labels[i];
		radio.className = "radio-option";

		divElement.appendChild(radio);
		divElement.appendChild(label);
	}
}

function getFormElements(): FormElements | undefined {
	if (localStorage.getItem("game-status") === "started") return;
	const form = document.getElementById("settings");
	if (!form) {
		throw new Error(`Form not found.`);
	}

	const getCheckedValue = (name: string): string => {
		const element = form.querySelector(
			`input[name="${name}"]:checked`
		) as HTMLInputElement;
		return element?.value.toString() || "";
	};

	const theme = getCheckedValue("theme_buttons");
	const numPlayers = getCheckedValue("num-players_buttons");
	const grid = getCheckedValue("grid-size_buttons");

	return { theme, numPlayers, grid };
}

function handleSubmit(event: Event) {
	localStorage.clear();
	const { theme, numPlayers, grid } = getFormElements();

	if (!theme || !numPlayers || !grid) {
		alert("Please select all settings before starting the game.");
		event.preventDefault();
		return;
	}
	const playerStats = {
		player_1: {
			score: 0,
			attempts: 0,
		},
		player_2: {
			score: 0,
			attempts: 0,
		},
		player_3: {
			score: 0,
			attempts: 0,
		},
		player_4: {
			score: 0,
			attempts: 0,
		},
	};

	localStorage.setItem("theme", theme);
	localStorage.setItem("num-player", numPlayers);
	localStorage.setItem("grid-size", grid);
	localStorage.setItem("game-status", "started");
	localStorage.setItem("player-stats", JSON.stringify(playerStats));
	localStorage.setItem("player-turn", "1");
	// localStorage.setItem("timer", "[0,0]");

	const setupScreen = document.getElementById("setup-screen");
	if (!setupScreen) {
		throw new Error(`Setup Screen not found.`);
	}

	setupScreen.style.display = "none";
}
