class Log extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, spawnX, spawnY, velocityX, velocityY, logBounce) {
        // call Phaser Physics Sprite constructor
        super(scene, spawnX, spawnY, '').setOrigin(0,0); 
        // set up physics sprite
        scene.add.existing(this);               // add to existing scene, displayList, updateList
        scene.physics.add.existing(this);       // add physics body
        this.setVelocityX(velocityX);
        this.setVelocityY(velocityY);
        this.setBounceY(logBounce);
    }

    update() {
        if(this.x < 0) {
            this.destroy();
        }
    }
}