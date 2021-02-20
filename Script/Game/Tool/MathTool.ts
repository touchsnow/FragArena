import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MathTool')
export class MathTool extends Component {

    public static getAngleByVector(lenx: number, leny: number) {
        if (leny === 0) {
            if (lenx < 0) {
                return 270
            }
            else if (lenx > 0) {
                return 90
            }

        }
        if (lenx === 0) {
            if (leny >= 0) {
                return 0
            }
            else if (leny < 0) {
                return 180
            }
        }

        let tanyx = Math.abs(leny) / Math.abs(lenx)
        let angle = 0
        if (leny > 0 && lenx < 0) {
            angle = 270 + Math.atan(tanyx) * 180 / Math.PI
        }
        else if (leny > 0 && lenx > 0) {
            angle = 90 - Math.atan(tanyx) * 180 / Math.PI
        }
        else if (leny < 0 && lenx < 0) {
            angle = 270 - Math.atan(tanyx) * 180 / Math.PI
        }
        else if (leny < 0 && lenx > 0) {
            angle = 90 + Math.atan(tanyx) * 180 / Math.PI
        }
        return angle
    }

    /**
     * 
     * @param originalVec 要旋转的向量
     * @param angle 要旋转的角度
     * @param rotateAxis 要旋转的轴 0-x,1-y,2-z
     */
    public static getRotateVec(originalVec: Vec3, angle: number, rotateAxis: number) {
        if (rotateAxis == 0) {
            let offsetY = originalVec.y * Math.cos(angle * Math.PI / 180) - originalVec.z * Math.sin(angle * Math.PI / 180)
            let offsetZ = originalVec.z * Math.cos(angle * Math.PI / 180) + originalVec.y * Math.sin(angle * Math.PI / 180)
            let result = new Vec3(originalVec.x, offsetY, offsetZ)
            return result
        }
        if (rotateAxis == 1) {
            let offsetX = originalVec.x * Math.cos(angle * Math.PI / 180) - originalVec.z * Math.sin(angle * Math.PI / 180)
            let offsetZ = originalVec.z * Math.cos(angle * Math.PI / 180) + originalVec.x * Math.sin(angle * Math.PI / 180)
            let result = new Vec3(offsetX, originalVec.y, offsetZ)
            return result
        }
        if (rotateAxis == 2) {
            let offsetX = originalVec.x * Math.cos(angle * Math.PI / 180) - originalVec.y * Math.sin(angle * Math.PI / 180)
            let offsetY = originalVec.y * Math.cos(angle * Math.PI / 180) + originalVec.x * Math.sin(angle * Math.PI / 180)
            let result = new Vec3(offsetX, offsetY, originalVec.z)
            return result
        }
    }

}
