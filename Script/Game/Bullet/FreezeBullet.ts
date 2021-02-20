// Learn TypeScript:
import { _decorator, Component, Node } from 'cc';
import { Bullet } from './Bullet';
import { ContinuousBullet } from './ContinuousBullet';
const { ccclass, property } = _decorator;

@ccclass('FreezeBullet')
export class FreezeBullet extends ContinuousBullet {

    initForContinuous(agrs:any) {
        this.firePoint = agrs[0]
        this.player = agrs[1]
        this.offsetAngle = agrs[2]
        this.attackRange = this.player.weapon.attackRange

        this.startPos = this.firePoint.worldPosition
        //this.attackFreq = 0.05
    }

    takeDamage() {
        let random = Math.random()
        if (random > this.player.weapon.hitRate) return
        super.takeDamage("FreezeDeBuff")
    }

}
