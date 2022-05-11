var DRAWUI = true;

function Position(x,y,parent)
{
    var self = this;
    this.x=x;
    this.y=y;
    this.owner=null;
    this.parent= !parent ? null : parent;
    this.up    = function(){ return (!self.parent[self.x]   || !self.parent[self.x][self.y-1]) ? null : self.parent[self.x][self.y-1];}
    this.down  = function(){ return (!self.parent[self.x]   || !self.parent[self.x][self.y+1]) ? null : self.parent[self.x][self.y+1];}
    this.left  = function(){ return (!self.parent[self.x-1] || !self.parent[self.x-1][self.y]) ? null : self.parent[self.x-1][self.y];}
    this.right = function(){ return (!self.parent[self.x+1] || !self.parent[self.x+1][self.y]) ? null : self.parent[self.x+1][self.y];}
    this.near = [this.up, this.right, this.down, this.left];
    this.domElement = null;
    this.from = null;
    this.to = this;
}

function Player (name, position,parent)
{
    this.parent = parent;
    this.name=name;
    this.history = new Array();
    this.history.board = parent;
    this.history.player = this;
    this.history.toMoveList = function () { var array = []; for (var object in this) { if (this.board.whichDirection(this[object].from, this[object]) != "start") array.push(this.board.whichDirection(this[object].from, this[object])); } return array; };
    if (position) this.history[0]=position;
    this.current= this.history.length == 0
                        ? null
                        : this.history[this.history.length-1];
    
    this.moveDown = function () { return this.parent.doMove(this, this.current.down()); }
    this.moveUp = function () { return this.parent.doMove(this, this.current.up()); }
    this.moveLeft = function () { return this.parent.doMove(this, this.current.left()); }
    this.moveRight = function () { return this.parent.doMove(this, this.current.right()); }

    this.possibleMoves = function () {
        var moves = new Array();
        for (var i in this.current.near) 
        {
            if (this.current.near[i]() && !this.current.near[i]().owner) {
                moves.push(this.current.near[i]());
                // this is temporary, reset in doMove
                this.current.near[i]().from=this.current;
            }
        }
        return moves;
    }
}

function drawSimpleBoard(board)
{
    if (DRAWUI == false) return;
    document.body.innerHTML="";
    for (var j = 0; j < board.height; j++) 
    {
        var row = document.createElement("pre");

        for (var i = 0; i < board.width; i++) 
        {
            var item = document.createElement("span");
            item.appendChild(document.createTextNode(!board[i][j].travel ? "▪" : board[i][j].travel));  // ▫
            item.className = !board[i][j].owner ? "blank" : board[i][j].owner;
            row.appendChild(item);
            board[i][j].domElement = item; // store dom reference
        }
        document.body.appendChild(row);
    }
}

function Board(width, height, p1start, p2start) 
{
    if (!p1start) p1start=new Position(14,14,this);
    if (!p2start) p2start=new Position(37,14,this);
    if (!width) width = 52;
    if (!height) height = 31;
    this.width = width;
    this.height = height;
    this.historyString = function () { var object = {}; object.red = this.red.history.toMoveList(); object.blue = this.blue.history.toMoveList(); return JSON.stringify(object); }

    // create board array and place/create players
    for (var i = 0; i < width; i++) {
        this[i] = new Array(height);
        for (var j = 0; j < height; j++) {
            this[i][j] = new Position(i,j,this);
            if (p1start.x == i && p1start.y == j) 
            {
                this.red = new Player("red",this[i][j],this);
                this[i][j].owner = this.red.name;
            }
            if (p2start.x == i && p2start.y == j) 
            {
                this.blue = new Player("blue",this[i][j],this);
                this[i][j].owner = this.blue.name;
            }
        }
    }

    this.currentPlayer = this.red;
    this.whichDirection = function (from, to) {
        if (from == null) return "start";
        if (from.x == to.x) {
            if (to.y > from.y) {
                return "down";
            } else {
                return "up";
            }
        }
        if (from.y == from.y) {
            if (to.x > from.x) {
                return "right";
            } else {
                return "left";
            }
        }
    };
    this.doMove = function (player, move) {
        var whichDirection = this.whichDirection;
        if (move && !move.owner && player == this.currentPlayer) {
            var currDomElement = this.currentPlayer.current.domElement;
            var current = this.currentPlayer.current;
            var travelDirection = whichDirection(this.currentPlayer.current.from, this.currentPlayer.current) + whichDirection(this.currentPlayer.current, move);

            // reset all froms as set in possibleMoves
            for (var i in player.current.near) {
                if (player.current.near[i]() != null && player.current.near[i]().from == player.current) {
                    player.current.near[i]().from = player.current.near[i]();
                }
            }

            move.owner = player.name;
            player.history.push(move);
            player.current.to = move;
            move.from = player.current;
            player.current = move;



            //console.log(travelDirection);
            var travelChar = null;
            switch (travelDirection) {
                case "upup":
                case "downdown":
                    travelChar = "│";
                    break;
                case "rightright":
                case "leftleft":
                    travelChar = "─";
                    break;
                case "upright":
                case "leftdown":
                    travelChar = "┌";
                    break;
                case "upleft":
                case "rightdown":
                    travelChar = "┐";
                    break;
                case "downright":
                case "leftup":
                    travelChar = "└";
                    break;
                case "downleft":
                case "rightup":
                    travelChar = "┘";
                    break;
                default:
                    travelChar = "▪";
                    break;
            }

            current.travel = travelChar;
            // lookup if reference isn't stored (never)
            var domElement = null;
            if (DRAWUI != false) {
                domElement = (move.domElement == null) ? document.getElementsByTagName('span')[move.y * this.width + move.x] : move.domElement;
                domElement.innerHTML = "▪";
                currDomElement.innerHTML = travelChar;
                domElement.removeAttribute('class')
                domElement.className = player.name;
            }
        }
        return player;
    }

    var array = new Array();
    for (var k = 0; k < width; k++) {
        array[k] = this[k];
    }

    this.array =array;
}

