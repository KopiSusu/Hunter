// revolutions per second
var angularSpeed = 0.01; 
var lastTime = 0;

// Use renderer.domElement to get the DOM element corresponding to the canvas created by the renderer.

var canvas = document.createElement("canvas");
var ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 480;
// document.body.appendChild(canvas);

// renderer
var renderer = new THREE.WebGLRenderer( canvas );
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// make a canvas
// var canvas = document.createElement("canvas");


// camera
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.z = 500;

// scene
var scene = new THREE.Scene();
scene.add(camera);

// material
var material = new THREE.MeshLambertMaterial({
  map: THREE.ImageUtils.loadTexture("images/background.png")
});
          
// cube
var cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), material);
cube.overdraw = true;
cube.rotation.x = Math.PI * 0.1;
scene.add(cube);

// add subtle ambient lighting
var ambientLight = new THREE.AmbientLight(0xbbbbbb);
scene.add(ambientLight);

// directional lighting
var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// need to work out way to pass my game unto this three.js cube.... hmmm
// heres my game logic...... hmmmm
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
heroImage.src = "images/hero.png";

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
  speed: 100, // gota make these monsters move somehow... hmmmmm
  x: 0,
  y: 0,
  direction: "right"
};
var monstersCaught = 0;

// lets add some handling for the user, cause shit wil be boring otherwise
// the dude said you want game movement to live in one place, thus this hash for later use
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
  // sets the monsters direction after reset
  randValue = Math.random()
  if (randValue < 0.25){
    monster.direction = "right";
  } else if (randValue >= 0.25 && randValue < 0.5) {
    monster.direction = "left";
  } else if (randValue >= 0.50 && randValue < 0.75) {
    monster.direction = "down";
  } else if (randValue >= 0.75) {
    monster.direction = "up";
  }
};

// reset player position
var resetPlayer = function () {
  hero.x = canvas.width / 2;
  hero.y = canvas.height / 2;
}; 

// now we have to update the games objects!! this is going to be big!!
var update = function (modifier) {
  if (38 in keysDown) {
    hero.y -= hero.speed * modifier; // what this is doing is essentially moving your dude 256 pixels in the y direction
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

  // monster movement... make random maybe? how the fuck to make this smooth

  if (monster.direction == "right") {
    monster.x += monster.speed * modifier;
  }
  if (monster.direction == "left") {
    monster.x -= monster.speed * modifier;
  }
  if (monster.direction == "down") {
     monster.y += monster.speed * modifier;
  }
  if ( monster.direction == "up") {
    monster.y -= monster.speed * modifier; 
  // still got a huge problem with this, monster movement erratic
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

  // do the same with the monster 
  if (
    monster.x >= (canvas.width) 
    || monster.x <= -30
    || monster.y >= (canvas.height) 
    || monster.y <= -30 
  ) {
    --monstersCaught
    reset();
  }

}; 
// the movment modifier works like this 1 seond = 256 * 1, 0.5 seconds = 256 * 0.5 ect
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

  // three.js stuff
    var time = (new Date()).getTime();
  var timeDiff = time - lastTime;
  var angleChange = angularSpeed * timeDiff * 2 * Math.PI / 1000;
  cube.rotation.y += angleChange;
  lastTime = time;

  // render
  renderer.render(scene, camera);



  update(delta / 1000);
  render();

  then = now;
  // now important we have to do this AGAIN ASAP!!!! apperantly animation frame is the way to go
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();










