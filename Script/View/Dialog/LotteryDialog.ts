import { _decorator, Component, Node, find, loader, instantiate, LabelComponent, Label, SpriteComponent, random, resources, SpriteFrame, sys } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import BaseDialog from '../../../Framework3D/Src/Base/BaseDialog';
import UIUtility from '../../../Framework3D/Src/Base/UIUtility';
import { Contants } from '../../Data/Contants';
import { AdManager } from '../../Game/Managers/AdManager';
import { ConfigMgr } from '../../Game/Managers/ConfigMgr';
import { StorgeMgr } from '../../Game/Managers/StorgeMgr';
import { GameUI } from '../UI/GameUI';
import { MainUI } from '../UI/MainUI';
const { ccclass, property } = _decorator;
enum pointerStage {
    accelerationStage = "accelerationStage",
    constantsStage = "constantsStage",
    slowStage = "slowStage",
    moveToTargetStage = "moveToTargetStage"
}
const PointerStage = pointerStage
@ccclass('LotteryDialog')
export class LotteryDialog extends BaseDialog {

    @property(Node)
    pointer: Node = null

    @property(Node)
    freeButton: Node = null

    @property(Node)
    adButton: Node = null

    @property(Node)
    closeButton: Node = null

    @property(Node)
    rewardMoneyIcon: Node = null

    @property(Node)
    rewardEnergyIcon: Node = null

    @property(LabelComponent)
    rewardLabel: LabelComponent = null

    @property(SpriteComponent)
    rewardSkinSprite: SpriteComponent = null

    @property(Node)
    rewardBg: Node = null

    @property(LabelComponent)
    remainingCount: LabelComponent = null

    @property(LabelComponent)
    remianingSkin: LabelComponent = null

    private colseCallBakc = null

    speed: number = 0

    pointerStage: pointerStage = null

    acclerationRate: number = 0.2

    slowRate: number = 0.08

    minSpeed: number = 1.5

    acclerateTime: number = 1.5
    currAcclerTime: number = 0

    constantTime: number = 0.5
    currConstantTime: number = 0

    slowTime: number = 3
    currSlowTime: number = 0

    targerPoint: number = 0

    correctItem = null

    private isRotating = false

    private totalPro = 0

    itemList = [
        { itemName: "Money*1000", probability: 35, angle: 330 },
        { itemName: "Energy*20", probability: 20, angle: 265 },
        { itemName: "Money*3000", probability: 10, angle: 210 },
        { itemName: "Skin", probability: 9, angle: 150 },
        { itemName: "Money*2000", probability: 25, angle: 90 },
        { itemName: "Energy*50", probability: 9, angle: 30 },
    ]

    start() {
        super.start()
        this.freeButton.on(Node.EventType.TOUCH_END, this.onFreeButton, this)
        this.adButton.on(Node.EventType.TOUCH_END, this.onAdButton, this)
        this.closeButton.on(Node.EventType.TOUCH_END, this.onCloseButton, this)
        let currentSkinLength = StorgeMgr.getInstance().ownedSkin.length
        let allSkinLength = ConfigMgr.getInstance().getSkinConfig().json["skinList"].length
        if (currentSkinLength == allSkinLength) {
            this.itemList[3].probability = 0
        }
        this.totalPro = 0
        for (let item of this.itemList) {
            this.totalPro += item.probability
        }
        this.updateLotteryDisplaey()
    }

    updateLotteryDisplaey() {
        let lotteryCount = this.getLotteryCount()
        if (lotteryCount == 0) {
            this.freeButton.active = true
        } else {
            this.freeButton.active = false
        }
        this.remainingCount.string = (10 - this.getLotteryCount()).toString()
        let remainCount = 10 - ((this.getLotteryCount() + 1))
        if (remainCount == 5) {
            this.remianingSkin.string = "这次必抽出英雄!"
        } else if (remainCount > 5) {
            this.remianingSkin.string = "剩 " + (remainCount - 5).toString() + "次必抽出英雄！"
        } else {
            this.remianingSkin.node.active = false
        }
    }

    initData(data) {
        super.initData(data)
        this.colseCallBakc = this._data.colseCallBakc
    }