var board = new Board();
drawSimpleBoard(board);

// Keyboard input with customisable repeat (set to 0 for no key repeat)

function KeyboardController(keys, repeat) {
    // Lookup of key codes to timer ID, or null for no repeat
    //
    var timers = {};

    // When key is pressed and we don't already think it's pressed, call the
    // key action callback and set a timer to generate another one after a delay
    //
    document.onkeydown = function (event) {
        var key = (event || window.event).keyCode;

        if (!(key in keys))
            return true;
        if (!(key in timers)) {
            timers[key] = null;
            keys[key]();
            if (repeat !== 0) timers[key] = setInterval(keys[key], repeat); }
        return false;
    };

    // Cancel timeout and mark key as released on keyup
    //
    document.onkeyup = function (event) {
        var key = (event || window.event).keyCode;
        if (key in timers) {
            if (timers[key] !== null) clearInterval(timers[key]);
            delete timers[key];
        }
    };

    // When window is unfocused we may not get key events. To prevent this
    // causing a key to 'get stuck down', cancel all held keys
    //
    window.onblur = function () {
        for (key in timers)
        if (timers[key] !== null) clearInterval(timers[key]);
        timers = {};
    };
};


KeyboardController({
    37: function () { board.currentPlayer.moveLeft();  },
    38: function () { board.currentPlayer.moveUp();    },
    39: function () { board.currentPlayer.moveRight(); },
    40: function () { board.currentPlayer.moveDown();  }
}, 250);


function doRandomMove(avoidance, callback, delay, repeatDelay,repeatCallback) {
    var otherPlayer = (board.currentPlayer == board.red) ? board.blue : board.red;
    // get possible moves of current player
    var moves = board.currentPlayer.possibleMoves();
    if (!delay) delay = 0;
    
    // if no moves left then declare other player the winner, do not call callback
    if (moves.length == 0) {
        console.log("[" + board.currentPlayer.history.length + "] %c" + /*otherPlayer.name.toUpperCase()*/"█" + "%c", "color:" + otherPlayer.name.toLowerCase() + ";", "color:black;");
        if (DRAWUI != false) board.currentPlayer.current.domElement.className = "bright " + board.currentPlayer.name;
        if (DRAWUI != false) board.currentPlayer.current.domElement.innerHTML = "x";
        if (DRAWUI != false) otherPlayer.current.domElement.innerHTML = "o";
        if (DRAWUI != false) otherPlayer.current.domElement.className = "bright " + otherPlayer.name;
        if (typeof repeatDelay != "undefined" && typeof repeatCallback == "function" && repeatDelay >= 0 ) {
            setTimeout(function(){ repeatCallback(); },repeatDelay);
            return true;
        }
        else return false;
    }

    // get exclusion method used by avoidance setting
    var avoidFunc = (typeof avoidance != "undefined") ? window[avoidance] : null;
    
    // filter using avoidance setting
    var safeMoves = (!avoidFunc || moves.length==1) ? moves : avoidFunc(moves, board);
    
    if (safeMoves.length == 0 && avoidance != "simpleFloodFilter") {
        safeMoves = simpleFloodFilter(moves, board);
    } else {
        //safeMoves = simpleFloodFilter(safeMoves, board);
    }

    /*
    if (safeMoves.length == 0) {
        console.log('TROUBLE - NO MOVES');
        return false;
    }
    */

    // take random choice of those filtered moves
    var rand = safeMoves[Math.floor(Math.random() * moves.length)];
    board.doMove(board.currentPlayer, rand);
    
    // switch to other player, and execute callback with timeout and mode/avoidance settings
    board.currentPlayer = otherPlayer;

    if (typeof callback == "function") setTimeout(function () { callback(avoidance, callback, delay, repeatDelay,repeatCallback); }, delay);
    //if (typeof callback == "function") (function () { callback(avoidance, callback); })();    

    return true;
}

