import '../shared/container.js';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const SnakeContainer = document.querySelector('snake-container');
const { CanvasText } = SnakeContainer;
const randomArrayItem = (arr) => arr.sort(() => Math.random() - 0.5).shift();

const notes = `
goals/todo:

`;
SnakeContainer.setNotes(notes.replace(/\t/g, '   '));

const autoRun = async (args) => {
	const { state: {p1, p2} } = args;
	await delay(500);

	const playerSpace = ([x,y]) => {
		const [currentX, currentY] = player.history[player.history.length-1];
		return [currentX+x, currentY+y];
	};

	const validMove = (player) => ([x,y]) => {
		const taken = [...p1.history, ...p2.history]
			.find(([hisX, hisY]) => x === hisX && y === hisY);
		return !taken;
	};

	const randomMove = (player) => {
		const allMoves = [
			[-1,0],
			[1,0],
			[0,-1],
			[0,1],
		]
			.map(playerSpace)
			.filter(validMove(player));
		const move = randomArrayItem(allMoves);
		return move;
	};
	for(var [name,player] of Object.entries({p1,p2})){
		const move = randomMove(player);
		if(!move) continue;
		player.history.push(move);
	}
};

SnakeContainer.functions = {
	autoRun,
};

SnakeContainer.onLoad(async () => {
	//SnakeContainer.runButton.onclick()
});
