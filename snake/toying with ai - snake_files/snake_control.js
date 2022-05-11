



//==============================================================================

function initMouseClickControl(){
		$(".boardTD").click(function () {
			//alert("Handler for .click() called.");
			//alert($(this).html());

			var success = false;
			var posId = $(this).attr('id').split("_");
			if (window.whichTurn == "Blue") {
				tdX = Number(posId[0]) - bluePos.x;
				tdY = Number(posId[1]) - bluePos.y;
			} else {
				tdX = Number(posId[0]) - redPos.x;
				tdY = Number(posId[1]) - redPos.y;
			}
			console.log('--clicked: [' + posId[0] + ', ' + posId[1] + ']');

			if (window.whichTurn == "Blue") {
				if (Math.abs(tdX) > Math.abs(tdY)) {
					(tdX > 0) ? success = moveBlue(-1, 0) : success = moveBlue(1, 0);
				} else {
					(tdY > 0) ? success = moveBlue(0, 1) : success = moveBlue(0, -1);
				}

				if (!success) if (Math.abs(tdX) > Math.abs(tdY)) {
					(tdY > 0) ? success = moveBlue(0, 1) : success = moveBlue(0, -1);
				} else {
					(tdY > 0) ? success = moveBlue(0, 1) : success = moveBlue(0, -1);
				}

			}

			if (window.whichTurn == "Red") {
				if (Math.abs(tdX) > Math.abs(tdY)) {
					(tdX > 0) ? success = moveRed(1, 0) : success = moveRed(-1, 0);
				} else {
					(tdY > 0) ? success = moveRed(0, 1) : success = moveRed(0, -1);
				}
				if (!success) if (Math.abs(tdX) > Math.abs(tdY)) {
					(tdY > 0) ? success = moveRed(0, 1) : success = moveRed(0, -1);
				} else {
					(tdX > 0) ? success = moveRed(1, 0) : success = moveRed(-1, 0);
				}
			}
			console.log(whichTurn + "'s turn");

			if (window.whichTurn == "Blue" && success) window.whichTurn = "Red";
			else if (window.whichTurn == "Red" && success) window.whichTurn = "Blue";

			//alert( tdX + "_" + tdY );
			//mobileController();

		});
}
//==============================================================================

var pVSp_controls = function(){
	//var controlTarget = $('<div/>',{"id":"controlTarget"});
	//controlTarget.css("background-color:white;width:50px;height:50px;");

	//$('body').append(controlTarget);


	//KEYS: J,I,L,K
	Mousetrap.bind('j',function(){
		console.log('pressed j');
		if (whichTurn=="Blue") if (moveBlue(1,0)) whichTurn="Red";
		return false;
	}, 'keydown');
	Mousetrap.bind('i',function(){
		console.log('pressed i');
		if (whichTurn=="Blue") if (moveBlue(0,-1)) whichTurn="Red";
		return false;
	}, 'keydown');
	Mousetrap.bind('l',function(){
		console.log('pressed l');
		if (whichTurn=="Blue") if (moveBlue(-1,0)) whichTurn="Red";
		return false;
	}, 'keydown');
	Mousetrap.bind('k',function(){
		console.log('pressed k');
  		if (whichTurn=="Blue") if (moveBlue(0,1)) whichTurn="Red";
		return false;
	}, 'keydown');

	//KEYS: A,W,D,S
	Mousetrap.bind('a',function(){
		console.log('pressed a');
		if (whichTurn=="Red") if (moveRed(-1, 0)) whichTurn="Blue";
		return false;
	}, 'keydown');
	Mousetrap.bind('w',function(){
		console.log('pressed w');
		if (whichTurn=="Red") if (moveRed(0,-1)) whichTurn="Blue";
		return false;
	}, 'keydown');
	Mousetrap.bind('d',function(){
		console.log('pressed d');
		if (whichTurn=="Red")if (moveRed(1,0)) whichTurn="Blue";
		return false;
	}, 'keydown');
	Mousetrap.bind('s',function(){
		console.log('pressed s');
  		if (whichTurn=="Red") if (moveRed(0,1)) whichTurn="Blue";
		return false;
	}, 'keydown');

	Mousetrap.bind('esc', function () {
		restart.call();
	});

}

var pVSrand_controls = function(){
	//var controlTarget = $('<div/>',{"id":"controlTarget"});
	//controlTarget.css("background-color:white;width:50px;height:50px;");

	//$('body').append(controlTarget);


	//KEYS: J,I,L,K
	Mousetrap.bind('a',function(){
		console.log('pressed a');
		if (whichTurn=="Red") if (moveRed(-1,0)) {
			whichTurn="Blue";
			doRandomMove("noloop");
		}
		return false;
	}, 'keydown');
	Mousetrap.bind('w',function(){
		console.log('pressed w');
		if (whichTurn=="Red") if (moveRed(0,-1)) {
			whichTurn="Blue";
			doRandomMove("noloop");
		}
		return false;
	}, 'keydown');
	Mousetrap.bind('d',function(){
		console.log('pressed d');
		if (whichTurn=="Red") if (moveRed(1,0)) {
			whichTurn="Blue";
			doRandomMove("noloop");
		}
		return false;
	}, 'keydown');
	Mousetrap.bind('s',function(){
		console.log('pressed s');
  		if (whichTurn=="Red") if (moveRed(0,1)) {
			whichTurn="Blue";
			doRandomMove("noloop");
		}
		return false;
	}, 'keydown');

	Mousetrap.bind('esc', function () {
		restart.call();
	});
}

//==============================================================================

function initKeys() {
	// Arrow key movement. Repeat key five times a second
	if (controlMode == 2) {
		KeyboardController({
			37: function () {
				moveRed(-1, 0);
			},
			38: function () {
				moveRed(0, -1);
			},
			39: function () {
				moveRed(1, 0);
			},
			40: function () {
				moveRed(0, 1);
			}
		}, 275);
	}

	if (controlMode == 1) {
		Mousetrap.bind('up', function () {
			moveRed(0, -1);
			return false;
		}, 'keydown');
		Mousetrap.bind('down', function () {
			moveRed(0, 1);
			return false;
		}, 'keydown');
		Mousetrap.bind('left', function () {
			moveRed(-1, 0);
			return false;
		}, 'keydown');
		Mousetrap.bind('right', function () {
			moveRed(1, 0);
			return false;
		}, 'keydown');

	}

	Mousetrap.bind('esc', function () {
		redPos.x = 15;
		redPos.y = 15;
		bluePos.x = boardData.x - redPos.x + 1;
		bluePos.y = redPos.y;
		initBoard(boardData);
	});

}

//==============================================================================

function mobileController() {
	//alert($(this).html());
	$("#popupDiv").show();
}

//==============================================================================

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
			if (repeat !== 0) timers[key] = setInterval(keys[key], repeat);	}
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
