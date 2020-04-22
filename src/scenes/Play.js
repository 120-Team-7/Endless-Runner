class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
        background = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'starfield').setOrigin(0,0);
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
        console.log(this);
        cursors = this.input.keyboard.createCursorKeys();

        // var graphics = this.add.graphics();

        // graphics.fillStyle(0x00ff00, 1);
        // graphics.fillRect(0, 2*game.config.height/3, game.config.width, game.config.height/3);

        player = this.physics.add.sprite(centerX, centerY, 'player').setOrigin(0.5);
        this.physics.add.existing(player);
        this.physics.add.existing(ground, true);
        
        player.setImmovable();
        player.setMaxVelocity(400, 10000);
        player.setCollideWorldBounds(true);

        // ground.body.allowGravity = false;
        // ground.body.immovable = true;
        // ground.setInteractble
        // ground.body.setImmovable();

        // this.physics.add.collider(player, this.groundTile);
        // collider.active = true;
        // this.physics.world.enable([player, this.groundTile]);

        this.physics.add.collider(ground, player);


        // game.physics.arcade.enable(this);

    }

    update() {
        // if(Phaser.Input.Keyboard.JustDown(cursors.left)) {
            
        //     player.body.velocity.y -= playerSpeed;
        // } else if(Phaser.Input.Keyboard.JustDown(cursors.right)) {
            
        //     player.body.velocity.y += playerSpeed;
        //     console.log(player.velcoity);
        // }
        // if(player.body.velocityX < ){
        //     player.body.velocity.x += playerSpeed/2;
        // } else if(player.body.velocity > 0){
        //     player.body.velocity.x -= playerSpeed/2;
        // }

        // this.physics.world.collide(player, ground);

        if(cursors.left.isDown) {
            player.body.velocity.x = -playerSpeed;
        }
        if(cursors.right.isDown) {
            player.body.velocity.x = playerSpeed;
        }
        if(cursors.up.isDown) {
            player.body.velocity.y = -playerSpeed;
        }

        background.tilePositionX += 0.5;
        ground.tilePositionX += 2;
    }
}