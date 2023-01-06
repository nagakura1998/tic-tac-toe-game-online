var ctrl = {
	newGame : function() {
		currGame.StopAllTimer();
		currGame = new game(20, 20, mode_vs_pc);
		board.writeBoard();
	},
	undo : function() {
		currGame.undo();
		//alert('There is no undo in this version!');
	},
	resign : function() {
		alert('You have resigned!');
		currGame.isGamming = false;
	},
	standUp : function() {
		if (currGame.Turn == X) {
			var bestMove = {row: 0, col:0};
			AIthink(X, bestMove);
			currGame.sq[bestMove.row][bestMove.col] = X;
			board.sqUpdate(bestMove.row, bestMove.col);
			referee.checkWin();
			currGame.Turn = O;
			currGame.noOfPiece++;
		} else {
			var bestMove = {row:0, col:0};
			AIthink(O, bestMove);
			currGame.sq[bestMove.row][bestMove.col] = O;
			board.sqUpdate(bestMove.row, bestMove.col);
			referee.checkWin();
			currGame.Turn = X;
			currGame.noOfPiece++;
		}
	}
};