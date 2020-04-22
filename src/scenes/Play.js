class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    create() {
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

        player = this.physics.add.sprite(centerX, centerY, 'player').setOrigin(0.5);

        this.physics.add.existing(player);
        this.physics.add.existing(ground, true);
        
        player.setImmovable();
        player.setMaxVelocity(400, 10000);
        player.setCollideWorldBounds(true);

        this.physics.add.collider(ground, player);
    }

    update() {
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