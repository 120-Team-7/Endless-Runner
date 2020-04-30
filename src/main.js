var gravityY = 600;

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
            // debug: true,
            gravity: {
                y: gravityY
            }
        }
    },
    scene: [ Load, Menu, Play, GameOver ]
}

// uncomment the following line if you need to purge local storage data
// localStorage.clear();

// Define game
let game = new Phaser.Game(config);

// Audio Settings
var globalVolume = 1;
var normalSoundRate = 1;
var slowedSoundRate = normalSoundRate - 0.5*normalSoundRate;
var soundRateDifficultBump = 0.5;
var soundRateChange = 0.0026;
var volumeChange = 0.1;

// Audio
var bgm;
var grabSound;
var throwSound;
var gruntSound;

// Game measurements & text placement
var gameWidth = game.config.width;
var gameHeight = game.config.height;
var centerX = game.config.width/2;
var centerY = game.config.height/2;
var textSpacer = 80;
var playHUDHeight = 100;
var playHUDY = gameHeight - playHUDHeight/2;
var difficultY = 35;

// Text settings
var timeSlowReady = '#008000'; // Green
var timeSlowDuring = '#DA70D6'; // Orchid
var timeSlowNotReady = '#B22222'; // Crimson
var psychicThrowInit = '#DA70D6'; // Orchid
var psychicThrowDuring = '#FF00FF'; // Magenta

// Game globals
var isGameOver = false;
var resetAudio = true;
var isPaused = false;
var sceneClock;
var highScore = 0;
var currTime = 0;               // Track this round's time
var backgroundScroll = 2;
var groundScroll = 5;
var cloudScroll = 1;
var nextDifficultyLevel = 30000; // Time until next increase in difficulty
var difficultyLevelMax = 1;     // Number of spawners spawned on max difficulty + 2
var thisDifficultyLevel = 1;
var spawnTime = 3000;
var spawnTimeMax = 3000;
var spawnTimeMin = 2000;
var count = 1;

// Obstacle settings
var logAngularVelocity = 540;
var logDespawnTime = 10000;
var logPreventInfiniteTime = 20000;

// Game objects
var background;
var ground;
var cloud;
var platform;
var player = null;
var pointer;
var pointerCircle;
var particleLine;
var particlePointer;
var particleVector;
var logParticles;
var playHUDBox;
var timeSlowFilter;

// Player statuses
var isJumping = false;
var isGrounded = false;
var timeSlowLock = false;
var cooldownCalled = false;
var isDuringSlow = false;
var timeSlowCooldown = 3000;
var isHit = false;

// Player run movemment
var maxVelocityX = 400;
var maxVelocityY = 1000;
var playerRunAccel = 100;
var groundDrag = 600;

// Player jump movemment
var holdJumpTime = 180;
var playerJumpSpeed = -50;
var playerInitSpeed = -500;
var playerGravity = 1000;

var playerAirAccel = 40;
var airDrag = 100;

// Player time slow
var normTimeScale = 0.75;
var slowedTimeScale = 1.5;
var slowmoTime = 5000;
var slowRate = 0.005; // change in physics times scale every frame
var filterMax = 0.4;
var filterChange = 0.005;

// Player pyschic throw
var preThrowDrag = 100;
var preThrowMinSpeed = 100;
var minThrowSpeed = 200;
var maxThrowSpeed = 600;
var psychicThrowTime = 500;

// Game controls
var keyLeft, keyRight, keyJump, keySlowmo, keyStart, keyMute, keyVolumeUp, keyVolumeDown;
var cursors;