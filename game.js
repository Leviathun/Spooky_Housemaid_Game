const config = {
    type: Phaser.AUTO,
    parent: 'game-container', // ใส่ ID ของ container ใน HTML
    scale: {
        mode: Phaser.Scale.RESIZE, // ปรับขนาดอัตโนมัติตามหน้าจอ
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: '100%', // ใช้ % แทนค่าตายตัว
        height: '100%'
    },
    scene: [BootScene, PreloaderScene, MainGameScene],
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 0 } }
    }
};

const game = new Phaser.Game(config);