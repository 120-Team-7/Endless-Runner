class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene');
    }

    create() {
        keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keySlowmo = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        keyStart = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // // check for high score in local storage
        // // uncomment console.log statements if you need to debug local storage
        // if(localStorage.getItem('hiscore') != null) {
        //     let storedScore = parseInt(localStorage.getItem('hiscore'));
        //     //console.log(`storedScore: ${storedScore}`);
        //     // see if current score is higher than stored score
        //     if(level > storedScore) {
        //         //console.log(`New high score: ${level}`);
        //         localStorage.setItem('hiscore', level.toString());
        //         highScore = level;
        //         newHighScore = true;
        //     } else {
        //         //console.log('No new high score :/');
        //         highScore = parseInt(localStorage.getItem('hiscore'));
        //         newHighScore = false;
        //     }
        // } else {
        //     //console.log('No high score stored. Creating new.');
        //     highScore = level;
        //     localStorage.setItem('hiscore', highScore.toString());
        //     newHighScore = true;
        // }

        // add GAME OVER text
        // if(newHighScore) {
        //     this.add.text(centerX, centerY - textSpacer, 'New Hi-Score!', { fontFamily: 'Helvetica', fontSize: '32px', color: '#FACADE' }).setOrigin(0.5);
        // // }
        // this.add.text(centerX, centerY, `You avoided getting REKT for ${level}s`, { fontFamily: 'Helvetica', fontSize: '48px', color: '#FFF' }).setOrigin(0.5);
        // this.add.text(centerX, centerY + textSpacer, `This browser's best: ${highScore}s`, { fontFamily: 'Helvetica', fontSize: '32px', color: '#FACADE' }).setOrigin(0.5);

        // Add text
        this.add.text(centerX, centerY + textSpacer, 'Press enter to restart', { fontFamily: 'Helvetica', fontSize: '24px', color: '#FFF' }).setOrigin(0.5);

        if(currTime > highScore){
            highScore = currTime;
            this.add.text(centerX, centerY + 2*textSpacer, 'NEW HIGH SCORE: ' + highScore, { fontFamily: 'Helvetica', fontSize: '24px', color: '#FFF' }).setOrigin(0.5);
        } else {
            this.add.text(centerX, centerY + 2*textSpacer, 'High score: ' + highScore, { fontFamily: 'Helvetica', fontSize: '24px', color: '#FFF' }).setOrigin(0.5);
        }

        // update globals
        isGameOver = false;
    }

    update() {
        // wait for space input to restart game
        if (Phaser.Input.Keyboard.JustDown(keyStart)) {
            this.scene.start('playScene');
        }
    }
}