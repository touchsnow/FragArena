import IMatrix from "./IMatrix";
import { _decorator, Vec2, v2 } from "cc";

const { ccclass, property } = _decorator;

/**
 *@description: 
 *@author: BenFei 不全连iL不改名
 *@date: 2020-07-08 21:58:49
 *尊重游戏创意，拒绝抄袭游戏
*/
@ccclass
export default class IMatrixTool {

    static testPlaceMatrix(m1: IMatrix<number>, m2: IMatrix<number>, m2Pos: Vec2 = v2(0, 0)): boolean {
        if (m2Pos.x < 0 || m2Pos.y < 0) return false;
        if (m2.width + m2Pos.x > m1.width) return false;
        if (m2.height + m2Pos.y > m1.height) return false;
        for (let x = 0; x < m2.width; x++) {
            for (let y = 0; y < m2.height; y++) {
                if (m2.get(x, y) > 0 && m1.get(x + m2Pos.x, y + m2Pos.y) > 0) {
                    return false;
                }
            }
        }
        return true;
    }

    static addMatrixFrom(m1: IMatrix<number>, m2: IMatrix<number>, m2Pos: Vec2 = v2(0, 0)) {
        for (let x = 0; x < m2.width; x++) {
            for (let y = 0; y < m2.height; y++) {
                if (this.valueIn(x + m2Pos.x, 0, m1.width - 1) && this.valueIn(y + m2Pos.y, 0, m1.height - 1)) {
                    m1.set(x + m2Pos.x, y + m2Pos.y, m1.get(x + m2Pos.x, y + m2Pos.y) + m2.get(x, y));
                }
            }
        }
    }

    static orMatrixFrom(m1: IMatrix<number>, m2: IMatrix<number>, m2Pos: Vec2 = v2(0, 0)) {
        for (let x = 0; x < m2.width; x++) {
            for (let y = 0; y < m2.height; y++) {
                if (this.valueIn(x + m2Pos.x, 0, m1.width - 1) && this.valueIn(y + m2Pos.y, 0, m1.height - 1)) {
                    m1.set(x + m2Pos.x, y + m2Pos.y, m1.get(x + m2Pos.x, y + m2Pos.y) | m2.get(x, y));
                }
            }
        }
    }

    static fillBigger(m1: IMatrix<number>, m2: IMatrix<number>, m2Pos: Vec2 = v2(0, 0)) {
        let tx = 0, ty = 0, m2Value = 0;
        for (let x = 0; x < m2.width; x++) {
            for (let y = 0; y < m2.height; y++) {
                tx = x + m2Pos.x;
                ty = y + m2Pos.y;
                if (this.valueIn(tx, 0, m1.width - 1) && this.valueIn(ty, 0, m1.height - 1)) {
                    m2Value = m2.get(x, y);
                    if (m1.get(tx, ty) < m2Value) {
                        m1.set(tx, ty, m2Value);
                    }
                }
            }
        }
    }

    static clearSubMatrix(m1: IMatrix<number>, m2: IMatrix<number>, m2Pos: Vec2, clearValue: number) {
        let tx = 0, ty = 0;
        for (let x = 0; x < m2.width; x++) {
            for (let y = 0; y < m2.height; y++) {
                tx = x + m2Pos.x;
                ty = y + m2Pos.y;
                if ((m2.get(x, y) != clearValue) && this.valueIn(tx, 0, m1.width - 1) && this.valueIn(ty, 0, m1.height - 1)) {
                    m1.set(tx, ty, clearValue);
                }
            }
        }
    }

    /**
     * 
     * @param value 
     * @param minV not include
     * @param maxV not include
     */
    private static valueBetween(value: number, minV: number, maxV: number) {
        return value > minV && value < maxV;
    }

    /**
     * 
     * @param value 
     * @param minV include
     * @param maxV include
     */
    private static valueIn(value: number, minV: number, maxV: number) {
        return value >= minV && value <= maxV;
    }

}
