import '../shared/container.js';
import basic from './algos/basic.js';
import randWithFlood from './algos/randWithFlood.js';

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
`;
SnakeContainer.setNotes(notes.replace(/\t/g, '   '));

SnakeContainer.functions = {
	basic, randWithFlood
};

SnakeContainer.onLoad(async () => {
	SnakeContainer.runButton.onclick()
});