function pitFilter(moves, board) {
    var safeMoves = new Array();

    // move is pit move if player goes there and only has one move left (this might describe other situations)
    var isPit = function (move, from) {
        var thenMoves = new Array();
        var takenSpots = new Array();
        for (var i in move.near) {
            if (move.near[i]() && !move.near[i]().owner) thenMoves.push(move.near[i]());
            else takenSpots.push(move.near[i]);
        }

        if (thenMoves.length == 0) { return true; }
        if (thenMoves.length > 1) { return false; }
        // corner versus corridor, should still do a flood test
        else if (thenMoves.length == 1 && ((from.x == move.x && thenMoves[0].x != move.x) || (from.y == move.y && thenMoves[0].y != move.y))) { return false; }
        
        return true;
    }

    var okayToEnterPit = function (move) {
        // TODO: return true if floodfill test suggests it's okay
        return false;
    }


    // TODO: test on -   T and Y  (NOT SURE THIS WORKS RIGHT)
    // T - flood test on right and left
    // Y - flood test on right, left, top  (could just be Y without upper right or upper left branch

    var current = moves[0].from;
    var xTee = (moves.length == 2) && (current.x == moves[0].x == moves[1].x);
    var yTee = (moves.length == 2) && (current.y == moves[0].y == moves[1].y);

    var goingLeft = (current.right() !=null) && current.x==current.right().x;
    var goingRight = (current.left() != null) && current.x == current.left().x;
    var goingUp = (current.down() != null) && current.y == current.down().y;
    var goingDown = (current.up() != null) && current.y == current.up().y;

    var xWhy = (goingLeft && ( current.up().left().owner != null || current.down().left().owner != null )) || (goingRight && ( current.up().right().owner != null || current.down().right().owner != null ));
    var yWhy = (goingUp && (current.left().up().owner != null || current.right().up().owner != null)) || (goingDown && (current.right().down().owner != null || current.left().down().owner != null));
    
    
    if ( xTee || yTee || xWhy || yWhy ) {
        // TODO: do multi flood
        return [];
    }

    for (var i in moves) {
        if (!isPit(moves[i],moves[i].from)) {
            safeMoves.push(moves[i]);
        } else if ( okayToEnterPit(moves[i]) ) {
            safeMoves.push(moves[i]);
        }
        
    }

    return safeMoves;
}

function simpleFloodFilter(moves, board) {
    var floodCounts = [];
    var floodMax = 0;
    var maxFlood = Math.floor(Math.pow(((board.currentPlayer.history.length - 4) / 4), 2));
    var safeMoves = [];

    for (var i in moves) {
        moves[i].owner = "TEST";
        var count = floodFill(moves[i].x, moves[i].y, false, maxFlood);
        moves[i].owner = null;
        if (count>floodMax) floodMax=count;
        floodCounts.push(count);
    }

    for (var j in moves){
        if (floodCounts[j] >= floodMax) safeMoves.push(moves[j]);
    }

    return safeMoves;
}

// TODO: rewind, forward history a step at a time - restart

//reset
function reset() {
    drawSimpleBoard(board = new Board());
}

// TODO: player versus player
// each control mechanism needs its own instance of doRandomMove
// need main/scheduler method that registers intended moves and does them both at same time if they are legal

// TODO: option to customize AI for opponent ( pit, pitfill, floodfill, scored/learned, other )

// click body resets, starts random move
var mobileClick = function (){
   reset();
   //while(doRandomMove("simpleFloodFilter")){}
   //doRandomMove("simpleFloodFilter", doRandomMove, 5)
   //doRandomMove("pitFilter", doRandomMove);
   doRandomMove("simpleFloodFilter", doRandomMove,1,500,mobileClick);
}

function test1(times) {
    var drawUIBACKUP = window.DRAWUI;
    window.DRAWUI = false;
    console.time('Execution time');
    console.profile('test1');
    var numberMoves = 0;
    var consoleLogBackup = window.console.log;
    window.console.log = function () { };
    for (var i = 0; i < times; i++) {
        mobileClick();
        numberMoves += board.red.history.length;
    }
    window.console.log = consoleLogBackup;
    console.profileEnd('test1');
    console.log('%c-------------------------------', "color:blue;");
    console.timeEnd('Execution time');
    console.log('%cAverage moves: ' + numberMoves / times, "color:blue;");
    console.log('%c-------------------------------', "color:blue;");
    window.DRAWUI = drawUIBACKUP;
    return;
}

