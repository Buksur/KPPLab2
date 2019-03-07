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
  move: function() {
    let c = this.coords;
    if (this.velocity === "up") {
      c.push({ x: c[c.length - 1].x, y: c[c.length - 1].y - 1 });
      if (this.check()) {
        return true;
      }
      if (!Food.eaten) {
        c.splice(0, 1);
      } else {
        Food.eaten = !Food.eaten;
      }
    }
    if (this.velocity === "down") {
      c.push({ x: c[c.length - 1].x, y: c[c.length - 1].y + 1 });
      if (this.check()) {
        return true;
      }
      if (!Food.eaten) {
        c.splice(0, 1);
      } else {
        Food.eaten = !Food.eaten;
      }
    }
    if (this.velocity === "left") {
      c.push({ x: c[c.length - 1].x - 1, y: c[c.length - 1].y });
      if (this.check()) {
        return true;
      }
      if (!Food.eaten) {
        c.splice(0, 1);
      } else {
        Food.eaten = !Food.eaten;
      }
    }
    if (this.velocity === "right") {
      c.push({ x: c[c.length - 1].x + 1, y: c[c.length - 1].y });
      if (this.check()) {
        return true;
      }
      if (!Food.eaten) {
        c.splice(0, 1);
      } else {
        Food.eaten = !Food.eaten;
      }
    }
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
    if (c.x !== Food.x || c.y !== Food.y) {
      return false;
    } else {
      Food.createNewPosition();
      Food.eaten = true;
      return false;
    }
  }
};

const Food = {
  x: 14,
  y: 6,
  eaten: false,
  createNewPosition: function() {
    do {
      this.x = Math.floor(Math.random() * M);
      this.y = Math.floor(Math.random() * N);
      console.log(Food);
    } while (checkFoodPos());
  }
};

function checkFoodPos() {
  Snake.coords.forEach(value => {
    if (value.x === Food.x && value.y === Food.y) {
      return true;
    }
  });
  return false;
}

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
  Field[Food.y][Food.x] = "X";
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
