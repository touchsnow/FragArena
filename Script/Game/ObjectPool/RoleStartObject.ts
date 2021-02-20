import { _decorator, Component, Node, ParticleSystemComponent, CCInteger } from 'cc';
import { PoolObjLifeCycle } from './PoolObjLifeCycle';
const { ccclass, property } = _decorator;

@ccclass('RoleStartObject')
export class RoleStartObject extends PoolObjLifeCycle {

    @property([ParticleSystemComponent])
    paticleList: ParticleSystemComponent[] = []

    @property(CCInteger)
    lifeTiem: number = 0

    currentLifeTime: number = 0

    update(dt: number) {
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
        for (let particle of this.paticleList) {
            particle.play()
        }
    }

    endLife(callBack?) {
        if (callBack) {
            callBack()
        }
        for (let particle of this.paticleList) {
            particle.stop()
        }
        this.recycle()
    }


}
