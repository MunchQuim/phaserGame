class LeaderScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LeaderScene' });
    }

    preload() {
        this.load.image('background4', './assets/background/background4.png');
    }

    create() {
        this.background4 = this.add.tileSprite(0, 0, config.width, config.height, 'background4').setOrigin(0, 0);
        this.mostrarPuntuaciones();

        let menuButton = this.add.text(10, config.height-20, 'regresar al menu', { font: '24px Arial', fill: '#fff' }).setOrigin(0,0.5).setInteractive();
        menuButton.on('pointerdown', () => {
            this.scene.start('MenuScene');  // Cambiar a la escena del juego
        });
        menuButton.on('pointerover', () => {
            menuButton.setStyle({ fill: '#FDA50F'});
        });
        menuButton.on('pointerout', () => {
            menuButton.setStyle({ fill: '#fff' });  // Restaurar el color original (blanco)
        });
    }
    update() {
        this.background4.tilePositionY -= 5;
    }

    mostrarPuntuaciones() {
        // Empieza a posicionar las puntuaciones en la pantalla
        let yPosition = 150;
        
        // Iterar sobre los jugadores y mostrar sus nombres y puntuaciones
        myData.forEach(player => {
            this.add.text(config.width / 2, yPosition, `${player.usuario}: ${player.puntuacion}`, {
                font: '28px Arial', fill: '#fff'
            }).setOrigin(0.5, 0.5);
            yPosition += 40; // Mover hacia abajo para el siguiente jugador
        });
    }

}