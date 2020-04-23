class ObstacleSpawner{
    constructor(scene, platforms, delayMin, delayMax, minX, maxX, minY, maxY) {
        console.log("spawner made")
        scene.timer = scene.time.addEvent({
            delay: Phaser.Math.Between(delayMin, delayMax), 
            callback: () => {
                console.log("spawning");
                
                scene.log = new Log(scene, gameWidth, centerY, Phaser.Math.Between(minX, maxX), Phaser.Math.Between(minY, maxY), platforms);
                scene.physics.add.collider(scene.log, platforms);
            }, 
            callbackContext: scene,
            loop: true,
        });

        this.scene = scene;

        scene.test2 = scene.add.text(32, 64);
    }

    update() {
        this.scene.test2.setText("timer: " + this.scene.timer.getProgress().toString().substr(0, 4))
    }
}