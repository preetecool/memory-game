type Icon = { id: number };
type IconCell = { url: string };

function shuffle<T>(array?: T[]): T[] {
    if (localStorage.getItem("theme") === "Icons") {
        array = mapIcons() as unknown as T[];
    }
    if (!array) return [];
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

function createElement(index: number, cell?: number, url?: string) {
    let gridVal = localStorage.getItem("grid-size") === "4x4" ? "sm" : "lg";
    let gameBoard: HTMLElement = document.getElementById("game-board")!;
    gameBoard.className = gridVal == "sm" ? "game-board board-sm" : "game-board board-lg";
    let div = document.createElement("div");

    gameBoard.appendChild(div);

    div.className =
        gridVal == "sm"
            ? "cell-lg light-gray-text-xlg transition"
            : "cell-sm light-gray-text-lg transition";
    div.id = `cell-${index + 1}`;
    let cellDiv = document.getElementById(`cell-${index + 1}`);
    let coverDiv = createDivWithClass("cell-cover", "");
    if (localStorage.getItem("theme") === "Icons") {
        let icon = document.createElement("img");
        icon.src = url!;
        icon.className = gridVal == "sm" ? "icon icon-lg" : "icon icon-sm";
        icon.style.fill = "#fcfcfc";
        div.appendChild(icon);
    }
    if (localStorage.getItem("theme") === "Numbers") {
        div.textContent = cell!.toString();
    }
    cellDiv!.appendChild(coverDiv);
}

function setGridFromStorage() {
    let icons = localStorage.getItem("theme") === "Icons";

    let cells = JSON.parse(localStorage.getItem("cells")!);
    for (let i = 0; i < cells.length; i++) {
        if (icons) {
            createElement(i, undefined, cells[i].url);
        } else {
            createElement(i, cells[i]);
        }
    }
    // localStorage.setItem("cells", JSON.stringify(cells));
}

function setGrid(): undefined {
    let gameDiv = document.getElementById("game-container");
    gameDiv!.style.display= 'flex';
    let gameStatus = localStorage.getItem("game-status");
    // if (gameStatus !== "started" || gameStatus !== "finished") return;
    if (localStorage.getItem("cells") || localStorage.getItem("match")) {
        setGridFromStorage();
        setPlayerStats;
        return;
    } else if (!localStorage.getItem("cells")) {
        if (localStorage.getItem("theme") === "Icons") {
            const cells: IconCell[] = shuffle();
            for (let i = 0; i < cells.length; i++) {
                createElement(i, undefined, cells[i].url);
            }
            localStorage.setItem("cells", JSON.stringify(shuffle()));
        } else if (localStorage.getItem("theme") === "Numbers") {
            const cells = generatePairs();
            for (let i = 0; i < cells.length; i++) {
                createElement(i, cells[i]);
            }
            localStorage.setItem("cells", JSON.stringify(cells));
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
    if (localStorage.getItem("game-status") === null) {
        localStorage.removeItem("player-stats");
    }
    const statsDiv = document.getElementById("stats");
    let numPlayers: string = localStorage.getItem("num-player")!;
    if (!statsDiv) return;

    if (numPlayers === "1") {
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
    if (numPlayers !== "1") {
        let stats = JSON.parse(localStorage.getItem("player-stats") || "{}");

        for (let i = 1; i <= Number(numPlayers); i++) {
            statsDiv.appendChild(
                createStatItem(`Player ${i}`, `player_${i}`, stats[`player_${i}`].score || "0")
            );
        }

        if (localStorage.getItem("player-turn")) {
            let playerTurn = Number(localStorage.getItem("player-turn"));
            let turnIndicator = document.createElement("div");
            let childElement = statsDiv.querySelector(`#player_${playerTurn}-card`);
            childElement?.classList.add("stat-active");
            turnIndicator.className = "turn-indicator";
            if (childElement) {
                childElement.appendChild(turnIndicator);
            }
        }
    }
}

function createStatItem(label: string, id: string, content: string) {
    const statItemDiv = createDivWithClass("stat-item");
    statItemDiv.id = id + "-card";
    statItemDiv.appendChild(createDivWithClass("stat-label", label));

    const contentDiv = createDivWithClass("blue-text-32", content);
    contentDiv.id = id;

    statItemDiv.appendChild(contentDiv);
    return statItemDiv;
}

function formatTime(time: string) {
    try {
        let [mins, decaseconds, seconds] = JSON.parse(time);
        return `${mins}:${decaseconds}${seconds}`;
    } catch (error) {
        console.error("Error parsing time:", error);
        return "0:00";
    }
}

function getPlayerAttempts() {
    const playerStats = JSON.parse(localStorage.getItem("player-stats") || "{}");
    return (playerStats.player_1?.attempts || 0).toString();
}

function mapIcons(): Icon[] {
    let gridSize = localStorage.getItem("grid-size");
    let icons: { id: number }[] = [
        "bell",
        "circle",
        "font-awesome",
        "futbol",
        "gem",
        "hand-spock",
        "heart",
        "hourglass",
        "lemon",
        "lightbulb",
        "map",
        "moon",
        "paper-plane",
        "square-full",
        "star",
        "sun",
        "compass",
        "newspaper",
    ].map((id, idx) => ({ id: idx, url: `./assets/icons/${id}.svg` }));
    let grid16 = icons.slice(0, 8).concat(...icons.slice(0, 8));
    let grid36 = icons.concat(...icons);
    let map = gridSize === "4x4" ? grid16 : grid36;

    return map;
}
