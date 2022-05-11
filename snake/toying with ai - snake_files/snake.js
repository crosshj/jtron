/*******************************************************************************
*
*

		TO DO:

		better opponent
		splash screen at first
		AI versus AI, via javascript library for AI



********************************************************************************/
//==============================================================================
var isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);

//==============================================================================

boardData = new Object();
boardData.x = 52;
boardData.y = 31;

STARTPOSRED = new Object();
STARTPOSBLUE = new Object();
STARTPOSRED.x = 15;
STARTPOSRED.y = 15;
STARTPOSBLUE.x = boardData.x - STARTPOSRED.x + 1;;
STARTPOSBLUE.y = STARTPOSRED.y;

redPos = new Object();
$.extend(redPos,STARTPOSRED);
bluePos = new Object();
$.extend(bluePos,STARTPOSBLUE);

var cellWidth = 15;
var cellHeight = cellWidth;
keystate = new Object();
var quit = false;
controlMode = 2;

DEBUG = false;

LOOKAHEAD = 52;
BUFFER = 0.01;

//==============================================================================

function bindEvents(target){

	target.bind("pause",function(e,caller){
		if ($(caller).hasClass("disabled")) return false;
		alert($(caller).text() + " button does nothing yet.");	
	});

	target.bind("rewindStep",function(e,caller){
		if ($(caller).hasClass("disabled")) return false;
		alert($(caller).text() + " button does nothing yet.");	
	});

	target.bind("forwardStep",function(e,caller){
		if ($(caller).hasClass("disabled")) return false;
		alert($(caller).text() + " button does nothing yet.");	
	});

	target.bind("commentClick",function(e,caller){
		if ($(caller).hasClass("disabled")) return false;
		alert('"'+$(caller).text() + '" click does nothing yet.');
	});
}



//==============================================================================

function initBoard(boardData) {

	$("#container").remove();

	if (isMobile) {
		$("body").attr("style", "margin-top:10px;");
		cellWidth--;
		cellHeight--;
	}

	$("body").append('<div id="container" class="container" style="width:' + boardData.x * cellWidth + 'px; height:' + boardData.y * cellHeight + 'px;"/>');

	// set up profile block
	var profileDiv = $('<div/>', {"id" : "profile"});
	profileDiv.click(function(){
		$('body').trigger("commentClick", $(this));
	});

	var comment = "Click here here to say hello.";
	profileDiv.append('<div class="comment">'+comment+'</div>');
	var userPic = "https://graph.facebook.com/crosshj/picture?return_ssl_resources=1&width=60&height=60";
	profileDiv.append('<div class="profilePic"><img src="'+userPic+'"/></div>');

	$("#container").append('<table id="board" border="1"><tbody>');

	for (i = 0; i < boardData.y; i++) {
		$("#board").append('<tr class="boardTR">');
		for (j = 0; j < boardData.x; j++) {
			if (j == redPos.x - 1 && i == redPos.y - 1) {
				$(".boardTR").eq(i).append('<td id="' + (j + 1) + '_' + (i + 1) + '" class="red_selected boardTD"></td>');
			} else if (j == bluePos.x - 1 && i == bluePos.y - 1) {
				$(".boardTR").eq(i).append('<td id="' + (j + 1) + '_' + (i + 1) + '" class="blue_selected boardTD"></td>');
			} else {
				$(".boardTR").eq(i).append('<td class="boardTD" id="' + (j + 1) + '_' + (i + 1) + '" ></td>');
			}
		}
		$("#board").append('</tr>');
	}

	$("#container").append('</tbody></table>');
	
	$("#container").append('<div id="toolbar"/>');
	
		window.restartButton = $('<div>RESTART</div>').attr("class","disabled button").attr("id","restartButton").click(function(){
		restart.call();
	});
	
	window.pauseButton = $('<div>PAUSE</div>').attr("class","disabled button").attr("id","pauseButton").click(function(){
		$('body').trigger("pause", this);
	});
	
	window.rewindButton = $('<div>&lt;&lt;</div>').attr("class","disabled button").attr("id","rewindButton").click(function(){
		$('body').trigger("rewindStep", $(this));
	});
	window.forwardButton = $('<div>&gt;&gt;</div>').attr("class","disabled button").attr("id","forwardButton").click(function(){
		$('body').trigger("forwardStep", $(this));
	});	

	$('#toolbar').append(restartButton);
	$('#toolbar').append(rewindButton);
	$('#toolbar').append(pauseButton);
	$('#toolbar').append(forwardButton);

	$('body').append(profileDiv);


	bindEvents($('body'));
	
}


