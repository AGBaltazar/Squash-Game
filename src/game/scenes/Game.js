import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    preload() {
        this.load.image('court', 'assets/court.png');
        this.load.image('ball', 'assets/Ball.png');
        this.load.spritesheet('bandit', 'assets/Bandit.png', { frameWidth: 150, frameHeight: 200 });
        this.load.spritesheet('stripe', 'assets/Stripe.png', { frameWidth: 100, frameHeight: 200 });
    }

    create() {
        this.cameras.main.setBackgroundColor(0x000000);
        
        this.createFloatingWindow(500, 500);

        EventBus.emit('current-scene-ready', this);
    }

    
    

    createFloatingWindow(width, height) {
        const x = this.scale.width / 2;
        const y = this.scale.height / 2;

        let windowBackground = this.add.rectangle(0, 0, width, height, 0x000000, 0.8);

        let floatingWindow = this.add.container(x, y);
        floatingWindow.add(windowBackground);

        const padding = 20;

        let tutorialText = this.add.text(
            -width / 2 + padding,
            -height / 2 + padding,
            'Welcome to Bluey Squash!\n\nIn this fun and exciting squash game, your goal is to rally the ball back and forth, keeping it in play as long as possible.\n\nUse the arrow keys to move your character left and right, and press the spacebar to hit the ball.\n\nIf the ball bounces past your opponent, you score a point!\n\nBe quick and strategic to outmaneuver your opponent. Keep an eye on the ball\'s speed, and do not let it get past you.\n\nGood luck, and have fun!', {
                fontFamily: 'Arial',
                fontSize: '18px',
                color: '#ffffff',
                wordWrap: { width: width - padding * 2 },
                align: 'left',
            }
        );

        floatingWindow.add(tutorialText);

        let exitTutorial = this.add.circle(width / 2 - padding, -height / 2 + padding, 10, 0xff0000)
            .setInteractive()
            .on('pointerdown', () => this.closeFloatingWindow());

        floatingWindow.add(exitTutorial);

        this.floatingWindow = floatingWindow;

        return floatingWindow;
    }

    closeFloatingWindow() {
        if (this.floatingWindow) {
            this.floatingWindow.destroy();
            this.floatingWindow = null;
        }

        this.scene.start('GameMechanics', {
            courtData: { x: 512, y: 384, texture: 'court' },
        });
        
    }

    changeScene() {
        this.scene.start('GameOver');


    }
}
