class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
        var platforms;

        background = this.add.tileSprite(0, 0, game.config.width, game.config.height, '').setOrigin(0,0);
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
        
        platforms = this.physics.add.staticGroup();
        platforms.create(gameWidth/2, 415, 'wall').setOrigin(0.5);
        this.physics.add.collider(player, platforms);

        this.log1 = new Log(this, gameWidth, centerY, -300, 500, platforms);

        this.physics.add.collider(this.log1, platforms);

    }

    update() {
        this.log1.update();

        player.isGrounded = player.body.touching.down;

        if(cursors.left.isDown) {
            player.body.velocity.x = -playerRunSpeed;
        } else if(cursors.right.isDown) {
            player.body.velocity.x = playerRunSpeed;
        } else {
            player.body.setDragX(drag);
        }

        // Min jump speed
        if(player.isGrounded && cursors.up.isDown){
            console.log("init");
            player.body.velocity.y = playerInitSpeed;
            player.body.setAccelerationY(playerInitAccel);
        }
        // Hold jump speed
        if(Phaser.Input.Keyboard.DownDuration(cursors.up, 150)) {
            console.log("hold");
	        player.body.velocity.y += playerJumpSpeed;
        }

        background.tilePositionX += 0.5;
        ground.tilePositionX += 2;
    }
}