function doMoves(player, list) {
    if (!player) player = window.board.red;
    var board = player.parent;

    var playerBackup = board.currentPlayer;
    if (player != board.currentPlayer) {
        board.currentPlayer = player;
    }

    var test = 1;
    switch (test) {
        case 1:
            // solved this using floodfill
            // move is valid if flood on it beats flood on other moves or flood on Math.floor(Math.pow(((player.history.length-4)/4),2))
            //                                                                     OR board.width*board.height -board.red.history.length -board.blue.history.length

            if (!list) list = ["up", "up", "right", "right", "down", "down", "down", "left"];
            for (var i in list) {
                board.doMove(window.board.red, window.board.red.current[list[i]]());
            }

            console.log(simpleFloodFilter(board.red.possibleMoves(), board)); // should return the left and down moves
            break;

        case 2:
            if (!list) list = { "red": ["up", "right", "right", "down", "right", "right", "down", "down", "left", "left", "left", "left", "down", "down", "down", "down", "left", "left", "up", "up", "up", "up", "left", "down", "down", "down", "down", "down", "right", "right", "right", "right", "up", "up", "up", "up", "right", "right", "right", "right", "up", "up", "up", "up", "left", "left", "up", "left", "left", "left", "left", "left", "left", "down", "down", "right", "up", "right", "down", "down"], "blue": ["left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left", "up", "up", "left", "left", "up", "left", "left", "left", "left", "left", "left", "left", "left", "down", "down", "down"] };
            //console.log(list);

            board.currentPlayer = board.red;
            for (var k in list.red) {
                board.doMove(window.board.red, window.board.red.current[list.red[k]]());
            }
            board.currentPlayer = board.blue;
            for (var j in list.blue) {
                board.doMove(window.board.blue, window.board.blue.current[list.blue[j]]());
            }
            // TODO: fix this - returns board[12][15], should return board[13][16] & board[14][15] - note 2 returned, not just one!
            console.log(simpleFloodFilter(board.red.possibleMoves(), board));
            break;
    }
    board.currentPlayer = playerBackup;
}






function floodFill(x, y, showFlood, limit) {
    var count = 0;
    var Stack = [];
    var flooded = [];

    if (!limit) limit = board.width * board.height;
    if (showFlood==undefined) showFlood = true;

    var fillPixel = function (x, y) {
        var alreadyFilled = function (x, y) {
            return board[x][y].owner != null;
        }

        var doFill = function (x, y) {
            count++;
            flooded.push(board[x][y]);
            board[x][y].owner = "orange";
            if (DRAWUI == true && showFlood) board[x][y].domElement.className = "orange";
            return (count <= limit);
        }

        if (!alreadyFilled(x, y)) if (!doFill(x, y)) return false;

        if (y - 1 >= 0 && !alreadyFilled(x, y - 1)) Stack.push([x, y - 1]);
        if (x + 1 < board.width && !alreadyFilled(x + 1, y)) Stack.push([x + 1, y]);
        if (y + 1 < board.height && !alreadyFilled(x, y + 1)) Stack.push([x, y + 1]);
        if (x - 1 >= 0 && !alreadyFilled(x - 1, y)) Stack.push([x - 1, y]);
        return true;
    }

    // start and do main fill
    fillPixel(x, y);
    while (Stack.length > 0) {
        toFill = Stack.pop();
        if (!fillPixel(toFill[0], toFill[1])) break;
    }

    // erase floodfill data
    if (!showFlood) {
        for (var i in flooded) {
            flooded[i].owner = null;
        }
    }
    return count;
}


// TODO: do this same thing, but on a list of pixels and fill them all at once
function multiFloodFill(list, limit) {


    return orderedObject;  // each of the items in list, but  with a count for each - that is, one more (or equal) than the last flood count to fall out race to max flood
    // eg. { "array" : [ { "count": 1, "item": [x1,y1] }, { "count": 5, "item": [x2,y2] }, { "count": 6, "item": [x3,y3] } ], "max": [{ "count": 6, "item": [x3,y3] }]  }
}

// TODO: count time spent and number of usages of filter methods

// TODO: need a flood fill that fills the way that player would fill

// TODO: filterGoal - pick a goal position to go some random number of moves ahead (within reason) then find a spot on the board that is safe to go to that is that many moves ahead
// this uses a method of flood fill that emulates character movement, if this place does not exist then step lower on moves until safe spot is found
// keep track of goal and filter moves based on this until goal is reached, then make new goal or follow some other filter method


// TODO: need a way of telling what spots any player can possibly move to in n number of moves


// TODO: method for converting current moves into a form that can be copy/pasted or stored so that certain situations can be trouble shooted
