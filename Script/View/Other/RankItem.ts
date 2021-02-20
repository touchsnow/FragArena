import { _decorator, Component, Node, LabelComponent } from 'cc';
import { BasePlayer } from '../../Game/Player/BasePlayer';
import { Player } from '../../Game/Player/Player';
const { ccclass, property } = _decorator;

@ccclass('RankItem')
export class RankItem extends Component {

    @property(LabelComponent)
    playerName: LabelComponent = null

    @property(LabelComponent)
    killCount: LabelComponent = null

    @property(Node)
    bg: Node = null

    public player: BasePlayer = null

    init(player: BasePlayer) {
        this.player = player
        this.playerName.string = this.player.getName()
        if (this.player instanceof Player) {
            this.bg.active = true
        }
        this.updateRankDisplay()
    }

    updateRankDisplay() {
        if(this.player){
            this.killCount.string = this.player.killCount.toString()
        }
    }

    getKillCount() {
        if(this.player){
            return this.player.killCount
        }
    }

}
