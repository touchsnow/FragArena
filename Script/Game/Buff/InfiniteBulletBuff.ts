import { _decorator, Component, Node } from 'cc';
import { BasePlayer } from '../Player/BasePlayer';
import { BaseBuff } from './BaseBuff';
const { ccclass, property } = _decorator;

@ccclass('InfiniteBulletBuff')
export class InfiniteBulletBuff extends BaseBuff {

    startBuff(player: BasePlayer,buffName: string) {
        super.startBuff(player,buffName)
    }

    update(dt: number) {
        if (this.player) {
            this.player.weapon.currentEnergy = this.player.weapon.totalEnery
        }
        super.update(dt)
    }

    debugStartBuff(player: BasePlayer, buffName: string, time: number, addition: number){
        super.debugStartBuff(player,buffName,time,addition)
    }

}
