class Log extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, spawnX, spawnY, velocityX, velocityY, logBounce) {
        // call Phaser Physics Sprite constructor
        super(scene, spawnX, spawnY, '').setOrigin(0,0).setInteractive(); 
        // set up physics sprite
        scene.add.existing(this);               // add to existing scene, displayList, updateList
        scene.physics.add.existing(this);       // add physics body
        this.setVelocityX(velocityX);
        this.setVelocityY(velocityY);
        this.setBounceY(logBounce);
    
        scene.input.setDraggable(this);
    
        scene.input.on('dragstart', function (pointer, gameObject) {
            this.initPointerX = pointer.x;
            this.initPointerY = pointer.y;
        });
        
        scene.input.on('dragend', function (pointer, gameObject) {
            this.dragVelocityX;
            this.dragVelocityY;
            // if(pointer.x - this.initPointerX > 0){
            //     this.dragVelocityX = Phaser.Math.Clamp(pointer.x - this.initPointerX, minDragSpeed, maxDragSpeed)
            // } else {
            //     this.dragVelocityX = Phaser.Math.Clamp(pointer.x - this.initPointerX, -minDragSpeed, -maxDragSpeed)
            // }

            // if(pointer.y - this.initPointerY > 0){
            //     this.dragVelocityY = Phaser.Math.Clamp(pointer.y - this.initPointerY, minDragSpeed, maxDragSpeed)
            // } else {
            //     this.dragVelocityY = Phaser.Math.Clamp(pointer.y - this.initPointerY, -maxDragSpeed, -minDragSpeed)
            // }
            
            gameObject.body.allowGravity = false;
            
            // gameObject.body.velocity.x = this.dragVelocityX;
            // gameObject.body.velocity.y = this.dragVelocityY;

            gameObject.body.velocity.x = pointer.x - this.initPointerX;
            gameObject.body.velocity.y = pointer.y - this.initPointerY;

            this.gravityReturn = scene.time.delayedCall(500, () => {
                console.log("Return: " + gameObject.body.gravity.y);
                gameObject.body.allowGravity = true;
            }, null, scene);
        });
    }

    update() {
        if(this.x < 0) {
            console.log("log destroyed");
            this.destroy();
        }
        if(this.x > gameWidth) {
            console.log("reflected: " + this.velocity.x);
            this.velocity.x = -this.velocity.x;
        }
    }
}