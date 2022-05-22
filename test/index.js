import '../shared/container.js';
import basic from './algos/basic.js';
import randWithFlood from './algos/randWithFlood.js';
import randFloodDist from './algos/randFloodDist.js';

const SnakeContainer = document.querySelector('snake-container');
const { CanvasText } = SnakeContainer;

const notes = `
ideas:
	- https://italolelis.com/snake

	- attach a neural network and use it

	- weighted probabilities (eg. to prefer straight lines)
	- genetic algorithm
		- jitter
		- follows self
		- follows opponent
		- attract to opponent w/ range
		- repel from opponent w/ range
	- act differently depending on relationship to self and/or opponent

	- https://en.wikipedia.org/wiki/Markov_decision_process
	- https://careerfoundry.com/en/blog/data-analytics/monte-carlo-method/
	- apply algos from other folders in this repo
	- previously, I had game play repeatedly with winner doing same moves as last win
	
	- divider: as a player, can I make some moves that cut available space in two with me on the bigger side?
		- can => I can perform these moves before other player can stop me

todo:
	- ability to pit two algorithms against each other
	- record/analyze the results of algorithm matches
`;
SnakeContainer.setNotes(notes.replace(/\t/g, '   '));

const game = (algos) => async (args) => {
	const {
		state: {p1, p2, width, height},
		state,
		aggressive
	} = args;

	let GameOver = false;
	const todos = [];
	for(var [name,player] of Object.entries({ p1,p2 })){
		const move = await algos[name](player, state);
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

const passive = randFloodDist;
const aggressive = (...args) => randFloodDist(...args, true/*aggressive*/ );

SnakeContainer.functions = {
	basic,
	randWithFlood: game({
		p1: randWithFlood,
		p2: randWithFlood
	}),
	passiveRandom: game({
		p1: passive,
		p2: randWithFlood
	}),
	passivePassive: game({
		p1: passive,
		p2: passive
	}),
	passiveAggressive: game({
		p1: passive,
		p2: aggressive
	}),
	aggressiveAggressive: game({
		p1: aggressive,
		p2: aggressive
	}),
	aggressiveRandom: game({
		p1: aggressive,
		p2: randWithFlood
	}),
};

SnakeContainer.onLoad(async () => {
	SnakeContainer.runButton.onclick()
});