//==============================================================================

function moveRed(x, y) {
	if (!isLegal(x, y, redPos)) return false;
	//moveBlue(x, y);
	$("#" + redPos.x + "_" + redPos.y).attr("class", "red_past");
	if (x+redPos.x > redPos.x){
		$("#" + redPos.x + "_" + redPos.y).addClass("right");
	}
	if (x+redPos.x < redPos.x){
		$("#" + redPos.x + "_" + redPos.y).addClass("left");
	}
	if (y+redPos.y > redPos.y){
		$("#" + redPos.x + "_" + redPos.y).addClass("down");
	}
	if (y+redPos.y < redPos.y){
		$("#" + redPos.x + "_" + redPos.y).addClass("up");
	}
	if (JSON.stringify(redPos)===JSON.stringify(STARTPOSRED)){
		$("#" + redPos.x + "_" + redPos.y).addClass("start");
	}
	redPos.y += y;
	redPos.x += x;
	$("#" + redPos.x + "_" + redPos.y).attr("class", "red_selected");
	return true;
}

//==============================================================================

function moveBlue(x, y) {
	if (!isLegal(x, y, bluePos)) return false;
	//TODO: pick random empty cell, move there

	$("#" + bluePos.x + "_" + bluePos.y).attr("class", "blue_past");

	if ((-1 * x)+bluePos.x > bluePos.x){
		$("#" + bluePos.x + "_" + bluePos.y).addClass("right");
	}
	if ((-1 * x)+bluePos.x < bluePos.x){
		$("#" + bluePos.x + "_" + bluePos.y).addClass("left");
	}
	if (y+bluePos.y > bluePos.y){
		$("#" + bluePos.x + "_" + bluePos.y).addClass("down");
	}
	if (y+bluePos.y < bluePos.y){
		$("#" + bluePos.x + "_" + bluePos.y).addClass("up");
	}

	if (JSON.stringify(bluePos)===JSON.stringify(STARTPOSBLUE)){
		$("#" + bluePos.x + "_" + bluePos.y).addClass("start");
	}

	bluePos.y += (y);
	bluePos.x += (-1 * x);
	$("#" + bluePos.x + "_" + bluePos.y).attr("class", "blue_selected");
	return true;
}


//==============================================================================

function isLegal(x, y, current) {
	var newMove = new Object();
	newMove.x = (whichTurn == "Red") ? current.x + x : current.x - x;
	newMove.y = current.y + y;

	if (newMove.x > boardData.x) {
		if (DEBUG) console.log("NewMove x is above range");
		return false;
	}
	if (newMove.x < 1) {
		if (DEBUG) console.log("NewMove x is below range");
		return false;
	}
	if (newMove.y > boardData.y) {
		if (DEBUG) console.log("NewMove y is above range");
		return false;
	}
	if (newMove.y < 1) {
		if (DEBUG) console.log("NewMove y is below range");
		return false;
	}

	if (true != $("#" + newMove.x + "_" + newMove.y).hasClass("boardTD")) {
		if (DEBUG) console.log('NewMove [' + newMove.x + ', ' + newMove.y + '] is not to an empty cell');
		return false;
	}

	return true;
}

