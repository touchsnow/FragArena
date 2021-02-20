import { _decorator, Component, Node, CCInteger, sys } from 'cc';
import { Contants } from '../../Data/Contants';
import { SignRewardItem } from './SignRewardItem';
const { ccclass, property } = _decorator;

@ccclass('SignRewardItemSpecial')
export class SignRewardItemSpecial extends SignRewardItem {


    @property(CCInteger)
    secendCaseValue: number = -1

    @property(Node)
    secendAbleNode: Node = null

    @property(Node)
    firstRecieve: Node = null

    init() {
        super.init()
        if (this.isSecendRecieve()) {
            this.secendAbleNode.active = true
            this.firstRecieve.active = false
        }
    }

    setAbleRecieve() {
        super.setAbleRecieve()
        if (this.isSecendRecieve()) {
            this.secendAbleNode.active = true
            this.firstRecieve.active = false
        }
    }

    // setHadRecieve() {
    //     super.setHadRecieve()
    // }

    isSecendRecieve() {
        let data = sys.localStorage.getItem(this.node.name + "secend" + Contants.gameVer)
        if (data) {
            let value = JSON.parse(data);
            return typeof value == 'undefined' || value == null ? false : value;
        }
        return false
    }

    setIsSecendRecieve(){
        let data = JSON.stringify(true)
        sys.localStorage.setItem(this.node.name + "secend" + Contants.gameVer, data)
    }

    getCaseValue() {
        if (this.isSecendRecieve()) {
            return this.secendCaseValue
        } else {
            return this.caseValue
        }
    }

}
