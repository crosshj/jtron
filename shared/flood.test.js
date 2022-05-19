import flood from './flood.js';


const board = {
	width: 10,
	height: 10
};
board.pixels = new Array(board.width*board.height).fill(false);

for(var [i] of new Array(5).entries()){
	const index = (i+1)*board.width-5;
	board.pixels[index] = true;
}
for(var [x] of new Array(5).entries()){
	board.pixels[board.width*5+x] = true;
}

const pixel = [5,5];

const drawBoard = () => {
	let output = ``;
	for(var [y] of new Array(board.height).entries()){
		for(var [x] of new Array(board.width).entries()){
			output += board.pixels[y*board.width + x] ? '██' : '░░';
		}
		output += '\n';
	}
	console.log(output);
};

drawBoard();
const filled = await flood({ board, pixel })
console.log(`filled: ${filled.length} pixels\n`);
drawBoard();
