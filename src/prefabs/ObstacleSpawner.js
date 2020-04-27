class ObstacleSpawner extends Phaser.GameObjects.Group{
    constructor(scene, delayMin, delayMax, minX, maxX, minY, maxY, logBounce) {
        let groupConfig = {
            runChildUpdate: true,
            maxSize: 5
        }
        super(scene, null, groupConfig);
        // bounce on ground
        scene.physics.add.collider(this, platform);
        // collide with the player
        if(!isHit){
            scene.physics.add.overlap(player, this, this.playerHit, null, scene);
        }
        // Add particles
        logParticles = scene.add.particles('psychicParticle');
        // Spawn timer
        scene.timer = scene.time.addEvent({
            delay: Phaser.Math.Between(delayMin, delayMax), 
            callback: () => {
                if(!this.isFull()){
                    // Log(scene, group, spawnX, spawnY, velocityX, velocityY, logBounce)
                    this.add(new Log(scene, this, gameWidth + 100, Phaser.Math.Between(100, centerY),
                        Phaser.Math.Between(minX, maxX), Phaser.Math.Between(minY, maxY), logBounce));
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
        // Camera effects
        this.cameras.main.flash(1000);
        this.cameras.main.shake(500, 0.01);
        // Update variables
        isGameOver = true;
        isHit = true;
        sceneClock.paused = true;
        player.body.setDragX(groundDrag);
        // Delay change to game over scene
        this.time.delayedCall(3000, () => {
            this.scene.start('gameOverScene') })
    }
}