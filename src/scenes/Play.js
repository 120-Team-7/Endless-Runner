class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }


    create() {
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keySlowmo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0,0);
        ground = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'ground').setOrigin(0,0);
        
        let playConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        
        player = this.physics.add.sprite(0, 100, 'player').setOrigin(0.5);
        player.setCollideWorldBounds(true);
        player.setMaxVelocity(maxVelocityX, maxVelocityY);
        
        // platforms
        platforms = this.physics.add.staticGroup();
        platforms.create(gameWidth/2, 415, 'invisibleGround').setOrigin(0.5);
        this.physics.add.collider(player, platforms);

        // ObstacleSpawner(scene, platforms, delayMin, delayMax, minX, maxX, minY, maxY) 
        this.spawner1 = new ObstacleSpawner(this, 3000, 4000, -300, -200, -600, 600, 1);

        this.timeText = this.add.text(32, 32, 'Time: 0');
        currTime = 0;
        sceneClock = this.time.addEvent({
            delay: 1000, 
            callback: () => {
                currTime ++;
                this.timeText.setText('Time: ' + currTime);
            }, 
            callbackContext: this,
            loop: true,
        });

        this.timeScaleText = this.add.text(32, 96, 'TimeScale: 0');
    }

    update() {
        this.spawner1.update();
        // this.physics.world.collide(paddle, this.barrierGroup, this.paddleCollision, null, this);
        isGrounded = player.body.touching.down;

        if(!isGameOver){
            if(isGrounded){
                // ground movement
                if(keyLeft.isDown) {
                    player.body.velocity.x -= playerRunAccel;
                    player.flipX = true;
                } else if(keyRight.isDown) {
                    player.body.velocity.x += playerRunAccel;
                    player.flipX = false;
                } else {
                    // Set drag when not inputting movement
                    player.body.setDragX(groundDrag);
                }
            } else {
                // air movement
                // set drag always when in air, decreased control while in air
                player.body.setDragX(airDrag);
                if(keyLeft.isDown) {
                    player.body.velocity.x -= playerAirAccel;
                    player.flipX = true;
                } else if(keyRight.isDown) {
                    player.body.velocity.x += playerAirAccel;
                    player.flipX = false;
                }
            }
    
            // Min jump speed
            if(isJumping == false && isGrounded && Phaser.Input.Keyboard.JustDown(keyJump)){
                player.body.velocity.y += playerInitSpeed;
                isJumping = true;
            }
            // Hold jump speed
            if(isJumping == true && Phaser.Input.Keyboard.DownDuration(keyJump, holdJumpTime)) {
                player.body.velocity.y += playerJumpSpeed;
            }
            // Let go of up key to jump again
            if(Phaser.Input.Keyboard.JustUp(keyJump)){
                isJumping = false;
            }

            // Time slow  
            if(Phaser.Input.Keyboard.DownDuration(keySlowmo, slowmoTime)) {
                if(this.physics.world.timeScale < slowedTimeScale){
                    this.physics.world.timeScale += 0.01; 
                } else {
                    this.physics.world.timeScale = slowedTimeScale;
                }
            } else {
                if(this.physics.world.timeScale > normTimeScale){
                    this.physics.world.timeScale -= 0.01; 
                } else {
                    this.physics.world.timeScale = normTimeScale;
                }
            }
            this.timeScaleText.setText('TimeScale: ' + this.physics.world.timeScale);
        }

        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            this.scene.start('gameOverScene');
        }

        // scroll background and ground
        background.tilePositionX += 1;
        ground.tilePositionX += 4 + scrollChange * (player.body.velocity.x/maxVelocityX);
    }
}