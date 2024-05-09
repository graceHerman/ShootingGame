class GameOver extends Phaser.Scene {
    constructor() {
        super("gameover");

        // Initialize a class variable "my" which is an object.
        // The object has one property, "sprite" which is also an object.
        // This will be used to hold bindings (pointers) to created sprites.
        this.my = {sprite: {}};

        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.bullet = [];   
        this.maxBullets = 10;           // Don't create more than this many bullets
        this.health = 5;
        
    }

    preload() {
        
    }

    create() {
        let my = this.my;

        // Create key objects
        this.nextScene = this.input.keyboard.addKey("S");
        this.compScene = this.input.keyboard.addKey("C");

        this.score = this.scene.settings.data.score;

        this.thanksText = this.add.text(300, 250, 'Game Over', { fontFamily: 'Arial', fontSize: 60, color: '#ffffff' });

        // Create score bar
        this.scoreText = this.add.text(330, 350, 'Score: ' + this.score, { fontFamily: 'Arial', fontSize: 50});

        this.nextText = this.add.text(280, 450, 'Press S to restart game', { fontFamily: 'Arial', fontSize: 35});
 
        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Game Over.js</h2><br>'

    }

    update() {
        let my = this.my;

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            //this.scene.start("level1", {score: 0, health: 5});
            this.scene.get("level1").restartScene();
            this.scene.stop("gameover");
        }
        /*// for testing purposes
        if (Phaser.Input.Keyboard.JustDown(this.compScene)) {
            this.scene.start("levelComplete");
        }*/

    }
}