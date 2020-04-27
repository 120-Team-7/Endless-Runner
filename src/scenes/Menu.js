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
            color: '#FF00FF',
            align: 'center',
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
            },
            fixedWidth: 0
        }
        // add menu screen text
        this.add.text(centerX, (centerY - textSpacer)/2, 'Psychic Trials', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '30px';
        menuConfig.color = '#FFFFFF',
        this.add.text(centerX, centerY - textSpacer, 'A move left   D move right', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY, 'W jump     Hold SHIFT time slow', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer, 'Click, drag, release obstacles to use Psychic Throw', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 2*textSpacer, 'Press ENTER here to start or return to menu elsewhere', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 3*textSpacer, 'High score: ' + highScore, menuConfig).setOrigin(0.5);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            this.scene.start('playScene');
        }
        // if (Phaser.Input.Keyboard.JustDown(keySlowmo)) {
        //     this.scene.start('gameOverScene');
        // }
    }
}