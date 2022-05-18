import '../shared/container.js';
import basic from './algos/basic.js';
import randWithFlood from './algos/randWithFlood.js';

const SnakeContainer = document.querySelector('snake-container');
const { CanvasText } = SnakeContainer;

const notes = `
`;
SnakeContainer.setNotes(notes.replace(/\t/g, '   '));

SnakeContainer.functions = {
	basic, randWithFlood
};

SnakeContainer.onLoad(async () => {
	SnakeContainer.runButton.onclick()
});
