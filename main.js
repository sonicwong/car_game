import "./style.css";
import Phaser from "phaser";

const stageSize = {
  width: 1920,
  height: 1080,
};

const moveSpeed = 500;

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");

    this.gamePlayerLine = 1;
    this.gamePlayerLineY = [300, 420, 540];
    this.gameCarLine = 1;
    this.gameCarLineY = [450, 570, 690];
    
    this.gamePlayer;
    this.gameCar;
  }

  preload() {
    this.load.image("bg", "imgs2/bg.png");

    //game
    this.load.image("gamePlayer", "imgs2/game_player.png");
    this.load.image("gameCar", "imgs2/game_car.png");
    this.load.image("gameBtnUp", "imgs2/game_btn_up.png");
    this.load.image("gameBtnDown", "imgs2/game_btn_down.png");
  }

  create() {
    this.add.image(0,0,"bg").setOrigin(0,0);

    this.debugTxt = this.add.text(100, 10, "player line: ", {
      fontSize: "50px",
      fontFamily: "Arial",
      align: 'left',
      color: '#000000'
    });

    this.gamePlayer = this.physics.add.image(250, 420, "gamePlayer")
      .setOrigin(0,0);
    this.gamePlayer.body.allowGravity = false;
    this.gamePlayer
      .setImmovable(true)
      .setCollideWorldBounds(true)
      .setSize(this.gamePlayer.width - 70, this.gamePlayer.height)
      .setOffset(20, 0);

    this.gameCar = this.physics.add
      .image(1300, 570, "gameCar")
      .setOrigin(0,0)
      .setMaxVelocity(moveSpeed, 0);
    this.gameCar
      .setY(this.newCarLine());

    this.gameBtnUp = this.add.image(120,810,"gameBtnUp").setOrigin(0,0).setInteractive({ cursor: 'pointer' });
    this.gameBtnUp.on('pointerdown', () => {
      this.updateGamePlayerPosition(-1);
    });
    this.gameBtnUp.setDepth(1);
    this.gameBtnDown = this.add.image(1620,810,"gameBtnDown").setOrigin(0,0).setInteractive({ cursor: 'pointer' });
    this.gameBtnDown.on('pointerdown', () => {
      this.updateGamePlayerPosition(1);
    });
    this.gameBtnDown.setDepth(1);
  }

  update() {
    if(this.gameCar.x <= -this.gameCar.width){
      this.gameCar.setX(stageSize.width);
      this.gameCar.setY(this.newCarLine());
    }
  }

  updateGamePlayerPosition(adj) {
    if(adj == -1 && this.gamePlayerLine > 0) this.gamePlayerLine --;
    if(adj == 1 && this.gamePlayerLine < 2) this.gamePlayerLine ++;
    this.adjustDepth();
    this.gamePlayer.y = this.gamePlayerLineY[this.gamePlayerLine];
  }

  newCarLine() {
    this.gameCarLine = Math.floor(Math.random() * 3);
    this.adjustDepth();
    return this.gameCarLineY[this.gameCarLine];
  }

  adjustDepth(){
    this.debugTxt.setText(`Player line: ${this.gamePlayerLine}, Car line: ${this.gameCarLine}`)
    this.gameCar.setDepth(this.carLine);
    this.gamePlayer.setDepth(this.playerLine);
  }
}

const config = {
  type: Phaser.WEBGL,
  width: stageSize.width,
  height: stageSize.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: -moveSpeed },
      debug: true,
    },
  },
  scene: [GameScene],
  scale: {
    mode: Phaser.Scale.FIT
  }
};

const game = new Phaser.Game(config);
