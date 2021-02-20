import { _decorator, Component, Node, Color } from 'cc';
import { Contants } from '../../Data/Contants';
import { CustomEventListener } from '../../Data/CustomEventListener';
import { BasePlayer } from '../Player/BasePlayer';
import { DeBuff } from './DeBuff';
const { ccclass, property } = _decorator;

@ccclass('FireAttackDeBuff')
export class FireAttackDeBuff extends DeBuff {

    private fireTime: number = 1
    private currentFireTime = 0

    private showDamageTime: number = 0.1
    private currentDamageTime: number = 0
    private lastHp: number = 0

    startDeBuff(player: BasePlayer, givePlayer: BasePlayer, buffName: string) {
        super.startDeBuff(player, givePlayer, buffName)
        this.lastHp = player.hunmanAttr.currentHp
    }

    update(dt: number) {
        super.update(dt)
        this.currentFireTime += dt
        if (this.currentFireTime >= this.fireTime) {
            this.currentFireTime = 0
            let result = this.player.attacked(10)
            if (result[0]) {
                this.givePlayer.addKillCount(this.player.getKilledExp())
                this.givePlayer.addRewardMoney(this.player.getLevel())
                CustomEventListener.dispatchEvent(Contants.EventName.startKillReport,
                    this.givePlayer.getName(),this.player.getName())
            }
        }
        this.currentDamageTime += dt
        if (this.currentDamageTime >= this.showDamageTime) {
            this.currentDamageTime = 0
            this.showDamage()
        }
    }

    removeBuff() {
        super.removeBuff()
    }

    showDamage() {
        if (!this.givePlayer.isAi) {
            let damage = this.lastHp - this.player.hunmanAttr.currentHp
            this.lastHp = this.player.hunmanAttr.currentHp
            if (damage > 0) {
                CustomEventListener.dispatchEvent(Contants.EventName.ShowDamage,
                    this.player.node.getWorldPosition(), new Color(255, 0, 0, 255), damage)
            }
        }
    }

    refresh(givePlayer: BasePlayer) {
        super.refresh(givePlayer)
        this.currentTime = 0
    }

}
