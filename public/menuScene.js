class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('background4', './assets/background/background4.png');
    }

    create() {
        myData = cargarDatos().then(data => {
            myData = data; 
        });
        this.background4 = this.add.tileSprite(0, 0, config.width, config.height, 'background4').setOrigin(0, 0);
    
        // Título del juego
        this.add.text(config.width/2, 200, '¡The legend of Phaser!', { font: '32px Arial', fill: '#fff' }).setOrigin(0.5,0.5);

        // Botónes
        const startButton = this.add.text(config.width/2, 300, 'Insert Coin', { font: '24px Arial', fill: '#fff' }).setOrigin(0.5,0.5).setInteractive();
        startButton.on('pointerover', () => {
            startButton.setStyle({ fill: '#FDA50F'});
        });
        startButton.on('pointerout', () => {
            startButton.setStyle({ fill: '#fff' });
        });
        const leaderButton = this.add.text(config.width/2, 350, 'Leaderboard', { font: '24px Arial', fill: '#fff' }).setOrigin(0.5,0.5).setInteractive();
        leaderButton.on('pointerover', () => {
            leaderButton.setStyle({ fill: '#FDA50F'});
        });
        leaderButton.on('pointerout', () => {
            leaderButton.setStyle({ fill: '#fff' });
        });

        // Acción al hacer clic en el botón
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');  // Cambiar a la escena del juego
        });
        leaderButton.on('pointerdown', () => {
            this.scene.start('LeaderScene');
        });


    }
    update(){
        this.background4.tilePositionY -= 5;
    }
}
