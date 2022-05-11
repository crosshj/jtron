//		<script  type="text/javascript">
		boardData = new Object();
		boardData.x = 52;
		boardData.y = 31;
		redStart = new Object();
		redStart.x = 15;
		redStart.y = 15;
		blueStart = new Object();
		blueStart.x = boardData.x - redStart.x;
		blueStart.y = redStart.y;
		var cellWidth = 15;
		var cellHeight = cellWidth;
		keystate = new Object();
		var quit = false;
		Game = new Object();

		$(document).ready(function()
		{
			initBoard(boardData);
			initKeys();
			Game.run();
			alert("Thanks for playing!  Refresh for another game!");

		});

		function initBoard(boardData) {
			$("body").append('<div id="container" class="container" style="width:'+
									boardData.x * cellWidth+'px; height:'+boardData.y * cellHeight+'px;"/>');

			$("#container").append('<table id="board" border="1"><tbody>');
			for (i=0; i < boardData.y; i++) {
				$("#board").append('<tr>');
				for (j=0; j < boardData.x; j++) {
					if (j==redStart.x-1 && i==redStart.y-1){
					   $("tr").eq(i).append('<td id="('+(i+1)+','+(j+1)+')" class="red_selected"></td>');
					} else if (j==blueStart.x && i==blueStart.y-1){
		  				$("tr").eq(i).append('<td id="('+(i+1)+','+(j+1)+')" class="blue_selected"></td>');
					} else {
						$("tr").eq(i).append('<td id="('+(i+1)+','+(j+1)+')" ></td>');
					}
				}
				$("#board").append('</tr>');
			}
			$("container").append('</tbody></table>');
		}


		function initKeys(){
			Mousetrap.bind('up',    function() { keystate.up    = true; return false;});
			Mousetrap.bind('down',  function() { keystate.down  = true; return false;});
			Mousetrap.bind('left',  function() { keystate.left  = true; return false;});
			Mousetrap.bind('right', function() { keystate.right = true; return false;});
			Mousetrap.bind('esc',   function() { quit           = true; return false;});
		}






		// from     http://nokarma.org/2011/02/02/javascript-game-development-the-game-loop/index.html

		// Updated drawing code for our objects
		//Game.prototype.draw = function(context, interpolation) {
	 		//context.fillRect(this.x, this.y + this.velocity * interpolation, 30, 30);
		//};


		Game.update = function(){};
		Game.draw = function(interpolation) {
		  //this.context.clearRect(0, 0, 640, 480);

		  //for (var i=0; i < this.entities.length; i++) {
		    //this.entities[i].draw(this.context, interpolation);
		  //}
		};

		Game.run = (function() {
		  var loops = 0, skipTicks = 1000 / Game.fps,
		      maxFrameSkip = 10,
		      nextGameTick = (new Date).getTime(),
		      lastGameTick;

		  return function() {
		    loops = 0;

		    while ((new Date).getTime() > nextGameTick) {
		      Game.update();
		      nextGameTick += skipTicks;
		      loops++;
		    }

		    if (!loops) {
		      Game.draw((nextGameTick - (new Date).getTime()) / skipTicks);
		    } else {
		      Game.draw(0);
		    }
		  };
		})();