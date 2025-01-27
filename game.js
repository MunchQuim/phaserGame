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
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

new Phaser.Game(config);

let enemies;
let proyectiles;
let player;
let scoreMultiplier = 1;
function preload() {
    //background
    //4 mas lejano
    this.load.image('background4', '/assets/background/background4.png');
    //3 con algo de movimiento
    this.load.image('background3', '/assets/background/background3.png');
    //2 movimiento lento
    this.load.image('background2', '/assets/background/background2.png');
    //1 movimiento
    this.load.image('background1', '/assets/background/background1.png');

    //cargamos el enemigo basico
    this.load.spritesheet('enemy', '/assets/enemigos/enemigo1.png', { frameWidth: 64, frameHeight: 64 });

    //cargamos el proyectil
    this.load.image('proyectil', '/assets/proyectiles/proyectil.png');

    // cargamos el sprite del personaje principal
    this.load.spritesheet('phaser', '/assets/main/CorbetaSprite.png', { frameWidth: 64, frameHeight: 64 }); // personaje principal

    //explosiones
    this.load.spritesheet('explosion1', '/assets/explosion1.png', { frameWidth: 64, frameHeight: 64 });
    this.load.spritesheet('explosion2', '/assets/explosion2.png', { frameWidth: 866 / 6, frameHeight: 288 });
}
function create() {
    this.entidades = {};
    // fisicas del mundo
    this.physics.world.setBounds(0, config.height / 2, config.width, config.height / 2);
    //background
    //4 mas lejano
    this.background4 = this.add.tileSprite(0, 0, config.width, config.height, 'background4').setOrigin(0, 0);
    //3 con algo de movimiento
    this.background3 = this.add.tileSprite(0, 0, config.width, config.height, 'background3').setOrigin(0, 0);
    //2 movimiento lento
    this.background2 = this.add.tileSprite(0, 0, config.width, config.height, 'background2').setOrigin(0, 0);
    //1 movimiento
    this.background1 = this.add.tileSprite(0, 0, config.width, config.height, 'background1').setOrigin(0, 0);



    //creamos el personaje principal
    player = this.physics.add.sprite(config.width / 2, config.height - 64, 'phaser');
    player.canShoot = true;
    player.dps = jugador.dps;
    player.vida = 3;
    player.invencible = false;
    player.score = 0;
    //animaciones de personaje princial
    this.anims.create({
        key: 'phaserFrente',
        frames: [{ key: 'phaser', frame: 0 + 3 * (Math.abs(player.vida - 3)) }]
        // si tengo 3 puntos de vida estoy 0, si tengo 2 puntos de vida estoy en 3, si tengo 1 punto de vida en 6, si tengo 0 puntos de vida en la 9 (que no existe)
    });
    this.anims.create({
        key: 'phaserIzquierda',
        frames: [{ key: 'phaser', frame: 1 + 3 * (Math.abs(player.vida - 3)) }]
        // si tengo 3 puntos de vida estoy 0, si tengo 2 puntos de vida estoy en 3, si tengo 1 punto de vida en 6, si tengo 0 puntos de vida en la 9 (que no existe)
    });
    this.anims.create({
        key: 'phaserDerecha',
        frames: [{ key: 'phaser', frame: 2 + 3 * (Math.abs(player.vida - 3)) }]
        // si tengo 3 puntos de vida estoy 0, si tengo 2 puntos de vida estoy en 3, si tengo 1 punto de vida en 6, si tengo 0 puntos de vida en la 9 (que no existe)
    });

    player.setCollideWorldBounds(true);
    player.body.setSize(24, 48); //ajusto la hitbox
    /* player.body.debugShowBody = true; */
    //proyectiles
    proyectiles = this.physics.add.group();
    // enemigos
    enemies = this.physics.add.group();

    //efectos de explosiones
    this.anims.create({
        key: 'animExplosion1',//nombre de la animacion
        frames: this.anims.generateFrameNumbers('explosion1', { start: '0', end: 3 }),
        frameRate: 3,
        repeat: 0,
    })
    this.anims.create({
        key: 'animExplosion2',//nombre de la animacion
        frames: this.anims.generateFrameNumbers('explosion2', { start: '0', end: 5 }),
        frameRate: 3,
        repeat: 0,
    })
    this.time.addEvent({
        delay: 10000,
        callback: spawnEnemy,
        callbackScope: this,
        loop: true
    });
    this.eventoPuntuacion = this.time.addEvent({
        delay: 1000,
        callback: () => {
            if (player.vida > 0) {
                scorePuntuation();
            } else {
                // Detener el evento si la condición es falsa
                this.eventoPuntuacion.remove();
            }
        },
        callbackScope: this,
        loop: true
    });

    this.physics.add.collider(player, enemies, (player, enemy) => {

        if (!player.invencible) {
            enemy.destroy();

            jugadorDaño(this);
        }
    });
    this.physics.add.overlap(proyectiles, enemies, (proyectil, enemy) => {
        if (proyectil.isFriendly) {
            proyectil.anims.play('animExplosion1', true);
            enemy.anims.play('animExplosion1', true);
            proyectil.body.enable = false;
            enemy.body.enable = false;

            setTimeout(() => {
                proyectil.destroy();
                enemy.destroy();
            }, 500);

            player.score += 50;
        } else {
            this.physics.world.removeCollider(proyectil.body.collider);
        }
    });

    this.physics.add.overlap(player, proyectiles, (player, proyectil) => {

        if (!player.invencible && !proyectil.isFriendly) {
            player.invencible = true;

            // Reproducción de animación y desactivación del proyectil
            proyectil.anims.play('animExplosion1', true);
            proyectil.body.enable = false;
            setTimeout(() => {
                proyectil.destroy();
            }, 500);

            // Si al jugador le queda más de 1 punto de vida
            jugadorDaño(this);
        }
    });

    //cremos las teclas (inputs)
    this.keys = this.input.keyboard.addKeys(
        {
            up: Phaser.Input.Keyboard.KeyCodes.UP,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            a: Phaser.Input.Keyboard.KeyCodes.A,
            w: Phaser.Input.Keyboard.KeyCodes.W,
            s: Phaser.Input.Keyboard.KeyCodes.S,
            d: Phaser.Input.Keyboard.KeyCodes.D,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT,
            hurt: Phaser.Input.Keyboard.KeyCodes.R,

        }
    );
    this.puntuacion = this.add.text(10, 10, 'Puntos: ' + player.score, {
        font: '32px Arial',
        fill: '#ffffff'
    });

}
function update() {

    //movemos el personaje
    actualizarPersonaje(this);

    //movemos el fondo con efecto profundidad
    moverFondo(this, player.y);

    enemies.children.iterate(function (enemy) {
        if (enemy && enemy.updatePattern) {
            enemy.updatePattern();
        }
    });
    proyectiles.children.iterate(function (proyectil) {
        if (proyectil && proyectil.updatePattern) {
            proyectil.updatePattern();
        }
    });

    this.puntuacion.setText('Puntos: ' + player.score);

}
function moverFondo(escena, jugadorY) {

    let altura = ((config.height / 4 - jugadorY) / config.height + 1) * 4;
    scoreMultiplier;
    const mitadAltura = config.height / 2+24;
    const maxY = config.height - 24;
    
    // Calcular el valor de scoreMultiplier
    if (jugadorY <= mitadAltura) {
        // A medida que jugadorY se acerca a mitadAltura, scoreMultiplier se aproxima a 10
        scoreMultiplier = 10 - (mitadAltura - jugadorY) / mitadAltura * 9;
    } else if (jugadorY >= maxY) {
        // Si jugadorY es mayor o igual a maxY, scoreMultiplier es 1
        scoreMultiplier = 1;
    } else {
        // Si jugadorY está entre mitadAltura y maxY, interpolamos linealmente entre 10 y 1
        scoreMultiplier = 10 - ((jugadorY - mitadAltura) / (maxY - mitadAltura)) * 9;
    }
    console.log(scoreMultiplier);
    escena.background4.tilePositionY -= 0.1 * altura;
    escena.background3.tilePositionY -= 0.5 * altura;
    escena.background2.tilePositionY -= 1 * altura;
    escena.background1.tilePositionY -= 5 * altura;
}
function actualizarPersonaje(escena) {
    if (player.vida > 0) {
        let turbo = 1;
        /* const minX = 0, maxX = config.width, minY = config.height/2, maxY = config.height-8; */
        if (escena.keys.shift.isDown) {
            turbo = 2;
        }
        //actualizamos el personaje
        if (escena.keys.up.isDown || escena.keys.w.isDown) {
            player.setVelocityY(-jugador.velocidad * turbo)
        } else if (escena.keys.down.isDown || escena.keys.s.isDown) {
            player.setVelocityY(jugador.velocidad * turbo)
        } else {
            player.setVelocityY(0)
        }/* 
        player.y=Phaser.Math.Clamp(player.y, minY, maxY); */

        if (escena.keys.left.isDown || escena.keys.a.isDown) {
            player.setVelocityX(-jugador.velocidad * turbo);
            player.anims.play('phaserIzquierda', true);
        } else if (escena.keys.right.isDown || escena.keys.d.isDown) {
            player.setVelocityX(jugador.velocidad * turbo);
            player.anims.play('phaserDerecha', true);
        } else {
            player.setVelocityX(0);
            player.anims.play('phaserFrente', true);
        }

        if (escena.keys.space.isDown) {
            if (player.canShoot) {
                player.canShoot = false;
                disparo(escena, true, player.x, player.y);
                setTimeout(() => {
                    player.canShoot = true;

                }, 1000 / player.dps);
            }
        }
        /*         if (escena.keys.hurt.isDown && !player.invencible) {
                    jugadorDaño(escena);
                } */
    }

}
function disparo(escena, isFriend, x, y) {
    let disparo;
    if (isFriend) {
        disparo = new ownPlasma(escena, x, y);
    } else {
        disparo = new enemyPlasma(escena, x, y);
    }

    proyectiles.add(disparo);

}
function scorePuntuation() {

    player.score += Math.floor(2 * scoreMultiplier);
}
function spawnEnemy() {
    if (player.vida > 0) {
        let cantidad = Phaser.Math.Between(1, Math.min(Math.floor(player.score / 100) + 2, 10));
        const randomPattern = Phaser.Math.Between(1, 2); // Selecciona un patrón aleatorio
        let enemy;


        for (let index = 0; index < cantidad; index++) {

            const x = Phaser.Math.Between(32, config.width - 32); // Posición aleatoria en X
            const y = -64; // Aparecen en la parte superior de la pantalla
            setTimeout(() => {
                switch (randomPattern) {
                    case 1:
                        enemy = new ZigZagEnemy(this, x, y);
                        break;
                    case 2:
                        enemy = new StraightEnemy(this, x, y);
                        break;

                }

                enemies.add(enemy); // Añadir el enemigo al grupo
            }, 1000 * index);

        }
    }


}
async function checkSalida(elemento) {
    if (elemento.y > config.height + 100 || elemento.y < -100 || elemento.x < -100 || elemento.x > config.width + 100) {
        elemento.destroy();
    }
}

