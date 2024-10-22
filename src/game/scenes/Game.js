import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class Game extends Scene {
    constructor() {
        super('Game');
    }

    preload() {
        // Load assets
        this.load.image('court', 'assets/court.png');
        this.load.image('ball', 'assets/Ball.png');
        this.load.spritesheet('bandit', 'assets/Bandit.png', { frameWidth: 150, frameHeight: 200 });
        this.load.spritesheet('stripe', 'assets/Stripe.png', { frameWidth: 100, frameHeight: 200 });
    }

    create() {
        this.cameras.main.setBackgroundColor(0x000000);

        const canvasWidth = this.scale.width;
        const canvasHeight = this.scale.height;

        const courtScale = canvasHeight * 0.8;
        
        this.court = this.add.image(canvasWidth / 2, canvasHeight / 2, 'court').setDisplaySize(courtScale, courtScale / 2); 

        const banditX = canvasWidth * 0.2;
        const stripeX = canvasWidth * 0.8;
        const playerY = canvasHeight * 0.5;
        
        this.bandit = this.physics.add.sprite(banditX, playerY, 'bandit').setScale(0.5); 
        this.stripe = this.physics.add.sprite(stripeX, playerY, 'stripe').setScale(0.5); 
        
        this.ball = this.physics.add.sprite(canvasWidth / 2, playerY, 'ball').setScale(0.2);

        this.createCourtBorders(canvasWidth, canvasHeight);

        this.createFloatingWindow(500, 500);

        EventBus.emit('current-scene-ready', this);
    }

    createCourtBorders(width, height) {
        const borderThickness = 20;  

        this.physics.add.staticImage(width / 2, (height * 0.1) - (borderThickness / 2), null)
            .setDisplaySize(width * 0.8, borderThickness)
            .setVisible(false);

        this.physics.add.staticImage(width / 2, (height * 0.9) + (borderThickness / 2), null)
            .setDisplaySize(width * 0.8, borderThickness)
            .setVisible(false);

        this.physics.add.staticImage((width * 0.1) - (borderThickness / 2), height / 2, null)
            .setDisplaySize(borderThickness, height * 0.8)
            .setVisible(false);

        this.physics.add.staticImage((width * 0.9) + (borderThickness / 2), height / 2, null)
            .setDisplaySize(borderThickness, height * 0.8)
            .setVisible(false);
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
