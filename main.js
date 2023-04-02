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
		this.width = 0;
		this.height = 0;
		this.holePercentage = 0;
		this.hardMode = false;
		this.fieldArray = fieldArray;
		this.pathCharacterPosition = {
			x: 0,
			y: 0,
		};
		this.hatLocation = {
			x: 0,
			y: 0,
		};
		this.playing = true;
	}
	getWidth() {
		this.width = prompt('How wide the maze should be? ');
		if (this.width >= 5 && this.width <= 50) {
			return;
		} else {
			console.log('Enter between 5 - 50');
			this.getWidth();
		}
	}
	getHeight() {
		this.height = prompt('How high the maze should be? ');
		if (this.height >= 5 && this.height <= 50) {
			return;
		} else {
			console.log('Enter between 5 - 20');
			this.getHeight();
		}
	}
	getHolePercentage() {
		this.holePercentage = prompt('Level of difficulty ') / 20;
		if (this.holePercentage >= 0.05 && this.holePercentage <= 0.25) {
			return;
		} else {
			console.log('Enter between 1 - 5');
			this.getHolePercentage();
		}
	}
	toggleHardMode() {
		let input = prompt('Do you like scary challenge (y/n)? ');
		switch (input) {
			case 'y':
				this.hardMode = true;
				console.log('Cool! ');
				break;
			case 'n':
				this.hardMode = false;
				console.log('Wussy! ');
				break;
			default:
				console.log('Please key in "y" or "n" only. ');
				this.toggleHardMode();
				break;
		}
	}
	generateField() {
		console.log('Welcome to the maze game! ');
		this.getWidth();
		this.getHeight();
		this.getHolePercentage();
		this.toggleHardMode();
		for (let i = 0; i < this.height; i++) {
			i !== 0 ? this.fieldArray.push([]) : null;
			for (let j = 0; j < this.width; j++) {
				this.fieldArray[i].push(fieldCharacter);
			}
		}

		this.pathCharacterPosition = {
			x: Math.floor(Math.random() * this.width),
			y: Math.floor(Math.random() * this.height),
		};

		do {
			this.hatLocation = {
				x: Math.floor(Math.random() * this.width),
				y: Math.floor(Math.random() * this.height),
			};
		} while (this.pathCharacterPosition.x === this.hatLocation.x && this.pathCharacterPosition.y === this.hatLocation.y);

		this.fieldArray[this.pathCharacterPosition.y][this.pathCharacterPosition.x] = pathCharacter;
		this.fieldArray[this.hatLocation.y][this.hatLocation.x] = hat;

		do {
			let newHole = {
				x: Math.floor(Math.random() * this.width),
				y: Math.floor(Math.random() * this.height),
			};
			if (newHole.x === this.pathCharacterPosition.x && newHole.y === this.pathCharacterPosition.y) {
				continue;
			} else if (newHole.x === this.hatLocation.x && newHole.y === this.hatLocation.y) {
				continue;
			} else {
				this.fieldArray[newHole.y][newHole.x] = hole;
			}
		} while (this.fieldArray.reduce((count, arr) => count + arr.filter((item) => item === hole).length, 0) / (this.width * this.height) <= this.holePercentage);
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
				this.pathCharacterPosition.y -= 1;
				break;
			case 'a':
				this.pathCharacterPosition.x -= 1;
				break;
			case 's':
				this.pathCharacterPosition.y += 1;
				break;
			case 'd':
				this.pathCharacterPosition.x += 1;
				break;
			default:
				console.log('Enter WASD to move. ');
				this.processInput();
				break;
		}
	}
	inMap() {
		return this.pathCharacterPosition.x >= 0 && this.pathCharacterPosition.x < this.fieldArray[0].length && this.pathCharacterPosition.y >= 0 && this.pathCharacterPosition.y < this.fieldArray.length;
	}
	isHole() {
		return this.fieldArray[this.pathCharacterPosition.y][this.pathCharacterPosition.x] === hole;
	}
	isHat() {
		return this.fieldArray[this.pathCharacterPosition.y][this.pathCharacterPosition.x] === hat;
	}
	isPath() {
		return this.fieldArray[this.pathCharacterPosition.y][this.pathCharacterPosition.x] === pathCharacter;
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
				this.fieldArray[this.pathCharacterPosition.y][this.pathCharacterPosition.x] = heart;
				this.print();
				this.fieldArray.forEach((row, indexRow) =>
					row.forEach((column, indexColumn) => {
						if (indexRow === this.pathCharacterPosition.y && indexColumn === this.pathCharacterPosition.x) {
							return;
						}
						setTimeout(() => {
							if (row[indexColumn] === hat) {
								return;
							} else if (row[indexColumn] === pathCharacter) {
								row[indexColumn] = heart;
							} else {
								row[indexColumn] = money;
							}
							this.print();
							console.log('Yay! You found the legandary pathCharacterPosition and won!');
						}, indexRow * Math.random() * 200 + indexColumn * Math.random() * 200);
					})
				);
				this.playing = !this.playing;
				break;
			}
			this.fieldArray[this.pathCharacterPosition.y][this.pathCharacterPosition.x] = pathCharacter;
			if (this.hardMode) {
				do {
					var newHole = {
						x: Math.floor(Math.random() * this.width),
						y: Math.floor(Math.random() * this.height),
					};
				} while (this.fieldArray[newHole.y][newHole.x] !== fieldCharacter);
				this.fieldArray[newHole.y][newHole.x] = hole;
			}
		}
	}
}

const myField = new Field();
myField.generateField();
myField.startGame();
