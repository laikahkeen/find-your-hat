const prompt = require('prompt-sync')({ sigint: true });
const clear = require('clear-screen');

const hat = '^';
const hole = 'O';
const heart = '♥';
const money = '$';
const fieldCharacter = '░';
const pathCharacter = '*';
class Field {
	constructor(fieldArray = [[]]) {
		this.fieldArray = fieldArray;
		this.numRows = fieldArray.length;
		this.numCols = fieldArray[0].length;
		this.position = {
			x: 0,
			y: 0,
		};
		this.playing = true;
	}

	print() {
		clear();
		console.log('You are lost in the maze. Find the treasure before the maze colapses. Go go go!');
		console.log('\n');
		this.fieldArray.forEach((row) => {
			console.log(row.join(''));
		});
		console.log('\n');
	}

	processInput() {
		let input = prompt('Where to go? ');
		switch (input) {
			case 'w':
				this.position.y -= 1;
				break;
			case 'a':
				this.position.x -= 1;
				break;
			case 's':
				this.position.y += 1;
				break;
			case 'd':
				this.position.x += 1;
				break;
			default:
				console.log('Enter WASD to move. ');
				this.processInput();
				break;
		}
	}

	inMap() {
		return this.position.x >= 0 && this.position.x < this.numCols && this.position.y >= 0 && this.position.y < this.numRows;
	}

	isHole() {
		return this.fieldArray[this.position.y][this.position.x] === hole;
	}

	isHat() {
		return this.fieldArray[this.position.y][this.position.x] === hat;
	}

	isPath() {
		return this.fieldArray[this.position.y][this.position.x] === pathCharacter;
	}

	startGame() {
		while (this.playing) {
			this.print();
			this.processInput();

			if (!this.inMap()) {
				console.log('Welcome to nowhere, bye!');
				this.playing = !this.playing;
				break;
			} else if (this.isHole()) {
				console.log('Oops! You fell into a hole, so silly haha!');
				this.playing = !this.playing;
				break;
			} else if (this.isHat()) {
				this.fieldArray[this.position.y][this.position.x] = heart;
				this.print();
				this.fieldArray.forEach((row, indexRow) =>
					row.forEach((column, indexColumn) => {
						if (indexRow === this.position.y && indexColumn === this.position.x) {
							return;
						}
						setTimeout(() => {
							row[indexColumn] = money;
							this.print();
							console.log('Yay! You found the legandary hat and won!');
						}, indexRow * 250 + indexColumn * 250);
					})
				);
				this.playing = !this.playing;
				break;
			}

			this.fieldArray[this.position.y][this.position.x] = pathCharacter;
		}
	}
}

const myField = new Field([
	['*', '░', 'O', '░', 'O', 'O', 'O'],
	['░', '░', 'O', '░', '░', '░', 'O'],
	['O', '░', '░', '░', 'O', '░', 'O'],
	['░', '░', '░', '░', 'O', '░', '░'],
	['O', '^', 'O', '░', 'O', 'O', '░'],
	['░', '░', '░', 'O', 'O', '░', '░'],
	['░', 'O', '░', '░', '░', '░', 'O'],
	['░', '░', '░', 'O', 'O', '░', 'O'],
]);

myField.startGame();
