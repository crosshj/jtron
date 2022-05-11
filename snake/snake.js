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
redPos = new Object();
redPos.x = 15;
redPos.y = 15;
bluePos = new Object();
bluePos.x = boardData.x - redPos.x + 1;
bluePos.y = redPos.y;
var cellWidth = 15;
var cellHeight = cellWidth;
keystate = new Object();
var quit = false;
controlMode = 2;

DEBUG = false;


//==============================================================================

function initBoard(boardData) {

	$("#container").remove();

	if (isMobile) {
		$("body").attr("style", "margin-top:10px;");
		cellWidth--;
		cellHeight--;
	}

	$("body").append('<div id="container" class="container" style="width:' + boardData.x * cellWidth + 'px; height:' + boardData.y * cellHeight + 'px;"/>');


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

	$("container").append('</tbody></table>');
}


//==============================================================================

function moveRed(x, y) {
	if (!isLegal(x, y, redPos)) return false;
	//moveBlue(x, y);
	$("#" + redPos.x + "_" + redPos.y).attr("class", "red_past");
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

function doRandomMove() {
	var currentPos = (whichTurn == "Red") ? redPos : bluePos;
	if (noMoves(currentPos)) {
		//clearInterval ( randomMoveInterval );
		var numberOfMoves = $('.' + whichTurn + '_past').length;
		console.warn(whichTurn + " loses after " + numberOfMoves + " moves");
		$('#restartButton').show();
		return false;
	}
	var randomX = Math.floor(Math.random() * 3) - 1;
	var randomY = Math.floor(Math.random() * 3) - 1;
	while (Math.abs(randomX) == Math.abs(randomY)) {
		randomX = Math.floor(Math.random() * 3) - 1;
		randomY = Math.floor(Math.random() * 3) - 1;
	}
	if (whichTurn == "Red") {
		if (moveRed(randomX, randomY)) {
			window.whichTurn = "Blue";
		}
	} else {
		if (moveBlue(randomX, randomY)) window.whichTurn = "Red";
	}
	setTimeout("doRandomMove()", DELAY)

}

//==============================================================================
var DO_LOOP = function (){
	if (isMobile || !isMobile) {
		setTimeout("doRandomMove()", 500)
	}
}

//==============================================================================
var restart = function (){
 	$('#restartButton').hide();
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

$(document).ready(function () {
	initBoard(boardData);
	window.whichTurn = "Red";
	window.DELAY=0;
	initMouseClickControl();
	initKeys();
	var MENU = [DO_LOOP];
	window.MENU_SELECTION=MENU[0];

	window.restartButton = $('<div>RESTART</div>').attr("class","button").attr("id","restartButton").click(function(){
		restart.call();
	});

	$('body').append(restartButton);

	MENU_SELECTION.call();

});

//==============================================================================