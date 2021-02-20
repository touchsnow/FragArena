import { _decorator, Component, Node, CCInteger } from 'cc';
import { PoolObjLifeCycle } from './PoolObjLifeCycle';
const { ccclass, property } = _decorator;

@ccclass('HealthBuffObject')
export class HealthBuffObject extends PoolObjLifeCycle {

    @property(CCInteger)
    lifeTiem: number = 0

    currentLifeTime: number = 0

    public followTarger: Node = null

    update(dt: number) {
        if (this.followTarger) {
            let pos = this.followTarger.getWorldPosition()
            pos.y += 0.5
            this.node.setWorldPosition(pos)
        }
        this.currentLifeTime += dt
        if (this.currentLifeTime > this.lifeTiem) {
            this.endLife()
        }
    }

    startLife(callBack?) {
        this.currentLifeTime = 0
        this.node.active = true
        if (callBack) {
            callBack()
        }
    }

    endLife(callBack?) {
        if (callBack) {
            callBack()
        }
        this.followTarger = null
        this.recycle()
    }
    
}
