class Log extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, group, spawnX, spawnY, velocityX, velocityY, logBounce) {
        // Call Phaser Physics Sprite constructor
        super(scene, spawnX, spawnY, 'log').setOrigin(0.5, 0.5).setInteractive(); 
        // Set up physics sprite
        scene.add.existing(this); // add to existing scene, displayList, updateList
        scene.physics.add.existing(this); // add physics body
        this.setCircle(30, 5, 5);
        this.setAngularVelocity(-logAngularVelocity);
        this.setVelocityX(velocityX);
        this.setVelocityY(velocityY);
        this.setBounceY(logBounce);

        let log = this;

        this.emitCircle = new Phaser.Geom.Circle(this.x, this.y, 30);
        log.particleTrail = logParticles.createEmitter({
            emitZone: { source: this.emitCircle },
            alpha: { start: 1, end: 0},
            scale: { start: 1, end: 0},
            speedX: this.body.velocity.x/10,
            speedY: this.body.velocity.y/10,
            lifespan: 2000,
            frequency: 50,
            quantity: 1,
        });
        log.particleTrail.stop();

        /*
        Psychic Throw
        Log is slowed on initial click and while holding click down. Log's velocity is set based on the
        vector formed by the distance between the pointer position on first clicking the log and the pointer
        position after releasing click. After releasing click, the log's velocity is set and it continues
        parallel to this vector for a short moment without gravity before gravity is returned. 
        */
        scene.input.setDraggable(this);
        scene.input.on('dragstart', function (pointer, gameObject,) {
            // Slow log on initial click
            gameObject.body.setDrag(preThrowDrag, preThrowDrag)
            // Store this initial pointer position
            this.initPointerX = pointer.x;
            this.initPointerY = pointer.y;
            // Start log trailing particles and burst at pointer to show this pointer position (start)
            gameObject.particleTrail.start();
            particlePointer.start();
        });
        
        scene.input.on('dragend', function (pointer, gameObject) {
            // No grav for now
            gameObject.body.allowGravity = false;
            // Reset drag
            gameObject.body.setDrag(0, 0);
            // Calculate measurements
            this.xDist = pointer.x - this.initPointerX;
            this.yDist = pointer.y - this.initPointerY;
            this.totalDist = Phaser.Math.Distance.Between(this.initPointerX, this.initPointerY, pointer.x, pointer.y);
            // Set particleLine
            particleLine.setTo(this.initPointerX, this.initPointerY, pointer.x, pointer.y);

            // Rare case where log disappears from trying to divide by 0
            if(this.totalDist == 0){
                this.throwVelocityY = -minThrowSpeed;
            // Set velocity magnitude to minDragSpeed if drag distance is shorter than min
            } else if(this.totalDist < minThrowSpeed){
                // Converts the xDist, yDist components into xSpeed, ySpeed components in order to achieve minThrowSpeed (diagonal speed) on combining components. Uses Pythagorean theorum to solve for scaleFactor given a, b, and c where c is minThrowSpeed and a, b are xDist, yDist
                this.minScaleFactor = Math.sqrt(Math.pow(Math.abs(this.xDist), 2) + Math.pow(Math.abs(this.yDist), 2)) / minThrowSpeed;
                // Converts distance components into velocity components that total to minThrowSpeed
                this.throwVelocityX = this.xDist / this.minScaleFactor;       
                this.throwVelocityY = this.yDist / this.minScaleFactor;
                // Match particleLine to minThrowSpeed
                Phaser.Geom.Line.Extend(particleLine, 0, minThrowSpeed - this.totalDist);
            // Set velocity magnitude to maxThrowSpeed if drag distance is longer than max
            } else if (this.totalDist > maxThrowSpeed) {
                this.maxScaleFactor = Math.sqrt(Math.pow(Math.abs(this.xDist), 2) + Math.pow(Math.abs(this.yDist), 2)) / maxThrowSpeed;
                this.throwVelocityX = this.xDist / this.maxScaleFactor;       
                this.throwVelocityY = this.yDist / this.maxScaleFactor;
                // Match particleLine to maxThrowSpeed
                Phaser.Geom.Line.Extend(particleLine, 0, -(this.totalDist - maxThrowSpeed));
            // Set velocity magnitude to drag distance if between minThrowSpeed and maxThrowSpeed
            } else {
                this.throwVelocityX = this.xDist;       
                this.throwVelocityY = this.yDist;
            }
            
            gameObject.body.velocity.x = this.throwVelocityX;
            gameObject.body.velocity.y = this.throwVelocityY;

            // Create paticleVector that matches and parallels the psychic throw vector
            particleVector.start();
            
            // Return gravity after short duration
            this.gravityReturn = scene.time.delayedCall(psychicThrowTime, () => {
                gameObject.body.allowGravity = true;
                log.particleTrail.stop();
                particleVector.stop();
                particlePointer.stop();
            }, null, scene);
        });

        // Despawn after certain time to prevent player tossing logs up forever
        this.infinitePrevent = scene.time.delayedCall(logPreventInfiniteTime, () => {
            log.particleTrail.start();
            scene.input.setDraggable(this, false);
            this.body.velocity.y = 0;
            this.body.velocity.x = -400;
            this.setAlpha(0.5);
        }, null, scene);

        this.group = group;
        this.scene = scene;
    }

    update() {
        this.emitCircle.setPosition(this.x, this.y);

        // Change angular velocity based on moving direction
        if(this.body.velocity.x < 0){
            this.setAngularVelocity(-logAngularVelocity);
        } else{
            this.setAngularVelocity(logAngularVelocity);
        }
        // Enforce pre throw slow down min speed
        if(Math.abs(this.body.velocity.x) < preThrowMinSpeed || Math.abs(this.body.velocity.y) < preThrowMinSpeed){
            this.body.setDrag(0, 0);
        }
        // Reflect log back left if log goes off right screen
        if(this.x > gameWidth + 100) {
            this.body.velocity.x = -this.body.velocity.x;
            this.x = gameWidth;
        }
        // Countdown remove log from group & scene when off left screen
        if(this.x < 0) {
            this.despawnTime = this.scene.time.delayedCall(logDespawnTime, () => {
                this.particleTrail.remove();
                this.group.remove(this, true, true);
            }, null, this.scene);
        }
    }
}