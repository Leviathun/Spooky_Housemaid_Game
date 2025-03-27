class MainGameScene extends Phaser.Scene {
    constructor() {
        super('MainGame');
        this.player = null;
        this.furnitureGroup = null;
        this.isHiding = false;
        this.isCleaning = false;
    }

    create() {
        // ตั้งค่าพื้นหลัง
        this.bg = this.add.image(0, 0, 'bg')
            .setOrigin(0, 0)
            .setDisplaySize(this.scale.width, this.scale.height);

        // Animation
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', {
                start: 0, 
                end: 5,   
                first: true
            }),
            frameRate: 5,
            repeat: -1
        });
    
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', {
                start: 19, 
                end: 27,    
            }),
            frameRate: 10,
            repeat: -1 // เล่นวนไปเรื่อยๆ
        });
    
        this.anims.create({
            key: 'clean',
            frames: this.anims.generateFrameNumbers('player', {
                start: 36, 
                end: 40
            }),
            frameRate: 8,
            repeat: 0 // เล่นครั้งเดียว
        });
    
        this.anims.create({
            key: 'hide',
            frames: this.anims.generateFrameNumbers('player', {
                start: 54, 
                end: 61
            }),
            frameRate: 8,
            showOnStart: true, // แสดงเฟรมแรกอัตโนมัติ
            showOnComplete: false // ไม่รีเซ็ตเฟรมเมื่อจบ
        });

        // อนิเมชันออกจากที่ซ่อน (เล่นย้อนกลับ)
        this.anims.create({
            key: 'unhide',
            frames: this.anims.generateFrameNumbers('player', {
                start: 61,
                end: 54,
                reverse: true // เล่นย้อนเฟรม
            }),
            frameRate: 8
        });

        // สร้างผู้เล่น
        this.player = this.physics.add.sprite(400, 300, 'player')
            .setCollideWorldBounds(true)
            .setScale(8) // ขยาย 8 เท่า
            .setOrigin(0, -1) // ตั้งตำแหน่งที่เริ่มต้น
            .setBounce(0.2) // ความยืดหยุ่นของการกระโดด
            .setSize(28, 30) // ปรับขนาด hitbox ให้ตรงตัวละคร
            .setOffset(2, 1) // ปรับตำแหน่ง hitbox
            .play('idle'); // เริ่มด้วยท่ายืน

        // ตั้งค่า Input
        this.keys = {
            a: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            d: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            e: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
        };

        this.input.on('pointerdown', (pointer) => {
            if (pointer.button === 0 && !this.isHiding) {
                //const furniture = this.getNearestFurniture();
                //if (furniture && this.physics.overlap(this.player, furniture)) {
                    // เริ่มอนิเมชันทำความสะอาด
                    this.isCleaning = true;
                    this.player.play('clean');
                    
                    // เมื่อจบอนิเมชันทำความสะอาด
                    this.player.once('animationcomplete', () => {
                        this.isCleaning = false;
                        this.player.play('idle'); // กลับสู่ท่ายืน
                    });
                    
                    furniture.startCleaning();
                //}
            }
        });
    }

    update() {
        // ระบบเคลื่อนที่ (ทำงานเมื่อไม่ซ่อนตัว)
        if (!this.isHiding && !this.isCleaning) {
            if (this.keys.a.isDown) {
                this.player.play('walk', true).setFlipX(true);
                this.player.setVelocityX(-160);
            } 
            else if (this.keys.d.isDown) {
                this.player.play('walk', true).setFlipX(false);
                this.player.setVelocityX(160);
            } 
            else {
                // ตรวจสอบว่าไม่ซ่อนตัวก่อนเล่น Idle
                if (!this.isHiding && this.player.anims.currentAnim?.key !== 'idle') {
                    this.player.play('idle', true);
                }
                this.player.setVelocityX(0);
            }
        }
    
        // ระบบซ่อนตัว
        if (Phaser.Input.Keyboard.JustDown(this.keys.e)) {
            if (!this.isHiding) {
                this.isHiding = true;
                // ลบอนิเมชันที่กำลังเล่นอยู่
                this.player.anims.remove('idle'); 
                this.player.anims.remove('walk');
                this.player.anims.remove('clean');
                this.player.anims.stop(); 
                
                // เล่นอนิเมชันซ่อนตัว
                this.player.play('hide');
                console.log('Current Animation:', this.player.anims.currentAnim.key); // ต้องเป็น 'hide'
                this.player.once('animationcomplete', (anim) => {
                    console.log('Completed Animation:', anim.key); // ต้องเป็น 'hide'
                    this.isHiding = true;
                    this.player.setFrame(61); // ล็อกเฟรมสุดท้าย
                    this.player.body.enable = false;
                    this.player.anims.stop(); // หยุดอนิเมชันทั้งหมด
                    console.log('Hidden at frame:', this.player.frame.name);
                });
            } else {
                // เล่นอนิเมชันออกจากที่ซ่อน
                this.player.play('unhide');
                this.player.once('animationcomplete', (anim) => {
                    this.isHiding = false;
                    this.player.body.enable = true;
                    this.player.play('idle');
                    console.log('Unhidden');
                });
            }
        }
    }

    /*createFurniture(x, y, state) {
        const furniture = new Furniture(this, x, y, state);
        this.furnitureGroup.add(furniture);
        return furniture;
    }

    startCleaning(pointer) {
        // ตรวจสอบระยะทำความสะอาด
        const furniture = this.getNearestFurniture();
        if (furniture && this.physics.overlap(this.player, furniture)) {
            furniture.startCleaning();
        }
    }

    getNearestFurniture() {
        // ตรวจจับเฟอร์นิเจอร์ที่ใกล้ที่สุด
        let nearest = null;
        let minDistance = Infinity;
        this.furnitureGroup.children.each(furniture => {
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y,
                furniture.x, furniture.y
            );
            if (distance < minDistance) {
                minDistance = distance;
                nearest = furniture;
            }
        });
        return nearest;
    }*/
}