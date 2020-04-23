class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    create() {
        // menu display
        // score display
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '100px',
            // backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        // add menu screen text
        this.add.text(centerX, centerY, 'Endless Runner', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '30px';
        this.add.text(centerX, centerY + 2*textSpacer, 'Press space to start', menuConfig).setOrigin(0.5);


        // set up cursor keys
        cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.space)) {
            this.scene.start('playScene');
        }
    }
}