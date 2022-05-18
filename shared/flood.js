/*
	given:
		- board with taken pixels set to true
		- pixel location
	returns:
		number of spots that can be flood filled from given pos
*/

const flood = (args) => {
	const { board, pixel } = args;

	const pixelStack = [pixel];

	while(pixelStack.length)
	{
		var newPos, pixelPos, reachLeft, reachRight;
		let [x, y] = pixelStack.pop();

		pixelPos = y*board.width + x;
		while(y-- >= drawingBoundTop && matchStartColor(pixelPos))
		{
			pixelPos -= board.width;
		}
		pixelPos += board.width;
		++y;
		reachLeft = false;
		reachRight = false;
		while(y++ < canvasHeight-1 && matchStartColor(pixelPos)){
			colorPixel(pixelPos);

			if(x > 0){
				if(matchStartColor(pixelPos - 1))
				{
					if(!reachLeft){
						pixelStack.push([x - 1, y]);
						reachLeft = true;
					}
				}
				else if(reachLeft)
				{
					reachLeft = false;
				}
			}
			if(x < board.width-1){
				if(matchStartColor(pixelPos + 4)){
					if(!reachRight){
						pixelStack.push([x + 1, y]);
						reachRight = true;
					}
				} else if(reachRight){
					reachRight = false;
				}
			}

			pixelPos += board.width;
		}
	}

};

export default flood;