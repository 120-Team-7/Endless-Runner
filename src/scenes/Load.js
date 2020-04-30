class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        // Load image assets
        this.load.atlas('player','./assets/runningchar.png','./assets/runningchar.json');
        this.load.image('cloud', './assets/bigCloud.png');
        this.load.image('ground', './assets/ground.png');
        this.load.image('invisibleGround', './assets/invisibleGround.png');
        this.load.image('background', './assets/background.png');
        this.load.image('log', './assets/log.png');
        this.load.image('psychicParticle', './assets/psychicParticle.png');
        this.load.image('psychicParticlePointer', './assets/psychicParticlePointer.png');
        // Load audio assets
        this.load.audio('song', './assets/bgm.wav');
    }

    create() {
        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        this.add.text(centerX, centerY, 'Press ENTER to start', {
            fontFamily: 'Courier',
            fontSize: '50px',
            color: '#FF00FF',
            align: 'center',
        }).setOrigin(0.5, 0.5);

        bgm = game.sound.add('song', { 
            mute: false,
            volume: globalVolume,
            rate: 1,
            loop: true 
        });

        // check for local storage browser support
        // if(window.localStorage) {
        //     console.log('Local storage supported');
        // } else {
        //     console.log('Local storage not supported');
        // }
    }
    update() {
        // Go to menu scene
        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            this.scene.start('menuScene');
        }
    }
}