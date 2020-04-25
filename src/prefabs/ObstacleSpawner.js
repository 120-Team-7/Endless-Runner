class ObstacleSpawner extends Phaser.GameObjects.Group{
    constructor(scene, delayMin, delayMax, minX, maxX, minY, maxY, logBounce) {
        let groupConfig = {
            runChildUpdate: true,
            maxSize: 5
        }
        
        super(scene, null, groupConfig);
        console.log(this.runChildUpdate);
        // bounce on ground
        scene.physics.add.collider(this, platforms);
        // collide with the player
        scene.physics.add.overlap(player, this, this.playerHit, null, scene);
        scene.timer = scene.time.addEvent({
            delay: Phaser.Math.Between(delayMin, delayMax), 
            callback: () => {
                // scene.log = new Log(scene, this, gameWidth, centerY, Phaser.Math.Between(minX, maxX), Phaser.Math.Between(minY, maxY), logBounce);
                if(!this.isFull()){
                    this.add(new Log(scene, this, gameWidth, centerY, Phaser.Math.Between(minX, maxX), Phaser.Math.Between(minY, maxY), logBounce));
                }
                console.log("Num logs: " + this.getLength());
            }, 
            callbackContext: scene,
            loop: true,
        });

        scene.test2 = scene.add.text(32, 64);
        this.scene = scene;
    }

    update() {
        this.preUpdate();
        this.scene.test2.setText("timer: " + this.scene.timer.getProgress().toString().substr(0, 4))
    }

    playerHit(){
        isGameOver = true;
        sceneClock.paused = true;
        player.body.setDragX(groundDrag);
        this.time.delayedCall(2000, () => { this.scene.start('gameOverScene') })
    }
}