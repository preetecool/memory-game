type cell = {
	id: number;
	textContent: number;
	matched?: boolean;
};

function revealCell() {
	let numCellsRevealed: number = 0;
	let flippedElements: HTMLElement[] = [];

	document.addEventListener("click", (e: Event) => {
		localStorage.setItem("attempt", "true");
		if (numCellsRevealed === 2) return;
		const target = e.target as HTMLElement;
		if (target.className === "cell-cover") {
			target.style.display = "none";
			let cell = document.getElementById(target.parentElement!.id);
			cell!.style.backgroundColor = "#fda214";
			numCellsRevealed++;
			flippedElements.push(target.parentElement as HTMLElement);

			if (numCellsRevealed === 2) {
				setTimeout(() => {
					handleMatch(flippedElements);

					numCellsRevealed = 0;
					flippedElements = [];
				}, 300);
			}
		}
	});
	if (
		localStorage.getItem("match") !== null &&
		localStorage.getItem("attempt") == "true"
	) {
		JSON.parse(localStorage.getItem("match")!).forEach((cell: cell) => {
			let cellDiv = document.getElementById(`cell-${cell.id}`);
			let coverDiv = cellDiv!.querySelector(".cell-cover") as HTMLElement;
			coverDiv.style.display = "none";
		});
	}
}
function handleMatch(flippedCells: HTMLElement[]) {
	if (!localStorage.getItem("attempt")) return;
	// const cells = flippedCells.map((cell) => Number(cell.textContent));
	const cells = flippedCells.map((el) => {
		let cell: cell = {
			id: Number(el.id.split("-")[1]),
			textContent: Number(el.textContent),
		};
		return cell;
	});

	const matchingCells = cells[0].textContent === cells[1].textContent;
	if (matchingCells && localStorage.getItem("match") == null) {
		for (let i = 0; i < flippedCells.length; i++) {
			flippedCells[i].style.backgroundColor = " #6395b8";
		}

		localStorage.removeItem("attempt");
		localStorage.setItem("match", JSON.stringify(cells));
	} else if (localStorage.getItem("match") !== null && matchingCells) {
		let matchedCells: cell[] = [];
		let previouslyMatched = localStorage.getItem("match");
		JSON.parse(previouslyMatched!).forEach((cell: cell, index: number) =>
			matchedCells.push(cell)
		);
		for (let i = 0; i < flippedCells.length; i++) {
			flippedCells[i].style.backgroundColor = " #6395b8";
		}
		localStorage.setItem("match", JSON.stringify(matchedCells.concat(cells)));
	} else {
		localStorage.removeItem("attempt");
		flippedCells.forEach((cell) => {
			const cover = cell.querySelector(".cell-cover") as HTMLElement;
			cover.style.display = "block";
		});
	}
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
