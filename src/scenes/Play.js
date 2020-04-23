class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
        var platforms;

        background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'background').setOrigin(0,0);
        ground = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'ground').setOrigin(0,0);
        
        let playConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            // backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        cursors = this.input.keyboard.createCursorKeys();

        player = this.physics.add.sprite(0, 100, 'player').setOrigin(0.5);
        player.setCollideWorldBounds(true);
        player.setMaxVelocity(maxVelocityX, maxVelocityY);
        
        platforms = this.physics.add.staticGroup();
        platforms.create(gameWidth/2, 415, 'wall').setOrigin(0.5);
        this.physics.add.collider(player, platforms);

        // ObstacleSpawner(scene, platforms, delayMin, delayMax, minX, maxX, minY, maxY) 
        this.spawner1 = new ObstacleSpawner(this, platforms, 2000, 3000, -300, -200, -600, 600);
        
        // this.timer = this.time.addEvent({
        //     delay: Phaser.Math.Between(2000, 3000), 
        //     callback: () => {
        //         console.log("spawning");
                
        //         this.log = new Log(this, gameWidth, centerY, Phaser.Math.Between(-300, -200), Phaser.Math.Between(600, -600), platforms);
        //         this.physics.add.collider(this.log, platforms);
        //     }, 
        //     callbackContext: this,
        //     loop: true,
        // });

        this.test1 = this.add.text(32, 32);
    }

    update() {
         // this.log1.update();
        this.test1.setText("isGrounded " + isGrounded + " isJumping " + isJumping);

        this.spawner1.update();

        isGrounded = player.body.touching.down;
        if(isGrounded){
            isJumping = false;
        }

        if(isGrounded){
            // Ground movement
            if(cursors.left.isDown) {
                player.body.velocity.x -= playerRunAccel;
            } else if(cursors.right.isDown) {
                player.body.velocity.x += playerRunAccel;
            } else {
                // Set drag when not inputting movement
                player.body.setDragX(groundDrag);
            }
        } else {
            // Air movement
            // Set drag always when in air, decreased control while in air
            player.body.setDragX(airDrag);
            if(cursors.left.isDown) {
                player.body.velocity.x -= playerAirAccel;
            } else if(cursors.right.isDown) {
                player.body.velocity.x += playerAirAccel;
            }
        }

        // Min jump speed
        if(isGrounded && cursors.up.isDown){
            console.log("init");
            player.body.velocity.y = playerInitSpeed;
            player.body.setAccelerationY(playerInitAccel);
            isJumping = true;
        }
        // Hold jump speed
        if(isJumping == true && Phaser.Input.Keyboard.DownDuration(cursors.up, holdJumpTime)) {
            console.log("hold");
	        player.body.velocity.y += playerJumpSpeed;
        } else {
            isJumping = false;
        }

        background.tilePositionX += 0.5;
        ground.tilePositionX += 2;
    }
}