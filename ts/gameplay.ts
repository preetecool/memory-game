function revealCell() {
	let numCellsRevealed: number = 0;
	let flippedCells: HTMLElement[] = [];

	document.addEventListener("click", (e: Event) => {
		if (numCellsRevealed === 2) return;

		const target = e.target as HTMLElement;
		if (target.className === "cell-cover") {
			target.style.display = "none";
			numCellsRevealed++;
			flippedCells.push(target.parentElement!);

			if (numCellsRevealed === 2) {
				setTimeout(() => {
					handleMatch(flippedCells);
					numCellsRevealed = 0;
					flippedCells = [];
				}, 200);
			}
		}
	});
}
function handleMatch(flippedCells: HTMLElement[]) {
	const cells = flippedCells.map((cell) => cell.textContent);
	if (cells[0] === cells[1]) {
		console.log("match");
	} else {
		console.log("no match");
		flippedCells.forEach((cell) => {
			const cover = cell.querySelector(".cell-cover") as HTMLElement;
			cover.style.display = "block";
		});
	}
}
