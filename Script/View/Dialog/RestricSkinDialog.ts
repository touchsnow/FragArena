import { _decorator, Component, Node, LabelComponent, sys } from 'cc';
import BaseDialog from '../../../Framework3D/Src/Base/BaseDialog';
import DialogManager from '../../../Framework3D/Src/Base/DialogManager';
import { Contants } from '../../Data/Contants';
import { AdManager } from '../../Game/Managers/AdManager';
import { ConfigMgr } from '../../Game/Managers/ConfigMgr';
import { StorgeMgr } from '../../Game/Managers/StorgeMgr';
import { SkinBuff } from '../UI/Main/SkinBuff';
const { ccclass, property } = _decorator;

@ccclass('RestricSkinDialog')
export class RestricSkinDialog extends BaseDialog {

    @property(Node)
    adButton: Node = null

    @property(LabelComponent)
    residueTime: LabelComponent = null

    @property(Node)
    closeButton: Node = null

    @property([SkinBuff])
    skinBuffs: SkinBuff[] = []

    private callback = null

    start() {
        super.start()
        this.adButton.on(Node.EventType.TOUCH_END, this.onAdButton, this)
        this.closeButton.on(Node.EventType.TOUCH_END, this.onCloseButton, this)
        let time = this.getResidueTime()
        this.residueTime.string = time

        let skinConfig = ConfigMgr.getInstance().getSkinConfig().json["Landlubber"]
        let skinBuffList = skinConfig.buffList
        for (let i = 0; i < skinBuffList.length; i++) {
            let skinBuff = this.skinBuffs[i]
            let buffConfig = ConfigMgr.getInstance().getDrwaCardConfig().json[skinBuffList[i]]
            skinBuff.setDisplay(buffConfig)
            skinBuff.node.active = true
        }
    }

    initData(data) {
        super.initData(data)
        this.callback = this._data.callback
    }

    onAdButton() {
        var callBack = function () {
            let time = this.getResidueTime() - 1
            if (time == 0) {
                StorgeMgr.getInstance().ownedSkin.push("Landlubber")
                StorgeMgr.getInstance().update()
                let data = {
                    skinName: "Landlubber"
                }
                DialogManager.getInstance().showDlg("LevelRewardDialog", data)
                this.onCloseButton()
            } else {
                this.setResidueTime(time)
                this.residueTime.string = time.toString()
            }
        }.bind(this)
        AdManager.getInstance().showVideo(callBack)
    }

    getResidueTime() {
        let key = "RestricSkin" + Contants.gameVer
        let data = sys.localStorage.getItem(key)
        if (data) {
            let value = JSON.parse(data);
            return typeof value == 'undefined' || value == null ? 2 : value;
        }
        return 2
    }

    setResidueTime(time: number) {
        let key = "RestricSkin" + Contants.gameVer
        let data = JSON.stringify(time)
        sys.localStorage.setItem(key, data)
    }

    onCloseButton() {
        if (this.callback) this.callback()
        this.onTouchClose(null, false)
    }

}
