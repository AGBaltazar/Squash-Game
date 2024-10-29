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
        this.physics.world.setBoundsCollision(true, true, true, false);

        const canvasWidth = this.scale.width;
        const canvasHeight = this.scale.height;

        this.court = this.physics.add.staticImage(canvasWidth / 2, canvasHeight / 2, this.courtData.texture)
            .setDisplaySize(window.innerWidth, window.innerHeight);

        const banditX = canvasWidth * 0.2;
        const stripeX = canvasWidth * 0.8;
        const playerY = canvasHeight * 0.5;
        
        this.bandit = this.physics.add.sprite(banditX, playerY, 'bandit').setScale(0.5).setCollideWorldBounds(true).setImmovable(true);
        this.stripe = this.physics.add.sprite(stripeX, playerY, 'stripe').setScale(0.5).setCollideWorldBounds(true);

        this.ball = this.physics.add.group({key: 'ball', frame: 3, frameQuantity: 1, bounceX: 1, bounceY: 1, collideWorldBounds:true, velocityX: 100, velocityY: 100});

        this.physics.add.collider(this.ball, this.bandit)

        EventBus.emit('current-scene-ready', this);
    }

    update() {
        let cursors = this.input.keyboard.createCursorKeys();

        this.bandit.setVelocity(0)

        if (cursors.left.isDown) {
            this.bandit.setVelocityX(-200);
            this.bandit.anims.play('left', true);
        } 
        else if (cursors.right.isDown) {
            this.bandit.setVelocityX(200);
            this.bandit.anims.play('right', true);
        } 
        
        if (cursors.up.isDown ) {
            this.bandit.setVelocityY(-200);
            this.bandit.anims.play('up', true)
        } 
        else if (cursors.down.isDown ) {
            this.bandit.setVelocityY(200); 
            this.bandit.anims.play('down', true);
        }

        //if(cursors.space.isDown ){}

        //If the ball goes out of bounds, then reset the match
        if(this.ball.y > 100){
            this.scoredReset();
        }
    }

    scoredReset(){
        this.ball.setVelocity(0);
        this.ball.setPosition(this.bandit.x, 500);
        console.log('score')
    }

    changeScene() {

        this.scene.start('MainMenu');
    }
}
