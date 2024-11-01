import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameMechanics extends Scene {
    constructor() {
        super('GameMechanics');
    }

    init(data) {
        this.courtData = data.courtData;
    }

    preload() {
        this.load.image('ball', 'assets/Ball.png');
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

        this.ball = this.physics.add.image(400, 500, 'ball').setCollideWorldBounds(true).setBounce(1);
        this.ball.setData('onBandit', true);

        this.physics.add.collider(this.ball, this.bandit);

        EventBus.emit('current-scene-ready', this);

        this.isSwinging = false; 
    }

    update() {
        let cursors = this.input.keyboard.createCursorKeys();
        this.bandit.setVelocity(0);

        if (cursors.left.isDown) {
            this.bandit.setVelocityX(-200);
            this.bandit.anims.play('left', true);
        } else if (cursors.right.isDown) {
            this.bandit.setVelocityX(200);
            this.bandit.anims.play('right', true);
        }

        if (cursors.up.isDown) {
            this.bandit.setVelocityY(-200);
            this.bandit.anims.play('up', true);
        } else if (cursors.down.isDown) {
            this.bandit.setVelocityY(200);
            this.bandit.anims.play('down', true);
        }

        if (cursors.space.isDown && !this.isSwinging) {
            this.bandit.anims.play('swing', true);
            this.isSwinging = true;

        } else if (cursors.space.isUp) {
            this.isSwinging = false;
        }

        if (this.ball.y > this.scale.height) {
            this.scoredReset();
        }
    }

    hitBall(ball, bandit) {
        let difference = ball.x - bandit.x;
        
        if (difference < 0) {
            ball.setVelocityX(200);
            ball.setVelocityY(-100); 
        } else if (difference > 0) {
            ball.setVelocityX(-200);
            ball.setVelocityY(-100);
        } else {
            ball.setVelocityY(-200);
        }
        
        console.log('Hit registered');
    }

    scoredReset() {
        this.ball.setVelocity(0);
        this.ball.setPosition(this.bandit.x, 500);
        this.bandit.setPosition(this.bandit.x, 500)
        this.ball.setData('onBandit', true);
        console.log('Score reset');
    }

    changeScene() {
        this.scene.start('MainMenu');
    }
}
