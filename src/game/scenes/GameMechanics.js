import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameMechanics extends Scene {
    constructor() {
        super('GameMechanics');
    }

    init(data) {
        this.courtData = data.courtData;
    }

    create() {
        const canvasWidth = this.scale.width;
        const canvasHeight = this.scale.height;
        const courtScale = canvasHeight * 0.8;

        this.court = this.physics.add.staticImage(canvasWidth / 2, canvasHeight / 2, this.courtData.texture)
            .setDisplaySize(courtScale, courtScale / 2);

        const banditX = canvasWidth * 0.2;
        const stripeX = canvasWidth * 0.8;
        const playerY = canvasHeight * 0.5;
        
        this.bandit = this.physics.add.sprite(banditX, playerY, 'bandit').setScale(0.5);
        this.stripe = this.physics.add.sprite(stripeX, playerY, 'stripe').setScale(0.5);
        this.ball = this.physics.add.sprite(canvasWidth / 2, playerY, 'ball').setScale(0.2);

        this.createCourtBorders(canvasWidth, canvasHeight);

        EventBus.emit('current-scene-ready', this);
    }

    createCourtBorders(width, height) {
        const borderThickness = 20;

        this.physics.add.staticImage(width / 2, (height * 0.1) - (borderThickness / 2), null)
            .setDisplaySize(width * 0.8, borderThickness)
            .setVisible(true);

        this.physics.add.staticImage(width / 2, (height * 0.9) + (borderThickness / 2), null)
            .setDisplaySize(width * 0.8, borderThickness)
            .setVisible(true);

        this.physics.add.staticImage((width * 0.1) - (borderThickness / 2), height / 2, null)
            .setDisplaySize(borderThickness, height * 0.8)
            .setVisible(true);

        this.physics.add.staticImage((width * 0.9) + (borderThickness / 2), height / 2, null)
            .setDisplaySize(borderThickness, height * 0.8)
            .setVisible(true);
    }

    update() {
        // Handle player movement and other game mechanics here
    }

    changeScene() {
        this.scene.start('MainMenu');
    }
}
