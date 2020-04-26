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

        let playConfig = {
            fontFamily: 'Courier',
            fontSize: '40px',
            color: '#00000',
            // strokeThickness: 5,
            // stroke: '#4682B4',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: 0
        }

        // graphics = this.add.graphics();
        // graphics.fillStyle(0xC0C0C0, 1);
        // graphics.lineStyle(128, 0x00ff00, 1);

        background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0,0);
        ground = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'ground').setOrigin(0,0);

        // this.add.line(centerX, centerY, 0, 0, gameWidth, gameHeight, 0x000000);

        // Player
        player = this.physics.add.sprite(0, 100, 'player').setOrigin(0.5);
        player.setCollideWorldBounds(true);
        player.setMaxVelocity(maxVelocityX, maxVelocityY);
        this.physics.world.timeScale = normTimeScale;
        
        // Platforms
        platforms = this.physics.add.staticGroup();
        platforms.create(gameWidth/2, 415, 'invisibleGround').setOrigin(0.5);
        this.physics.add.collider(player, platforms);

        // ObstacleSpawner(scene, platforms, delayMin, delayMax, minX, maxX, minY, maxY) 
        this.spawner1 = new ObstacleSpawner(this, 3000, 4000, -300, -200, -600, 600, 1);

        // HUD boxes
        this.add.rectangle(centerX, playHUDY, gameWidth, playHUDHeight, 0x808080).setOrigin(0.5,0.5);
        this.add.rectangle(centerX, playHUDY, gameWidth - 20, playHUDHeight - 20, 0xC0C0C0).setOrigin(0.5,0.5);

        // Current time/distance ran
        this.timeTextTop = this.add.text(centerX/2 - 100, playHUDY - 15, 'Distance: ', playConfig).setOrigin(0.5, 0.5);
        this.timeTextLeft = this.add.text(50, playHUDY + 17, '0', playConfig).setOrigin(0.5, 0.5);
        this.timeTextRight = this.add.text(170, playHUDY + 17, 'meters', playConfig).setOrigin(0.5, 0.5);
        currTime = 0;
        sceneClock = this.time.addEvent({
            delay: 1000, 
            callback: () => {
                currTime ++;
                this.timeTextLeft.setText(currTime);
            }, 
            callbackContext: this,
            loop: true,
        });

        this.highScoreTop = this.add.text(centerX + centerX/2 + 120, playHUDY - 15, 'High Score: ', playConfig).setOrigin(0.5, 0.5);
        this.highScoreLeft = this.add.text(gameWidth - 240, playHUDY + 17, highScore, playConfig).setOrigin(0.5, 0.5);
        this.highScoreRight = this.add.text(gameWidth - 120, playHUDY + 17, 'meters', playConfig).setOrigin(0.5, 0.5);

        this.timeSlowText = this.add.text(centerX - 30, playHUDY, 'Time slow:', playConfig).setOrigin(0.5, 0.5);
        playConfig.fixedWidth = 100;
        this.timeSlowNum = this.add.text(centerX + 130, playHUDY, '', playConfig).setOrigin(0.5, 0.5);

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
                } else if(keyRight.isDown) {
                    player.body.velocity.x += playerRunAccel;
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
                } else if(keyRight.isDown) {
                    player.body.velocity.x += playerAirAccel;
                    
                }
            }
            if(player.body.velocity.x > 0) {
                player.flipX = false;
            }
            if(player.body.velocity.x < 0) {
                player.flipX = true;
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
                this.cameras.main.clearTint();
                if(this.physics.world.timeScale > normTimeScale){
                    this.physics.world.timeScale -= 0.01; 
                } else {
                    this.physics.world.timeScale = normTimeScale;
                }
            }
            this.percentSlow = Math.round(200*(this.physics.world.timeScale-normTimeScale));
            if (this.percentSlow % 10 == 0){
                this.timeSlowNum.setText(this.percentSlow);
            }
        }

        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            this.scene.start('gameOverScene');
        }

        // scroll background and ground
        background.tilePositionX += backgroundScroll - (0.33)*backgroundScroll*(this.percentSlow/100);
        ground.tilePositionX += groundScroll - (0.33)*groundScroll*(this.percentSlow/100);
    }
}