import { _decorator, Component, Node } from 'cc';
import { ContinuousBullet } from './ContinuousBullet';
const { ccclass, property } = _decorator;

@ccclass('PoisonBullet')
export class PoisonBullet extends ContinuousBullet {

    initForContinuous(agrs: any) {
        this.firePoint = agrs[0]
        this.player = agrs[1]
        this.offsetAngle = agrs[2]
        this.attackRange = this.player.weapon.attackRange
        this.startPos = this.firePoint.worldPosition
    }

    takeDamage() {
        let random = Math.random()
        if (random > this.player.weapon.hitRate) return
        super.takeDamage("PoisonDebuff")
    }
}
