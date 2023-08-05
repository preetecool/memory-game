type cell = {
	id: number;
	textContent: number;
	matched?: boolean;
};
function revealCell() {
	let numCellsRevealed: number = 0;
	let flippedElements: HTMLElement[] = [];
	let matching = false;

	document.addEventListener("click", handleCellClick);

	if (localStorage.getItem("match") !== null) {
		restoreMatchedCells();
		localStorage.setItem("attempt", "false");
	}

	function handleCellClick(e: Event) {
		if (numCellsRevealed >= 2 || matching) {
			localStorage.setItem("attempt", "false");
			return;
		}

		const target = e.target as HTMLElement;
		if (target.className === "cell-cover") {
			localStorage.setItem("attempt", "true");
			revealTargetCell(target);
			numCellsRevealed++;
			flippedElements.push(target.parentElement as HTMLElement);

			if (numCellsRevealed === 2) {
				matching = true;
				setTimeout(() => {
					handleMatch(flippedElements);
					numCellsRevealed = 0;
					flippedElements = [];
					localStorage.setItem("attempt", "false");
					matching = false;
				}, 300);
			}
		}
	}
	function revealTargetCell(target: HTMLElement) {
		target.style.display = "none";
		let cell = document.getElementById(target.parentElement!.id);
		cell!.style.backgroundColor = "#fda214";
	}

	function restoreMatchedCells() {
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
}

function handleMatch(flippedCells: HTMLElement[]) {
	if (localStorage.getItem("attempt") === "false") return;

	const cells = mapFlippedCells(flippedCells);
	const matchingCells = cells[0].textContent === cells[1].textContent;

	if (matchingCells) {
		handleMatchingCells(flippedCells, cells);
	} else {
		handleNonMatchingCells(flippedCells);
	}
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

function handleMatchingCells(flippedCells: HTMLElement[], cells: cell[]) {
	changeBackgroundColor(flippedCells, "#bcced9");

	let matchedCells: cell[] = localStorage.getItem("match")
		? JSON.parse(localStorage.getItem("match")!)
		: [];

	localStorage.setItem("match", JSON.stringify(matchedCells.concat(cells)));
	localStorage.removeItem("attempt");
}

function changeBackgroundColor(flippedCells: HTMLElement[], color: string) {
	for (let i = 0; i < flippedCells.length; i++) {
		flippedCells[i].style.backgroundColor = color;
	}
}

function handleNonMatchingCells(flippedCells: HTMLElement[]) {
	localStorage.removeItem("attempt");
	flippedCells.forEach((cell) => {
		const cover = cell.querySelector(".cell-cover") as HTMLElement;
		cover.style.display = "block";
	});
}

function handleReset(resetGrid: () => void) {
	document.addEventListener("click", (e: Event) => {
		let target = e.target as HTMLElement;
		if (target.id === "restart") {
			localStorage.removeItem("cells");
			localStorage.removeItem("match");
			resetGrid();
			location.reload();
		}
	});
}
