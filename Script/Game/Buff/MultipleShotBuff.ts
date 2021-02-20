// Learn TypeScript:
import { _decorator } from 'cc';
import { BaseBuff } from './BaseBuff';
const { ccclass, property } = _decorator;

@ccclass('MultipleShotBuff')
export class MultipleShotBuff extends BaseBuff {

    private shotCount: number = 0

    addShotCount() {
        this.shotCount += 1
        if (this.shotCount > 2) {
            this.shotCount = 2
        }
    }

    getShotConnt() {
        return this.shotCount
    }

}
