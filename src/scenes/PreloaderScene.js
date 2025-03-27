class PreloaderScene extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    preload() {
        // โหลดสไปรท์ชีท
        this.load.spritesheet('player', 'assets/spritesheets/IceElemental.png', 
            {
                frameWidth: 32,   // ความกว้างจริงของแต่ละเฟรม
                frameHeight: 32,  // ความสูงจริงของแต่ละเฟรม
                margin: 0,        // ระยะขอบระหว่างเฟรม
                spacing: 0        // ระยะห่างระหว่างเฟรม 
            }
        );
         // โหลดภาพพื้นหลัง
        this.load.image('bg', 'assets/images/background.png');

        // โหลดเสียง
        //this.load.audio('clean_sfx', 'assets/audio/clean.wav');
    }

    create() {
        this.scene.start('MainGame');
    }
}