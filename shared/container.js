import './container-css.js';
import sheet from './container.css' assert { type: 'css' };
import faSheet from 'https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css' assert { type: 'css' };

import { delay, clone } from './utils.js';

import * as handlebars from "./handlebars.js";
const template = await handlebars.compile('./container.hbs');

import {
	CanvasText,
	ShowOverlayBlock,
	render,
	readBlock,
	cloneCanvas,
	game,
} from './game.js';

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
		await render(this.canvasCtx, this.overlayCtx, dims, state);
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
		await render(this.canvasCtx, this.overlayCtx, dims, state);
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
		
		// TODO: this could be simplified
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

	await render(this.canvasCtx, this.overlayCtx, dims, state);
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
