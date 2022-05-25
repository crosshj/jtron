import {delay, clone, randomArrayItem} from "../../shared/utils.js";
import flood from '../../shared/flood.js';
import { Graph, astar } from 'https://cdn.skypack.dev/javascript-astar/';

// rationality
const testFlood = async ({ state, playerMoves, avoid=[] }) => {
	const { p1, p2, width, height } = state;
	const board = {
		width,height,
		pixels: new Array(width * height).fill(false)
	};
	for(var [x,y] of [...p1.history, ...p2.history, ...avoid]){
		board.pixels[y*width+x] = true;
	}
	let moves = [];
	for(var pixel of playerMoves){
		const filled = await flood({ board: clone(board), pixel });
		moves.push({ pixel, length: filled.length });
	}
	const max = Math.max(...moves.map(x => x.length)) || 0;
	if(!max) return;
	return moves.filter(x => x.length >= max).map(x => x.pixel);
};

// TODO: astar for distance (versus geometric distance)
// https://github.com/bgrins/javascript-astar/blob/master/astar.js
// https://github.com/bgrins/javascript-astar/tree/0.0.1/original-implementation

// https://stackoverflow.com/questions/23705233/how-to-speed-up-a-algorithm-at-large-spatial-scales/23779490#23779490
// see also: Dijkstra's algorithm (for weighted edges), or Breadth-First Search (for unweighted edges, faster than Dijkstra)


// cowardice, fear OR aggressiveness
const distanceMoves = async ({ state, moves, aggressive }) => {
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
	if(aggressive)
		return distMoves.filter(x => x.distance <= min).map(x => x.pixel);

	return distMoves.filter(x => x.distance >= max).map(x => x.pixel);
};

const aStarDistMoves = async ({ player, state, moves, aggressive }) => {
	const { p1, p2 } = state;
	const opponent = player.name === 'p1' ? 'p2' : 'p1';
	const opponentPosition = state[opponent].history.slice(-1)[0];

	// 0 denotes filled, 1 denotes empty (unit weight)
	const boardArray = new Array(state.width).fill().map(
		y => new Array(state.height).fill(1)
	);
	for(var [x,y] of p1.history) boardArray[x][y] = 0;
	for(var [x,y] of p2.history) boardArray[x][y] = 0;
	boardArray[opponentPosition[0]][opponentPosition[1]] = 1;

	const graph = new Graph(boardArray);

	const distance = ([x1,y1],[x2,y2]) => {
		var start = graph.grid[x1][y1];
		var end = graph.grid[x2][y2];
		var result = astar.search(graph, start, end);
		return result.length;
	};

	let distMoves = [];
	for(var pixel of moves){
		const d = distance(pixel, opponentPosition);
		if(!d) continue;
		distMoves.push({ pixel, distance: d });
	}
	if(!distMoves.length) return await distanceMoves({ state, moves, aggressive });

	const max = Math.max(...distMoves.map(x => x.distance)) || 0;
	const min = Math.min(...distMoves.map(x => x.distance)) || 0;

	if(!max) return await distanceMoves({ state, moves, aggressive });

	if(aggressive)
		return distMoves.filter(x => x.distance <= min).map(x => x.pixel);

	return distMoves.filter(x => x.distance >= max).map(x => x.pixel);
};

const getMoves = ({ player, state }) => {
	const {p1, p2, width, height} = state;

	const [currentX, currentY] = player.history[player.history.length-1];
	const playerSpace = ([x,y]) => ([currentX+x, currentY+y]);

	const validMove = ([x,y]) => {
		const taken = [...p1.history, ...p2.history]
			.find(([hisX, hisY]) => x === hisX && y === hisY);
		const inBounds = x >= 0 && y >= 0 && x < width && y < height;
		return !taken && inBounds;
	};
	
	const playerMoves = [
			[-1,0],
			[1,0],
			[0,-1],
			[0,1],
		]
		.map(playerSpace)
		.filter(validMove)
	return playerMoves;
};


const withAstar = async (player, state, aggressive) => {
	// if([
	// 	1,2,3,4,5,6,7,8,9,
	// 	33,34,35,36,37,38,39,40,41,42,43,44,45
	// ].includes(player.history.length)){
	// 	aggressive = true;
	// }
	const { p1, p2 } = state;
	const playerMoves = getMoves({ player, state });
	if(!playerMoves?.length) return;
	if(playerMoves.length === 1) return playerMoves[0];

	const opponent = player.name === 'p1' ? p2 : p1;
	const opponentMoves = getMoves({ player: opponent, state });

	const floodMoves = await testFlood({ state, playerMoves, avoid: opponentMoves });
	if(!floodMoves?.length) return;
	if(floodMoves.length === 1) return floodMoves[0];

	let distMoves = floodMoves;
	distMoves = await aStarDistMoves({ player, state, moves: floodMoves, aggressive });
	if(!distMoves?.length) return;
	if(distMoves.length === 1) return distMoves[0];

	const move = randomArrayItem(distMoves);
	return move;
};

export default withAstar;
