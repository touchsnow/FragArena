import { _decorator, Component, Node, LabelComponent } from 'cc';
import BaseDialog from '../../../Framework3D/Src/Base/BaseDialog';
const { ccclass, property } = _decorator;

@ccclass('ResurgenceDialog')
export class ResurgenceDialog extends BaseDialog {

    @property(Node)
    resurgenceButton: Node = null

    @property(Node)
    skipButton: Node = null

    @property(LabelComponent)
    timeDownLabel: LabelComponent = null

    private resurgenceCallback = null
    private skipCallback = null

    private timeDown: number = 5

    start() {
        super.start()
        this.resurgenceCallback = this._data.resurgenceCallBack
        this.skipCallback = this._data.skipCallback
        this.resurgenceButton.on(Node.EventType.TOUCH_END, this.onResurgenceButton, this)
        this.skipButton.on(Node.EventType.TOUCH_END, this.onSkipButton, this)
    }

    update(dt: number) {
        this.timeDown -= dt
        let minutes = Math.round((this.timeDown - 30) / 60) % 60;
        let seconds = this.timeDown % 60;
        this.timeDownLabel.string = (minutes > 9 ? minutes.toFixed(0) : "0" + minutes.toFixed(0)) + ":" + (seconds > 9 ? seconds.toFixed(0) : "0" + seconds.toFixed(0))
        if (this.timeDown <= 0) {
            this.onSkipButton()
        }
    }

    onResurgenceButton() {
        if (this.resurgenceCallback) {
            this.resurgenceCallback()
            this.onTouchClose(false, null)
        }
    }

    onSkipButton() {
        if (this.skipCallback) {
            this.skipCallback()
            this.onTouchClose(false, null)
        }
    }

}
