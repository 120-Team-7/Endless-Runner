class ObstacleSpawner{
    constructor(scene, delayMin, delayMax, minX, maxX, minY, maxY) {
        console.log("spawner made")
        scene.timer = scene.time.addEvent({
            delay: Phaser.Math.Between(delayMin, delayMax), 
            callback: () => {
                console.log("spawning");
                scene.log = new Log(scene, gameWidth, centerY, Phaser.Math.Between(minX, maxX), Phaser.Math.Between(minY, maxY));
                // bounce on ground
                scene.physics.add.collider(scene.log, platforms);
                // collide with the player
                scene.physics.add.overlap(player, scene.log, this.playerHit, null, scene);
            }, 
            callbackContext: scene,
            loop: true,
        });

        scene.test2 = scene.add.text(32, 64);
        this.scene = scene;

    }

    update() {
        this.scene.test2.setText("timer: " + this.scene.timer.getProgress().toString().substr(0, 4))
    }

    playerHit(){
        player.body.setDragX(groundDrag);
        isGameOver = true;
        console.log('You lose');
        this.time.delayedCall(3000, () => { this.scene.start('gameOverScene'); })
    }
}