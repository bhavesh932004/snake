(function (){
	const CELL_WIDTH = 20;
	const CELL_HEIGHT = 20;
	const BOARD_WIDTH = 20;
	const BOARD_HEIGHT = 20;
	const BOARD_COLOR = "black";
	const SNAKE_COLOR = "red";
	const FOOD = [0, 0];
	const FOOD_COLOR = "blue";
	let DIR = "R";
	let SNAKE_TAIL = [-1, -1];
	let gameInterval = null;

	const snake = [];

	function createBoard(width, height){
		const board = document.getElementById("sg-board");

		for(let r = 0; r < height; r++){
			const row = createDiv("sg-board-row");
			for(let c = 0; c < width; c++){
				const cell = createCell(r, c);
				row.appendChild(cell);
			}

			board.appendChild(row);
		}
	}

	function createDiv(className){
		const div = document.createElement("div");
		div.setAttribute("class", className);

		return div;
	}

	function createCell(row, col){
		const div = createDiv("sg-board-cell");
		div.setAttribute("id", `sg-board-cell-${row}-${col}`);
		div.style["width"] = `${CELL_WIDTH}px`;
		div.style["height"] = `${CELL_HEIGHT}px`;

		return div;
	}

	function changeCellColor(row, col, color){
		const id = `sg-board-cell-${row}-${col}`;
		const cell = document.getElementById(id);
		cell.style.backgroundColor = color;
	}

	function updateSnakeTail(x, y){
		SNAKE_TAIL = [x, y];
	}

	function updateSnake(x, y){
		const snake_len = snake.length;
		updateSnakeTail(snake[snake_len - 1][0], snake[snake_len - 1][1]);

		for(let i = snake_len - 1; i > 0; i--){
			snake[i] = snake[i - 1];
		}
		
		if(snake[0][1] == FOOD[0] && snake[0][0] == FOOD[1]){
			generateFood();
			snake.push(SNAKE_TAIL);
		}

		snake[0] = [x, y];
		
		let collision = false;
		for(let i = 1; i < snake_len; i++){
			if(snake[i][0] == snake[0][0] && snake[i][1] == snake[0][1]){
				collision = true;
				break;
			}
		}

		if(collision){
			clearInterval(gameInterval);
			stopGame();
			startGame();
		}
	}

	function colorSnakeTail(){
		if(SNAKE_TAIL[0] != -1 && SNAKE_TAIL[1] != -1){
			changeCellColor(SNAKE_TAIL[1], SNAKE_TAIL[0], BOARD_COLOR);
		}
	}

	function colorSnake(){
		const snake_len = snake.length;
		for(i = 0; i < snake_len; i++){
			changeCellColor(snake[i][1], snake[i][0], SNAKE_COLOR);
		}
	}

	function gameLoop(){
		gameInterval = setInterval(() => {
			colorSnakeTail();
			colorSnake();

			let x = snake[0][0], y = snake[0][1];
			switch(DIR){
				case "R":
					updateSnake((x + 1) % BOARD_WIDTH, y);
					break;
				case "D":
					updateSnake(x, (y + 1) % BOARD_HEIGHT);
					break;
				case "L":
					updateSnake((x - 1 + BOARD_WIDTH) % BOARD_WIDTH, y);
					break;
				case "U":
					updateSnake(x, (y - 1 + BOARD_HEIGHT) % BOARD_HEIGHT);
					break;
			}		

		}, 100);
	}

	function changeDirection(code){
		if(code < 37 || code > 40){
			return;
		}
		
		const odirs = ["R", "D", "L", "U"];
		const dirs = ["L", "U", "R", "D"];
		for(let c = 0; c < 4; c++){
			if(c == code - 37 && DIR != odirs[c]){
				DIR = dirs[c];
			}
		}
	}

	function handleKeyEvent(event){
		changeDirection(event.keyCode);
	}

	function removeKeyEvent(){
		document.removeEventListener("keydown", handleKeyEvent);
	}

	function setupKeyEvent(){
		document.addEventListener("keydown", handleKeyEvent);
	}

	function generateFood(){
		while(1){
			const row = Math.floor(Math.random() * BOARD_HEIGHT);
			const col = Math.floor(Math.random() * BOARD_WIDTH);
			
			const covered_with_snake = snake.find((grid) => {
				return grid[0] == row && grid[1] == col;
			});

			if(covered_with_snake){
				continue;
			}

			changeCellColor(row, col, FOOD_COLOR);
			FOOD[0] = row;
			FOOD[1] = col;
			break;
		}
	}

	function clearSnake(){
		let snake_len = snake.length;
		while(snake_len--){
			snake.pop();
		}
	}

	function clearBoard(){
		const board = document.getElementById("sg-board");
		board.innerHTML = "";
	}

	function stopGame(){
		clearSnake();
		clearBoard();
		removeKeyEvent();
	}

	function createSnake(){
		snake.push([2, 0]);
		snake.push([1, 0]);
		snake.push([0,0]);
	}

	function startGame(){
		createBoard(BOARD_WIDTH, BOARD_HEIGHT);
		
		createSnake();
		generateFood();
		gameLoop();

		setupKeyEvent();
	}

	startGame();
}());
