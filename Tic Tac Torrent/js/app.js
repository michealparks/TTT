(function(){
	"use-strict";

	var TicTacTorrent = angular.module('ticTacTorrent', []);

	TicTacTorrent.controller('gameCtrl', function($scope, $timeout){
		// Holds game instance specific data.
		var dataConstructor = function(){
			return {
				showMenu   : true,
				showBoard  : false,
				gameActive : false,
				gameWin    : false,
				gameDraw   : false,
				playComp   : true,
				curPlayer  : 0,
				winPlayer  : -1,
				numWin     : 3,
				players    : [

				],
				artificialIntelligence : new ArtificialIntelligence(1),
				grid : [
					[-1, -1, -1],
					[-1, -1, -1],
					[-1, -1, -1],
				],
				size : 3
			};
		};
		$scope.data = dataConstructor();

		// Resizes the game grid.
		$scope.resizeGrid = function(dir){
			if (dir == 1 && $scope.data.size < 6) $scope.data.size++;
			if (dir == 0 && $scope.data.size > 3) $scope.data.size--;
			$scope.data.grid = [];
			for (var i = 0, len = $scope.data.size; i < len; i++){
				$scope.data.grid.push([]);
				for (var j = 0, len2 = len; j < len; j++){
					$scope.data.grid[i].push(-1);
				}
			}
		};

		$scope.changeViews = function(menu){
			if (menu){
				$scope.data.gameWin    = false;
				$scope.data.gameDraw   = false;
				$scope.data.showBoard  = false;
				$scope.data.showMenu   = true;
				$scope.data.gameActive = false;
				$timeout(function(){$scope.data = dataConstructor();}, 500);
			} else {
				$scope.data.showMenu   = false;
				$scope.data.showBoard  = true;
				$scope.data.gameActive = true;
			}
		};

		$scope.plTurn = function(test){
			if (!$scope.data.gameActive) return false;
			if (test === $scope.data.curPlayer) return true; else return false;
		};

		$scope.aimove = function(){
			var move = $scope.data.artificialIntelligence.calculateMove($scope.data.grid);
		    $scope.playerMove(move[1], move[0]);
		};

		$scope.playerMove = function(x, y){
			if ($scope.data.grid[x][y] === -1 && $scope.data.gameActive){
			    $scope.data.grid[x][y] = $scope.data.curPlayer;

				checkStatus(
					Logic.gridState(
						x, y,
						$scope.data.numWin,
						$scope.data.grid,
						$scope.data.size
					)
				);

				if ($scope.data.curPlayer === 1) {
					$scope.data.curPlayer = 0;
				} else {
					$scope.data.curPlayer = 1;
					if ($scope.data.playComp) $timeout(function(){$scope.aimove();}, 800);
				}
			}

		};

		// Updates the view to show X's and O's if grid elements have been selected.
		$scope.selected = function(type, x, y){
			if ($scope.data.grid[x][y] === 0 && type === 0) return true;
			if ($scope.data.grid[x][y] === 1 && type === 1) return true;
			return false;
		};

		// Checks to see if the win state has been satisfied.
		var checkStatus = function(winState){
			if (winState === -1) return;
			else {
				if (winState === -2) $scope.data.gameDraw = true;
				else {
					$scope.data.gameWin   = true;
					$scope.data.winPlayer = winState;
				}
				$scope.data.gameActive = false;
			}
		};
	});

})();

var Logic = {
	gridState : function(x, y, numWin, grid, size){
		var
		_first   = grid[x][y],
		_zeros   = 0,
		_matched = 0;

		// Vertical test moving up/down.
		for (var i = y-1; i >= 0; i--)   if (_first === grid[x][i]) _matched++; else break;
		for (var i = y+1; i < size; i++) if (_first === grid[x][i]) _matched++; else break;
		if (_matched >= numWin-1) return _first;
		_matched = 0;

		// Horizontal test moving left/right.
		for (var i = x-1; i >= 0; i--)   if (_first === grid[i][y]) _matched++; else break;
		for (var i = x+1; i < size; i++) if (_first === grid[i][y]) _matched++; else break;
		if (_matched >= numWin-1) return _first;
		_matched = 0;

		// Diagonal test moving down-left/up-right.
		for (var i = x-1, j = y-1; i >= 0 && j >= 0; i--, j--)     if (_first === grid[i][j]) _matched++; else break;
		for (var i = x+1, j = y+1; i < size && j < size; i++, j++) if (_first === grid[i][j]) _matched++; else break;
		if (_matched >= numWin-1) return _first;
		_matched = 0;

		// Diagonal test moving down-right/up-left.
		for (var i = x+1, j = y-1; i < size && j >= 0; i++, j--) if (_first === grid[i][j]) _matched++; else break;
		for (var i = x-1, j = y+1; i >= 0 && j < size; i--, j++) if (_first === grid[i][j]) _matched++; else break;
		if (_matched >= numWin-1) return _first;

		// Check if the grid still has available moves.
		for (var i = 0; i < size; i++){
			for (var j = 0; j < size; j++) if (grid[i][j] === -1) _zeros++;
		}

		// No one has won.
		if (_zeros === 0) return -2; else return -1;
	}
};