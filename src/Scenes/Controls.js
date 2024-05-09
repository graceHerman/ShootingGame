class Controls extends Phaser.Scene {
    constructor() {
        super("controls");

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
        this.credScene = this.input.keyboard.addKey("C");
        this.prevSceneKey = this.scene.settings.data.prevScene;

        // controls
        // A: left // D: right // Space: fire/emit // R: Reset Scene // S: Next Scene
        this.contText = this.add.text(300, 50, 'Controls:', { fontFamily: 'Arial', fontSize: 25, color: '#ffffff' });
        this.AText = this.add.text(100, 100, 'A key = player moves left', { fontFamily: 'Arial', fontSize: 25, color: '#ffffff' });
        this.DText = this.add.text(100, 150, 'D key = player moves right', { fontFamily: 'Arial', fontSize: 25, color: '#ffffff' });
        this.SText = this.add.text(100, 200, 'Spacebar = fire bullet', { fontFamily: 'Arial', fontSize: 25, color: '#ffffff' });
        this.RText = this.add.text(100, 250, 'R key = Reset', { fontFamily: 'Arial', fontSize: 25, color: '#ffffff' });

        this.nextText = this.add.text(320, 700, 'Press S to restart', { fontFamily: 'Arial', fontSize: 35});

        this.credText = this.add.text(320, 800, 'Press C to go to credits', { fontFamily: 'Arial', fontSize: 25});

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Controls and Credits.js</h2><br>'

    }

    update() {
        let my = this.my;


        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start(this.prevSceneKey, {score: this.score});
        }

        if (Phaser.Input.Keyboard.JustDown(this.credtScene)) {
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