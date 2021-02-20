import { _decorator, Node, sys, find } from 'cc';
import BaseDialog from '../../../Framework3D/Src/Base/BaseDialog';
import { Contants } from '../../Data/Contants';
import { AdManager } from '../../Game/Managers/AdManager';
import { StorgeMgr } from '../../Game/Managers/StorgeMgr';
import { SignRewardItem } from '../Other/SignRewardItem';
import { SignRewardItemSpecial } from '../Other/SignRewardItemSpecial';
import { MainUI } from '../UI/MainUI';
const { ccclass, property } = _decorator;

@ccclass('SignRewardDialog')
export class SignRewardDialog extends BaseDialog {

    @property([SignRewardItem])
    signRewardItemList: SignRewardItem[] = []

    @property(Node)
    recieveButton: Node = null

    @property(Node)
    doubleRecieveButton: Node = null

    @property(Node)
    hadRecieveNode: Node = null

    @property(Node)
    closeButton: Node = null

    private closeCallBack = null

    start() {
        super.start()
        this.recieveButton.on(Node.EventType.TOUCH_END, this.onRecieveButton, this)
        this.doubleRecieveButton.on(Node.EventType.TOUCH_END, this.onDoubleRecieveButton, this)
        this.closeButton.on(Node.EventType.TOUCH_END, this.onCloseButton, this)
        this.initItem()
        if (this.getRecieveState()) {
            this.hadRecieveNode.active = true
            this.recieveButton.active = false
            this.doubleRecieveButton.active = false
        } else {
            this.hadRecieveNode.active = false
            this.recieveButton.active = true
            this.doubleRecieveButton.active = true
        }
        if (!this.getRecieveState() && this.needStartNewCricle()) {
            for (let item of this.signRewardItemList) {
                item.setAbleRecieve()
            }
        }
    }

    initData(data) {
        super.initData(data)
        this.closeCallBack = this._data.closeCallBack
    }

    initItem() {
        for (let item of this.signRewardItemList) {
            item.init()
        }
    }

    onRecieveButton() {
        for (let item of this.signRewardItemList) {
            let recieved = item.getRecievedState()
            if (!recieved) {
                let caseValue = item.getCaseValue()
                item.setHadRecieve()
                this.enabledReward(caseValue, 1)
                break
            }
        }
        this.setRecieveState(true)
        this.hadRecieveNode.active = true
        this.recieveButton.active = false
        this.doubleRecieveButton.active = false
    }

    onDoubleRecieveButton() {
        var callback = function () {
            for (let item of this.signRewardItemList) {
                let recieved = item.getRecievedState()
                if (!recieved) {
                    let caseValue = item.getCaseValue()
                    item.setHadRecieve()
                    this.enabledReward(caseValue, 2)
                    break
                }
            }
            this.setRecieveState(true)
            this.hadRecieveNode.active = true
            this.recieveButton.active = false
            this.doubleRecieveButton.active = false
        }.bind(this)
        AdManager.getInstance().showVideo(callback)
    }

    enabledReward(caseValue: number, addition: number) {
        switch (caseValue) {
            case -1:
                console.log("默认值")
                break;
            case 1:
                find("Canvas").getComponent(MainUI).addMoneyAnim(10,100*addition)
                break;
            case 2:
                StorgeMgr.getInstance().ownedSkin.push("Mr.Jump")
                StorgeMgr.getInstance().update()
                break;
            case 3:
                find("Canvas").getComponent(MainUI).addEnergy(20/2,2*addition)
                break;
            case 4:
                find("Canvas").getComponent(MainUI).addMoneyAnim(20,100*addition)
                break;
            case 5:
                find("Canvas").getComponent(MainUI).addMoneyAnim(30,100*addition)
                break;
            case 6:
                find("Canvas").getComponent(MainUI).addEnergy(50/2,2*addition)
                break;
            case 7:
                StorgeMgr.getInstance().ownedSkin.push("Osterhase")
                find("Canvas").getComponent(MainUI).addEnergy(50/2,2*addition)
                find("Canvas").getComponent(MainUI).addMoneyAnim(15,200*addition)
                break;
            case 7:
                find("Canvas").getComponent(MainUI).addEnergy(50/2,2*addition)
                find("Canvas").getComponent(MainUI).addMoneyAnim(20,200*addition)
                StorgeMgr.getInstance().update()
                break;
            default:
                break;
        }
    }

    getRecieveState() {
        let key = new Date().toLocaleDateString() + "SignReward" + Contants.gameVer
        let data = sys.localStorage.getItem(key)
        if (data) {
            let value = JSON.parse(data);
            return typeof value == 'undefined' || value == null ? false : value;
        }
        return false
    }

    setRecieveState(state: boolean) {
        let key = new Date().toLocaleDateString() + "SignReward" + Contants.gameVer
        let data = JSON.stringify(state)
        sys.localStorage.setItem(key, data)
    }

    needStartNewCricle() {
        for (let item of this.signRewardItemList) {
            if (!item.getRecievedState()) {
                return false
            }
        }
        for (let item of this.signRewardItemList) {
            let specialItem = item.node.getComponent(SignRewardItemSpecial)
            if (specialItem) {
                specialItem.setIsSecendRecieve()
            }
        }
        return true
    }

    onCloseButton() {
        AdManager.getInstance().showInters()
        if (this.closeCallBack) this.closeCallBack()
        this.onTouchClose(null, false)
    }

}