//==============================================================================

function noMoves(currentPos) {
	if (
	isLegal(1, 0, currentPos) || isLegal(-1, 0, currentPos) || isLegal(0, 1, currentPos) || isLegal(0, -1, currentPos)) return false;
	return true;
}

//==============================================================================




//==============================================================================

function doRandomMove(mode) {
	var currentPos = (whichTurn == "Red") ? redPos : bluePos;
	var moves = possibleMovesArray(currentPos);

	if (moves.length == 0) {
		//clearInterval ( randomMoveInterval );
		var numberOfMoves = $('.' + whichTurn + '_past').length;
		console.warn(whichTurn + " loses after " + numberOfMoves + " moves");
		if (whichTurn == "Red"){
			$('#restartButton').addClass("blue_past");
		}else{
			$('#restartButton').addClass("red_past");
		}
		$('#restartButton').removeClass("disabled");
		return false;
	}
// 	var safeMoves = [];
// 	if (moves.length > 1){
// 		//safeMoves = pitAvoidSimpleArray.call(null,[currentPos.x,currentPos.y],moves);
// 		safeMoves = fillTestArray.call(null,[currentPos.x,currentPos.y],moves,1);
// 	} //else {
// 		safeMoves = moves;
// 	//}
// 	//console.log(moves);
//  	if (safeMoves.length > 0){
//  		moves = safeMoves;
// 	}
// // 	} else {
// // 		//console.log("No fill test safe moves! "+whichTurn+" at [ " +currentPos.x+", "+currentPos.y+" ]");
// // 	}
	moves=fillTestArray.call(null,[currentPos.x,currentPos.y],moves,BUFFER);

	var rand = moves[Math.floor(Math.random() * moves.length)];

	var randomX, randomY;
	randomX = (whichTurn == "Red") ? rand[0]-currentPos.x : currentPos.x-rand[0];
	randomY = rand[1]-currentPos.y;

// 	while (1) {
// 		randomX = Math.floor(Math.random() * 3) - 1;
// 		randomY = Math.floor(Math.random() * 3) - 1;
// 		if ( Math.abs(randomX) == Math.abs(randomY) ) {
// 			continue;
// 		}
// 		var safeMoves = pitAvoidSimpleArray.call(null,[currentPos.x,currentPos.y],[[currentPos.x+randomX,currentPos.y+randomY]]);
// 		//console.log(safeMoves);
// 		if (safeMoves.length > 0){
// 			break;
// 		}
//
// 	}

	var move="fail";
	if (whichTurn == "Red") {
		if (moveRed(randomX, randomY)) {
			window.whichTurn = "Blue";
			move="success"
		}
	} else {
		if (moveBlue(randomX, randomY)) {
			window.whichTurn = "Red";
			move="success"
		}
	}
	if (mode == "loop"| move == "fail") setTimeout("doRandomMove()", DELAY)
}

//==============================================================================
var DO_LOOP = function (){
	if (isMobile || !isMobile) {
		setTimeout('doRandomMove("loop")', 500)
	}
}

//==============================================================================
var restart = function (){
	$('.red_past').removeClass('red_past');
	$('.blue_past').removeClass('blue_past');
	$('#restartButton').addClass("disabled");
	redPos.x = 15;
	redPos.y = 15;
	window.whichTurn = "Red";
	bluePos.x = boardData.x - redPos.x + 1;
	bluePos.y = redPos.y;
  $('td').attr("class",'boardTD');
	$('td#'+bluePos.x+'_'+bluePos.y).addClass("blue_selected");
	$('td#'+redPos.x+'_'+redPos.y).addClass("red_selected");
	MENU_SELECTION.call();
}

