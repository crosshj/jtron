import './container-css.js';
import sheet from './container.css' assert { type: 'css' };
import faSheet from 'https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css' assert { type: 'css' };

import * as handlebars from "./handlebars.js";
import { delay, clone } from './utils.js';
const template = await handlebars.compile('./container.hbs');

const width = 52;
const height = 31;
const cellDim = 3;
const overlayMult = cellDim * 6;
const dims = {
	canvas: {
		width,
		height
	},
	overlay: {
		width: width*overlayMult,
		height: height*overlayMult
	}
};

const defaultState = {
	width, height,
	p1: {
		name: "p1",
		color: "#B33",
		history: [
			[15,15],
		],
	},
	p2:{
		name: "p2",
		color: "#39D",
		history: [
			[36,15],
		],
	}
};
let state = clone(defaultState);

const style = ``.trim();

const drawLine = ({ ctx, from, to, color}) => {
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineWidth = 1;
	ctx.moveTo(...from);
	ctx.lineTo(...to);
	ctx.stroke();
};

const renderBoard = (ctx) => {
	ctx.clearRect(0,0,width*overlayMult, height*overlayMult);
	const defaultColor = '#000';
	for(var [y] of new Array(height+1).entries()){
		const color = y % 5 === 0
			? defaultColor
			: defaultColor + "5";
		drawLine({ ctx, from: [0,y*overlayMult], to: [width*overlayMult,y*overlayMult], color })
	}
	for(var [x] of new Array(width+1).entries()){
		const color = x % (5) === 1
			? defaultColor
			: defaultColor + "5";
		drawLine({ ctx, from: [x*overlayMult,0], to: [x*overlayMult,height*overlayMult], color })
	}
};

