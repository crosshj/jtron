import '../shared/container.js';
import basic from './algos/basic.js';
import randWithFlood from './algos/randWithFlood.js';

const SnakeContainer = document.querySelector('snake-container');
const { CanvasText } = SnakeContainer;

const notes = `
ideas:
	- weighted probabilities (eg. to prefer straight lines)
	- genetic algorithm
	- https://en.wikipedia.org/wiki/Markov_decision_process
	- https://careerfoundry.com/en/blog/data-analytics/monte-carlo-method/
	- https://italolelis.com/snake
	- apply algos from other folders in this repo
	- act differently depending on relationship to self and/or opponent
	- previously, I had game play repeatedly with winner doing same moves as last win
	- attach a neural network and use it
`;
SnakeContainer.setNotes(notes.replace(/\t/g, '   '));

SnakeContainer.functions = {
	basic, randWithFlood
};

SnakeContainer.onLoad(async () => {
	SnakeContainer.runButton.onclick()
});
