class Log extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, spawnX, spawnY, velocityX, velocityY, logBounce) {
        // call Phaser Physics Sprite constructor
        super(scene, spawnX, spawnY, '').setOrigin(0,0).setInteractive(); 
        // set up physics sprite
        scene.add.existing(this);               // add to existing scene, displayList, updateList
        scene.physics.add.existing(this);       // add physics body
        this.setVelocityX(velocityX);
        this.setVelocityY(velocityY);
        this.setBounceY(logBounce);

        this.exists = true;

        // Pyschic throw
        scene.input.setDraggable(this);
        scene.input.on('dragstart', function (pointer, gameObject) {
            console.log("gottem");
            // Slow log on initial click
            gameObject.body.setDrag(preThrowDrag, preThrowDrag)
            // Store this pointer position
            this.initPointerX = pointer.x;
            this.initPointerY = pointer.y;
        });
        
        scene.input.on('dragend', function (pointer, gameObject) {
            // No grav for now
            gameObject.body.allowGravity = false;
            // Reset drag
            gameObject.body.setDrag(0, 0);

            this.xDist = pointer.x - this.initPointerX;
            this.yDist = pointer.y - this.initPointerY;
            this.totalDist = Phaser.Math.Distance.Between(this.initPointerX, this.initPointerY, pointer.x, pointer.y);

            // Set velocity magnitude to minDragSpeed if drag distance is shorter than min
            if(this.totalDist < minThrowSpeed){
                // Converts the xDist, yDist components into xSpeed, ySpeed components in order to achieve minThrowSpeed (diagonal speed) on combining components
                // Uses Pythagorean theorum to solve for scaleFactor given a, b, and c where c is minThrowSpeed and a, b are xDist, yDist
                this.minScaleFactor = Math.sqrt(Math.pow(Math.abs(this.xDist), 2) + Math.pow(Math.abs(this.yDist), 2)) / minThrowSpeed;
                // Converts distance components into velocity components that total to minThrowSpeed
                this.throwVelocityX = this.xDist / this.minScaleFactor;       
                this.throwVelocityY = this.yDist / this.minScaleFactor;
            // Set velocity magnitude to maxThrowSpeed if drag distance is longer than max
            } else if (this.totalDist > maxThrowSpeed) {
                this.maxScaleFactor = Math.sqrt(Math.pow(Math.abs(this.xDist), 2) + Math.pow(Math.abs(this.yDist), 2)) / maxThrowSpeed;
                this.throwVelocityX = this.xDist / this.maxScaleFactor;       
                this.throwVelocityY = this.yDist / this.maxScaleFactor;
            // Set velocity magnitude to drag distance if between minThrowSpeed and maxThrowSpeed
            } else {
                this.throwVelocityX = this.xDist;       
                this.throwVelocityY = this.yDist;
            }

            
            gameObject.body.velocity.x = this.throwVelocityX;
            gameObject.body.velocity.y = this.throwVelocityY;

            // Return gravity after short duration
            this.gravityReturn = scene.time.delayedCall(psychicThrowTime, () => {
                // console.log("in gravity return " + this.exists);
                // if(this.exists == true){
                    // console.log("gravity returned " + this.exists);
                    gameObject.body.allowGravity = true;
                // }
            }, null, scene);
        });

        // Despawn after time to prevent player tossing logs up forever
        this.despawnTime = scene.time.delayedCall(logDespawnTime, () => {
            this.exists = false;
            this.group.remove(this, true, true);
        }, null, scene);

        this.group = group;
    }

    update() {
        // Enforce pre throw slow down min speed
        if(Math.abs(this.body.velocity.x) < preThrowMinSpeed || Math.abs(this.body.velocity.y) < preThrowMinSpeed){
            this.body.setDrag(0, 0);
        }
        // Remove log from group & scene when off left screen
        if(this.x < 50) {
            this.exists = false;
            this.group.remove(this, true, true);
            // console.log("despawn " + this.exists);
        }
        // Reflectlog back left if log goes off right screen
        if(this.x > gameWidth + 100) {
            this.body.velocity.x = -this.body.velocity.x;
            this.x = gameWidth;
            // Reset to defualt y if current y wouldn't result in log returning on screen
            if(this.y > centerY){
                this.y = centerY
            }
        }
    }
}