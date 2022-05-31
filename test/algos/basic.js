import {randomArrayItem} from "../../shared/utils.js";

const algo = async (player, state) => {
	const {p1, p2, width, height} = state;

	const playerSpace = ([x,y]) => {
		const [currentX, currentY] = player.history[player.history.length-1];
		return [currentX+x, currentY+y];
	};

	const validMove = (player) => ([x,y]) => {
		const taken = [...p1.history, ...p2.history]
			.find(([hisX, hisY]) => x === hisX && y === hisY);
		const inBounds = x >= 0 && y >= 0 && x < width && y < height;
		return !taken && inBounds;
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

	return randomMove(player);
};

export default algo;
