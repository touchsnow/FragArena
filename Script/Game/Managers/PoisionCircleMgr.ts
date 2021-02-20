import { _decorator, Component, Node, tween, Tween, Vec3, Vec2 } from 'cc';
import { PoisionCircleDeBuff } from '../Buff/PoisionCircleDeBuff';
import { GameMgr } from './GameMgr';
const { ccclass, property } = _decorator;

@ccclass('PoisionCircleMgr')
export class PoisionCircleMgr extends Component {

    @property(Node)
    circleNode: Node = null

    @property(Node)
    edgeNode: Node = null

    private gameMgr: GameMgr = null
    private totalTime: number = 0
    private currentTime: number = 0

    private tween: Tween<Node> = null

    init(time: number, gameMgr: GameMgr) {
        this.totalTime = time
        this.gameMgr = gameMgr
        this.tween = tween(this.node)
            .delay(0.5)
            .call(() => {
                this.enableDamage()
            })
            .union()
            .repeatForever()
            .start()
    }

    update(dt: number) {
        this.currentTime += dt
        if (this.currentTime >= this.totalTime) {
            this.tween.stop()
            return
        }
        let scale = 1 - this.currentTime / this.totalTime
        if (scale < 0.2) {
            scale = 0.2
        }
        this.circleNode.setScale(scale, 1, scale)
    }

    enableDamage() {
        let allPlayer = this.gameMgr.playerMgr.getAllPlayers()
        let adgePos = this.edgeNode.worldPosition
        let edgeDis = Vec2.distance(new Vec2(adgePos.x, adgePos.z), new Vec2(0, 0))
        for (let player of allPlayer) {
            if (!player.hunmanAttr.isDead) {
                let playerPos = player.node.worldPosition
                let playerDis = Vec2.distance(new Vec2(playerPos.x, playerPos.z), new Vec2(0, 0))
                if (playerDis > edgeDis) {
                    let poisionCircleBuff = player.getComponent(PoisionCircleDeBuff)
                    if (poisionCircleBuff) {
                        poisionCircleBuff.refresh()
                    } else {
                        player.addComponent(PoisionCircleDeBuff).init(0.5, player)
                    }
                }
            }
        }
    }

}
