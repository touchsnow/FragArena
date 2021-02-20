import { _decorator, Component, Node, UITransform, instantiate } from 'cc';
import BaseDialog from '../../../Framework3D/Src/Base/BaseDialog';
const { ccclass, property } = _decorator;

@ccclass('GuideDialog')
export class GuideDialog extends BaseDialog {

    @property(Node)
    touchRange: Node = null

    @property(Node)
    fingerNode: Node = null

    @property(Node)
    newNodePatent:Node = null

    private touchCB = null

    start() {
        this.touchRange.on(Node.EventType.TOUCH_END, this.onTouchRange, this)
    }

    initData(data) {
        super.initData(data)
        this.touchCB = this._data.touchCB
        let touchNode = this._data.touchNode as Node
        let newNode = instantiate(touchNode)
        this.touchRange.getComponent(UITransform).setContentSize(touchNode.getComponent(UITransform).contentSize)
        this.touchRange.setWorldPosition(touchNode.getWorldPosition())
        newNode.setParent(this.newNodePatent)
        this.fingerNode.setWorldPosition(touchNode.getWorldPosition())
    }

    onTouchRange() {
        this.onTouchClose(null, false)
        if (this.touchCB) {
            this.touchCB()
        }
    }

}
