class ObstacleSpawner{
    constructor(scene, rate, platforms) {
        console.log("spawner made")
        this.happy = 5;
        this.timer = scene.time.addEvent(rate, () => {
            console.log("spawning");
            this.log = new Log(this, gameWidth, centerY, -300, 500, platforms);
            this.physics.add.collider(this.log, platforms);
            },
            scene, true
        );
    }

    update() {
       
    }
}