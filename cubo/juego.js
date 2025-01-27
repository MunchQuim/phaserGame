//https://phaser.io/tutorials/making-your-first-phaser-3-game-spanish/part2
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },  
            debug: false  // Opcional, para ver los límites de colisiones en pantalla
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
let player = new MainPersonaje();
let enemigo = new Enemigo1();
let cursors;
var platforms;
var game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    
    player.preload(this);
    enemigo.preload(this);
    
/*     this.load.spritesheet('roboto',
        'assets/roboto64-sprite.png',
        { frameWidth: 64, frameHeight: 64 }
    ); */
}


function create() {
    this.add.image(400, 300, 'sky');
    player.create(this);
    enemigo.create(this);
    this.physics.add.collider(this.playerBody, this.enemy, handleCollision, null, this);
    cursors = this.input.keyboard.createCursorKeys();
}

function update() {
    player.update(this,cursors);
    enemigo.update(this);
}

function handleCollision(player, enemy) {
    // Aquí puedes definir lo que sucede cuando los objetos colisionan
    console.log('¡Colisión detectada!');
    player.setBounce(200);  // Hace que el jugador rebote al colisionar
    enemy.setBounce(200);   // Hace que el enemigo rebote también
    
}
