import { Component, OnInit } from '@angular/core';
import Phaser from 'phaser';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  phaserGame: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {
    this.config = {
      type: Phaser.AUTO,
      height: 650,
      width: 450,
      // tslint:disable-next-line: no-use-before-declare
      scene: [ MainScene ],
      parent: 'game-container',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 100 }
        }
      }
    };
  }
  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
    //stop scrolling on space key press
    window.addEventListener('keydown', function(e) {
      // tslint:disable-next-line: deprecation
      if(e.keyCode === 32 && e.target === document.body) {
        e.preventDefault();
      }
    });
  }
}

class MainScene extends Phaser.Scene {
  platforms: Phaser.Physics.Arcade.StaticGroup;
  player: Phaser.Physics.Arcade.Sprite;
  playerOnRightWall = true;
  background: Phaser.GameObjects.Image;

  constructor() {
    super({ key: 'main' });
  }
  create() {
    //add background
    this.background = this.add.image(225, 300, 'background');

    //add side walls
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(920, 325, 'side-wall').setScale(1).refreshBody();
    this.platforms.create(-470, 325, 'side-wall').setScale(1).refreshBody();

    //add player
    this.player = this.physics.add.sprite(350, 600, 'dude');
    this.player.setCollideWorldBounds(true);
    //this.player.setBounce(0.2);

    //set gravity
    this.player.body.gravity.y = -50;
    this.player.body.gravity.x = 300;

    //set collisions
    this.physics.add.collider(this.player, this.platforms);

    //set speed
    this.player.setVelocityY(0);

    //add jump
    this.input.keyboard.on('keyup_SPACE', this.playerJump, this);

    //setup camera
    this.cameras.main.setSize(450, 650);
    const camera = this.cameras.add(0, 0, 450, 650);
    this.cameras.main.startFollow(this.player);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
  }

  preload() {
    this.load.image('background', 'assets/ninja-jumper-background.jpg');
    this.load.image('side-wall', 'assets/ninja-jumper-sidewall.jpg');
  }

  update() {

  }

  playerJump() {
    if (this.playerOnRightWall && !this.player.body.touching.right) {
      return;
    }
    if (!this.playerOnRightWall && !this.player.body.touching.left) {
      return;
    }
    console.log('jump');
    this.player.setVelocityY(-100);
    if (this.playerOnRightWall) {
      this.player.setVelocityX(-350);
      this.player.body.gravity.x = -300;
      this.playerOnRightWall = false;
    } else {
      this.player.setVelocityX(350);
      this.player.body.gravity.x = 300;
      this.playerOnRightWall = true;
    }
  }
}
