//import { delay, clone } from './utils.js';

export const drawLine = ({ ctx, from, to, color}) => {
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineWidth = 1;
	ctx.moveTo(...from);
	ctx.lineTo(...to);
	ctx.stroke();
};

export const renderBoard = (ctx, dims, state) => {
	const overlayMult = dims.overlay.width/dims.canvas.width;

	ctx.clearRect(0,0,dims.overlay.width, dims.overlay.height);
	const defaultColor = '#000';
	for(var [y] of new Array(dims.canvas.height+1).entries()){
		const color = y % 5 === 0
			? defaultColor
			: defaultColor + "5";
		drawLine({ ctx, from: [0,y*overlayMult], to: [dims.overlay.width,y*overlayMult], color })
	}
	for(var [x] of new Array(dims.canvas.width+1).entries()){
		const color = x % (5) === 1
			? defaultColor
			: defaultColor + "5";
		drawLine({ ctx, from: [x*overlayMult,0], to: [x*overlayMult,dims.overlay.height], color })
	}
};

export const renderPlayers = (ctx, dims, state) => {
	ctx.clearRect(0,0,dims.canvas.width, dims.canvas.height);
	const { p1, p2 } = state;
	for(var player of [p1, p2]){
		for(var [i, [x,y]] of player.history.entries()){
			const opacity = (6).toString(16);
			ctx.fillStyle = i === player.history.length -1
				? player.color
				: player.color.replace(/0/g, '7') + opacity;
			ctx.fillRect(x,y, 1, 1);
		}
	}
};

export const render = (ctx, overlayCtx, dims, state) => new Promise((resolve) => {
	requestAnimationFrame(() => {
		renderBoard(overlayCtx, dims, state);
		renderPlayers(ctx, dims, state);
		resolve();
	});
})

export async function CanvasText(text){
	let ready = await document.fonts.ready;
	// console.log('Fonts Ready: ' + JSON.stringify(ready))
	// console.log('Roboto Mono Ready: ' + document.fonts.check('1em Roboto Mono'))
	// const DELAY = 50;
	// setTimeout(() => {
		const { canvasOverlay: canvas } = this;
		const ctx = canvas.getContext("2d");
		ctx.clearRect(0,0, canvas.width, canvas.height);
		ctx.fillStyle = "#000c";
		ctx.fillRect(0,0, canvas.width, canvas.height);
		ctx.fillStyle = "white"
		canvasTxt.fontSize = 16;
		canvasTxt.align = 'left';
		canvasTxt.vAlign = 'top';
		//canvasTxt.font = 'VT323';
		// canvasTxt.font = 'Varela';
		canvasTxt.font = 'Roboto Mono';
		//canvasTxt.font = 'Monospace';
		//canvasTxt.fontWeight = 100;
		//canvasTxt.fontVariant = 'small-caps';
		canvasTxt.drawText(ctx, text, canvasTxt.fontSize, canvasTxt.fontSize, canvas.width-2, canvas.height-8)
	// },DELAY);
}

export function ShowOverlayBlock(x,y){
	const { overlayCtx: ctx, canvasOverlay } = this;
	const {width, height} = canvasOverlay;
	if(typeof x === 'undefined'){
		ctx.clearRect(0, 0, width, height);
		return;
	}
	ctx.clearRect(0, 0, width, height);
	ctx.beginPath();
	// ctx.rect(x*10, y*10, 10, 10);
	// ctx.fillStyle = "rgba(0, 255, 195, 0.5)"
	// ctx.fill();
	//ctx.strokeStyle = "rgba(0, 255, 195, 1)";
	ctx.strokeStyle = "rgba(150, 255, 255, 1)";
	ctx.strokeRect((x*30)-0.5, (y*30)-0.5, 31, 31);
	ctx.strokeStyle = "rgba(20,0,30, 1)";
	ctx.strokeRect((x*30)-1.5, (y*30)-1.5, 33, 33);
}

export function setBodyBack(image, callback){
	const { canvas, bgImage } = this;
	const setBg = () => {
		const imageDataUri = canvas.toDataURL('image/png');
		bgImage.style.backgroundImage = `url(${imageDataUri})`;
		callback && callback();
	};
	if(!image) return setTimeout(setBg, 1);
	image.addEventListener('load', setBg);
}

