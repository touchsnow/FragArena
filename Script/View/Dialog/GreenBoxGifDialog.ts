// Learn TypeScript:
import { _decorator, Component, Node } from 'cc';
import BaseDialog from '../../../Framework3D/Src/Base/BaseDialog';
import DialogManager from '../../../Framework3D/Src/Base/DialogManager';
import { AdManager } from '../../Game/Managers/AdManager';
import { GifBox } from '../Other/GifBox';
const { ccclass, property } = _decorator;

@ccclass('GreenBoxGifDialog')
export class GreenBoxGifDialog extends BaseDialog {

    @property(Node)
    continueButton: Node = null

    @property(GifBox)
    box1: GifBox = null

    @property(GifBox)
    box2: GifBox = null

    @property(GifBox)
    box3: GifBox = null

    private closeCallBack = null

    start() {
        super.start()
        AdManager.getInstance().showInters()
        this.box1.node.on(Node.EventType.TOUCH_END, this.onBox1Touch, this)
        this.box2.node.on(Node.EventType.TOUCH_END, this.onBox2Touch, this)
        this.box3.node.on(Node.EventType.TOUCH_END, this.onBox3Touch, this)
        this.continueButton.on(Node.EventType.TOUCH_END, this.onContinueButton, this)
    }

    initData(data) {
        super.initData(data)
        this.closeCallBack = this._data.callBack
    }

    onBox1Touch() {
        if (this.box1.hadOpen) return
        this.box1.onTouch()
        this.box2.setAd()
        this.box3.setAd()
        this.continueButton.active = true
    }

    onBox2Touch() {
        if (this.box2.hadOpen) return
        this.box2.onTouch()
        this.box1.setAd()
        this.box3.setAd()
        this.continueButton.active = true
    }

    onBox3Touch() {
        if (this.box3.hadOpen) return
        this.box3.onTouch()
        this.box1.setAd()
        this.box2.setAd()
        this.continueButton.active = true
    }

    onContinueButton() {
        // if (this.closeCallBack) {
        //     this.closeCallBack()
        // }
        var callback = function () {
            this.closeCallBack()
        }.bind(this)
        let data = {
            colseCallBakc: callback
        }
        DialogManager.getInstance().showDlg("LotteryDialog", data)
        this.onTouchClose(null, false)
    }

}
