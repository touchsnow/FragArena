import { _decorator, Component, Node, SpriteComponent, LabelComponent, CameraComponent, Director, director, lerp } from 'cc';
import { BasePlayer } from '../../Game/Player/BasePlayer';
const { ccclass, property } = _decorator;

@ccclass('PlayerInfo')
export class PlayerInfo extends Component {

    @property(SpriteComponent)
    hpBar: SpriteComponent = null

    @property(SpriteComponent)
    mpBar: SpriteComponent = null

    @property(SpriteComponent)
    laterHpBar: SpriteComponent = null

    @property(LabelComponent)
    playerName: LabelComponent = null

    player: BasePlayer = null

    mainCamera: CameraComponent = null

    private offsetY: number = 0

    start() {
        this.offsetY = 230
    }

    init(player: BasePlayer) {
        this.player = player
        this.playerName.string = this.player.getName()
        this.updateDiaplay()
    }

    updateDiaplay() {
        if (this.player) {
            this.hpBar.fillRange = this.player.getHpPercent()
            this.mpBar.fillRange = this.player.weapon.currentEnergy / this.player.weapon.totalEnery
        }
    }

    update() {
        let pos = this.mainCamera.convertToUINode(this.player.node.worldPosition, this.node.parent)
        pos.y += this.offsetY
        this.node.setPosition(pos)
        this.laterHpBar.fillRange = lerp(this.laterHpBar.fillRange, this.hpBar.fillRange, 0.05)
    }

}
