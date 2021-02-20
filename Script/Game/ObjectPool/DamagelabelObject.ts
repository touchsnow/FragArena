import { _decorator, Component, Node, tween, LabelComponent, random } from 'cc';
import { ObjectPoolMgr } from '../Managers/ObjectPoolMgr';
import { PoolObjLifeCycle } from './PoolObjLifeCycle';
const { ccclass, property } = _decorator;

@ccclass('DamagelabelObject')
export class DamagelabelObject extends PoolObjLifeCycle {

    @property(LabelComponent)
    label: LabelComponent = null


    startLife(callback?) {
        if (callback) {
            callback()
        }
        let pos = this.node.getPosition()
        let sympol = random() - 0.5
        if (sympol > 0) {
            sympol = 1
        } else {
            sympol = -1
        }
        pos.x += sympol * (random() * 30)
        pos.y += 100 + random() * 50

        tween(this.node)
            .to(0.5, { position: pos },{easing:"circOut"})
            .call(() => {
                this.endLife()
            })
            .start()
    }

    endLife(callback?) {
        if (callback) {
            callback()
        }
        this.recycle()
    }

    recycle() {
        ObjectPoolMgr.getInstance().putUIObj(this.node)
    }

}
