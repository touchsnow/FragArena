import { _decorator, Component, Node } from 'cc';
import { BasePlayer } from '../Player/BasePlayer';
import { DeBuff } from './DeBuff';
const { ccclass, property } = _decorator;

@ccclass('PoisionCircleDeBuff')
export class PoisionCircleDeBuff extends DeBuff {

    private frameTime: number = 0

    init(continueTime: number, player: BasePlayer) {
        this.continueTime = continueTime
        this.player = player
    }

    update(dt: number) {
        super.update(dt)
        this.frameTime += 1
        let damage = 5 * (1 + 0.01) * (this.frameTime - 1) / 60
        this.player.attacked(damage)
        if (this.player.hunmanAttr.isDead) {
            this.removeBuff()
        }
    }
}
