var chess = document.getElementById("chess");
var reset = document.getElementById("reset")

var context = chess.getContext('2d');

var isBlack = true;
var over = false;
var state = []; //棋盘状态 空 = 0, white = 1, black = 2

var wins = []; //赢法数组
initWins();
var count = 0; // 赢法数目

var myWin = [];
var	computerWin = [];  //赢法统计数组




for(var i = 0; i < 15; i++) {
	for(var j = 0; j < 11; j++) {
		for(var k = 0; k < 5; k++) {
			wins[i][j + k][count] = true;
		}
		count++;
	}
}

for(var i = 0; i < 15; i++) {
	for(var j = 0; j < 11; j++) {
		for(var k = 0; k < 5; k++) {
			wins[j + k][i][count] = true;
		}
		count++;
	}
}

for(var i = 0; i < 11; i++) {
	for(var j = 14; j > 3; j--) {
		for(var k = 0; k < 5; k++) {
			wins[i + k][j - k][count] = true;
		}
		count++;
	}
}

for(var i = 0; i < 11; i++) {
	for(var j = 0; j < 11; j++) {
		for(var k = 0; k < 5; k++) {
			wins[i + k][j + k][count] = true;
		}
		count++;
	}
}


resetHandler();
//console.log(count);

reset.addEventListener("click", resetHandler);


function clickHandler(e) {
	var x = Math.floor(e.offsetX / 30);
	var y = Math.floor(e.offsetY / 30);
	if(!isBlack) {
		return;
	}
	if(!state[x][y]) {
		oneStep(x, y, isBlack);

		for(var k = 0; k < count; k++) {
			if(wins[x][y][k]) {
				myWin[k]++;
				console.log("myWin[" + k + '] = ' + myWin[k]);
				computerWin[k] = 6;
				if(myWin[k] === 5) {
					alert("you win!");
					chess.removeEventListener("click", clickHandler);
					over = true;
				}
			}
		}

		isBlack = !isBlack;
		computerAI();
		/*
		if(isWin(x, y)){
			chess.removeEventListener("click", clickHandler);
			if(state[x][y] === 1) {
				alert("white win!");
			}
			if(state[x][y] === 2) {
				alert("black win!");
			}
		}
		*/
	}
}

function resetHandler() {
	context.clearRect(0, 0, 450, 450);
	initState();
	initChess();
	initWinCount(count);
	chess.addEventListener("click", clickHandler);
}

function initWins() {
	for(var i = 0; i < 15; i++) {
		wins[i] = [];
		for(var j = 0; j < 15; j++) {
			wins[i][j] = [];
		}
	}
}

function initWinCount(n) {
	for(var i = 0; i < n; i++) {
		myWin[i] = 0;
		computerWin[i] = 0;
	}
}


function initState() {
	for(var i = 0; i < 15; i++) {
		state[i] = [];
	}
}

function initChess() {
	context.beginPath();
	for(var i = 0; i < 15; i++) {
		context.moveTo(15 + 30 * i, 15);
		context.lineTo(15 + 30 * i, 435);
		context.strokeStyle = "#696969";
		context.stroke();

		context.moveTo(15, 15 + 30 * i);
		context.lineTo(435, 15 + 30 * i);
		context.strokeStyle = "#696969";
		context.stroke();
	}
	context.closePath();
}

function oneStep(x, y, isBlack) {
	context.beginPath();
	context.arc(15 + x * 30, 15 + y * 30, 12, 0, 2 * Math.PI);
	if(isBlack) {
		context.fillStyle = "black";
		state[x][y] = 2;
	} else {
		context.fillStyle = "white";
		state[x][y] = 1;
	}
	context.fill();
	context.stroke();
	context.closePath();
}

function computerAI() {
	var myScore = [],
		computerScore = [],
		max = 0,
		u = 0,
		v = 0;
	for(var i = 0; i < 15; i++) {
		myScore[i] = [];
		computerScore[i] = [];
		for(var j = 0; j < 15; j++) {
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	for(var i = 0; i < 15; i++) {
		for(var j = 0; j < 15; j++) {
			if(!state[i][j]) {
				for(var k = 0; k < count; k++) {
					if(wins[i][j][k]) {
						if(myWin[k] == 1) {
							myScore[i][j] += 200;
						} else if(myWin[k] == 2) {
							myScore[i][j] += 400;
						} else if(myWin[k] == 3) {
							myScore[i][j] += 2000;
						} else if(myWin[k] == 4) {
							myScore[i][j] += 10000;
						} 
						if(computerWin[k] == 1) {
							computerScore[i][j] += 220;
						} else if(computerWin[k] == 2) {
							computerScore[i][j] += 420;
						} else if(computerWin[k] == 3) {
							computerScore[i][j] += 2100;
						} else if(computerWin[k] == 4) {
							computerScore[i][j] += 20000;
						} 
					}
				}
				if(myScore[i][j] > max) {
					max = myScore[i][j];
					u = i;
					v = j;
				} else if (myScore[i][j] == max) {
					if(computerScore[i][j] > computerScore[u][v]) {
						u = i;
						v = j;
					}
				}
				if(computerScore[i][j] > max) {
					max = computerScore[i][j];
					u = i;
					v = j;
				} else if (computerScore[i][j] == max) {
					if(myScore[i][j] > myScore[u][v]) {
						u = i;
						v = j;
					}
				}
			}
		}
	}
	oneStep(u, v, false);
	for(var k = 0; k < count; k++) {
		if(wins[u][v][k]) {
			computerWin[k]++;
			console.log("myWin[" + k + '] = ' + myWin[k]);
			myWin[k] = 6;
			if(computerWin[k] === 5) {
				alert("computer win!");
				chess.removeEventListener("click", clickHandler);
				over = true;
			}
		}
	}

	isBlack = !isBlack;
}
/*
function isWin(x, y) {
	var flag = state[x][y];
	var count = 1;

	for(var i = 1; x + i < 15; i++) {
		if(state[x + i][y] === flag) {
			count++;
		} else {
			break;
		}
	}
	for(var i = 1; x - i >= 0; i++) {
		if(state[x - i][y] === flag) {
			count++;
		} else {
			break;
		}
	}
	if(count >= 5) {
		return true;
	} else {
		count = 1;
	}

	for(var i = 1; y + i < 15; i++) {
		if(state[x][y + i] === flag) {
			count++;
		} else {
			break;
		}
	}
	for(var i = 1; y - i >= 0; i++) {
		if(state[x][y - i] === flag) {
			count++;
		} else {
			break;
		}
	}
	if(count >= 5) {
		return true;
	} else {
		count = 1;
	}

	for(var i = 1; x + i < 15 && y + i < 15; i++) {
		if(state[x + i][y + i] === flag) {
			count++;
		} else {
			break;
		}
	}
	for(var i = 1;x - i >= 0 && y - i >= 0; i++) {
		if(state[x - i][y - i] === flag) {
			count++;
		} else {
			break;
		}
	}
	if(count >= 5) {
		return true;
	} else {
		count = 1;
	}

	for(var i = 1; x - i >= 0 && y + i < 15; i++) {
		if(state[x - i][y + i] === flag) {
			count++;
		} else {
			break;
		}
	}
	for(var i = 1;x + i < 15 && y - i >= 0; i++) {
		if(state[x + i][y - i] === flag) {
			count++;
		} else {
			break;
		}
	}
	if(count >= 5) {
		return true;
	} else {
		count = 1;
	}
}
*/