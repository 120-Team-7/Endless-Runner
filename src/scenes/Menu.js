class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    create() {
        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        keyVolumeUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyVolumeDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyMute = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);


        if(resetAudio == true){
            bgm.play();
            resetAudio = false;
        }

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
        this.add.text(centerX, centerY + 3*textSpacer, 'High score: ' + highScore, menuConfig).setOrigin(0.5);
        menuConfig.color = '#FFFFFF',
        this.add.text(centerX, centerY - textSpacer, 'A move left   D move right', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY, 'W jump     Hold SHIFT time slow', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + textSpacer, 'Click, drag, release obstacles to use Psychic Throw', menuConfig).setOrigin(0.5);
        this.add.text(centerX, centerY + 2*textSpacer, 'Press ENTER here to start or return to menu elsewhere', menuConfig).setOrigin(0.5);
        this.volumeText = this.add.text(gameWidth - 170, centerY + 3*textSpacer, 'Game volume: ' + game.sound.volume, menuConfig).setOrigin(0.5);
        this.muteText = this.add.text(150, centerY + 3*textSpacer, 'Muted: ' + game.sound.mute, menuConfig).setOrigin(0.5);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            this.scene.setVisible(false, 'menuScene');
            this.scene.setVisible(true, 'playScene');
            this.scene.run('playScene');
        }
        if (Phaser.Input.Keyboard.JustDown(keyVolumeDown)) {
            if(game.sound.volume - volumeChange >= 0){
                game.sound.volume -= volumeChange;
            } else {
                game.sound.volume = 0;
            }
        }
        if (Phaser.Input.Keyboard.JustDown(keyVolumeUp)) {
            if(game.sound.volume + volumeChange <= 1){
                game.sound.volume += volumeChange;
            } else {
                game.sound.volume = 1;
            }
        }
        if (Phaser.Input.Keyboard.JustDown(keyMute)) {
            if(game.sound.mute == false){
                game.sound.mute = true;
            } else {
                game.sound.mute = false;
            }
        }
        this.volumeText.setText('Game volume: ' + Math.round(game.sound.volume * 100));
        this.muteText.setText('Muted: ' + game.sound.mute);
    }
}