//==============================================================================
function isEmpty (cell){
	var x = cell[0];
	var y = cell[1];
	var blueCurrent = $('td#'+x+'_'+y).hasClass("blue_selected");
	var redCurrent  = $('td#'+x+'_'+y).hasClass("red_selected");
	var bluePast = $('td#'+x+'_'+y).hasClass("blue_past");
	var redPast  = $('td#'+x+'_'+y).hasClass("red_past");
	var outOfRange = x > boardData.x | x < 1 | y > boardData.y | y < 1
	return !(blueCurrent | redCurrent | bluePast | redPast | outOfRange);
}

function boldCell(x,y){
	$('td#'+x+'_'+y).css("background-color","#F0F");
}

function redPastCell(x,y){
	$('td#'+x+'_'+y).addClass("red_past");
}

function redSelectCell(x,y){
	$('td#'+x+'_'+y).addClass("red_selected");
}

//==============================================================================
// return all moves from given that are safe against pit/channel trap using a simple algorithm
var pitAvoidSimpleArray = function (position, moves){
	 var posX = position[0];
	 var posY = position[1];
	 //console.log(position);
	 //console.log(moves);
	 return $.map(moves,function(move,index){
		var x = move[0];
	 	var y = move[1];
  		// if new move lands in a channel, don't count it safe

// 		console.log("FROM "+posX+","+posY+" TO "+x+","+y+" ");
//  		console.log("SAME X "+(posX==x));
//  		console.log("LEFT "+isEmpty([x-1,y]));
//  		console.log("RIGHT "+isEmpty([x+1,y]));
//  		console.log( posX==x && isEmpty([x,y-1]) & isEmpty([x,y+1]) );
// 		console.log("SAME Y "+(posY==y));
// 		console.log(!isEmpty([x,y-1]));
// 		console.log(!isEmpty([x,y+1]));
// 		console.log( posY==y && (!isEmpty([x,y-1]) & !isEmpty([x,y+1])) );
// 		console.log(  ( posX==x & (isEmpty([x,y-1]) & isEmpty([x,y+1])) )
// 		    | ( posY==y & (isEmpty([x-1,y]) & isEmpty([x+1,y])) )
// 		);

		if (!isEmpty([x,y])) return;

		if ( posX==x && (!isEmpty([x-1,y]) & !isEmpty([x+1,y])) ){
			if (DEBUG) console.log("SAFE(1) = ["+x+","+y+"]");
			return;
		}
		if ( posY==y && (!isEmpty([x,y-1]) & !isEmpty([x,y+1])) ){
			if (DEBUG) console.log("SAFE(2) = ["+x+","+y+"]");
			return;
		}
		//console.log("NOT SAFE = ["+x+","+y+"]");
		return [move];
	});

}
function appendClass(x,y,cellClass){
	$('#'+x+'_'+y).addClass(cellClass);
}

function testClass(x,y,cellClass){
	return $('#'+x+'_'+y).hasClass(cellClass);
}

function fill(x, y){
	 var cellClass = "TESTER";
	 appendClass(x,y,cellClass);
}

function alreadyFilled(x, y){
	return (    testClass(x,y,"TESTER")
	         || testClass(x,y,"red_past")
	         || testClass(x,y,"red_selected")
	         || testClass(x,y,"blue_past")
	         || testClass(x,y,"blue_selected")
	         || testClass(x,y,"TESTER_BORDER")  );
}

function floodFill(x, y){
	if(alreadyFilled(x, y)) return false;
	if ( x > boardData.x | x < 1 | y > boardData.y | y < 1 ) return false;
	//setTimeout("fill("+x+", "+y+");", (++counter)*50);
	//console.log('fill ' + x + ' ' + y);
	fill(x, y);

	return ( floodFill(x,   y-1) & floodFill(x+1, y  ) & floodFill(x,   y+1) & floodFill(x-1, y  ));
}

