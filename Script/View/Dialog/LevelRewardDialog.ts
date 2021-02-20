import { _decorator, Component, Node, SpriteComponent, resources, SpriteFrame, UITransform } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import { ConfigMgr } from '../../Game/Managers/ConfigMgr';
import { SkinBuff } from '../UI/Main/SkinBuff';
import { BaseFragArenaDialog } from './BaseFragArenaDialog';
const { ccclass, property } = _decorator;

@ccclass('LevelRewardDialog')
export class LevelRewardDialog extends BaseFragArenaDialog {


    @property(SpriteComponent)
    sprite: SpriteComponent = null

    @property([SkinBuff])
    skinBuffs: SkinBuff[] = []

    @property(Node)
    continueButton: Node = null

    private skinPath: string = ""
    private skinBuffList = []

    start() {
        super.start()
        this.continueButton.on(Node.EventType.TOUCH_END, this.onContinueButton, this)
        AudioManager.getInstance().playEffectByPath("Lottery")
    }

    initData(data) {
        super.initData(data)
        let skinConfig = ConfigMgr.getInstance().getSkinConfig().json[this._data.skinName]
        this.skinPath = skinConfig.spritePath
        this.skinBuffList = skinConfig.buffList
        resources.load(this.skinPath, SpriteFrame, (err, spriteFrame) => {
            if(err){
                return
            }
            if(this.sprite && spriteFrame){
                this.sprite.spriteFrame = spriteFrame
                let originalSize = spriteFrame.originalSize
                originalSize.x *= 0.8
                originalSize.y *= 0.8
                this.sprite.node.getComponent(UITransform).setContentSize(originalSize)
                this.sprite.spriteFrame = spriteFrame
            }
        })
        for (let i = 0; i < this.skinBuffList.length; i++) {
            let skinBuff = this.skinBuffs[i]
            let buffConfig = ConfigMgr.getInstance().getDrwaCardConfig().json[this.skinBuffList[i]]
            skinBuff.setDisplay(buffConfig)
            skinBuff.node.active = true
        }
    }

    onContinueButton() {
        this.onTouchClose(null, false)
    }

}
