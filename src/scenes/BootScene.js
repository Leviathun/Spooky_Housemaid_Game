class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        // โหลดโลโก้สำหรับหน้าโหลดทรัพยากร
        this.load.image('logo', 'assets/images/logo.png');
    }

    create() {
        this.scene.start('Preloader');
    }
}