import { _decorator, Component, Node } from 'cc';
import { ObjectPoolMgr } from '../Managers/ObjectPoolMgr';
import { SpeedBuffObject } from '../ObjectPool/SpeedBuffObject';
import { BasePlayer } from '../Player/BasePlayer';
import { BaseBuff } from './BaseBuff';
const { ccclass, property } = _decorator;

@ccclass('AddSpeedBuff')
export class AddSpeedBuff extends BaseBuff {

    startBuff(player: BasePlayer, buffName: string) {
        super.startBuff(player, buffName)
        player.hunmanAttr.moveSpeed *= (1 + this.addition)
        let node = ObjectPoolMgr.getInstance().get("SpeedBuff")
        let buff = node.getComponent(SpeedBuffObject)
        buff.lifeTiem = this.continueTime
        buff.followTarger = player.node
        buff.startLife()
    }

    removeBuff() {
        this.player.hunmanAttr.moveSpeed /= (1 + this.addition)
        super.removeBuff()
    }

    debugStartBuff(player: BasePlayer, buffName: string, time: number, addition: number){
        super.debugStartBuff(player, buffName,time,addition)
        player.hunmanAttr.moveSpeed *= (1 + this.addition)
        let node = ObjectPoolMgr.getInstance().get("SpeedBuff")
        let buff = node.getComponent(SpeedBuffObject)
        buff.lifeTiem = time
        buff.followTarger = player.node
        buff.startLife()
    }

}
