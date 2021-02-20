import { _decorator, Component, Node, LabelComponent } from 'cc';
import { BaseFragArenaDialog } from './BaseFragArenaDialog';
const { ccclass, property } = _decorator;

@ccclass('TipDialog')
export class TipDialog extends BaseFragArenaDialog {

    @property(LabelComponent)
    label: LabelComponent = null

    @property(Node)
    closeButton: Node = null

    start() {
        super.start()
        this.closeButton.on(Node.EventType.TOUCH_END, this.onCloseButton, this)
    }

    initData(data) {
        super.initData(data)
        this.label.string = data.label
    }

    onCloseButton() {
        this.onTouchClose(null, false)
    }

}
