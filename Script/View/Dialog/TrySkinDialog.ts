import { _decorator, Component, Node, SpriteComponent, resources, SpriteFrame, UITransform, random, Asset } from 'cc';
import BaseDialog from '../../../Framework3D/Src/Base/BaseDialog';
import UIUtility from '../../../Framework3D/Src/Base/UIUtility';
import { AdManager } from '../../Game/Managers/AdManager';
import { ConfigMgr } from '../../Game/Managers/ConfigMgr';
import { StorgeMgr } from '../../Game/Managers/StorgeMgr';
import { MainPage } from '../UI/Main/MainPage';
import { SkinBuff } from '../UI/Main/SkinBuff';
const { ccclass, property } = _decorator;

@ccclass('TrySkinDialog')
export class TrySkinDialog extends BaseDialog {

    @property(SpriteComponent)
    skinSprite: SpriteComponent = null

    @property(Node)
    tryButton: Node = null

    @property(Node)
    giveButton: Node = null

    @property([SkinBuff])
    skinBuffs: SkinBuff[] = []

    private skinName: string = ""

    private callBack = null

    private mainPage: MainPage = null

    start() {
        super.start()
        this.tryButton.on(Node.EventType.TOUCH_END, this.onTryButton, this)
        this.giveButton.on(Node.EventType.TOUCH_END, this.onGiveUpButton, this)
        let lockSkin = []
        let skinConfig = ConfigMgr.getInstance().getSkinConfig().json
        let skinList = skinConfig["skinList"]
        let hadSkinList = StorgeMgr.getInstance().ownedSkin
        for (let skin of skinList) {
            if (hadSkinList.indexOf(skin) != -1) {
                continue
            }
            lockSkin.push(skin)
        }
        let randomIndex = Math.floor(random() * lockSkin.length)
        this.skinName = lockSkin[randomIndex]
        let config = ConfigMgr.getInstance().getSkinConfig().json[this.skinName]
        resources.load(config.spritePath, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                return
            }
            if (this.skinSprite && spriteFrame) {
                this.skinSprite.spriteFrame = spriteFrame
            }
        })

        let skinBuffList = config.buffList
        for (let i = 0; i < skinBuffList.length; i++) {
            let skinBuff = this.skinBuffs[i]
            let buffConfig = ConfigMgr.getInstance().getDrwaCardConfig().json[skinBuffList[i]]
            skinBuff.setDisplay(buffConfig)
            skinBuff.node.active = true
        }
    }

    initData(data) {
        super.initData(data)
        this.callBack = this._data.callBack
        this.mainPage = this._data.mainPage
        console.log(this.mainPage)
    }

    onTryButton() {
        var callBack = function () {
            if (this.callBack) this.callBack()
            StorgeMgr.getInstance().trySkin = this.skinName
            StorgeMgr.getInstance().update()
            let loadArray = []
            ConfigMgr.getInstance().setupAIConfig(4)
            let aiConfigs = ConfigMgr.getInstance().getPlayerConfig()
            for (let ai of aiConfigs) {
                loadArray.push("Player/" + ai.skin)
            }
            loadArray.push("Player/" + this.skinName)
            resources.load(loadArray, Asset, (completedCount, totalCount) => {
                let progress = completedCount / totalCount;
                if (isNaN(progress)) {
                    return;
                }
                this.mainPage.setProgress(progress)
            }, () => {
                this.mainPage.setProgress(1)
                this.mainPage.loadPage.playerFinish = true
                this.mainPage.loadPage.loadFinish()
            })
            // resources.load(loadArray, () => {
            //     UIUtility.getInstance().loadScene("GameScene")
            // })
            this.onTouchClose(null, false)
        }.bind(this)

        AdManager.getInstance().showVideo(callBack)
    }

    onGiveUpButton() {
        if (this.callBack) this.callBack()
        let loadArray = []
        ConfigMgr.getInstance().setupAIConfig(4)
        let aiConfigs = ConfigMgr.getInstance().getPlayerConfig()
        for (let ai of aiConfigs) {
            loadArray.push("Player/" + ai.skin)
        }
        resources.load(loadArray, Asset, (completedCount, totalCount) => {
            let progress = completedCount / totalCount;
            if (isNaN(progress)) {
                return;
            }
            this.mainPage.setProgress(progress)
        }, () => {
            this.mainPage.setProgress(1)
            this.mainPage.loadPage.playerFinish = true
            this.mainPage.loadPage.loadFinish()
        })
        // resources.load(loadArray, () => {
        //     UIUtility.getInstance().loadScene("GameScene")
        // })
        this.onTouchClose(null, false)
    }

}