//jugador sufre daño
function jugadorDaño(escena) {
    player.invencible = true;

    // Si al jugador le queda más de 1 punto de vida
    if (player.vida - 1 > 0) {
        player.vida--;

        // Desactivar colisiones del jugador
        player.body.checkCollision.none = true;

        // Iniciar parpadeo
        const parpadeo = setInterval(() => {
            player.setVisible(!player.visible);
        }, 300);

        // Reactivar colisiones y detener parpadeo después de 2.1 segundos
        setTimeout(() => {
            clearInterval(parpadeo);
            player.invencible = false;
            player.setVisible(true);
            player.body.checkCollision.none = false; // Reactivar colisiones
        }, 2100);
    } else {
        // Si el jugador no tiene vidas restantes
        player.vida--;
        player.body.checkCollision.none = true;
        player.anims.play('animExplosion1', true);
        player.on('animationcomplete', () => {
            player.destroy();
            setTimeout(() => {
                gameOver(escena);
            }, 500);

        })
        // Desactivar colisiones y eliminar al jugador
        // Desactivar colisiones para evitar conflictos

    }

}


//////////////////////////
// Clases de enemigos
//////////////////////////

// Patrón: Zig-Zag
class ZigZagEnemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = 200;
        this.direction = 1; // 1 para derecha, -1 para izquierda
        this.setScale(0.75);

        this.fireCooldown = 1500;
        this.lastFired = 0;
    }

    async updatePattern() {
        this.setVelocityX(this.speed * this.direction);
        this.setVelocityY(this.speed / 2);
        if ((this.x <= 32 && this.direction == -1) || (this.x >= config.width - 32 && this.direction == 1)) {
            this.direction *= -1; // Cambiar de dirección si llega a los bordes
        }
        console.log(this.scene.time.now > this.lastFired + this.fireCooldown);
        if (this.scene.time.now > this.lastFired + this.fireCooldown) {
            this.lastFired = this.scene.time.now; // Actualizar el tiempo

            disparo(this.scene, false, this.x, this.y);
        }
        checkSalida(this);
    }
}

