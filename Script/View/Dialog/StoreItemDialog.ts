import { _decorator, Component, Node, SpriteComponent, LabelComponent, resources, SpriteFrame } from 'cc';
import { ConfigMgr } from '../../Game/Managers/ConfigMgr';
import { BaseFragArenaDialog } from './BaseFragArenaDialog';
const { ccclass, property } = _decorator;

@ccclass('StoreItemDialog')
export class StoreItemDialog extends BaseFragArenaDialog {

    @property(SpriteComponent)
    sprite: SpriteComponent = null

    @property(LabelComponent)
    itemName: LabelComponent = null

    @property(LabelComponent)
    itemDescribe: LabelComponent = null

    @property(Node)
    equitButton: Node = null

    @property(Node)
    unEquitButton: Node = null

    @property(Node)
    upgradeButton: Node = null

    @property(Node)
    closeButton: Node = null

    @property(LabelComponent)
    additionLabel: LabelComponent = null

    private equitCallback = null
    private unEquitCallback = null
    private upgradeCallback = null

    start() {
        this.equitButton.on(Node.EventType.TOUCH_END, this.onEquitButton, this)
        this.unEquitButton.on(Node.EventType.TOUCH_END, this.onUnEquitButton, this)
        this.upgradeButton.on(Node.EventType.TOUCH_END, this.onUpgradeButton, this)
        this.closeButton.on(Node.EventType.TOUCH_END, this.onCloseButton, this)
    }

    initData(data) {
        super.initData(data)
        this.equitCallback = this._data.equitCallback
        this.unEquitCallback = this._data.unEquitCallback
        this.upgradeCallback = this._data.upgradeCallback
        this.equitButton.active = this._data.equitButtonActive
        this.unEquitButton.active = this._data.unEquitButtonActive
        this.upgradeButton.active = this._data.upgradeButtonActive

        let config = ConfigMgr.getInstance().getDrwaCardConfig().json[this._data.itemName]
        resources.load(config.spritePath, SpriteFrame, (err, spriteFrame) => {
            if (err) return
            this.sprite.spriteFrame = spriteFrame
        })
        this.itemName.string = config.cnName
        this.itemDescribe.string = config.describe
        this.additionLabel.string = config.label
    }

    onEquitButton() {
        if (this.equitCallback) {
            this.equitCallback()
        }
        this.onCloseButton()
    }

    onUnEquitButton() {
        if (this.unEquitCallback) {
            this.unEquitCallback()
        }
        this.onCloseButton()
    }

    onUpgradeButton() {
        if (this.upgradeCallback) {
            this.upgradeCallback()
        }
        this.onCloseButton()
    }

    onCloseButton() {
        this.onTouchClose(null, false)
    }
}


