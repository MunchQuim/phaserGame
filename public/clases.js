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
        this.setVelocityY(this.speed / 2 + (this.speed / 9) * scoreMultiplier - 1);
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
        this.setVelocityY(this.speed / 2 + (this.speed / 9) * scoreMultiplier - 1);
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
        this.setVelocityY(this.speed + (this.speed / 19) * scoreMultiplier - 1);
        checkSalida(this);
    }
}