const validMove = (i, i2, context) => {
	const { w, h } = context;

	if(i2 < 0 || i2 >= w*h) return false;

	const y = Math.floor(i/w);
	const x = i-y*w;
	if(y*w+x !== i) debugger;

	const y2 = Math.floor(i2/w);
	const x2 = i2-y2*w;
	if(y2*w+x2 !== i2) debugger;

	return [-1,1,0].includes(x2 - x) && [-1,1,0].includes(y2 - y);
};

// this is a unit-cost specialization of dijkstra's algorithm
function floodfill(distmap,idx) {
	const { w, h } = this;
	var q = [idx];
	var q2 = [];
	distmap[idx] = 1;
	var dist = 1;
	//while(q.length) {
	while(q.length && distmap.length < w*h) { // is added
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
		q = q2; q2 = [];
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
	
	if(myi === 805 && theiri === 804) debugger;
	
	if(depth == 0) {
		return evaluate_pos.bind(this)(myi,theiri);
	}
	var bestmove=0;
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

function init({ width, height }){
	var p1ai = false;
	// map: 0 = empty, -1 = wall, 1 = player 1, 2 = player 2
	var map = [];
	// width and height constants
	var w = width;
	var h = height;
	var p1score=0,p2score=0;
	var p1dist, p2dist;

	// start out with a clear map with a border around the edges
	for(var j=0;j<h*w;j++) map[j] = 0;
	function addWall(x,y) {
		map[x+y*w] = -1;
	}

	for(var i=0;i<w-1;i++) { addWall(i,0); addWall(i,h-2); }
	for(j=0;j<h-1;j++) { addWall(0,j); addWall(w-2,j); }
	// Move convention: 0 = left, 1 = up, 2 = right, 3 = down (corresponds to keyCode-37)
	var p1move = 0;
	var p2move = 0;
	var dx = [-1,0,1,0];
	var dy = [0,-1,0,1];
	var di = [-1,-w,1,w];
	// var p1x = 9,
	// 		p1y = (h/2)-1;
	// var p2x = w-11,
	// 		p2y = (h/2)-1;
	//var tmr, lastmove;
	//var moveq = [];
	var gameover = false;

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
		// if(moveq.length) {
		// 	var move = moveq[0];
		// 	var newidx = p1x+dx[move]+(p1y+dy[move])*w;
		// 	// note: we only allow move (and pop it from the queue) if it isn't into a wall
		// 	// this has the side-effect of making you go totally out of control if
		// 	// you move right into a long wall, and we should probably pop "stuck"
		// 	// moves after a frame or two
		// 	if(!map[newidx]) {
		// 		p1move = move;
		// 		moveq.shift();
		// 	}
		// }

		//var score = negamax.bind(context)(p2x+w*p2y,p1x+w*p1y,6,-1e6,1e6); // side effect of negamax() is to set p2move

		//p1x += dx[p1move]; p1y += dy[p1move];
		//p2x += dx[p2move]; p2y += dy[p2move];
		// var p1idx = p1x+p1y*w;
		// var p2idx = p2x+p2y*w;
		// if((map[p1idx] && map[p2idx]) || p1idx == p2idx)
		// 	draw();

		const myi = p2x+w*p2y;
		const theiri = p1x+w*p1y;
		negamax.bind(context)(myi,theiri,6,-1e6,1e6);

		//lastmove = p1move;

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
	for(var [x,y] of p1.history){
		map[y*width+x] = 1;
	}
	for(var [x,y] of p2.history){
		map[y*width+x] = 2;
	}
	frame = frame || init({ width, height });
	const context = player.name === 'p2'
		? frame({ map, p1, p2 })
		: frame({ map, p1: p2, p2: p1 });

	return playerSpace(context.p2);
};

export default algo;
