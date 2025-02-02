const config = {
    type: Phaser.AUTO,
    width: 480,
    height: 600,
    backgroundColor: '#FFC0CB',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    scene: [MenuScene, GameScene, NameScene, LeaderScene]



}

new Phaser.Game(config);

let enemies;
let proyectiles;
let player;
let scoreMultiplier = 1;
let score = 0;
let myData = cargarDatos().then(data => {
    myData = data; 
});

async function cargarDatos() {
    let url = "https://square-hookworm-sweeping.ngrok-free.app/apiJuegos.php";
    // Realizar la solicitud GET
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en la solicitud GET:", error);
        return [];
    }
}


