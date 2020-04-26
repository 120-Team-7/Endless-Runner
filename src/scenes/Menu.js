class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    create() {
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keySlowmo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

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
        this.add.text(centerX, centerY - 3*textSpacer, 'Psychic Trials', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '30px';
        this.add.text(centerX, centerY - textSpacer, 'A move left   D move right    W jump', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY, 'SHIFT time slow', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer, 'Click and drag obstacles to use pyschic throw', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 2*textSpacer, 'Press ENTER here to start or return to menu elsewhere', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 3*textSpacer, 'High score: ' + highScore, menuConfig).setOrigin(0.5);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            this.scene.start('playScene');
        }
    }
}