class Level1 extends Phaser.Scene {
    graphics;
    curve;
    path;

    constructor() {
        super("level1");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = {sprite: {}};

        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.bullet = [];   
        this.maxBullets = 10;           // Don't create more than this many bullets

        this.my.sprite.enemyBullet = [];
        this.emaxBullet = 10;

        this.health = 5;
        this.score = 0;

        this.maxHealth = 5;
        this.maxScore = 100;


        this.path = {
            from: 0,
            to: 1,
            delay: 0,
            duration: 2000,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true,
            //rotateToPath: true,
            rotationOffset: -90
        };

        this.enemyHitCounter = 0;
        this.enemyHitCounter2 = 0;

        this.enemy1Destroyed = false;
        this.enemy2Destroyed = false;
        
    }
    restartScene() {
        // Reset all properties to their initial values
        this.my.sprite.bullet = [];
        this.my.sprite.enemyBullet = [];
        this.health = 5;
        this.score = 0;
        this.enemyHitCounter = 0;
        this.enemyHitCounter2 = 0;
        this.enemy1Destroyed = false;
        this.enemy2Destroyed = false;

        // Restart the scene
        this.scene.restart();
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("heart", "heart.png");
        this.load.image("hippo", "hippo.png");
        this.load.image("elephant", "elephant.png");
        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");

        this.load.image("snake", "snake.png");
        this.load.image("rock", "particle_brown.png");
        this.load.image("spike", "spike_bottom.png");
        this.load.image("penguin", "penguin.png");
        this.load.image("coin", "gold_1.png");
        this.load.image("x-mark", "numeralX copy.png");
        this.load.image("wingMan1", "wingMan1.png");

        // sound
        this.load.audio("punch", "impactPunch_medium_000.ogg");
        this.load.audio("ding", "impactMetal_light_003.ogg");
    }

    create() {
        let my = this.my;

        // declare player 
        my.sprite.penguin = this.add.sprite(game.config.width/2, game.config.height - 100, "penguin");
        my.sprite.penguin.setScale(0.25);

        // declare "enemies"
        // Create a curve, for use with the path
        // Initial set of points are only used to ensure there is something on screen to begin with.
        // No need to save these values.
        // x, y

        this.points = [
            100, 300,
            750, 300,
        ];

        //this.points = this.generateRandomPoints();

        this.curve = new Phaser.Curves.Spline(this.points);
        // Initialize Phaser graphics, used to draw lines
        this.graphics = this.add.graphics();
        
        this.initializeGraphics();

        my.sprite.hippo = this.add.follower(this.curve, 10, 10, "hippo").setScale(0.25);
        this.createPath(my.sprite.hippo, this.curve, this.points);
        my.sprite.hippo.visible = false;
        my.sprite.hippo.destroy(); // Remove the first hippo

        my.sprite.hippo1 = this.add.sprite(100, 40, "hippo").setScale(0.25); 

        my.sprite.elephant = this.add.sprite(700, 40, "elephant").setScale(0.25);

        my.sprite.coin = this.add.sprite(game.config.width/2, 40, "coin");
        my.sprite.coin.setScale(0.5);

        my.sprite.heart = this.add.sprite(250, 40, "heart");


        // Notice that in this approach, we don't create any bullet sprites in create(),
        // and instead wait until we need them, based on the number of space bar presses

        // Create white puff animation
        this.anims.create({
            key: "puff",
            frames: [
                { key: "whitePuff00" },
                { key: "whitePuff01" },
                { key: "whitePuff02" },
                { key: "whitePuff03" },
            ],
            frameRate: 15,
            repeat: 5,
            hideOnComplete: true
        });

        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.nextScene = this.input.keyboard.addKey("S");
        this.resetScene = this.input.keyboard.addKey("R");
        this.controlsScene = this.input.keyboard.addKey("C");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 5;
        this.bulletSpeed = 5;
        this.enemyBulletSpeed = 5;
        this.enemySpeed = 2;

        this.collidedThisFrame = false;

        // Create health bar
        this.healthText = this.add.text(20, 650, 'Health: ', { fontFamily: 'Arial', fontSize: 24, color: '#ffffff' });
        this.healthBar = this.add.rectangle(110, 655, 200, 20, 0x00ff00).setOrigin(0);
        this.healthBar.displayWidth = (this.health / this.maxHealth) * 200;

        // Create score bar
        this.scoreText = this.add.text(770, 650, 'Score: ' + this.score, { fontFamily: 'Arial', fontSize: 24});
        this.scoreBar = this.add.rectangle(20, 50, 200, 20).setOrigin(0);
        this.scoreBar.displayWidth = (this.score / this.maxScore) * 200;

        this.xImages.forEach(xImage => xImage.visible = false);
        this.graphics.visible = false;

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Level 1.js</h2><br>C: Controls'

    }

