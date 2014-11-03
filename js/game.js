var canvas = document.createElement("canvas");
var ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// background
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
  bgReady = true
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
  heroReady = true;
};
heroImage.src = "images/Hero.png";

// some bad motherfuckers image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
  monsterReady = true;
};
monsterImage.src = "images/monster.png";

// load the game objects
var hero = {
  speed: 256, // this is in pixels per second
  x: canvas.width / 2,
  y: canvas.height / 2
};
// monster wont move but lets try and change this later
var monster = {
  x: 0,
  y: 0
};
var monstersCaught = 0;

// lets add some handling for the user, cause shit wil be boring otherwise
// the dude said you want game logic to live in one place, thus this hash for later use
var keysDown = {};

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
}, false);

// reset game when you catch that coconut
var reset = function () {
  monster.x = 32 + (Math.random() * (canvas.width - 64));
  monster.y = 32 + (Math.random() * (canvas.height - 64))
};

// reset player position
var resetPlayer = function () {
  hero.x = canvas.width / 2;
  hero.y = canvas.height / 2;
};


// now we have to update the games objects
var update = function (modifier) {
  if (38 in keysDown) {
    hero.y -= hero.speed * modifier // what this is doing is essentially moving your dude 256 pixels in the y direction
  }
  if (40 in keysDown) { // Player holding down
    hero.y += hero.speed * modifier;
  }
  if (37 in keysDown) { // Player holding left
    hero.x -= hero.speed * modifier;
  }
  if (39 in keysDown) { // Player holding right
    hero.x += hero.speed * modifier;
  }

    // here we are setting collision, so if we touch the monster they will get caught
  if (
    hero.x <= (monster.x + 32)
    && monster.x <= (hero.x + 32)
    && hero.y <= (monster.y + 32)
    && monster.y <= (hero.y + 32)
  ) {
    ++monstersCaught;
    reset();
  }

  // reset player position if he leaves the screen, for some reason this was a bitch
  if (
    hero.x >= (canvas.width) 
    || hero.x <= -30
    || hero.y >= (canvas.height) 
    || hero.y <= -30 
  ) {
    resetPlayer();
  }
}; // the movment modifier works like this 1 seond = 256 * 1, 0.5 seconds = 256 * 0.5 ect
// this ensures that the hero runs at the same speed all the time

// lets get drawing! or whatever it is in javascript
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }

  if (heroReady) {
    ctx.drawImage(heroImage, hero.x, hero.y);
  }

  if (monsterReady) {
    ctx.drawImage(monsterImage, monster.x, monster.y);
  }

 // probably should add some kind of score
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Monsters caught: " + monstersCaught, 32, 32);
};

// finally, and last, we set up game loop
var main = function () {
  var now = Date.now();
  var delta = now - then;

  update(delta / 1000);
  render();

  then = now;
  // now important we have to do this AGAIN ASAP!!!!
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();









