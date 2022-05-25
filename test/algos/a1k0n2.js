const validMove = (context) => {
	const { w, h} = context;
	const totalLength = w*h;
	
	return (i, i2) => {
		if(i2 < 0 || i2 >= totalLength) return false;
		if(context.map[i2]) return false;

		const y = Math.floor(i/w);
		const y2 = Math.floor(i2/w);
		//if(![-1,1,0].includes(y2 - y)) return false;

		if(y2 === y) return [-1,1,0].includes(i2 - i)

		const x = i-y*w;
		const x2 = i2-y2*w;
		return [-1,1,0].includes(x2 - x);
	};
};

// this is a unit-cost specialization of dijkstra's algorithm
function floodfill(distmap,idx) {
	var q = [idx];
	var q2 = [];
	distmap[idx] = 1;
	var dist = 1;
	while(q.length) {
		dist++;
		for(var idx of q) {
			for(var move of this.di) {
				const i2 = idx + move;

				if(distmap[i2]) continue;
				if(!this.validMove(idx, i2)) continue;

				distmap[i2] = dist;
				q2.push(i2);
			}
		}
		q = q2;
		q2 = [];
	}
	return distmap;
}

function evaluate_pos(myi,theiri){
	const { w, h } = this;
	// evaluate position
	this.p1dist = floodfill.bind(this)([], myi);
	this.p2dist = floodfill.bind(this)([], theiri);
	var score = 0;
	this.p2score = this.p1score = 0;
	for(var i=w+1; i<w*(h-1)-1; i++) {
		if(this.map[i]) continue; // wall?  forget it
		if(!this.p2dist[i]) { // unreachable to player 2?
			if(this.p1dist[i]) { this.p2score++; score++; }
			continue;
		}
		if(!this.p1dist[i]) { // unreachable to player 1?
			if(this.p2dist[i]) { this.p1score++; score--; }
			continue;
		}
		var d = this.p1dist[i] - this.p2dist[i];
		// closer to player 1?  count for p1's score
		if(d<0) { this.p2score++; score++; }
		else if(d>0) { this.p1score++; score--; } // else for p2's
	}
	return score;
}

// negamax -- minimax with alpha-beta pruning, simple implementation (see wikipedia)
function negamax(myi,theiri,depth,a,b){
	if(depth == 0) {
		return evaluate_pos.bind(this)(myi,theiri);
	}
	var bestmove;
	for(var [i,move] of this.di.entries()) {
		const idx = myi + move;
		if(!this.validMove(myi, idx)) continue;
		this.map[idx] = 1;
		// recurse
		const score = -negamax.bind(this)(theiri,idx,depth-1, -b, -a);
		this.map[idx] = undefined;
		if(score <= a) continue;
		a = score;
		bestmove = i;
		if(a >= b) break;
	}
	this.p2move = bestmove;
	return a;
}

function init({ width: w, height: h }){
	const depth = 3;

	const context = {
		w,h,
		di: [-1, -w, 1, w],
		map: undefined,
		p1score: 0,
		p2score: 0,
		p1dist: undefined,
		p2dist: undefined,
		p2move: 0
	};
	context.validMove = validMove(context);

	//0 = left, 1 = up, 2 = right, 3 = down
	const moves = [
		[-1,0], //left
		[0,-1], //up
		[1,0], //right
		[0,1], //down
	];

	return function frame({ p1, p2 }) {
		// map: 0 = empty, 1 = player 1, 2 = player 2
		context.map = context.map || new Array(w*h).fill(0);
		for(var [x,y] of p1.history) context.map[y*w+x] = 1;
		for(var [x,y] of p2.history) context.map[y*w+x] = 2;

		context.p1 = p1;
		context.p2 = p2;
		const [p1x, p1y] = p1.history.slice(-1)[0] || [];
		const [p2x, p2y] = p2.history.slice(-1)[0] || [];

		const myi = p2x + w * p2y;
		const theiri = p1x + w * p1y;
		negamax.bind(context)(myi,theiri,depth,-1e6,1e6);

		return moves[context.p2move];
	};
}

let frame;
const algo = async (player, state, aggressive) => {
	const {p1, p2, width, height} = state;
	const [currentX, currentY] = player.history.slice(-1)[0] || [];
	const playerSpace = ([x,y]) => ([currentX+x, currentY+y]);

	frame = frame || init({ width, height });
	const move = player.name === 'p2'
		? frame({ p1, p2 })
		: frame({ p1: p2, p2: p1 });

	if(!move){
		frame = undefined;
		return;
	}
	return playerSpace(move);
};

export default algo;
