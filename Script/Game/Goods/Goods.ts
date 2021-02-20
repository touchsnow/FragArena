import { _decorator, Component, Node, CCInteger, tween, Vec3 } from 'cc';
import { PlayerMgr } from '../Managers/PlayerMgr';
import { BasePlayer } from '../Player/BasePlayer';
const { ccclass, property } = _decorator;

@ccclass('Goods')
export class Goods extends Component {

    @property(CCInteger)
    refreshTiem: number = 0

    @property(Node)
    modelNode: Node = null

    private playerMgr: PlayerMgr = null

    private inCD: boolean = false

    private currentCD: number = 0

    init(playerMgr: PlayerMgr) {
        this.playerMgr = playerMgr
        tween(this.node)
            .delay(0.2)
            .call(() => {
                this.getPlayer()
            })
            .union()
            .repeatForever()
            .start()
    }

    update(dt: number) {
        if (this.inCD) {
            this.currentCD += dt
            if (this.currentCD > this.refreshTiem) {
                this.refresh()
            }
        }
    }

    giveReward(player: BasePlayer) {
        this.inCD = true
        this.modelNode.active = false
    }

    getPlayer() {
        if (this.playerMgr && !this.inCD) {
            let players = this.playerMgr.getAllPlayers()
            for (let player of players) {
                let dis = Vec3.distance(this.node.worldPosition, player.node.worldPosition)
                if (dis < 1.5) {
                    this.giveReward(player)
                }
            }
        }
    }

    refresh() {
        this.modelNode.active = true
        this.inCD = false
        this.currentCD = 0
    }

}
