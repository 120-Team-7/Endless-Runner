class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        // Load image assets
        this.load.image('cloud', './assets/bigCloud.png');
        this.load.image('player', './assets/chara1.png');
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
        bgm = game.sound.add('song', { 
            mute: false,
            volume: globalVolume,
            rate: 1,
            loop: true 
        });
        // // check for local storage browser support
        // if(window.localStorage) {
        //     console.log('Local storage supported');
        // } else {
        //     console.log('Local storage not supported');
        // }

        // Go to menu scene
        this.scene.start('menuScene');
    }
}