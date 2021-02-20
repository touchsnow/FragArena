import { _decorator, Node, Vec3, Vec2 } from 'cc';
import { MathTool } from '../Tool/MathTool';
import { PoolObjLifeCycle } from './PoolObjLifeCycle';
const { ccclass, property } = _decorator;

@ccclass('ShieldBuffObject')
export class ShieldBuffObject extends PoolObjLifeCycle {


    @property([Node])
    shieldList: Node[] = []

    startLife(callBack?) {
        this.node.active = true
    }

    endLife(callBack?) {
        for (let shield of this.shieldList) {
            shield.active = false
        }
        this.recycle()
    }

    getResist(pos: Vec2): boolean {
        let thisPos2 = new Vec2(this.node.worldPosition.x, this.node.worldPosition.z)
        let attackVec = pos.clone().subtract(thisPos2).normalize()
        for (let shield of this.shieldList) {
            if (shield.active) {
                let angle1 = MathTool.getAngleByVector(-attackVec.x, -attackVec.y)
                let angle2 = MathTool.getAngleByVector(-shield.forward.x, -shield.forward.z)
                let resultAngle = Math.abs(angle1 - angle2)
               // console.log(angle1,angle2,resultAngle)
                if (resultAngle < 45) {
                    return true
                }
            }
        }
        return false
    }

    update(dt: number) {
        this.node.setRotationFromEuler(this.node.eulerAngles.x, this.node.eulerAngles.y + 60 * dt, this.node.eulerAngles.z)
    }

    enableShield() {
        for (let shield of this.shieldList) {
            if (shield.active == false) {
                shield.active = true
                break
            }
        }
    }

}
