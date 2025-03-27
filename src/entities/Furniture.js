class Furniture extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, state = 'dirty') {
        super(scene, x, y, 'furniture');
        this.state = state;
        this.cleaningProgress = 0;
        this.updateTexture();
    }

    updateTexture() {
        this.setTexture(`furniture_${this.state}`);
    }

    startCleaning() {
        // เริ่มนับเวลาทำความสะอาด
        this.scene.time.addEvent({
            delay: 1000, // 1 วินาทีต่อสเตจ
            callback: () => {
                this.cleaningProgress++;
                if (this.cleaningProgress >= this.getRequiredTime()) {
                    this.upgradeState();
                }
            },
            loop: true
        });
    }

    getRequiredTime() {
        // คำนวณเวลาที่ต้องการจากสถานะ
        switch(this.state) {
            case 'dirty': return 2;
            case 'plain': return 1;
            default: return 0;
        }
    }

    upgradeState() {
        // อัพเกรดสถานะเฟอร์นิเจอร์
        if (this.state === 'dirty') {
            this.state = 'plain';
        } else if (this.state === 'plain') {
            this.state = 'clean';
        }
        this.updateTexture();
    }
}