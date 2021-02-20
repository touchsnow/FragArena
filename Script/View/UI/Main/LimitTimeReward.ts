import { _decorator, Component, LabelComponent, Node, find } from 'cc';
import AudioManager from '../../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../../Framework3D/Src/Base/DialogManager';
import { Contants } from '../../../Data/Contants';
import { CustomEventListener } from '../../../Data/CustomEventListener';
import { AdManager } from '../../../Game/Managers/AdManager';
import { StorgeMgr } from '../../../Game/Managers/StorgeMgr';
import { UiNodeBreath } from '../../../Game/Tool/UiNodeBreath';
import { MainUI } from '../MainUI';
const { ccclass, property } = _decorator;

@ccclass('LimitTimeReward')
export class LimitTimeReward extends Component {

    @property(LabelComponent)
    label: LabelComponent = null

    @property(Node)
    rewardNode: Node = null

    @property(Node)
    countDownLabel: Node = null

    @property(UiNodeBreath)
    uiBreath: UiNodeBreath = null

    private targetTime: number = 0
    private currentTime: number = 0

    countDown: boolean = false


    start() {
        this.updateLimit()
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
    }

    update(dt: number) {
        if (!this.countDown) return
        this.currentTime += dt
        if (this.currentTime >= this.targetTime) {
            this.endCountDown()
        }
        let timeDown = this.targetTime - this.currentTime
        let minutes = Math.round((timeDown - 30) / 60) % 60;
        let seconds = timeDown % 60;
        this.label.string = (minutes > 9 ? minutes.toFixed(0) : "0" + minutes.toFixed(0)) + ":" + (seconds > 9 ? seconds.toFixed(0) : "0" + seconds.toFixed(0))
    }

    updateLimit() {
        let limitTime = StorgeMgr.getInstance().limitRewardTime
        let currentTime = new Date().getTime() / 1000
        this.currentTime = currentTime
        if (limitTime < this.currentTime) {
            this.countDown = false
            this.rewardNode.active = true
            this.countDownLabel.active = false
            this.uiBreath.startTween()
        } else {
            this.targetTime = limitTime
            this.countDown = true
            this.rewardNode.active = false
            this.countDownLabel.active = true
            this.uiBreath.stopTween()
        }
    }

    endCountDown() {
        this.uiBreath.startTween()
        this.countDown = false
        this.rewardNode.active = true
        this.countDownLabel.active = false
    }

    onTouch() {
        if (!this.countDown) {
            var videoCallback = function () {
                let currentTime = new Date().getTime() / 1000
                StorgeMgr.getInstance().limitRewardTime = currentTime + 1800
                // StorgeMgr.getInstance().money += 2000
                // StorgeMgr.getInstance().update()
                find("Canvas").getComponent(MainUI).addMoneyAnim(20,100)
                AudioManager.getInstance().playEffectByPath("ReceivingMoney")
                let data = {
                    label: "恭喜获得金币2000"
                }
                DialogManager.getInstance().showDlg("TipDialog", data)
                CustomEventListener.dispatchEvent(Contants.EventName.UpdataMainUiDiaplay)
                this.updateLimit()
            }.bind(this)
            AdManager.getInstance().showVideo(videoCallback)
        }
    }

}
