import { _decorator, Component, Node, LabelComponent } from 'cc';
import { BaseFragArenaDialog } from './BaseFragArenaDialog';
const { ccclass, property } = _decorator;

@ccclass('ConfirmDialog')
export class ConfirmDialog extends BaseFragArenaDialog {

    @property(Node)
    confirmButton: Node = null

    @property(Node)
    cancleButton: Node = null

    @property(Node)
    closeButton: Node = null

    @property(LabelComponent)
    label: LabelComponent = null

    private confirmCallback = null
    private cancleCallback = null

    start() {
        super.start()
        this.confirmButton.on(Node.EventType.TOUCH_END, this.onConfirmButton, this)
        this.cancleButton.on(Node.EventType.TOUCH_END, this.onCancleButton, this)
        this.closeButton.on(Node.EventType.TOUCH_END, this.onCloseButton, this)
    }

    initData(data) {
        super.initData(data)
        this.confirmCallback = this._data.confirmCallback
        this.cancleCallback = this._data.cancleCallback
        this.label.string = this._data.label
    }

    onConfirmButton() {
        if (this.confirmCallback) {
            this.confirmCallback()
        }
        this.onTouchClose(null, false)
    }

    onCancleButton() {
        if (this.cancleCallback) {
            this.cancleCallback()
        }
        this.onTouchClose(null, false)
    }

    onCloseButton() {
        this.onTouchClose(null, false)
    }

}
