import {delay, clone, randomArrayItem} from "../../shared/utils.js";
import flood from '../../shared/flood.js';

const testFlood = async ({ state, allMoves }) => {
	const { p1, p2, width, height } = state;
	const board = {
		width,height,
		pixels: new Array(width * height).fill(false)
	};
	for(var [x,y] of [...p1.history, ...p2.history]){
		board.pixels[y*width+x] = true;
	}
	let moves = [];
	for(var pixel of allMoves){
		const filled = await flood({ board: clone(board), pixel });
		moves.push({ pixel, length: filled.length });
	}
	const max = Math.max(...moves.map(x => x.length)) || 0;
	if(!max) return;
	return moves.filter(x => x.length >= max).map(x => x.pixel);
};

const randWithFlood = async (player, state) => {
	const {p1, p2, width, height} = state;
	const [currentX, currentY] = player.history[player.history.length-1];

	const playerSpace = ([x,y]) => ([currentX+x, currentY+y]);

	const validMove = ([x,y]) => {
		const taken = [...p1.history, ...p2.history]
			.find(([hisX, hisY]) => x === hisX && y === hisY);
		const inBounds = x >= 0 && y >= 0 && x < width && y < height;
		return !taken && inBounds;
	};

	const randomMove = async (player) => {
		const allMoves = [
			[-1,0],
			[1,0],
			[0,-1],
			[0,1],
		]
			.map(playerSpace)
			.filter(validMove);
		if(!allMoves?.length) return;
		if(allMoves.length === 1) return allMoves[0];

		const floodMoves = await testFlood({ state, allMoves });
		if(!floodMoves?.length) return;
		if(floodMoves.length === 1) return floodMoves[0];

		const move = randomArrayItem(floodMoves);
		return move;
	};

	return randomMove(player);
};

export default randWithFlood;
