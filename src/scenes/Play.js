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
        keyMute = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        isGameOver = false;
        timeSlowLock = false;
        cooldownCalled = false;
        isJumping = false;
        isHit = false;
        spawnTime = spawnTimeMax;

        let playConfig = {
            fontFamily: 'Courier',
            fontSize: '40px',
            color: '#00000',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: 0
        }
        let difficultyConfig = {
            fontFamily: 'Courier',
            fontSize: '40px',
            color: '#00000',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: 0
        }

        // Audio ---------------------------------------------------------------------------------
        

        // Add scrolling background
        background = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'background').setOrigin(0,0);
        ground = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'ground').setOrigin(0,0);
        cloud = this.add.tileSprite(0, 0, gameWidth, gameHeight, 'cloud').setOrigin(0,0);

        // Create player
        player = this.physics.add.sprite(50, centerY + 50, 'player').setOrigin(0.5, 0.5);
        player.body.setSize(30, 105);
        player.body.setOffset(30, 25);
        player.setCollideWorldBounds(true);
        player.setMaxVelocity(maxVelocityX, maxVelocityY);
        player.setDepth(5);
        this.physics.world.timeScale = normTimeScale;
        
        // Ground platform
        platform = this.physics.add.staticGroup();
        platform.create(gameWidth - 100, 415, 'invisibleGround').setOrigin(0.5);
        this.physics.add.collider(player, platform);

        // HUD boxes ---------------------------------------------------------------------------------
        this.add.rectangle(centerX, playHUDY, gameWidth, playHUDHeight, 0x808080).setOrigin(0.5,0.5);
        this.add.rectangle(centerX, playHUDY, gameWidth - 20, playHUDHeight - 20, 0xC0C0C0).setOrigin(0.5,0.5);
        this.add.rectangle(centerX, difficultY, 340, 70, 0x808080).setOrigin(0.5,0.5);
        this.add.rectangle(centerX, difficultY, 320, 50, 0xC0C0C0).setOrigin(0.5,0.5);

        // Current time/distance ran text
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

        // High score text
        this.highScoreTop = this.add.text(centerX + centerX/2 + 120, playHUDY - 15, 'High Score: ', playConfig).setOrigin(0.5, 0.5);
        this.highScoreLeft = this.add.text(gameWidth - 240, playHUDY + 17, highScore, playConfig).setOrigin(0.5, 0.5);
        this.highScoreRight = this.add.text(gameWidth - 120, playHUDY + 17, 'meters', playConfig).setOrigin(0.5, 0.5);

        // Time slow text
        this.timeSlowText = this.add.text(centerX - 30, playHUDY, 'Time slow:', playConfig).setOrigin(0.5, 0.5);
        this.timeSlowText.setStyle({
            color: timeSlowReady
        });
        playConfig.fixedWidth = 100;
        this.timeSlowNum = this.add.text(centerX + 130, playHUDY, '', playConfig).setOrigin(0.5, 0.5);

        // ObstacleSpawner(scene, delayMin, delayMax, minX, maxX, minY, maxY, logBounce)
        this.spawner1 = new ObstacleSpawner(this, spawnTime, spawnTime + 1000, -150, -300, 0, 400, 1);

        // Difficulty level text
        thisDifficultyLevel = 1;
        this.difficultText = this.add.text(centerX, difficultY, 'Difficulty: ' + thisDifficultyLevel, difficultyConfig).setOrigin(0.5, 0.5);
        this.difficultyTimer = this.time.addEvent({
            delay: nextDifficultyLevel,
            callback: () => {
                thisDifficultyLevel++;
                if(spawnTime != spawnTimeMin){
                    spawnTime -= 500;
                }
                this.difficultText.setText("Difficulty: " + thisDifficultyLevel, difficultyConfig);
            },
            callbackScope: this,
            repeat: difficultyLevelMax
        });

        // Add particles ---------------------------------------------------------------------------------
        this.pointerParticles = this.add.particles('psychicParticlePointer');
        this.pointerParticles.setDepth(15);
        logParticles = this.add.particles('psychicParticle');
        logParticles.setDepth(10);
        // Initialize emit zones
        pointerCircle = new Phaser.Geom.Circle(0, 0, 5);
        particleLine = new Phaser.Geom.Line(-200, -200, gameWidth, gameHeight);
        // Particles to show psychic throw velocity vector
        particleVector = this.pointerParticles.createEmitter({
            emitZone: { source: particleLine },
            alpha: { start: 1, end: 0 },
            scale: { start: 0.75, end: 0 },
            speed: {min: 0, max: 10},
            lifespan: { min: 500, max: 1000 },
            frequency: 20,
            quantity: 2,
        });
        // Particles on initial click
        particlePointer = this.pointerParticles.createEmitter({
            emitZone: { source: pointerCircle},
            alpha: { start: 1, end: 0 },
            scale: { start: 1.5, end: 0 },
            speed: { min: 0, max: 20 },
            lifespan: { min: 3000, max: 4000 },
            frequency: 10000,
            quantity: 10,
        });
        particleVector.stop();
        particlePointer.stop();
        
    }

    update() {
        this.spawner1.update();
        // this.physics.world.collide(paddle, this.barrierGroup, this.paddleCollision, null, this);
        isGrounded = player.body.touching.down;

        if(!isGameOver){
            if(isGrounded){
                // Ground movement
                if(keyLeft.isDown) {
                    player.body.velocity.x -= playerRunAccel;
                } else if(keyRight.isDown) {
                    player.body.velocity.x += playerRunAccel;
                } else {
                    // Set drag when not inputting movement 
                    player.body.setDragX(groundDrag);
                }
            } else {
                // Air movement
                // Set drag always when in air, decreased control while in air
                player.body.setDragX(airDrag);
                if(keyLeft.isDown) {
                    player.body.velocity.x -= playerAirAccel;
                } else if(keyRight.isDown) {
                    player.body.velocity.x += playerAirAccel;
                }
            }

            // Flip player sprite based on x velocity
            if(player.body.velocity.x > 5) {
                player.flipX = false;
            }
            if(player.body.velocity.x < -5) {
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

            /*
            Time slow
            Hold down SHIFT to start and continue time slow based on physics time scale where higher scale results
            in slower time. Time scale steadily increases until reaching the maximum. On releasing shift or
            reaching the max duration, time scale steadily decreases until it reaches the given normal time scale.
            Cooldown starts when player releases SHIFT. Until the cooldown is over, the player is locked out from
            using time slow again. 
            */
            if(timeSlowLock == false && Phaser.Input.Keyboard.DownDuration(keySlowmo, slowmoTime)) {
                // Show time slow being used
                this.timeSlowText.setStyle({
                    color: timeSlowDuring
                });
                // Increase timescale until reach slowedTimeScale
                if(this.physics.world.timeScale < slowedTimeScale){
                    this.physics.world.timeScale += slowRate;
                    // Slow down global sound rate
                    if(game.sound.rate > slowedSoundRate) { game.sound.rate -= soundRateChange; } else {
                        game.sound.rate = slowedSoundRate;
                    }
                } else {
                    this.physics.world.timeScale = slowedTimeScale;
                }
            // Either the player releases timeslow key or the duration is up
            } else if(this.physics.world.timeScale != normTimeScale) {
                // Prevent player from using again until cooldown
                timeSlowLock = true;
                this.timeSlowText.setStyle({
                    color: timeSlowNotReady
                });
                // After slowmoTime is up, decrease timescale until reach normTimeScale
                if(this.physics.world.timeScale > normTimeScale){
                    this.physics.world.timeScale -= slowRate;
                    // Speed up global sound rate
                    if(game.sound.rate < normalSoundRate) { game.sound.rate += soundRateChange; } else{
                        game.sound.rate = normalSoundRate;
                    }
                } else {
                    this.physics.world.timeScale = normTimeScale;
                }
            }
            // Start cooldown when conditions are met
            // Conditions: cooldownCalled needed to prevent multiple cooldowns, timeSlowLock to tell if has been
            // used, and justUp to force the player to release SHIFT to start the cooldown.
            if(cooldownCalled == false && timeSlowLock == true && Phaser.Input.Keyboard.JustUp(keySlowmo)){
                cooldownCalled = true;
                this.timeSlowDelay = this.time.delayedCall(timeSlowCooldown, () => {
                    timeSlowLock = false;
                    cooldownCalled = false;
                    // Show time slow is ready
                    this.timeSlowText.setStyle({
                        color: timeSlowReady
                    });
                }, null, this);
            }

            // Update time slow text
            // Based on percentage of time slow with 0 being normal and 100 being max time slow
            this.percentSlow = Math.round(200*(this.physics.world.timeScale-normTimeScale));
            if (this.percentSlow % 10 == 0){
                this.timeSlowNum.setText(this.percentSlow);
            }
        } else {
            bgm.stop();
        }

        // Return to menu input
        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            isPaused = true;
            this.scene.pause('playScene');
            this.scene.setVisible(false, 'playScene');
            this.scene.run('menuScene');
        }

        // // Mute all sounds
        // if (Phaser.Input.Keyboard.JustDown(keyMute)) {
        //     if(game.sound.mute == false){
        //         game.sound.mute = true;
        //     } else {
        //         game.sound.mute = false;
        //     }
        // }

        // Update particle emit zone for pointer
        pointer = this.input.activePointer;
        pointerCircle.setPosition(pointer.worldX, pointer.worldY);

        // Scroll background and ground and modify based on time slow
        // Slows by 0.33 at 100% time slow and 0 at 0%
        background.tilePositionX += backgroundScroll - (0.33)*backgroundScroll*(this.percentSlow/100);
        ground.tilePositionX += groundScroll - (0.33)*groundScroll*(this.percentSlow/100);
        cloud.tilePositionX += cloudScroll - (0.33)*cloudScroll*(this.percentSlow/100);
    }
}