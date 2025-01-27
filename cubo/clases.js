
class Proyectil {
    imagen;
    velocidad;
    maxDist;
    constructor(imagen, velocidad, maxDist) {
        this.imagen = imagen;
        this.velocidad = velocidad;
        this.maxDist = maxDist;
    }
}

class MainPersonaje {
    vida;
    velocidad;
    spritesheet;
    tamañoSprite;
    aps;
    nombre;
    canShot;

    constructor() {
        this.vida = 6;
        this.velocidad = 300;
        this.spritesheet = 'assets/roboto64-sprite.png';
        this.tamañoSprite = 64;
        this.aps = 1;
        this.nombre = 'roboto';
        this.canShot = true;
    }
    preload(scene) {
        scene.load.spritesheet(this.nombre,
            this.spritesheet,
            { frameWidth: this.tamañoSprite, frameHeight: this.tamañoSprite }
        );
    }
    create(scene) {
        scene.playerBody = scene.physics.add.sprite(100, 450, this.nombre);
        scene.playerHead = scene.add.sprite(100, 450, this.nombre);

        scene.playerBody.setBounce(0.2);
        scene.playerBody.setCollideWorldBounds(true);

        scene.anims.create({
            key: 'pbleft',
            frames: scene.anims.generateFrameNumbers(this.nombre, { start: 6, end: 7 }),
            frameRate: 3,
            repeat: -1
        });
        scene.anims.create({
            key: 'pbright',
            frames: scene.anims.generateFrameNumbers(this.nombre, { start: 6, end: 7 }),
            frameRate: 3,
            repeat: -1
        });
        scene.anims.create({
            key: 'pbup',
            frames: scene.anims.generateFrameNumbers(this.nombre, { start: 4, end: 5 }),
            frameRate: 3,
            repeat: -1
        });
        scene.anims.create({
            key: 'pbdown',
            frames: scene.anims.generateFrameNumbers(this.nombre, { start: 4, end: 5 }),
            frameRate: 3,
            repeat: -1
        });
        scene.anims.create({
            key: 'pbturn',
            frames: scene.anims.generateFrameNumbers(this.nombre, { start: 4, end: 4 }),
            frameRate: 3,
            repeat: -1
        });

        scene.anims.create({
            key: 'phleft',
            frames: scene.anims.generateFrameNumbers(this.nombre, { start: 1, end: 1 }),
            frameRate: 3,
            repeat: -1
        });
        scene.anims.create({
            key: 'phright',
            frames: scene.anims.generateFrameNumbers(this.nombre, { start: 2, end: 2 }),
            frameRate: 3,
            repeat: -1
        });
        scene.anims.create({
            key: 'phup',
            frames: scene.anims.generateFrameNumbers(this.nombre, { start: 3, end: 3 }),
            frameRate: 3,
            repeat: -1
        });
        scene.anims.create({
            key: 'phdown',
            frames: scene.anims.generateFrameNumbers(this.nombre, { start: 0, end: 0 }),
            frameRate: 3,
            repeat: -1
        });
        scene.anims.create({
            key: 'phturn',
            frames: scene.anims.generateFrameNumbers(this.nombre, { start: 0, end: 0 }),
            frameRate: 3,
            repeat: -1
        });
        scene.playerBody.anims.play('pbturn', true);
        scene.playerHead.anims.play('phturn', true);
    }
    update(scene, cursors) {
        this.movement(scene, cursors);
        if (cursors.space.isDown && this.canShot) {
            this.shot(scene);
        }

    }
    movement(scene, cursors) {
        scene.playerHead.x = scene.playerBody.x;
        scene.playerHead.y = scene.playerBody.y;
        /* console.log(scene); */
        if (cursors.left.isDown) {
            scene.playerBody.setVelocityX(-this.velocidad);
        } else if (cursors.right.isDown) {
            scene.playerBody.setVelocityX(this.velocidad);
        } else {
            scene.playerBody.setVelocityX(0);
        }

        if (cursors.up.isDown) {
            scene.playerBody.setVelocityY(-this.velocidad);
        } else if (cursors.down.isDown) {
            scene.playerBody.setVelocityY(this.velocidad);
        } else {
            scene.playerBody.setVelocityY(0);
        }

        if (scene.playerBody.body.velocity.y < 0) {
            scene.playerBody.anims.play('pbup', true);
            scene.playerHead.anims.play('phup', true);
        } else if (scene.playerBody.body.velocity.y > 0) {
            scene.playerBody.anims.play('pbdown', true);
            scene.playerHead.anims.play('phdown', true);
        } else if (scene.playerBody.body.velocity.x < 0) {
            scene.playerBody.anims.play('pbleft', true);
            scene.playerHead.anims.play('phleft', true);
        }
        else if (scene.playerBody.body.velocity.x > 0) {
            scene.playerBody.anims.play('pbright', true);
            scene.playerHead.anims.play('phright', true);
        }
    }
    shot(scene) {
        this.canShot = false;
        setTimeout(() => {
            this.canShot = true;
            console.log('Ahora se puede disparar');
        }, this.aps * 1000);
    }

}

class Enemigo1 {
    vida;
    velocidad;
    spritesheet;
    tamañoSprite;
    aps;
    nombre;
    canShot;

    constructor() {
        this.vida = 2;
        this.velocidad = 30;
        this.spritesheet = 'assets/robotoEnemy1.png';
        this.tamañoSprite = 64;
        this.aps = 1;
        this.nombre = 'enemy1';
        this.canAttack = true;
    }
    preload(scene) {
        scene.load.spritesheet(this.nombre,
            this.spritesheet,
            { frameWidth: this.tamañoSprite, frameHeight: this.tamañoSprite }
        );
    }
    create(scene) {
        let x = 150;
        let y = 150;
        scene.enemy = scene.physics.add.sprite(x, y, this.nombre);

        scene.enemy.setBounce(0.2);
        scene.enemy.setCollideWorldBounds(true);

        scene.anims.create({
            key: 'e1_idle',
            frames: scene.anims.generateFrameNumbers(this.nombre, { start: 0, end: 7 }),
            frameRate: 3,
            repeat: -1
        });
        scene.anims.create({
            key: 'e1_charging',
            frames: scene.anims.generateFrameNumbers(this.nombre, { start: 9, end: 14 }),
            frameRate: 3,
            repeat: 0
        });
        scene.anims.create({
            key: 'e1_attack',
            frames: scene.anims.generateFrameNumbers(this.nombre, { start: 15, end: 21 }),
            frameRate: 3,
            repeat: 0
        });

        scene.enemy.anims.play('e1_idle', true);
    }
    update(scene) {
        this.movement(scene);

    }
    movement(scene) {
        let vecX = scene.playerBody.x - scene.enemy.x;
        let vecY = scene.playerBody.y - scene.enemy.y;

        if(vecX >= 0){
            scene.enemy.flipX = false;
        }
        else{
            scene.enemy.flipX = true;
        }
        let distancia = Math.sqrt(Math.pow(vecX, 2) + Math.pow(vecY, 2));

        if (distancia !== 0) {
            // Normalizar el vector dirección para que la magnitud sea 1
            let directionX = vecX / distancia;
            let directionY = vecY / distancia;

            // Multiplicar por la velocidad deseada para obtener las componentes de la velocidad
            let velocityX = directionX * this.velocidad;
            let velocityY = directionY * this.velocidad;
            scene.enemy.setVelocityX(velocityX);
            scene.enemy.setVelocityY(velocityY);
        }
    }


}
