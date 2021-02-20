import { _decorator, Component, Node } from 'cc';
import { ObjectPoolMgr } from '../Managers/ObjectPoolMgr';
import { HealthBuffObject } from '../ObjectPool/HealthBuffObject';
import { BasePlayer } from '../Player/BasePlayer';
import { BaseBuff } from './BaseBuff';
const { ccclass, property } = _decorator;

@ccclass('HealthBuff')
export class HealthBuff extends BaseBuff {

    startBuff(player: BasePlayer,buffName: string) {
        super.startBuff(player,buffName)
        let node = ObjectPoolMgr.getInstance().get("HealthBuff")
        let buff = node.getComponent(HealthBuffObject)
        buff.lifeTiem = this.continueTime
        buff.followTarger = player.node
        buff.startLife()
    }

    update(dt: number) {
        this.player.hunmanAttr.currentHp += this.player.hunmanAttr.maxHp * this.addition * dt
        if (this.player.hunmanAttr.currentHp > this.player.hunmanAttr.maxHp) {
            this.player.hunmanAttr.currentHp = this.player.hunmanAttr.maxHp
        }
        super.update(dt)
    }

    removeBuff() {
        super.removeBuff()
    }

    debugStartBuff(player: BasePlayer, buffName: string, time: number, addition: number){
        super.debugStartBuff(player,buffName,time,addition)
        let node = ObjectPoolMgr.getInstance().get("HealthBuff")
        let buff = node.getComponent(HealthBuffObject)
        buff.lifeTiem = time
        buff.followTarger = player.node
        buff.startLife()
    }

}
