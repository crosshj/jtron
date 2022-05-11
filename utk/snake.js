/*

		TO DO:

		collision detect, end of game
		better opponent
		splash screen at first
		AI versus AI, via javascript library for AI



*/

var isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/);

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

$(document).ready(function() {
    initBoard(boardData);
    initKeys();

});

function initBoard(boardData) {

    $("#container").remove();

	 if (isMobile){
		$("body").attr("style","margin-top:10px;");
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

	 if (isMobile || !isMobile){
  		window.whichTurn = "Red";
        $(".boardTD").click(function() {
  				//alert("Handler for .click() called.");
				//alert($(this).html());
				
				var posId=$(this).attr('id').split("_");
				if (window.whichTurn == "Blue"){
                    tdX = Number(posId[0]) - bluePos.x;
				    tdY = Number(posId[1]) - bluePos.y;
				} else {
				    tdX = Number(posId[0]) - redPos.x;
				    tdY = Number(posId[1]) - redPos.y;
				}
				
  		if (window.whichTurn == "Blue"){
				if ( Math.abs(tdX) > Math.abs(tdY)){
				    ( tdX > 0 ) ? moveBlue( -1, 0) : moveBlue( 1, 0);
                } else {
                    ( tdY > 0 ) ? moveBlue( 0, 1) : moveBlue( 0, -1);
                }
        } 
        
        if (window.whichTurn == "Red"){
				if ( Math.abs(tdX) > Math.abs(tdY)){
				    ( tdX > 0 ) ? moveRed( 1, 0) : moveRed( - 1, 0);
                } else {
                    ( tdY > 0 ) ? moveRed( 0, 1) : moveRed( 0, -1);
                }            
        }
        
        if (window.whichTurn == "Blue") window.whichTurn = "Red";
        else if (window.whichTurn == "Red") window.whichTurn = "Blue"; 
        
                //alert( tdX + "_" + tdY );
                //mobileController();
                
		});

	 }
}

function initKeys() {
    // Arrow key movement. Repeat key five times a second
    if (controlMode == 2) {
        KeyboardController({
            37: function() {
                moveRed( - 1, 0);
            },
            38: function() {
                moveRed(0, -1);
            },
            39: function() {
                moveRed(1, 0);
            },
            40: function() {
                moveRed(0, 1);
            }
        }, 275);
    }

    if (controlMode == 1) {
        Mousetrap.bind('up', function() {
            moveRed(0, -1);
            return false;
        }, 'keydown');
        Mousetrap.bind('down', function() {
            moveRed(0, 1);
            return false;
        }, 'keydown');
        Mousetrap.bind('left', function() {
            moveRed( - 1, 0);
            return false;
        }, 'keydown');
        Mousetrap.bind('right', function() {
            moveRed(1, 0);
            return false;
        }, 'keydown');

    }

		Mousetrap.bind('esc', function() {
			redPos.x = 15;
			redPos.y = 15;
			bluePos.x = boardData.x - redPos.x + 1;
			bluePos.y = redPos.y;
			initBoard(boardData);
		});

}

function moveRed(x, y) {
    //moveBlue(x, y);
    $("#" + redPos.x + "_" + redPos.y).attr("class", "red_past");
    redPos.y += y;
    redPos.x += x;
    $("#" + redPos.x + "_" + redPos.y).attr("class", "red_selected");
    
}

function moveBlue(x, y) {

    //TODO: pick random empty cell, move there

    $("#" + bluePos.x + "_" + bluePos.y).attr("class", "blue_past");
    bluePos.y += (y);
    bluePos.x += ( - 1 * x);
    $("#" + bluePos.x + "_" + bluePos.y).attr("class", "blue_selected");
}
function mobileController(){
    //alert($(this).html());
    $("#popupDiv").show();
}
// Keyboard input with customisable repeat (set to 0 for no key repeat)
//
function KeyboardController(keys, repeat) {
    // Lookup of key codes to timer ID, or null for no repeat
    //
    var timers = {};

    // When key is pressed and we don't already think it's pressed, call the
    // key action callback and set a timer to generate another one after a delay
    //
    document.onkeydown = function(event) {
        var key = (event || window.event).keyCode;
        if (! (key in keys))
            return true;
        if (! (key in timers)) {
            timers[key] = null;
            keys[key]();
            if (repeat !== 0)
                timers[key] = setInterval(keys[key], repeat);
        }
        return false;
    };

    // Cancel timeout and mark key as released on keyup
    //
    document.onkeyup = function(event) {
        var key = (event || window.event).keyCode;
        if (key in timers) {
            if (timers[key] !== null)
                clearInterval(timers[key]);
            delete timers[key];
        }
    };

    // When window is unfocused we may not get key events. To prevent this
    // causing a key to 'get stuck down', cancel all held keys
    //
    window.onblur = function() {
        for (key in timers)
            if (timers[key] !== null)
            clearInterval(timers[key]);
        timers = {};
    };
};
