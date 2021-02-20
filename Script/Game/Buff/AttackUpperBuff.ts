import { _decorator, Component, Node } from 'cc';
import { ObjectPoolMgr } from '../Managers/ObjectPoolMgr';
import { AttackUpperBuffObject } from '../ObjectPool/AttackUpperBuffObject';
import { BasePlayer } from '../Player/BasePlayer';
import { BaseBuff } from './BaseBuff';
const { ccclass, property } = _decorator;

@ccclass('AttackUpperBuff')
export class AttackUpperBuff extends BaseBuff {

    startBuff(player: BasePlayer,buffName: string) {
        super.startBuff(player,buffName)
        this.player.hunmanAttr.damageAddition += this.addition
        let node = ObjectPoolMgr.getInstance().get("AttackUpper")
        let buff = node.getComponent(AttackUpperBuffObject)
        buff.lifeTiem = this.continueTime
        buff.followTarger = player.node
        buff.startLife()
    }

    removeBuff() {
        this.player.hunmanAttr.damageAddition -= this.addition
        super.removeBuff()
    }

    debugStartBuff(player: BasePlayer, buffName: string, time: number, addition: number){
        super.debugStartBuff(player,buffName,time,addition)
        this.player.hunmanAttr.damageAddition += this.addition
        let node = ObjectPoolMgr.getInstance().get("AttackUpper")
        let buff = node.getComponent(AttackUpperBuffObject)
        buff.lifeTiem = time
        buff.followTarger = player.node
        buff.startLife()
    }

}
