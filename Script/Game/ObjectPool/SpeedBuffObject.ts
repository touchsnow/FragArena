import { _decorator, Component, Node, CCInteger, ParticleSystemComponent, Vec3, CurveRange } from 'cc';
import { PoolObjLifeCycle } from './PoolObjLifeCycle';
const { ccclass, property } = _decorator;

@ccclass('SpeedBuffObject')
export class SpeedBuffObject extends PoolObjLifeCycle {

    @property(CCInteger)
    lifeTiem: number = 0

    @property(ParticleSystemComponent)
    particle: ParticleSystemComponent = null

    currentLifeTime: number = 0

    public followTarger: Node = null

    update(dt: number) {
        if (this.followTarger && this.followTarger.worldPosition) {
            let pos = this.followTarger.getWorldPosition()
            pos.y += 0.5
            this.node.setWorldPosition(pos)
            this.node.setWorldRotation(this.followTarger.worldRotation)
            let eulers = new Vec3()
            this.node.getRotation().getEulerAngles(eulers)
            this.particle.startRotationY.constant = eulers.y
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
