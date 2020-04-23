class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
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

        cursors = this.input.keyboard.createCursorKeys();

        player = this.physics.add.sprite(0, 100, 'player').setOrigin(0.5);
        player.setCollideWorldBounds(true);
        player.setMaxVelocity(maxVelocityX, maxVelocityY);
        
        // platforms
        platforms = this.physics.add.staticGroup();
        platforms.create(gameWidth/2, 415, 'invisibleGround').setOrigin(0.5);
        this.physics.add.collider(player, platforms);

        // ObstacleSpawner(scene, platforms, delayMin, delayMax, minX, maxX, minY, maxY) 
        this.spawner1 = new ObstacleSpawner(this, 2000, 3000, -300, -200, -600, 600);

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
        if(!isGameOver){
            if(isGrounded){
                // ground movement
                if(cursors.left.isDown) {
                    player.body.velocity.x -= playerRunAccel;
                } else if(cursors.right.isDown) {
                    player.body.velocity.x += playerRunAccel;
                } else {
                    // Set drag when not inputting movement
                    player.body.setDragX(groundDrag);
                }
            } else {
                // air movement
                // set drag always when in air, decreased control while in air
                player.body.setDragX(airDrag);
                if(cursors.left.isDown) {
                    player.body.velocity.x -= playerAirAccel;
                } else if(cursors.right.isDown) {
                    player.body.velocity.x += playerAirAccel;
                }
            }
    
            // Min jump speed
            if(isGrounded && cursors.up.isDown){
                player.body.velocity.y += playerInitSpeed;
                isJumping = true;
            }
            // Hold jump speed
            if(isJumping == true && Phaser.Input.Keyboard.DownDuration(cursors.up, holdJumpTime)) {
                player.body.velocity.y += playerJumpSpeed;
            } else {
                isJumping = false;
            }
        }

        // scroll background and ground
        background.tilePositionX += 1;
        ground.tilePositionX += 4 + scrollChange * (player.body.velocity.x/maxVelocityX);
    }
}