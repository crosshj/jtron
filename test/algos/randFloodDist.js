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

const distanceMoves = async ({ state, moves }) => {
	const { p1, p2 } = state;
	const distance = ([x1,y1],[x2,y2]) => Math.sqrt(
		Math.pow(x2 - x1, 2) +
		Math.pow(y2 - y1, 2) * 1.0
	);
	const time = p1.history.length;

	let distMoves = [];
	for(var pixel of moves){
		const d1 = distance(pixel, p1.history[p1.history.length-1]);
		const d2 = distance(pixel, p2.history[p2.history.length-1]);
		distMoves.push({ pixel, distance: Math.max(d1,d2) });
	}
	const max = Math.max(...distMoves.map(x => x.distance)) || 0;
	const min = Math.min(...distMoves.map(x => x.distance)) || 0;
	if(!max) return;
	if(max-min < 1) return moves;
	return distMoves.filter(x => x.distance >= max).map(x => x.pixel)
};

const autoRun = async (args) => {
	const { state: {p1, p2, width, height}, state } = args;

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

	const randomMove = async (player, name) => {
		const allMoves = [
			[-1,0],
			[1,0],
			[0,-1],
			[0,1],
		]
			.map(playerSpace)
			.filter(validMove(player));
		if(!allMoves?.length) return;
		if(allMoves.length === 1) return allMoves[0];

		const floodMoves = await testFlood({ state, allMoves });
		if(!floodMoves?.length) return;
		if(floodMoves.length === 1) return floodMoves[0];

		let distMoves = floodMoves;
		if(name === "p1"){
			distMoves = await distanceMoves({ state, moves: floodMoves });
			if(!distMoves?.length) return;
			if(distMoves.length === 1) return distMoves[0];
		}

		const move = randomArrayItem(distMoves);
		return move;
	};
	
	let GameOver = false;
	for(var [name,player] of Object.entries({p1,p2})){
		const move = await randomMove(player, name);
		if(!move){
			GameOver = true;
			break;
		}
		player.history.push(move);
	}
	return GameOver;
};

export default autoRun;
