// Learn TypeScript:
import { _decorator, Component, Node, LabelComponent } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import BaseDialog from '../../../Framework3D/Src/Base/BaseDialog';
const { ccclass, property } = _decorator;

@ccclass('SettingDialog')
export class SettingDialog extends BaseDialog {

    @property(Node)
    musicButton: Node = null

    @property(Node)
    soundButton: Node = null

    @property(LabelComponent)
    musicLabel: LabelComponent = null

    @property(LabelComponent)
    soundLabel: LabelComponent = null

    @property(Node)
    closeSettingButton: Node = null

    start() {
        super.start()
        this.musicButton.on(Node.EventType.TOUCH_END, this.onMusicButton, this)
        this.soundButton.on(Node.EventType.TOUCH_END, this.onSoundButton, this)
        this.closeSettingButton.on(Node.EventType.TOUCH_END, this.onClose, this)
        this.updateSettingDisplay()
    }

    updateSettingDisplay() {
        let soundResult = AudioManager.getInstance().getEffectState()
        if (soundResult) {
            this.soundLabel.string = "音效：开启"
        } else {
            this.soundLabel.string = "音效：关闭"
        }
        let musicResult = AudioManager.getInstance().getMusicState()
        if (musicResult) {
            this.musicLabel.string = "音乐：开启"
        } else {
            this.musicLabel.string = "音乐：关闭"
        }
    }

    onMusicButton() {
        let result = AudioManager.getInstance().getMusicState()
        AudioManager.getInstance().setMusicState(!result)
        this.updateSettingDisplay()
    }

    onSoundButton() {
        let result = AudioManager.getInstance().getEffectState()
        AudioManager.getInstance().setEffectState(!result)
        this.updateSettingDisplay()
    }

    onClose() {
        this.onTouchClose(null,false)
    }



}
