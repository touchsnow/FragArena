import { _decorator, Component, Node, tween, Vec3, CCInteger, easing } from 'cc';
import { PoolObjLifeCycle } from './PoolObjLifeCycle';
const { ccclass, property } = _decorator;

@ccclass('MachineLineObject')
export class MachineLineObject extends PoolObjLifeCycle {

    @property(Vec3)
    originalScale: Vec3 = null

    @property(CCInteger)
    moveSpeed: number = 0

    startLife(callBack?) {
        if (callBack) {
            callBack()
        }
        this.node.active = true
        tween(this.node)
            .call(() => {
                this.node.setWorldScale(this.originalScale)
            })
            .to(1, { worldScale: new Vec3(0, 0, 0) }, { easing: "circInOut" })
            .call(() => {
                this.endLife()
            })
            .start()
    }

    update() {
        let pos = this.node.forward.clone().multiplyScalar(this.moveSpeed).add(new Vec3(0, -0.003, 0))
        this.node.setWorldPosition(this.node.worldPosition.clone().add(pos))
    }

    endLife() {
        this.recycle()
    }

}