// Patrón: Movimiento recto
class StraightEnemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'enemy');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = 200;
        this.setScale(0.75);

        this.fireCooldown = 1500;
        this.lastFired = 0;
    }

    async updatePattern() {
        // Este enemigo solo se mueve hacia abajo
        this.setVelocityY(this.speed / 2);
        if (this.scene.time.now > this.lastFired + this.fireCooldown) {
            this.lastFired = this.scene.time.now; // Actualizar el tiempo
            disparo(this.scene, false, this.x, this.y);
        }
        checkSalida(this);
    }
}

//////////////////////////
// Clases de proyectiles
//////////////////////////
class ownPlasma extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'proyectil');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = -300;
        this.setScale(0.75);
        this.setFlipY(-1);
        this.body.setSize(24, 24, false);
        this.body.setOffset(20, 5);
        this.isFriendly = true;

    }

    async updatePattern() {
        this.setVelocityY(this.speed);
        checkSalida(this);
    }
}
class enemyPlasma extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'proyectil');
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = 400;
        this.setScale(0.75);
        this.body.setSize(24, 24, false);
        this.body.setOffset(20, 30);
        this.isFriendly = false;

    }

    async updatePattern() {
        this.setVelocityY(this.speed);
        checkSalida(this);
    }
}
function gameOver(escena) {
    escena.add.text(config.width / 2, config.height / 2, 'Game Over', {
        font: '32px Arial',
        fill: '#ffffff'

    }).setOrigin(0.5, 0.5);
}