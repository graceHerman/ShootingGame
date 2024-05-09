class Start extends Phaser.Scene {
    constructor() {
        super("start");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = {sprite: {}};

        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.bullet = [];   
        this.maxBullets = 10;           // Don't create more than this many bullets

        this.score = 0;
        
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("elephant", "elephant.png");
        this.load.image("heart", "heart.png");
        this.load.image("hippo", "hippo.png");
        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");

        this.load.image("snake", "snake.png");
        this.load.image("bullet", "particle_brown.png");
        this.load.image("penguin", "penguin.png");
        this.load.image("coin", "gold_1.png");
        this.load.image("wingMan1", "wingMan1.png");
        this.load.image("wingMan2", "wingMan2.png");
        this.load.image("wingMan3", "wingMan3.png");
        this.load.image("wingMan4", "wingMan4.png");
        this.load.image("wingMan5", "wingMan5.png");
    }

    create() {
        let my = this.my;

        // Notice that in this approach, we don't create any bullet sprites in create(),
        // and instead wait until we need them, based on the number of space bar presses

        // Create key objects
        this.nextScene = this.input.keyboard.addKey("S");
        this.controls = this.input.keyboard.addKey("C");

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 5;
        this.bulletSpeed = 5;

        this.scoreText = this.add.text(200, 250, 'Wild Animals', { fontFamily: 'Arial', fontSize: 80, color: '#ffffff' });

        // Create score bar
        this.playText = this.add.text(260, 350, 'Press S to play', { fontFamily: 'Arial', fontSize: 50});
        this.contText = this.add.text(220, 430, 'Press C to Controls', { fontFamily: 'Arial', fontSize: 50});

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Start.js</h2><br>'

    }

    update() {
        let my = this.my;

        if (Phaser.Input.Keyboard.JustDown(this.controls)) {
            this.scene.start("controls", { prevScene: this.scene.key });
        }

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("level1", { score: this.score }, {health: 5});
        }

    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
}

         