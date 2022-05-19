export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const randomArrayItem = (arr) => arr.sort(() => Math.random() - 0.5).shift();
export const clone = (o) => JSON.parse(JSON.stringify(o));
