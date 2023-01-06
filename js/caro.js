
const X = 1, O = 2, Empty = 0;


var currGame = new game(20, 20);
board.writeBoard();

function startTimer(seconds, container, oncomplete) {
    var startTime, timer, obj, ms = seconds*1000,
        display = document.getElementById(container);
    obj = {};
    obj.resume = function() {
        startTime = new Date().getTime();
        timer = setInterval(obj.step,250); // adjust this number to affect granularity
                            // lower numbers are more accurate, but more CPU-expensive
    };
    obj.pause = function() {
        ms = obj.step();
        clearInterval(timer);
    };
    obj.step = function() {
        var now = Math.max(0,ms-(new Date().getTime()-startTime)),
            m = Math.floor(now/60000), s = Math.floor(now/1000)%60;
        s = (s < 10 ? "0" : "")+s;
        display.innerHTML = m+":"+s;
        if( now == 0) {
            clearInterval(timer);
            obj.resume = function() {};
            if( oncomplete) oncomplete();
        }
        return now;
    };
    obj.resume();
    return obj;
}

function game(noOfRow, noOfCol, vs_pc = true) {
	this.noOfRow = noOfRow, this.noOfCol = noOfCol;
	this.Turn = X;
	this.isGamming = true; //currGame.isGamming or Not.
	this.noOfPiece = 0; //number of Pieces on the table -> to check draw
	this.sq = new Array(); /* define an array storing XO position */
	for (var i = 0; i < this.noOfRow; i++) {
		this.sq[i] = new Array();
		for (var j = 0; j < this.noOfCol; j++) {
			this.sq[i][j]=0;
		}
	}
	this.sq[9][9] = X;
	this.sq[9][10] = O;
	this.sq[10][10] = X;
	this.sq[10][9] = O;

	class Task{
		constructor(row, col, turn) {
			this.row = row;
			this.col = col;
			this.turn = turn;
		}
	}
	this.mem = new Array(Task);
	
	this.X_timer = startTimer(5*60, "oppo1-time", function() {alert(`Time Out! ${currGame.Turn == X? "X" : "O"} lost`);});
	this.X_timer.pause();
	this.O_timer = startTimer(5*60, "oppo2-time", function() {alert(`Time Out! ${currGame.Turn == X? "X" : "O"} lost`);});
	this.O_timer.pause();
	this.X_timer.resume();
	if (vs_pc){
		this.xMove = function(i,j){
			currGame.sq[i][j] = X;
			currGame.mem.push(new Task(i, j, X));
			board.sqUpdate(i, j);

			currGame.X_timer.pause();
			currGame.O_timer.resume();

			currGame.noOfPiece++;
			currGame.Turn = O;
			referee.checkWin()
			if (currGame.isGamming == false){
				return;
			}
			var bestMove = {row:0, col:0};
			AIthink(O, bestMove);
			currGame.sq[bestMove.row][bestMove.col] = O;
			currGame.mem.push(new Task(bestMove.row, bestMove.col, O));
			board.sqUpdate(bestMove.row, bestMove.col);

			currGame.X_timer.resume();
			currGame.O_timer.pause();

			currGame.Turn = X;
			currGame.noOfPiece++;
			referee.checkWin()
		};
		this.undo = function() {
			if (currGame.mem.length == 0){
				return;
			}
			
			var task = currGame.mem.pop();
			currGame.sq[task.row][task.col] = 0;
			board.sqUpdate(task.row, task.col);
			task = currGame.mem.pop();

			currGame.sq[task.row][task.col] = 0;
			board.sqUpdate(task.row, task.col);
			currGame.Turn = X;
			currGame.noOfPiece-=2;

			currGame.O_timer.pause();
			currGame.X_timer.resume();
		}
	}
	else{
		this.xMove = function(i,j){
			currGame.sq[i][j] = currGame.Turn == X? X:O;
			currGame.mem.push(new Task(j, j, currGame.Turn));
			board.sqUpdate(i, j);
			if (currGame.Turn == X){
				currGame.X_timer.pause();
				currGame.O_timer.resume();
			} 
			else{
				currGame.X_timer.resume();
				currGame.O_timer.pause();
			}

			currGame.noOfPiece++;
			currGame.Turn = currGame.Turn == O ? X: O;
			referee.checkWin()
		};
		this.undo = function() {
			if (currGame.mem.length == 0){
				return;
			}
			
			var task = currGame.mem.pop();
			currGame.sq[task.row][task.col] = 0;
			board.sqUpdate(task.row, task.col);
			currGame.Turn = task.turn;
			currGame.noOfPiece--;

			if (currGame.Turn == X){
				currGame.X_timer.resume();
				currGame.O_timer.pause();
			}
			else{
				currGame.X_timer.pause();
				currGame.O_timer.resume();
			}
		}
	}

	this.StopAllTimer = function(){
		this.O_timer.pause();
		this.X_timer.pause();
	}
}

