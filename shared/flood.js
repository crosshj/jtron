/*
	given:
		- board with taken pixels set to true
		- pixel location
	returns:
		number of spots that can be flood filled from given pos
*/

const processPixelStack = async (board, pixelStack, fn) => {
	const { width, height, pixels } = board;
	let [x, y] = pixelStack.pop();
	let pixelPos = y*width + x;

	if(x < 0) return;
	if(y < 0) return;
	if(x === width) return;
	if(y === height) return;
	if(pixels[pixelPos]) return;

	pixels[y*width + x] = true;
	await fn([x,y]);
	pixelStack.push([x - 1, y]);
	pixelStack.push([x + 1, y]);
	pixelStack.push([x, y - 1]);
	pixelStack.push([x, y + 1]);
};

const flood = async (args) => {
	const { board, pixel, eachPixel } = args;
	const pixelStack = [pixel];
	const allFills = [];

	const fn = async (pixel) => {
		allFills.push(pixel);
		eachPixel && eachPixel(pixel);
	};
	while(pixelStack.length){
		await processPixelStack(board, pixelStack, fn);
	}
	return allFills;
};

export default flood;