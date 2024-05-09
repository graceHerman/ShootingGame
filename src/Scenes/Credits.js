class Credits extends Phaser.Scene {
    constructor() {
        super("credits");

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

        // Create key objects
        this.nextScene = this.input.keyboard.addKey("S");
        this.prevSceneKey = this.scene.settings.data.prevScene;

        // controls
        // A: left // D: right // Space: fire/emit // R: Reset Scene // S: Next Scene
        // credits
        this.creditText = this.add.text(100, 150, 'Credits:', { fontFamily: 'Arial', fontSize: 25, color: '#ffffff' });
        this.credit1Text = this.add.text(100, 200, 'kenny_animal-pack, kenny_jumper-pack for assets', { fontFamily: 'Arial', fontSize: 25, color: '#ffffff' });
        this.credit2Text = this.add.text(100, 250, ' kenny_impact-sounds for sound.', { fontFamily: 'Arial', fontSize: 25, color: '#ffffff' });
        this.credit3Text = this.add.text(100, 300, 'Used Bullet Time file by Jim Whitehead as reference for my code ', { fontFamily: 'Arial', fontSize: 25, color: '#ffffff' });

        this.nextText = this.add.text(320, 600, 'Press S to go back', { fontFamily: 'Arial', fontSize: 35});

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Controls and Credits.js</h2><br>'

    }

    update() {
        let my = this.my;


        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start(this.prevSceneKey, {score: this.score});
        }

    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
}