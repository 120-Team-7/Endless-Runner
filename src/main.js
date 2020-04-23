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
                y: 800
            }
        }
    },
    scene: [ Load, Menu, Play, GameOver ]
}

// uncomment the following line if you need to purge local storage data
//localStorage.clear();

// define game
let game = new Phaser.Game(config);

// define globals
var background;
var ground;
var player = null;

var maxVelocityX = 400;
var maxVelocityY = 1000;

var playerRunAccel = 100;
var groundDrag = 800;

var holdJumpTime = 180;
var playerJumpSpeed = -35;
var playerInitSpeed = -300;
var playerInitAccel = -50;

var playerAirAccel = 15;
var airDrag = 100;

var isJumping = false;
var isGrounded = false;

var gameWidth = game.config.width;
var gameHeight = game.config.height;
var centerX = game.config.width/2;
var centerY = game.config.height/2;
const textSpacer = 64;

var cursors;