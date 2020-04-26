class ObstacleSpawner extends Phaser.GameObjects.Group{
    constructor(scene, delayMin, delayMax, minX, maxX, minY, maxY, logBounce) {
        let groupConfig = {
            runChildUpdate: true,
            maxSize: 5
        }
        super(scene, null, groupConfig);
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
            }, 
            callbackContext: scene,
            loop: true,
        });

        this.scene = scene;
    }

    update() {
        // Somehow needed to update children
        this.preUpdate();
        // this.scene.timer.getProgress()
    }

    playerHit(){
        this.cameras.main.flash(1000);
        this.cameras.main.shake(500, 0.01);
        isGameOver = true;
        sceneClock.paused = true;
        player.body.setDragX(groundDrag);
        this.time.delayedCall(2000, () => { this.scene.start('gameOverScene') })
    }
}