const renderPlayers = (ctx) => {
	ctx.clearRect(0,0,width, height);
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

const render = (ctx, overlayCtx) => new Promise((resolve) => {
	requestAnimationFrame(() => {
		renderBoard(overlayCtx);
		renderPlayers(ctx);
		resolve();
	});
})

async function CanvasText(text){
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

const SelectOption = ({ name, value}) => `<option value="${value}">${name}</option>`

function ShowOverlayBlock(x,y){
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

function setBodyBack(image, callback){
	const { canvas, bgImage } = this;
	const setBg = () => {
		const imageDataUri = canvas.toDataURL('image/png');
		bgImage.style.backgroundImage = `url(${imageDataUri})`;
		callback && callback();
	};
	if(!image) return setTimeout(setBg, 1);
	image.addEventListener('load', setBg);
}


function cloneCanvas(oldCanvas) {
	const newCanvas = document.createElement('canvas');
	const context = newCanvas.getContext('2d');
	newCanvas.width = oldCanvas.width;
	newCanvas.height = oldCanvas.height;
	context.drawImage(oldCanvas, 0, 0);
	return newCanvas;
}

function imageOverflow({ x, y, xOffset=0, yOffset=0, width, height, id, canvas }){
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

function readBlock(args){
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
function writeBlock({x, y, width, height, imageData }){
	if(!imageData) return;
	let resolver;
	window.requestAnimationFrame(() => {
		const ctx = this.canvas.getContext('2d');
		ctx.putImageData(imageData, x*width, y*height);
		resolver();
	});
	return new Promise((resolve) => resolver = resolve);
}

async function ready(){
	const {
		refreshButton, fsRefreshButton, runButton, pauseButton,
		functionSelector, functionSelectorOpponent, inputFunctions, changeFunction, changeFunctionOpponent, fnOptions,
		loadedHandlers, loadedCallback
	} = this;
	const _ShowOverlayBlock = ShowOverlayBlock.bind(this);

	functionSelector.value = sessionStorage.getItem(this.appName + '-snake-fn') || fnOptions[0]?.value;
	functionSelectorOpponent.value = sessionStorage.getItem(this.appName + '-snake-fn-opponent') || fnOptions[0]?.value;

	functionSelector.onchange = () => changeFunction(functionSelector.value);
	functionSelectorOpponent.onchange = () => changeFunctionOpponent(functionSelectorOpponent.value);

	const refreshAction = async () => {
		//_ShowOverlayBlock();
		state = clone(defaultState);
		await render(this.canvasCtx, this.overlayCtx);
		runButton.classList.remove('hidden');
		pauseButton.classList.add('hidden');
		this.paused = 'canceled';
	};
	refreshButton.onclick = refreshAction;
	fsRefreshButton.onclick = async () => {
		await refreshAction();
		runButton.click();
	};

	const done = ({ steps, passes }={}) => {
		this.canvasReadOnly = cloneCanvas(this.canvas);
		//const hideOverlay = steps !== 1 && !passes;
		//hideOverlay && setTimeout(_ShowOverlayBlock, 1000);
		runButton.classList.remove('hidden');
		pauseButton.classList.add('hidden');
	};

	const game = (algos) => async (args) => {
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

	const run = async ({ x,y,fn,fnOpp,steps, step, passes, pass }) => {
		const { id } = readBlock.bind(this)({
			x, y, width: 10, height: 10
		});
		const readImage = (offset) => readBlock.bind(this)({
			x, y,
			xOffset: offset.x,
			yOffset: offset.y,
			width: 10 + (offset.width || 0),
			height: 10 + (offset.height || 0),
		});
		const runGame = game({
			p1: fn,
			p2: fnOpp
		});
		const result = await runGame({
			steps, step, passes, pass, state
		});
		await render(this.canvasCtx, this.overlayCtx);
		return result;
	};

	runButton.onclick = async () => {
		runButton.classList.add('hidden');
		pauseButton.classList.remove('hidden');

		if(this.paused && this.paused.resolve){
			this.paused.finally(() => {
				delete this.paused;
			});
			this.paused.resolve();
			return;
		}
		if(this.paused && !this.paused.resolve){
			delete this.paused;
		}
		const { currentFunction, currentFunctionOpponent, functions } = this;
		const steps = undefined;
		const passes = 9999999;

		const fn = functions[currentFunction];
		const fnOpp = functions[currentFunctionOpponent];

		if(!fn){
			console.log('Function not defined: ' + currentFunction);
			return;
		}
		if(!fnOpp){
			console.log('Opponent function not defined: ' + currentFunctionOpponent);
			return;
		}
		//console.log({ steps, passes })
		if(steps === 1 && !passes){
			await run({ x:0, y:0, fn, steps, step: 0 });
			done({ steps });
			return;
		}
		let step=0;
		let gameOver=false;
		for(var [pass] of new Array(passes||1).entries()){
			for(var [x] of new Array(16).entries()){
				for(var [y] of new Array(12).entries()){
					if(this.paused){
						const status = await this.paused;
						if(status === 'canceled') break;
					}
					gameOver = await run({ x, y, fn, fnOpp, steps, step, pass, passes });
					step+=1;
					if(steps && step >= steps) break;
					if(gameOver) break;
				}
				if(steps && step >= steps) break;
				if(gameOver) break;
			}
			if(gameOver) break;
			step=0;
		}
		done({ passes });
	}
	pauseButton.onclick = async () => {
		let pausedResolve;
		this.paused = new Promise((resolve ) =>{ pausedResolve = resolve; });
		this.paused.resolve = pausedResolve;

		runButton.classList.remove('hidden');
		pauseButton.classList.add('hidden');
	};
	this.expandButton.onclick = async () => {
		this.compressButton.classList.remove('hidden');
		this.expandButton.classList.add('hidden');
		this.fsRefreshButton.classList.remove('hidden');
		this.canvasContainer.classList.add('rotated-fs');
		this.canvasOverlay.style.width = this.canvas.clientWidth + 'px';
		document.body.requestFullscreen(/*{ navigationUI: "show" }*/)
			.then(() => {})
			.catch(err => {
				alert(`An error occurred while trying to switch into fullscreen mode: ${err.message} (${err.name})`);
			});
	};
	this.compressButton.onclick = async () => {
		this.expandButton.classList.remove('hidden');
		this.fsRefreshButton.classList.add('hidden');
		this.compressButton.classList.add('hidden');
		this.canvasContainer.classList.remove('rotated-fs');
		this.canvasOverlay.style.width = '';
		document.exitFullscreen(/*{ navigationUI: "show" }*/)
			.then(() => {})
			.catch(err => {
				alert(`An error occurred while trying to switch into fullscreen mode: ${err.message} (${err.name})`);
			});
	};
	await changeFunction(functionSelector.value);
	await changeFunctionOpponent(functionSelectorOpponent.value);
	await loadedCallback.bind(this)();

	await render(this.canvasCtx, this.overlayCtx);
}


class Container extends HTMLElement {
	constructor() {
		super();
		//this.shadow = this.attachShadow({ mode: 'closed' });
		this.attachShadow({ mode: 'open' });

		this.shadowRoot.adoptedStyleSheets = [
			sheet, faSheet
		];

		//this is weird, cannot get functions(the dom input) before setting innerHTML
		this.shadowRoot.innerHTML = `
			<slot name="functions"></slot>
		`;
		this.functionsSlot = this.shadowRoot.querySelector('slot[name="functions"]');
		
		this.inputFunctions = Array.from(this.functionsSlot.assignedElements({flatten: true})?.[0]?.children);
		this.fnOptions = this.inputFunctions.map(x => {
			return {
				name: x.getAttribute('name') || x.getAttribute('event'),
				value: x.getAttribute('event') || x.getAttribute('name'),
				steps: x.getAttribute('steps') ? Number(x.getAttribute('steps')) : '',
				pass: x.getAttribute('pass') ? Number(x.getAttribute('pass')) : ''
			}
		}).sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()) );

		//this is the second part of the above weirdness, see inefficient but works
		this.shadowRoot.innerHTML = template({
			...dims,
			functions: this.fnOptions
		});
		this.functions = [];
		this.loadedHandlers = [];


		this.notesSlot = this.shadowRoot.querySelector('slot[name="notes"]');
		//this.functionsSlot = this.shadowRoot.querySelector('slot[name="functions"]');

		//TODO: would be nice if template could handle all this "getting dom elements"
		this.container = this.shadowRoot.querySelector('.container');
		this.canvasContainer = this.shadowRoot.querySelector('.canvas-container');
		this.background = this.shadowRoot.querySelector('.background');
		this.bgImage = this.shadowRoot.querySelector('#bg-image');
		this.canvas = this.shadowRoot.querySelector('.container #canvas1');
		this.canvasCtx = this.canvas.getContext("2d");
		this.canvasOverlay = this.shadowRoot.querySelector('.container #canvas-overlay');
		this.overlayCtx = this.canvasOverlay.getContext("2d");

		this.runButton = this.shadowRoot.querySelector('#play');
		this.pauseButton = this.shadowRoot.querySelector('#pause');
		this.refreshButton = this.shadowRoot.querySelector('#refresh');
		this.fsRefreshButton = this.shadowRoot.querySelector('#fs-refresh');
		this.expandButton = this.shadowRoot.querySelector('#screen-expand');
		this.compressButton = this.shadowRoot.querySelector('#screen-compress');
		this.extend = this.shadowRoot.querySelector('.extend');

		this.functionSelector = this.shadowRoot.querySelector('#function-selector');
		this.functionSelectorOpponent = this.shadowRoot.querySelector('#function-selector-opponent');

		this.CanvasText = CanvasText.bind(this);

		this.appName = this.getAttribute('name');
		this.changeFunction = async (which) => {
			sessionStorage.setItem(this.appName+'-snake-fn', which);
			this.currentFunction = which;
		};
		this.changeFunctionOpponent = async (which) => {
			sessionStorage.setItem(this.appName+'-snake-fn-opponent', which);
			this.currentFunctionOpponent = which;
		};
		this.ready = ready.bind(this)();
	}
	connectedCallback() {}

	disconnectedCallback() {
		this.loaded = false;
	}
	async loadedCallback(){
		const { container, background } = this;
		for(const handler of this.loadedHandlers){
			await handler.bind(this)();
		}
		this.loaded = true;
		background.classList.remove('loading');
		container.classList.remove('loading');
	}
	onLoad(handler){
		this.loadedHandlers.push(handler);
	}
	setNotes(text){
		this.notesSlot.innerHTML = `<pre>${text.trim()}</pre>`;
	}
}
customElements.define('snake-container', Container);

export default {};
