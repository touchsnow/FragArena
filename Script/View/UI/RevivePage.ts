import { _decorator, Component, Node, LabelComponent, tween, Vec3 } from 'cc';
import { AdManager } from '../../Game/Managers/AdManager';
const { ccclass, property } = _decorator;

@ccclass('RevivePage')
export class RevivePage extends Component {


    @property(Node)
    resurgenceButton: Node = null

    @property(Node)
    freeResurgenceButton: Node = null

    @property(Node)
    skipButton: Node = null

    @property(LabelComponent)
    timeDownLabel: LabelComponent = null

    private resurgenceCallback = null
    private skipCallback = null

    private timeDown: number = 5

    private currentSeconds = 0

    start() {
        this.resurgenceButton.on(Node.EventType.TOUCH_END, this.onResurgenceButton, this)
        this.skipButton.on(Node.EventType.TOUCH_END, this.onSkipButton, this)
        this.freeResurgenceButton.on(Node.EventType.TOUCH_END, this.onFreeResurgenceButton, this)
    }

    show(resurgenceCallBack, skipCallback) {
        this.resurgenceCallback = resurgenceCallBack
        this.skipCallback = skipCallback
        this.timeDown = 12
        this.node.active = true
        AdManager.getInstance().showInters()
    }

    update(dt: number) {
        this.timeDown -= dt
        let minutes = Math.round((this.timeDown - 30) / 60) % 60;
        let seconds = Math.ceil(this.timeDown % 60)
        if (seconds !== this.currentSeconds) {
            this.changeSeconds(seconds)
        }
        if (this.timeDown <= 0) {
            this.onSkipButton()
        }
    }

    onResurgenceButton() {
        var callback = function () {
            if (this.resurgenceCallback) {
                this.resurgenceCallback()
            }
            this.node.active = false
        }.bind(this)
        AdManager.getInstance().showVideo(callback)
    }

    onFreeResurgenceButton() {
        if (this.resurgenceCallback) {
            this.resurgenceCallback()
        }
        this.freeResurgenceButton.active = false
        this.resurgenceButton.active = true
        this.node.active = false
    }

    onSkipButton() {
        if (this.skipCallback) {
            this.skipCallback()
        }
        this.node.active = false
    }

    changeSeconds(seconds: number) {

        this.currentSeconds = seconds
        this.timeDownLabel.string = seconds.toString()
        this.timeDownLabel.node.setScale(2, 2, 2)
        tween(this.timeDownLabel.node)
            .to(0.6, { scale: new Vec3(0.5, 0.5, 0.5) },{easing:"circOut"})
            .start()
    }

}
