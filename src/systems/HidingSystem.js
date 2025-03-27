export class HidingSystem {
    static toggleHiding(player, isHiding) {
        player.body.enable = !isHiding;
        player.setVisible(!isHiding);
    }
}