function drawBox(x,y,boxRadius,cellClass){
	var startX, startY, endX, endY;

	if (x-boxRadius < 0) startX = 0;
	else startX = x-boxRadius;

	if (y-boxRadius < 0) startY = 0;
	else startY = y-boxRadius;

	if (x+boxRadius > boardData.x) endX = boardData.x+1;
	else endX = x+boxRadius;

	if (y+boxRadius > boardData.y) endY = boardData.y+1;
	else endY = y+boxRadius;

	for ( i = startX; i<endX; i++){
		appendClass(i,startY,cellClass);
		appendClass(i,endY,cellClass);
	}
	for ( i = startY; i<=endY; i++){
		appendClass(startX,i,cellClass);
		appendClass(endX,i,cellClass);
	}

	for ( i = startX+1; i<endX; i++){
		for ( j = startY+1; j<endY; j++){
			appendClass(i,j,"WITHIN_BOX");
		}
	}


	//if (endX > boardData.x) endX = boardData.x;
	//if (endY > boardData.y) endY = boardData.y;
	//if (startX < 1) startX = 1;
	//if (startY < 1) startY = 1;

	return (endX-startX-1)*(endY-startY-1);

}


function fillTest(x,y,boxRadius){
	if ( x > boardData.x | x < 1 | y > boardData.y | y < 1){
		console.log("fillTest test point out of range [ " + x + ", "+y+" ]");
		return;
	}

	$('.TESTER_BORDER').removeClass('TESTER_BORDER');
	$('.TESTER').removeClass('TESTER');
	$('.WITHIN_BOX').removeClass('WITHIN_BOX');
	window.counter=0;
	var cellClass = "TESTER_BORDER";
	var fillCount = 0;
// 	if (boxRadius > 30){
// 		console.log("Max box radius is 15 due to stack size.");
// 		boxRadius = 15;
// 	}
	var totalPossible=drawBox(x,y,boxRadius,cellClass);
	if (DEBUG) console.log("totalPossible = "+totalPossible);
	if (!floodFill(x, y)){
		$('.TESTER_BORDER').removeClass('TESTER_BORDER');
		fillCount = $('.TESTER').length;
		$('.TESTER').removeClass('TESTER');
	}
	return 100 * fillCount/totalPossible;
}



//==============================================================================
var possibleMovesArray = function (position){
	// return all moves that can possibly be made
	var left, right, up, down;
	var list = [];
	left =[position.x-1,position.y  ,whichTurn,"left"];
	right=[position.x+1,position.y  ,whichTurn,"right"];
	up   =[position.x,  position.y-1,whichTurn,"up"];
	down =[position.x,  position.y+1,whichTurn,"down"];
	if (isEmpty(left)) list.push(left);
	if (isEmpty(right)) list.push(right);
	if (isEmpty(up)) list.push(up);
	if (isEmpty(down)) list.push(down);

	//console.log(list);

	return list;
}


//==============================================================================
// return all moves from given that are safe against pit/channel trap using a simple algorithm
var fillTestArray = function (position, moves, buffer){
	var bestPercent=0;
	var boxRadius = LOOKAHEAD;//(boardData.x > boardData.y)? boardData.x : boardData.y;

	moves.forEach(function(move, index, array){
		var x = move[0];
	 	var y = move[1];
		move.fillPercent = fillTest(x,y,boxRadius);
		if (move.fillPercent > bestPercent) bestPercent = move.fillPercent;
	});

	return $.map(moves,function(move,index){

		if (move.fillPercent >= (bestPercent-buffer)) {
			return [move];
		}


	});

}

var pVSp = function(){
	pVSp_controls.call();
}

var pVSrand = function(){
	pVSrand_controls.call();
}

//==============================================================================

$(document).ready(function () {
	//initBoard(boardData);
	window.whichTurn = "Red";
	window.DELAY=0;
	//initMouseClickControl();
	//initKeys();
	var MENU = [DO_LOOP, pVSp, pVSrand];
 	window.MENU_SELECTION=MENU[2];

	//MENU_SELECTION.call();

});

//==============================================================================