    update(dt) {
        if (this.pointerStage) {
            switch (this.pointerStage) {
                case PointerStage.accelerationStage:
                    this.accelerationStage(dt)
                    break;
                case PointerStage.constantsStage:
                    this.constantsStage(dt)
                    break;
                case PointerStage.slowStage:
                    this.slowStage(dt)
                    break;
                case PointerStage.moveToTargetStage:
                    this.moveToTargetStage(dt)
                    break;
                default:
                    break;
            }
        }
    }

    initPointer() {
        this.speed = 0
        this.currAcclerTime = 0
        this.currConstantTime = 0
        this.currSlowTime = 0
        this.rewardEnergyIcon.active = false
        this.rewardMoneyIcon.active = false
        this.rewardSkinSprite.node.active = false
        this.rewardBg.active = false
        this.rewardLabel.node.active = false
    }

    onCloseButton() {
        if (this.isRotating == true) {
            UIUtility.getInstance().showTopTips("正在抽奖中....")
            return
        }
        if (this.colseCallBakc) {
            this.colseCallBakc()
        }
        setTimeout(() => {
            AdManager.getInstance().showInters()
        }, 0.5 * 1000)
        this.onTouchClose(null, false)
    }

    onFreeButton() {
        if (this.isRotating) {
            UIUtility.getInstance().showTopTips("正在抽奖中....")
            return
        }
        if (this.getLotteryCount() >= 10) {
            UIUtility.getInstance().showTopTips("今天的抽奖次数已经用完")
            return
        }
        this.initPointer()
        let randomNum = Math.random() * this.totalPro
        let probability = 0
        for (let i = 0; i < this.itemList.length; i++) {
            probability += this.itemList[i].probability
            console.log(probability)
            if (randomNum <= probability) {
                this.correctItem = this.itemList[i]
                break
            }
        }
        if ((this.getLotteryCount() + 1) % 10 == 5) {
            console.log("必中皮肤")
            this.correctItem = this.itemList[3]
        }
        this.targerPoint = this.correctItem.angle
        this.pointerStage = PointerStage.accelerationStage
        this.isRotating = true
        this.setLotteryCount(this.getLotteryCount() + 1)
    }

    onAdButton() {
        if (this.isRotating) {
            UIUtility.getInstance().showTopTips("正在抽奖中....")
            return
        }
        if ((this.getLotteryCount()) >= 10) {
            UIUtility.getInstance().showTopTips("今天的抽奖次数已经用完")
            return
        }
        this.initPointer()
        var callback = function () {
            let randomNum = Math.random() * this.totalPro
            console.log(randomNum)
            let probability = 0
            for (let i = 0; i < this.itemList.length; i++) {
                probability += this.itemList[i].probability
                console.log(probability)
                if (randomNum <= probability) {
                    this.correctItem = this.itemList[i]
                    break
                }
            }
            if ((this.getLotteryCount() + 1) % 10 == 5) {
                this.correctItem = this.itemList[3]
                console.log("必中皮肤")
            }
            this.targerPoint = this.correctItem.angle
            this.pointerStage = PointerStage.accelerationStage
            this.isRotating = true
            this.setLotteryCount(this.getLotteryCount() + 1)
        }.bind(this)
        AdManager.getInstance().showVideo(callback)

    }

    accelerationStage(dt) {
        let pos = this.pointer.eulerAngles.clone()
        this.speed += this.acclerationRate
        pos.z = pos.z + this.speed
        this.pointer.setRotationFromEuler(pos.x, pos.y, pos.z)
        this.currAcclerTime += dt
        if (this.currAcclerTime >= this.acclerateTime) {
            this.pointerStage = PointerStage.constantsStage
        }
    }

    constantsStage(dt) {
        let pos = this.pointer.eulerAngles.clone()
        pos.z += this.speed
        this.pointer.setRotationFromEuler(pos.x, pos.y, pos.z)
        this.currConstantTime += dt
        if (this.currConstantTime >= this.constantTime) {
            this.pointerStage = PointerStage.slowStage
        }
    }

