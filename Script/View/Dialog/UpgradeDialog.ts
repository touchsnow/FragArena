import { _decorator, Component, Node, SpriteComponent, LabelComponent, resources, SpriteFrame } from 'cc';
import { ConfigMgr } from '../../Game/Managers/ConfigMgr';
import { BaseFragArenaDialog } from './BaseFragArenaDialog';
const { ccclass, property } = _decorator;

@ccclass('UpgradeDialog')
export class UpgradeDialog extends BaseFragArenaDialog {

    @property(Node)
    closeButton: Node = null

    @property(SpriteComponent)
    sprite: SpriteComponent = null

    @property(LabelComponent)
    label: LabelComponent = null

    start() {
        super.start()
        this.closeButton.on(Node.EventType.TOUCH_END, this.onCloseButton, this)
    }

    initData(data) {
        super.initData(data)
        let itemName = data.itemName
        let cardConfig = ConfigMgr.getInstance().getDrwaCardConfig().json[itemName]

        resources.load(cardConfig.spritePath, SpriteFrame, (err, spriteFrame) => {
            if (err) return
            if(this.sprite.spriteFrame && spriteFrame){
                this.sprite.spriteFrame = spriteFrame
            }
        })
        this.label.string = cardConfig.label
    }

    onCloseButton() {
        this.onTouchClose(null, false)
    }


}
