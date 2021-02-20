import { _decorator, Component, Node } from 'cc';
import { ConfigMgr } from '../Managers/ConfigMgr';
import { BasePlayer } from '../Player/BasePlayer';
const { ccclass } = _decorator;

@ccclass('BaseBuff')
export class BaseBuff extends Component {

    player: BasePlayer = null

    protected continueTime: number = 0
    protected currentTime: number = 0
    protected addition: number = 0

    startBuff(player: BasePlayer, buffName: string) {
        this.player = player
        let buffConfig = ConfigMgr.getInstance().getBuffConfig().json
        this.continueTime = buffConfig[buffName].time
        this.addition = buffConfig[buffName].addition
    }

    update(dt: number) {
        this.currentTime += dt
        if (this.currentTime > this.continueTime) {
            this.removeBuff()
        }
    }

    removeBuff() {
        this.node.removeComponent(this)
    }

    debugStartBuff(player: BasePlayer, buffName: string, time: number, addition: number) {
        this.player = player
        let buffConfig = ConfigMgr.getInstance().getBuffConfig().json
        this.continueTime = time
        this.addition = addition
    }

}
