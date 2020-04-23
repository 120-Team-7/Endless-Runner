class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }


    

    create() {
        var platforms;
        
        


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


        
        background = this.add.tileSprite(0, 0, game.config.width, game.config.height, '').setOrigin(0,0);
        ground = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'ground').setOrigin(0,0);

        
        cursors = this.input.keyboard.createCursorKeys();
      
        

        player = this.physics.add.sprite(0, 100, 'player').setOrigin(0.5);
        platforms = this.physics.add.staticGroup();
        platforms.create(500, 415,'wall' );
        this.physics.add.collider(player, platforms);
        player.setCollideWorldBounds(true);

        

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