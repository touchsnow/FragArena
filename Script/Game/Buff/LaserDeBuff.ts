import { _decorator, Component, Node, Color } from 'cc';
import { Contants } from '../../Data/Contants';
import { CustomEventListener } from '../../Data/CustomEventListener';
import { BasePlayer } from '../Player/BasePlayer';
import { DeBuff } from './DeBuff';
const { ccclass, property } = _decorator;

@ccclass('LaserDeBuff')
export class LaserDeBuff extends DeBuff {

    private showDamageTime: number = 0.1
    private currentDamageTime: number = 0
    private lastHp: number = 0

    startDeBuff(player: BasePlayer, givePlayer: BasePlayer, buffName: string) {
        super.startDeBuff(player, givePlayer, buffName)
        this.lastHp = player.hunmanAttr.currentHp
    }

    update(dt: number) {
        super.update(dt)

        this.currentDamageTime += dt
        if (this.currentDamageTime >= this.showDamageTime) {
            this.currentDamageTime = 0
            this.showDamage()
        }
    }

    showDamage() {
        if (!this.givePlayer.isAi) {
            let damage = this.lastHp - this.player.hunmanAttr.currentHp
            this.lastHp = this.player.hunmanAttr.currentHp
            if (damage > 0) {
                CustomEventListener.dispatchEvent(Contants.EventName.ShowDamage,
                    this.player.node.getWorldPosition(), new Color(255, 255, 0, 255), damage)
            }
        }
    }


    refresh(givePlayer: BasePlayer) {
        super.refresh(givePlayer)
        this.currentTime = 0
    }


}
