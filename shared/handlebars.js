import Handlebars from "https://unpkg.com/handlebars-esm";

const CURRENT_PATH = import.meta.url.split('/').slice(0,-1).join('/') + "/";

export const compile = async (path) => {
	const source = await fetch(CURRENT_PATH + path).then(x => x.text());
	const template = Handlebars.compile(source);
	return template;
};
