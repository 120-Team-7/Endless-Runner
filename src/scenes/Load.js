class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        // set up loading bar (to-do)

        // load assets
        this.load.image('player', './assets/SimplePlayer.png');
        this.load.image('ground', './assets/ground.png');
    }

    create() {
        // check for local storage browser support
        if(window.localStorage) {
            console.log('Local storage supported');
        } else {
            console.log('Local storage not supported');
        }

        // go to menu scene
        this.scene.start('menuScene');
    }
}