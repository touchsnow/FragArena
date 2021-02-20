import { _decorator, Component, Node } from 'cc';
import BaseStorge from '../../../Framework3D/Src/Base/BaseStorge';
import { Contants } from '../../Data/Contants';
const { ccclass, property } = _decorator;

@ccclass('SignMgr')
export class SignMgr extends BaseStorge {

    private static signMgr: SignMgr
    public static getInstance(): SignMgr {
        if (this.signMgr == null) {
            this.signMgr = new SignMgr()
        }
        return SignMgr.signMgr
    }


    private gameVer: number = 0
    private accrueSign: number = 0
    private continuousSign: number = 0

    private firstData: string = ""
    private firstContinusSign: string = ""

    /**在loading调用 */
    init() {
        //@ts-ignore
        let storgeItem = this.get(this.__proto__.constructor.name);
        if (storgeItem) {
            //@ts-ignore
            Object.assign(this, storgeItem);
            if (this.gameVer !== Contants.gameVer) {
                //@ts-ignore
                this.remove(this.__proto__.constructor.name)
                this.initData()
                //@ts-ignore
                this.set(this.__proto__.constructor.name, this);
            }
        } else {
            //@ts-ignore
            this.set(this.__proto__.constructor.name, this);
        }

        let todayDay = new Date()
        let lastDay = new Date()
        lastDay.setDate(lastDay.getDate() - 1)

        let todayDayString = "2021/1/20" // todayDay.toLocaleDateString();
        let signResult = this.get(todayDayString, false)
        if (!signResult) {
            this.accrueSign += 1
            this.set(todayDayString, true)
        }

        let lastDayString = "2021/1/19" // lastDay.toLocaleDateString()
        let lastSignResult = this.get(lastDayString, false)
        if (lastSignResult) {
            this.continuousSign += 1
        } else {
            this.continuousSign = 1
            this.firstContinusSign = todayDayString
        }
        this.update()
        console.log(this)
    }

    initData() {
        this.gameVer = Contants.gameVer
        this.accrueSign = 1
        this.continuousSign = 1
        this.firstData = new Date().toLocaleDateString()
    }

    /**获取累计签到数 */
    getAccrueSign() {
        return this.accrueSign
    }

    /**获取第一天登陆签到日 */
    getFirstSignDate() {
        return this.firstData
    }

    /**获取不中断的签到数 */
    getContinuousSign() {

    }

    /**获取不中断的签到的第一天 */
    getContinuousFirstDate() {

    }

}
