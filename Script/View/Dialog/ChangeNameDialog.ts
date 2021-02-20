import { _decorator, Component, Node, ProgressBarComponent, EditBoxComponent, EditBox } from 'cc';
import { StorgeMgr } from '../../Game/Managers/StorgeMgr';
import { BaseFragArenaDialog } from './BaseFragArenaDialog';
const { ccclass, property } = _decorator;

@ccclass('ChangeNameDialog')
export class ChangeNameDialog extends BaseFragArenaDialog {

    @property(EditBoxComponent)
    editbox: EditBoxComponent = null

    @property(Node)
    closeButton: Node = null
    private callback = null

    start() {
        super.start()
        this.editbox.string = StorgeMgr.getInstance().playerName
        this.editbox.node.on('text-changed', this.onEditBox, this)
        this.closeButton.on(Node.EventType.TOUCH_END, this.onCloseButton, this)
    }

    initData(data) {
        super.initData(data)
        this.callback = this._data.callback
    }

    onEditBox(editbox: EditBox) {
        let name = editbox.string
        if (name.length > 6) {
            name = name.substring(0, 6)
        }
        this.editbox.string = name
        StorgeMgr.getInstance().playerName = name
        StorgeMgr.getInstance().update()
    }

    onCloseButton() {
        if (this.callback) {
            this.callback()
        }
        this.onTouchClose(null, false)
    }

}
