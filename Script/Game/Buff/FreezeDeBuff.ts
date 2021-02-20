import { _decorator, Component, Node, Vec3, Color, AudioSourceComponent } from 'cc';
import { Contants } from '../../Data/Contants';
import { CustomEventListener } from '../../Data/CustomEventListener';
import { ConfigMgr } from '../Managers/ConfigMgr';
import { BasePlayer } from '../Player/BasePlayer';
import { DeBuff } from './DeBuff';
const { ccclass, property } = _decorator;

@ccclass('FreezeDeBuff')
export class FreezeDeBuff extends DeBuff {

    private fireTime: number = 1
    private currentFireTime = 0

    currentDownRate = 0
    cuurentDownSpeed = 0

    maxDecelerate: number = 0
    minDecelerate: number = 0

    maxShotSpeed: number = 0
    minShotSpeed: number = 0

    private showDamageTime: number = 0.1
    private currentDamageTime: number = 0
    private lastHp: number = 0

    startDeBuff(player: BasePlayer, givePlayer: BasePlayer, buffName: string) {
        super.startDeBuff(player, givePlayer, buffName)
        let buffConfig = ConfigMgr.getInstance().getBuffConfig().json
        this.maxDecelerate = buffConfig[buffName].maxDecelerate
        this.minDecelerate = buffConfig[buffName].minDecelerate
        this.maxShotSpeed = buffConfig[buffName].maxShotSpeed
        this.minShotSpeed = buffConfig[buffName].minShotSpeed
        this.lastHp = player.hunmanAttr.currentHp
    }

    update(dt: number) {
        super.update(dt)
        this.currentFireTime += dt
        if (this.currentFireTime >= this.fireTime) {
            this.currentFireTime = 0
            if (this.player.node) {
                let dis = Vec3.distance(this.player.node.worldPosition, this.givePlayer.node.worldPosition)
                let attackRange = this.givePlayer.weapon.attackRange
                let realDis = dis / attackRange
                if (realDis > 1) realDis = 1
                let rate = -this.minDecelerate * realDis + this.maxDecelerate
                this.player.hunmanAttr.moveSpeedAddition += this.currentDownRate
                this.player.hunmanAttr.moveSpeedAddition -= rate
                this.currentDownRate = rate

                let speedRate = -this.minShotSpeed * realDis + this.maxShotSpeed
                this.player.hunmanAttr.attackSpeedAddition += this.cuurentDownSpeed
                this.player.hunmanAttr.attackSpeedAddition -= speedRate
                this.cuurentDownSpeed = speedRate
                // console.log(realDis)
                // console.log(this.player.hunmanAttr.moveSpeedAddition)
                // console.log(this.player.hunmanAttr.attackSpeedAddition)
            }
        }
        this.currentDamageTime += dt
        if (this.currentDamageTime >= this.showDamageTime) {
            this.currentDamageTime = 0
            this.showDamage()
        }
    }

    removeBuff() {
        this.player.hunmanAttr.moveSpeedAddition += this.currentDownRate
        this.player.hunmanAttr.attackSpeedAddition += this.cuurentDownSpeed
        super.removeBuff()
    }

    showDamage() {
        if (!this.givePlayer.isAi) {
            let damage = this.lastHp - this.player.hunmanAttr.currentHp
            this.lastHp = this.player.hunmanAttr.currentHp
            if (damage > 0) {
                CustomEventListener.dispatchEvent(Contants.EventName.ShowDamage,
                    this.player.node.getWorldPosition(), new Color(0, 0, 255, 255), damage)
            }
        }
    }

    refresh(givePlayer: BasePlayer) {
        super.refresh(givePlayer)
        this.currentTime = 0
    }

}
