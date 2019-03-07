class Food {
  constructor(position) {
    this.position = position;
  }

  overlapsWith({ x, y }) {
    if (this.position.x === x && this.position.y === y) {
      return true;
    }
    return false;
  }

  setPosition(position) {
    this.position = position;
  }
}

class Field {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.initialize();
  }

  initialize() {
    this.board = [];
    for (let i = 0; i < this.height; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.width; j++) {
        this.board[i].push('.');
      }
    }
  }

  inBounds({ x, y }) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return false;
    }
    return true;
  }

  update(snake, food) {
    this.initialize();
    snake.body.forEach(({ x, y }) => {
      this.board[y][x] = '#';
    });
    this.board[food.position.y][food.position.x] = 'X';
  }

  draw() {
    console.clear();
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        process.stdout.write(this.board[i][j].toString());
      }
      process.stdout.write('\n');
    }
  }
}

class Snake {
  constructor(position, direction = 'right') {
    this.body = [position];
    this.direction = direction;
  }

  setDirection(direction) {
    this.direction = direction;
  }

  overlapsWith(position) {
    return !!this.body.find(({ x, y }) => position.x === x && position.y === y);
  }

  nextStep() {
    const head = this.body[this.body.length - 1];

    let dx = 0;
    let dy = 0;
    if (this.direction === 'up') {
      dy = -1;
    }
    if (this.direction === 'down') {
      dy = 1;
    }
    if (this.direction === 'left') {
      dx = -1;
    }
    if (this.direction === 'right') {
      dx = 1;
    }

    return { x: head.x + dx, y: head.y + dy };
  }

  grow(position) {
    this.body.push(position);
  }

  shrink() {
    this.body.splice(0, 1);
  }

  move(position) {
    this.grow(position);
    this.shrink();
  }
}

class Game {
  constructor(width = 40, height = 15) {
    this.field = new Field(width, height);
    this.snake = new Snake(this.randomFreePosition());
    this.food = new Food(this.randomFreePosition());
    this.draw();
  }

  run(tick = 500) {
    this.interval = setInterval(() => {
      this.step();
      this.draw();
    }, tick);
  }

  onKey(keyName) {
    if (['up', 'down', 'left', 'right'].includes(keyName)) {
      this.snake.setDirection(keyName);
    }
  }

  draw() {
    this.field.update(this.snake, this.food);
    this.field.draw();
  }

  step() {
    const nextStep = this.snake.nextStep();

    if (!this.field.inBounds(nextStep)) {
      this.loose();
    } else if (this.snake.overlapsWith(nextStep)) {
      this.loose();
    } else if (this.food.overlapsWith(nextStep)) {
      this.snake.grow(nextStep);
      this.food.setPosition(this.randomFreePosition());
    } else {
      this.snake.move(nextStep);
    }
  }

  loose() {
    clearInterval(this.interval);
    console.clear();
    console.log('You loose! Restart the game!');
    process.exit();
  }

  randomFreePosition() {
    let x;
    let y;

    do {
      x = Math.floor(Math.random() * this.field.width);
      y = Math.floor(Math.random() * this.field.height);
    } while (!this.isFree({ x, y }));

    return { x, y };
  }

  isFree(position) {
    return !(this.food && this.food.overlapsWith(position)) &&
           !(this.snake && this.snake.overlapsWith(position));
  }
}

const game = new Game();
game.run(500);

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else {
    game.onKey(key.name);
  }
});
