import { _decorator, Component, Node, random } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AIDifficilty')
export class AIDifficilty {

    private attackState: boolean = true

    private attackTime: number = 0
    private currentAttackTime: number = 0

    private stopTime: number = 0
    private currentStopTime: number = 0

    private delayTime: number = 0
    private currentDelayTime: number = 0

    update(dt: number) {
        this.currentDelayTime += dt
        if (this.currentDelayTime > this.delayTime) {
            if (this.attackState) {
                this.currentAttackTime += dt
                if (this.currentAttackTime > this.attackTime) {
                    this.swtichState()
                }
            } else {
                this.currentStopTime += dt
                if (this.currentStopTime > this.stopTime) {
                    this.swtichState()
                }
            }
        }
    }

    init(level: number) {
        let stopTime = (5 - level)
        stopTime = stopTime <= 0 ? 0 : stopTime
        console.log(stopTime)
        this.stopTime = stopTime
        this.attackTime = 5 - stopTime
        console.log(this.stopTime, this.attackTime)
        this.delayTime = random() * 10
    }

    swtichState() {
        this.attackState = !this.attackState
        this.currentAttackTime = 0
        this.currentStopTime = 0
    }

    getAIAttackState() {
        return this.attackState
    }

}
