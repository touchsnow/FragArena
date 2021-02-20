import { _decorator, Component, Node, LabelOutlineComponent } from 'cc';
import { ContinuousBullet } from '../Bullet/ContinuousBullet';
import { IWeapon } from './IWeapon';
const { ccclass, property } = _decorator;

@ccclass('ContinuousGun')
export class ContinuousGun extends IWeapon {

    protected bullet: ContinuousBullet = null
    protected backBullet: ContinuousBullet = null
    protected rightFrontBullet: ContinuousBullet = null
    protected leftFrontBullet: ContinuousBullet = null
    protected bulletList: ContinuousBullet[] = []
    protected onDamageTime: number = 0

    update(dt: number) {
        if (!this.bullet) return
        if (this.attackState) {
            let remainEnergy = this.currentEnergy - this.consume
            if (this.bullet.onFire) {
                this.onDamageTime += dt
                if (this.onDamageTime > this.player.getDamageInterval()) {
                    this.onDamageTime = 0
                    this.currentEnergy -= this.consume
                }
            }
            if (remainEnergy > 10) {
                for(let bullet of this.bulletList){
                    bullet.attack()
                }
            }
            if (remainEnergy < 0) {
                for(let bullet of this.bulletList){
                    bullet.stopAttack()
                }
            }
        }
        //能量恢复
        if (this.attackState) {
            this.currentEnergy += this.energyRecoverySpeed * dt
        } else {
            this.currentEnergy += this.energyRecoverySpeed * dt * 3
        }
        if (this.currentEnergy >= this.totalEnery) this.currentEnergy = this.totalEnery
    }

    stopAttack() {
        super.stopAttack()
        for (let bullet of this.bulletList) {
           // console.log(bullet)
            if (bullet) {
                bullet.stopAttack()
            }
        }
    }

    disboard() {
        for (let bullet of this.bulletList) {
            if (bullet) {
                bullet.node.destroy()
            }
            bullet = null
        }

    }

}