    createPath(enemy, curve, points) {
        if (curve.points.length > 0) {
            let firstPoint = curve.points[0];
            enemy.x = firstPoint.x;
            enemy.y = firstPoint.y;
            enemy.visible = true;
            enemy.startFollow(this.path);
        }
    }

    initializeGraphics() {
        // Draw initial graphics
        this.xImages = [];
        this.drawPoints();
        this.drawLine();
    }

    // Draws an x mark at every point along the spline.
    drawPoints() {
        for (let point of this.curve.points) {
            this.xImages.push(this.add.image(point.x, point.y, "x-mark"));
        }
    }

    // Add a point to the spline
    addPoint(point) {
        this.curve.addPoint(point);
        this.xImages.push(this.add.image(point.x, point.y, "x-mark"));
    }

    // Draws the spline
    drawLine() {
        //this.graphics.visible = false;
        this.graphics.clear();                      // Clear the existing line
        this.graphics.lineStyle(2, 0xffffff, 1);    // A white line
        this.curve.draw(this.graphics, 32);         // Draw the spline
    }

    update() { 
        let my = this.my;
        let updateCounter = this.enemyHitCounter;

        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.penguin.x > (my.sprite.penguin.displayWidth/2)) {
                my.sprite.penguin.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.penguin.x < (game.config.width - (my.sprite.penguin.displayWidth/2))) {
                my.sprite.penguin.x += this.playerSpeed;
            }
        }

        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Are we under our bullet quota?
            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.penguin.x, my.sprite.penguin.y-(my.sprite.penguin.displayHeight/2), "rock")
                );
            }
            this.enemyShootBullet(my.sprite.hippo, my.sprite.enemyBullet);
        }

        for (let bullet of my.sprite.enemyBullet) {
            bullet.update(); // Update bullet's position
        }

        // Make all of the bullets move
        for (let bullet of my.sprite.bullet) {
            bullet.y -= this.bulletSpeed;
        }

        for (let b of my.sprite.enemyBullet) {
            //b.setFlipY(true);
            b.y -= this.enemyBulletSpeed;
        }

        // Remove all of the bullets which are offscreen
        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));
        my.sprite.enemyBullet = my.sprite.enemyBullet.filter((enemyBullet) => enemyBullet.y < 650);

        this.collidedThisFrame = false;

        // make enemy move towards player, attack player and get defeated by player's bullet
        // elephant
        this.enemyShootBullet(my.sprite.elephant, my.sprite.enemyBullet);
        if (this.enemyHitCounter < 3) {
            this.hitEnemy(my.sprite.elephant, my.sprite.bullet, 2);
            //console.log("flag e: " + counter);
            if (my.sprite.elephant.visible = true) {
                this.moveToPlayer(my.sprite.elephant, my.sprite.penguin);
            }
            this.collideWithPLayer(my.sprite.elephant, my.sprite.penguin);
        }
        // hippo
        if (this.enemyHitCounter2 < 3) {
            this.hitEnemy1(my.sprite.hippo1, my.sprite.bullet, 2);
            //console.log("flag h: " + my.sprite.hippo1.beenHit);
            if (my.sprite.hippo1.visible = true) {
                this.moveToPlayer(my.sprite.hippo1, my.sprite.penguin);
            }
            this.collideWithPLayer(my.sprite.hippo1, my.sprite.penguin);
        } 

        // increase points for score
        for (let bullet of my.sprite.bullet) {
            if (this.collides(my.sprite.coin, bullet)) {
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.coin.visible = false;
                my.sprite.coin.x = -100;
                this.my.sprite.coin.visible = true;
                if(this.score >= this.maxScore) {
                    this.score += 5;
                    this.scoreText.setText('Score: ' + this.score);
                    this.updateScoreBar();
                } else {
                    this.score += 5;
                    this.scoreText.setText('Score: ' + this.score);
                    this.updateScoreBar();
                }
                this.sound.play("ding", {volume: 1});
                this.my.sprite.coin.x = Math.random()*config.width;

            }
        }

        // increase health
        for (let bullet of my.sprite.bullet) { 
            if (this.collides(my.sprite.heart, bullet)) {
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;
                my.sprite.heart.visible = false;
                my.sprite.heart.x = -100;
                this.my.sprite.heart.visible = true;
                this.sound.play("ding", {volume: 1});
                if (this.health >= this.maxHealth) {
                    this.health += 0;
                    this.healthText.setText('Health: ');
                    this.updateHealthBar();
                } else {
                    this.health += 1;
                    this.healthText.setText('Health: ');
                    this.updateHealthBar();
                }
                this.my.sprite.heart.x = Math.random()*config.width;
                this.my.sprite.heart.y = Math.random()*200;

            }
        }

        // change scenes
        if (Phaser.Input.Keyboard.JustDown(this.resetScene)) {
            this.score = 0;  
            this.restartScene();
        }

        if (Phaser.Input.Keyboard.JustDown(this.controlsScene)) {
            this.scene.start("controls", { prevScene: this.scene.key }, {score: this.score});
        }
        
        if (this.enemy1Destroyed && this.enemy2Destroyed) {
            //console.log("dead: " + this.enemy1Destroyed);
            this.enemyHitCounter = 0;
            this.enemyHitCounter2 = 0;
            this.enemy1Destroyed = false;
            this.enemy1Destroyed = false;
            this.scene.start("levelComplete", { score: this.score });
        }

    }

    enemyShootBullet(enemy, bullet) {
        if (bullet.length < this.emaxBullets) {
            bullet.push(this.add.sprite(enemy.x, enemy.y-(enemy.displayHeight/2), "spike").setScale(0.25));
        }
    }

    moveToPlayer(enemy, player) {
        // Calculate direction to player
        const directionX = player.x - enemy.x;
        const directionY = player.y - enemy.y;

        // Normalize the direction vector
        const length = Math.sqrt(directionX * directionX + directionY * directionY);
        const directionXNormalized = directionX / length;
        const directionYNormalized = directionY / length;

        // Move the elephant towards the player along the X-axis
        enemy.x += directionXNormalized * this.enemySpeed;

        // Check if the player is to the left or right of the elephant
        if (directionX < 0) {
            // Player is to the left, so the elephant should move downwards and to the left
            enemy.x -= this.enemySpeed * 0.5; // Adjust this speed as needed
        } else if (directionX > 0) {
            // Player is to the right, so the elephant should move downwards and to the right
            enemy.x += this.enemySpeed * 0.5; // Adjust this speed as needed
        }

        // Move the elephant downwards along the Y-axis
        enemy.y += this.enemySpeed; // Adjust this speed as needed
        // Check if the enemy is off-screen 
        if (enemy.x < -enemy.width || enemy.x > config.width || enemy.y > config.height) {
            // Reset the enemy's position to appear again
            enemy.x = Math.random() * config.width;
            enemy.y = -enemy.height; // Start from the top
        }

        // Move the enemy downwards along the Y-axis
        enemy.y += this.enemySpeed; // Adjust this speed as needed
    }

    collideWithPLayer(enemy, player) {
        if (!this.collidedThisFrame && this.collides(player, enemy)) {
            this.collidedThisFrame = true;
            this.health -= 1;
            // Ensure health doesn't go below 0
            if (this.health <= 0) {
                this.health = 0;
                this.scene.start("gameover", {score: this.score});
            }

            // Update health text
            this.healthText.setText('Health: ');

            // Update health bar display
            this.updateHealthBar();

            enemy.x = Math.random()*config.width;
            enemy.y = 100;
        }
    }
    
    hitEnemy(enemy, b, num) {
        for (let bullet of b) {
            if (this.collides(enemy, bullet)) {
                
                // start animation
                this.puff = this.add.sprite(enemy.x, enemy.y, "whitePuff03").setScale(0.25).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;

                // Increment hit counter
                this.enemyHitCounter++;
                // Check if enemy has been hit 3 times
                if (this.enemyHitCounter >= 3) {
                    enemy.visible = false;
                    enemy.destroy();
                    this.enemy1Destroyed = true;
                    return;
                }

                this.sound.play("punch", {volume: 1});
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    enemy.visible = true;
                    this.score += num;
                    this.scoreText.setText('Score: ' + this.score);
                    this.updateScoreBar();
                    enemy.x = Math.random()*config.width;
                    enemy.y = 100;
                }, this);
            }
        }
    }

    hitEnemy1(enemy, b, num) {
        for (let bullet of b) {
            if (this.collides(enemy, bullet)) {
                
                // start animation
                this.puff = this.add.sprite(enemy.x, enemy.y, "whitePuff03").setScale(0.25).play("puff");
                // clear out bullet -- put y offscreen, will get reaped next update
                bullet.y = -100;

                // Increment hit counter
                this.enemyHitCounter2++;
                // Check if enemy has been hit 3 times
                if (this.enemyHitCounter2 >= 3) {
                    enemy.visible = false;
                    enemy.destroy();
                    this.enemy2Destroyed = true;
                    return;
                }

                this.sound.play("punch", {volume: 1});
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    enemy.visible = true;
                    this.score += num;
                    this.scoreText.setText('Score: ' + this.score);
                    this.updateScoreBar();
                    enemy.x = Math.random()*config.width;
                    enemy.y = 100;
                }, this);
            }
        }
    }

    updatePoints() {
        this.generateRandomPoints();
        this.createCurveAndGraphics(); // Update the curve and graphics with new points
    }

    // Function to update the health bar
    updateHealthBar() {
        // Calculate the ratio of current health to maximum health
        this.healthBar.displayWidth = (this.health / this.maxHealth) * 200;
    }

    // Function to update the score bar
    updateScoreBar() {
        this.scoreBar.displayWidth = (this.score / this.maxScore) * 200;
    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
}