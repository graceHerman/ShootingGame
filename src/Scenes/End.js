class End extends Phaser.Scene {
    constructor() {
        super("end");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = {sprite: {}};

        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.bullet = [];   
        this.maxBullets = 10;           // Don't create more than this many bullets
        
    }
    init(data) {
        this.score = data.score || 0; // Retrieve the score from data, defaulting to 0 if not provided
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
        this.overScene = this.input.keyboard.addKey("G");
        this.controlsScene = this.input.keyboard.addKey("C");

        // Set movement speeds (in pixels/tick)

        this.thanksText = this.add.text(100, 250, 'Thank you for playing! :D', { fontFamily: 'Arial', fontSize: 60, color: '#ffffff' });

        // Create score bar
        this.scoreText = this.add.text(330, 350, 'Score: ' + this.score, { fontFamily: 'Arial', fontSize: 50});

        this.playText = this.add.text(230, 420, 'Press S to play again', { fontFamily: 'Arial', fontSize: 50});

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>End.js</h2><br>'

    }

    update() {
        let my = this.my;

        // for testing purposes
        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("start");
        }

        /*if (Phaser.Input.Keyboard.JustDown(this.overScene)) {
            this.scene.start("gameover");
        }

        if (Phaser.Input.Keyboard.JustDown(this.controlsScene)) {
            this.scene.start("controls", { prevScene: this.scene.key });
        }*/

    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
}
         