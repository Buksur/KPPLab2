const M = 40;
const N = 15;
const Field = [];

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
    if (c.x >= M || c.x < 0 || c.y >= N || c.y < 0) {
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

class Food {
  constructor() {
    this.generateNewPosition();
    this.eaten = false;
  }

  generateNewPosition() {
    this.position = {};
    do {
      this.position.x = Math.floor(Math.random() * M);
      this.position.y = Math.floor(Math.random() * N);
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

const food = new Food();

const generateField = (w, h) => {
  for (let i = 0; i < h; i++) {
    Field[i] = [];
    for (let j = 0; j < w; j++) {
      Field[i].push('.');
    }
  }
};

const drawField = field => {
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      Field[i][j] = '.';
    }
  }
  Snake.coords.forEach(value => {
    Field[value.y][value.x] = "#";
  });
  Field[food.position.y][food.position.x] = "X";
  console.clear();
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      process.stdout.write(field[i][j].toString());
    }
    process.stdout.write("\n");
  }
};

const updateField = () => {
  if (Snake.move()) {
    clearInterval(game);
    console.clear();
    console.log("You loose! Restart the game!");
    process.exit();
  }
};
generateField(M, N);
drawField(Field);

let game = setInterval(() => {
  updateField();
  drawField(Field);
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
