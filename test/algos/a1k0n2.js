const validMove = (i, i2, context) => {
	const { w, h } = context;

	if(i2 < 0 || i2 >= w*h) return false;

	const y = Math.floor(i/w);
	const x = i-y*w;

	const y2 = Math.floor(i2/w);
	const x2 = i2-y2*w;

	return [-1,1,0].includes(x2 - x) &&
		[-1,1,0].includes(y2 - y);
};

// this is a unit-cost specialization of dijkstra's algorithm
function floodfill(distmap,idx) {
	const { w, h } = this;
	var q = [idx];
	var q2 = [];
	distmap[idx] = 1;
	var dist = 1;
	while(q.length) {
		dist++;
		for(var i=0;i<q.length;i++) {
			var idx = q[i];
			for(var move=0;move<4;move++) {
				var i2 = idx + this.di[move];

				if(this.map[i2] || distmap[i2]) continue;
				if(!validMove(idx, i2, this)) continue;

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
	for(var i=w+1;i<w*(h-1)-1;i++) {
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
	const { w, h } = this;

	if(depth == 0) {
		return evaluate_pos.bind(this)(myi,theiri);
	}
	var bestmove;
	var bestaltmove=0;
	for(var move=0;move<4;move++) {
		var idx = myi + this.di[move];
		if(this.map[idx]) continue;
		if(!validMove(myi, idx, this)) continue;
		this.map[idx] = 1;
		// recurse
		var score = -negamax.bind(this)(theiri,idx,depth-1, -b, -a);
		this.map[idx] = undefined;
		if(score > a) {
			a = score;
			bestmove = move;
			bestaltmove = this.p2move;
			if(a >= b)
				break;
		}
	}
	// note: p1ai is buggy, because we're cheating: player 1 AI will probably
	// smash into a wall when P2 is about to lose.  we're just using the player
	// 1 move from the principal variation computed for player 2, and if player
	// 2 is doomed, there isn't one.
	if(this.p1ai) this.p1move=bestaltmove;
	this.p2move = bestmove;
	return a;
}

function init({ width: w, height: h }){
	var p1ai = false;

	// map: 0 = empty, -1 = wall, 1 = player 1, 2 = player 2
	var map = [];
	var p1score=0,p2score=0;
	var p1dist, p2dist;

	// start out with a clear map with a border around the edges
	for(var j=0;j<h*w;j++) map[j] = 0;

	// Move convention: 0 = left, 1 = up, 2 = right, 3 = down (corresponds to keyCode-37)
	var p1move = 0;
	var p2move = 0;
	var dx = [-1,0,1,0];
	var dy = [0,-1,0,1];
	var di = [-1,-w,1,w];

	const context = {
		w,h,
		di, map,
		p1score, p2score, p1dist, p2dist,
		p1move, p2move,
		p1ai
	};

	return function frame({ map, p1, p2 }) {
		context.map = map;
		context.p1 = p1;
		context.p2 = p2;
		const [p1x, p1y] = p1.history[p1.history.length-1];
		const [p2x, p2y] = p2.history[p2.history.length-1];

		const myi = p2x+w*p2y;
		const theiri = p1x+w*p1y;
		negamax.bind(context)(myi,theiri,6,-1e6,1e6);

		//0 = left, 1 = up, 2 = right, 3 = down
		const moves = [
			[-1,0], //left
			[0,-1], //up
			[1,0], //right
			[0,1], //down
		];
		return {
			p1: moves[context.p1move],
			p2: moves[context.p2move]
		};
	};
}

let frame;
const algo = async (player, state, aggressive) => {
	const {p1, p2, width, height} = state;
	const [currentX, currentY] = player.history[player.history.length-1];
	const playerSpace = ([x,y]) => ([currentX+x, currentY+y]);

	// map: 0 = empty, -1 = wall, 1 = player 1, 2 = player 2
	const map = new Array(width*height).fill(0);
	for(var [x,y] of p1.history) map[y*width+x] = 1;
	for(var [x,y] of p2.history) map[y*width+x] = 2;

	frame = frame || init({ width, height });
	const context = player.name === 'p2'
		? frame({ map, p1, p2 })
		: frame({ map, p1: p2, p2: p1 });

	if(!context.p2) return;
	return playerSpace(context.p2);
};

export default algo;
