var gravityY = 800;

// define and configure main Phaser game object
let config = {
    parent: 'myGame',
    type: Phaser.AUTO,
    width: 1024,
    height: 576,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                y: gravityY
            }
        }
    },
    scene: [ Load, Menu, Play, GameOver ]
}

// uncomment the following line if you need to purge local storage data
//localStorage.clear();

// define game
let game = new Phaser.Game(config);

// Game measurements & text placement
var gameWidth = game.config.width;
var gameHeight = game.config.height;
var centerX = game.config.width/2;
var centerY = game.config.height/2;
var textSpacer = 64;
var playHUDHeight = 100;
var playHUDY = gameHeight - playHUDHeight/2;


// Game globals
var isGameOver = false;
var sceneClock;
var highScore = 0;
var currTime;               // Track this round's time
var backgroundScroll = 2;
var groundScroll = 5;
var playHUDBox;

// Obstacle settings
var logDespawnTime = 10000;

// Game objects
var background;
var ground;
var platforms;
var player = null;

// player statuses
var isJumping = false;
var isGrounded = false;
var hasJumped = false;
var isHit = false;

// Player run movemment
var maxVelocityX = 400;
var maxVelocityY = 1000;
var playerRunAccel = 100;
var groundDrag = 500;

// Player jump movemment
var holdJumpTime = 180;
var playerJumpSpeed = -35;
var playerInitSpeed = -300;

var playerAirAccel = 15;
var airDrag = 100;

// Player slowmo
var normTimeScale = 0.75;
var slowedTimeScale = 1.25;
var slowmoTime = 5000;

// Player pyschic throw
var minDragSpeed = 300;
var maxDragSpeed = 500;

// Game controls
var keyLeft, keyRight, keyJump, keySlowmo, keyStart;

var graphics