export function cloneCanvas(oldCanvas) {
	const newCanvas = document.createElement('canvas');
	const context = newCanvas.getContext('2d');
	newCanvas.width = oldCanvas.width;
	newCanvas.height = oldCanvas.height;
	context.drawImage(oldCanvas, 0, 0);
	return newCanvas;
}

export function imageOverflow({ x, y, xOffset=0, yOffset=0, width, height, id, canvas }){
	//console.log({x, y })
	const leftOver = x*10 + xOffset;
	const topOver = y*10 + yOffset;
	const rightOver = (x*10+xOffset+width) - canvas.width;
	const bottomOver = (y*10+yOffset+height) - canvas.height;
	
	const topLeftCorner = leftOver > 0 && topOver > 0;
	const topRightCorner = rightOver > 0 && topOver > 0;
	const bottomLeftCorner = leftOver > 0 && bottomOver > 0;
	const bottomRightCorner = rightOver > 0 && bottomOver > 0;

	for(var _y=0, _h=height; _y < _h; _y++){
		const baseIndex = _y*(width)*4;
		if(leftOver < 0){
			for(var _x=0, _w=Math.abs(leftOver); _x < _w; _x++){
				const pixel = baseIndex+_x*4;
				const src = baseIndex + (2*_w-_x)*4;
				id.data[pixel] = id.data[src];
				id.data[pixel+1] = id.data[src+1];
				id.data[pixel+2] = id.data[src+2];
				id.data[pixel+3] = id.data[src+3];
			}
		}
		if(rightOver > 0){
			const xDiff = width-rightOver;
			for(var _x=0, _w=rightOver; _x < _w; _x++){
				const pixel = baseIndex+(_x+xDiff)*4;
				const src = baseIndex + (xDiff-_x-2)*4;
				id.data[pixel] = id.data[src];
				id.data[pixel+1] = id.data[src+1];
				id.data[pixel+2] = id.data[src+2];
				id.data[pixel+3] = id.data[src+3];
			}
		}
		if(topOver < 0 && _y < Math.abs(topOver)){
			const srcBase = (2*Math.abs(topOver)-_y)*(width)*4;
			for(var _x=0, _w=width; _x < _w; _x++){
				const pixel = baseIndex+_x*4;
				const src = srcBase+_x*4;
				id.data[pixel] = id.data[src];
				id.data[pixel+1] = id.data[src+1];
				id.data[pixel+2] = id.data[src+2];
				id.data[pixel+3] = id.data[src+3];
			}
		}
		if(bottomOver > 0 && _y >= (height-bottomOver)){
			const diff = height-bottomOver;
			const srcBase = (2*diff-_y-2)*(width)*4;
			for(var _x=0, _w=width; _x < _w; _x++){
				const pixel = baseIndex+_x*4;
				const src = srcBase+_x*4;
				id.data[pixel] = id.data[src];
				id.data[pixel+1] = id.data[src+1];
				id.data[pixel+2] = id.data[src+2];
				id.data[pixel+3] = id.data[src+3];
			}
		}
	}

}

export function readBlock(args){
	const { x, y, xOffset=0, yOffset=0, width, height } = args;
	if(!this.canvasReadOnly){
		this.canvasReadOnly = cloneCanvas(this.canvas);
	}
	const ctx = this.canvasReadOnly.getContext('2d');;
	const id = ctx.getImageData(x*10+xOffset, y*10+xOffset, width, height);

	imageOverflow({
		...args,
		id,
		canvas: this.canvasReadOnly
	})

	const set = [];
	return { id, set };
}
export function writeBlock({x, y, width, height, imageData }){
	if(!imageData) return;
	let resolver;
	window.requestAnimationFrame(() => {
		const ctx = this.canvas.getContext('2d');
		ctx.putImageData(imageData, x*width, y*height);
		resolver();
	});
	return new Promise((resolve) => resolver = resolve);
}

export const game = (algos) => async (args) => {
	const {
		state: {width, height},
		state,
		aggressive
	} = args;

	let GameOver = false;
	const todos = [];
	const clonedState = clone(state);
	const {p1,p2} = clonedState;
	for(var [name,player] of Object.entries({ p1,p2 })){
		const move = await algos[name](player, clonedState);
		if(!move){
			GameOver = true;
			break;
		}
		todos.push([name, move]);
	}
	for(var [name, move] of todos){
		state[name].history.push(move);
	}
	return GameOver;
};