class NameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'NameScene' });
    }
    nick = "";
    nickOutput = "___";
    canSave = false;
    preload() {
        this.load.image('background4', './assets/background/background4.png');
    }

    create() {
        this.background4 = this.add.tileSprite(0, 0, config.width, config.height, 'background4').setOrigin(0, 0);

        this.add.text(config.width / 2, 100, "Puntuacion: " + score, { font: '32px Arial', fill: '#fff' }).setOrigin(0.5, 0.5);
        this.add.text(config.width / 2, 200, '¡Inserte su nick!', { font: '32px Arial', fill: '#fff' }).setOrigin(0.5, 0.5);
        let nickText = this.add.text(config.width / 2, 300, this.nickOutput, { font: '32px Arial', fill: '#fff' }).setOrigin(0.5, 0.5);

        this.OkButton = this.add.text(config.width / 2, 400, 'Pulse Enter', { font: '24px Arial', fill: '#fff' }).setOrigin(0.5, 0.5).setVisible(this.canSave);

        this.input.keyboard.on('keydown', (event) => {

            let key = event.key.toUpperCase();
            if (this.canSave && event.key === "Enter") {
                this.guardarDatos();
            }


            // Si es una letra o número y aún hay espacio en el nick
            if (/^[A-Z0-9]$/.test(key) && this.nick.length < 3) {
                this.nick += key;
            }
            // Si presiona Backspace, borrar última letra
            else if (event.key === "Backspace" && this.nick.length > 0) {
                this.nick = this.nick.slice(0, -1);
            }
            this.nickOutput = this.nick;
            if (this.nick.length < 3) {
                for (let index = 3; index > this.nick.length; index--) {
                    this.nickOutput = this.nickOutput + "_"
                }
            }
            // Actualizar el texto mostrado en pantalla
            nickText.setText(this.nickOutput);
        });

    }
    update() {
        this.background4.tilePositionY -= 5;
        this.canSave = (this.nick.length == 3);
        this.OkButton.setVisible(this.canSave);

    }
    guardarDatos() {
        let url = "https://square-hookworm-sweeping.ngrok-free.app/apiJuegos.php";
        let data = new URLSearchParams();
        data.append("player", this.nick);
        data.append("score", score);

        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: data.toString()
        })
            .then(response => response.json())
            .then(async (result) => {
                if (result.success) {
                    /* console.log("Puntuación guardada con éxito."); */
                    const data = await cargarDatos();
                    myData = data;
                    this.scene.start('LeaderScene');
                } else {
                    console.error("Error al guardar puntuación:", result.error);
                }
            })
            .catch(error => console.error("Error en la petición:", error));
    }

}