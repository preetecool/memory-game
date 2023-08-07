function checkGameStatus() {
    var gameStatus = localStorage.getItem("game-status");
    if (gameStatus === "started") {
        var setupScreen = document.getElementById("setup-screen");
        if (!setupScreen) {
            throw new Error("Setup Screen not Found");
        }
        setupScreen.style.display = "none";
    }
}
function createRadioButtons(id, numButtons, labels) {
    var divElement = document.getElementById(id);
    if (!divElement) {
        throw new Error("Element with ID \"".concat(id, "\" not found."));
    }
    for (var i = 0; i < numButtons; i++) {
        var label = document.createElement("label");
        label.htmlFor = "".concat(id, "_").concat(i + 1);
        label.textContent = labels[i];
        label.className = "radio-label";
        var radio = document.createElement("input");
        radio.type = "radio";
        radio.name = id;
        radio.id = "".concat(id, "_").concat(i + 1);
        radio.value = labels[i];
        radio.className = "radio-option";
        divElement.appendChild(radio);
        divElement.appendChild(label);
    }
}
function getFormElements() {
    if (localStorage.getItem("game-status") === "started")
        return;
    var form = document.getElementById("settings");
    if (!form) {
        throw new Error("Form not found.");
    }
    var getCheckedValue = function (name) {
        var element = form.querySelector("input[name=\"".concat(name, "\"]:checked"));
        return (element === null || element === void 0 ? void 0 : element.value.toString()) || "";
    };
    var theme = getCheckedValue("theme_buttons");
    var numPlayers = getCheckedValue("num-players_buttons");
    var grid = getCheckedValue("grid-size_buttons");
    return { theme: theme, numPlayers: numPlayers, grid: grid };
}
function handleSubmit(event) {
    var _a = getFormElements(), theme = _a.theme, numPlayers = _a.numPlayers, grid = _a.grid;
    if (!theme || !numPlayers || !grid) {
        alert("Please select all settings before starting the game.");
        event.preventDefault();
        return;
    }
    var playerStats = {
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
    var setupScreen = document.getElementById("setup-screen");
    if (!setupScreen) {
        throw new Error("Setup Screen not found.");
    }
    setupScreen.style.display = "none";
}
