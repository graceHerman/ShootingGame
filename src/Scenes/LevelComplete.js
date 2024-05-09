class LevelComplete extends Phaser.Scene {
    constructor() {
        super("levelComplete");

        this.enemyHitCounter = 0;
        this.enemyHitCounter2 = 0;
        
    }

    preload() {
        
    }

    create() {
        let my = this.my;

        // Create key objects
        this.nextScene = this.input.keyboard.addKey("S");
        this.restartScene = this.input.keyboard.addKey("R");
        this.prevSceneKey = this.scene.settings.data.prevScene;
        this.score = this.scene.settings.data.score || 0;

        this.thanksText = this.add.text(230, 250, 'Level Completed!', { fontFamily: 'Arial', fontSize: 60, color: '#ffffff' });

        // Create score bar
        this.scoreText = this.add.text(330, 350, 'Score: ' + this.score, { fontFamily: 'Arial', fontSize: 50});

        this.restarttText = this.add.text(280, 450, 'Press R to restart level', { fontFamily: 'Arial', fontSize: 35});

        this.nextText = this.add.text(250, 500, 'Press S to go to next level', { fontFamily: 'Arial', fontSize: 35});
 
        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Level Completed.js</h2><br>'

    }

    update() {
        let my = this.my;

        if (Phaser.Input.Keyboard.JustDown(this.restartScene)) {
            this.scene.get("level1").restartScene();
            this.scene.stop("levelComplete");
        }
        
        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("level2", {score: this.score}, {health: 5});
        }

    }
}