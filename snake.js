class Food {
  constructor() {
    this.generateNewPosition();
    this.eaten = false;
  }

  generateNewPosition() {
    this.position = {};
    do {
      this.position.x = Math.floor(Math.random() * field.width);
      this.position.y = Math.floor(Math.random() * field.height);
    } while (this.checkFoodPos());
  }

  checkFoodPos() {
    Snake.coords.forEach(({ x, y }) => {
      if (this.position.x === x && this.position.y === y) {
        return true;
      }
    });
    return false;
  }
}

class Field {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.generate();
  }

  generate() {
    this.board = [];
    for (let i = 0; i < this.height; i++) {
      this.board[i] = [];
      for (let j = 0; j < this.width; j++) {
        this.board[i].push('.');
      }
    }
  }

  update() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        this.board[i][j] = '.';
      }
    }
    Snake.coords.forEach(({ x, y }) => {
      this.board[y][x] = "#";
    });
    this.board[food.position.y][food.position.x] = "X";
  }

  draw() {
    console.clear();
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        process.stdout.write(this.board[i][j].toString());
      }
      process.stdout.write("\n");
    }
  }
}

const Snake = {
  coords: [
    {
      x: 20,
      y: 10
    }
  ],
  velocity: "right",
  step(dx, dy) {
    const lastCoordinate = this.coords[this.coords.length - 1];
    this.coords.push({
      x: lastCoordinate.x + dx,
      y: lastCoordinate.y + dy
    });
    if (this.check()) {
      return true;
    }
    if (!food.eaten) {
      this.coords.splice(0, 1);
    } else {
      food.eaten = !food.eaten;
    }
  },
  move() {
    let dx = 0;
    let dy = 0;
    if (this.velocity === "up") {
      dy = -1;
    }
    if (this.velocity === "down") {
      dy = 1;
    }
    if (this.velocity === "left") {
      dx = -1;
    }
    if (this.velocity === "right") {
      dx = 1;
    }
    return this.step(dx, dy);
  },
  check: function() {
    let c = this.coords[this.coords.length - 1];
    if (c.x >= field.width || c.x < 0 || c.y >= field.height || c.y < 0) {
      return true;
    }
    for (let i = 0; i < this.coords.length - 1; i++) {
      if (c.x === this.coords[i].x && c.y === this.coords[i].y) {
        return true;
      }
    }
    if (c.x !== food.position.x || c.y !== food.position.y) {
      return false;
    } else {
      food.generateNewPosition();
      food.eaten = true;
      return false;
    }
  }
};

const field = new Field(40, 15);
const food = new Food();

const nextTick = () => {
  if (Snake.move()) {
    clearInterval(game);
    console.clear();
    console.log("You loose! Restart the game!");
    process.exit();
  }
};

field.update();
field.draw();

let game = setInterval(() => {
  nextTick();
  field.update();
  field.draw();
}, 500);

const readline = require("readline");
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on("keypress", (str, key) => {
  if (key.ctrl && key.name === "c") {
    process.exit();
  } else if (key.name === "up") {
    Snake.velocity = "up";
  } else if (key.name === "down") {
    Snake.velocity = "down";
  } else if (key.name === "left") {
    Snake.velocity = "left";
  } else if (key.name === "right") {
    Snake.velocity = "right";
  }
});