    slowStage(dt) {
        this.speed -= this.slowRate
        this.currSlowTime += dt
        if (this.speed <= this.minSpeed || this.currSlowTime >= this.slowTime) {
            this.speed = this.minSpeed
            let round = Math.ceil(this.pointer.eulerAngles.z / 360)
            if (this.targerPoint + round * 360 > this.pointer.eulerAngles.z) {
                this.targerPoint = round * 360 + this.targerPoint
            } else {
                this.targerPoint = (round - 1) * 360 + this.targerPoint
            }
            this.pointerStage = pointerStage.moveToTargetStage
        }
        let pos = this.pointer.eulerAngles.clone()
        pos.z += this.speed
        this.pointer.setRotationFromEuler(pos.x, pos.y, pos.z)
    }

    moveToTargetStage(dt) {
        let pos = this.pointer.eulerAngles.clone()
        let dis = this.targerPoint - this.pointer.eulerAngles.z
        if (dis <= 100) {
            let speed = this.speed * dis / 100
            if (dis / 100 < 1 / 10) {
                speed = this.speed * 1 / 10
            }
            pos.z += speed
            this.pointer.setRotationFromEuler(pos.x, pos.y, pos.z)
        } else {
            pos.z += this.speed
            this.pointer.setRotationFromEuler(pos.x, pos.y, pos.z)
        }
        if (this.pointer.eulerAngles.z >= this.targerPoint) {
            //if (this.colseCallBakc) this.colseCallBakc()
            //this.onTouchClose(null, false)
            this.setReward()
            AudioManager.getInstance().playEffectByPath("Lottery")
            console.log(this.correctItem)
            this.pointerStage = null
            this.isRotating = false
            this.updateLotteryDisplaey()
        }
    }

    setReward() {
        switch (this.correctItem.itemName) {
            case this.itemList[0].itemName:
                this.setRewardMoney(1000)
                break
            case this.itemList[1].itemName:
                this.setRewawrEnergy(20)
                break
            case this.itemList[2].itemName:
                this.setRewardMoney(3000)
                break
            case this.itemList[3].itemName:
                this.setRewardSkin()
                break
            case this.itemList[4].itemName:
                this.setRewardMoney(2000)
                break
            case this.itemList[5].itemName:
                this.setRewawrEnergy(50)
                break
            default:
                break
        }
    }

    setRewardMoney(num: number) {
        this.rewardBg.active = true
        this.rewardMoneyIcon.active = true
        this.rewardLabel.node.active = true
        this.rewardLabel.string = num.toString()
        let mianUI = find("Canvas").getComponent(MainUI)
        if (mianUI) {
            mianUI.addMoneyAnim(num / 100, 100)
        }

        let gameUI = find("Canvas").getComponent(GameUI)
        if (gameUI) {
            gameUI.addMoneyAnim(num / 100, 100)
        }
    }

    setRewawrEnergy(num: number) {
        this.rewardBg.active = true
        this.rewardEnergyIcon.active = true
        this.rewardLabel.node.active = true
        this.rewardLabel.string = num.toString()
        let mainUI = find("Canvas").getComponent(MainUI)
        if (mainUI) {
            mainUI.addEnergy(num / 2, 2)
        }

        let gameUI = find("Canvas").getComponent(GameUI)
        if (gameUI) {
            gameUI.addEnergy(num / 2, 2)
        }
    }

    setRewardSkin() {
        this.rewardBg.active = true
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
        let skinName = lockSkin[randomIndex]
        let config = ConfigMgr.getInstance().getSkinConfig().json[skinName]
        resources.load(config.spritePath, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                return
            }
            if (this.rewardSkinSprite && spriteFrame) {
                this.rewardSkinSprite.spriteFrame = spriteFrame
                this.rewardSkinSprite.node.active = true
            }
        })
        StorgeMgr.getInstance().ownedSkin.push(skinName)
    }

    getLotteryCount() {
        let key = "Lottery" + new Date().toLocaleDateString() + Contants.gameVer
        return StorgeMgr.getInstance().get(key, 0)
    }

    setLotteryCount(num: number) {
        let key = "Lottery" + new Date().toLocaleDateString() + Contants.gameVer
        StorgeMgr.getInstance().set(key, num)
    }


}
