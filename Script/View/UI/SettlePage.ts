import { _decorator, Component, Node, LabelComponent, Label, tween, resources, Vec3, ProgressBarComponent, SpriteComponent, Color, instantiate, Asset, find } from 'cc';
import DialogManager from '../../../Framework3D/Src/Base/DialogManager';
import UIUtility from '../../../Framework3D/Src/Base/UIUtility';
import { UpgradeSystem } from '../../Data/UpgradeSystem';
import { AdManager } from '../../Game/Managers/AdManager';
import { ConfigMgr } from '../../Game/Managers/ConfigMgr';
import { StorgeMgr } from '../../Game/Managers/StorgeMgr';
import { LevelRewardItem } from '../Other/LevelRewardItem';
import { LoadPage } from './Main/LoadPage';
const { ccclass, property } = _decorator;

@ccclass('SettlePage')
export class SettlePage extends Component {

    @property(Node)
    continueButton: Node = null

    @property(Node)
    backToMainButton: Node = null

    @property(LabelComponent)
    resultLabel: LabelComponent = null

    @property(Node)
    resultNode: Node = null

    @property(Node)
    settle: Node = null

    @property(Node)
    rewardButton: Node = null

    @property(Node)
    rewardx2Button: Node = null

    @property(LabelComponent)
    currentLevelLabel: LabelComponent = null

    @property(LabelComponent)
    levelBarLabel: LabelComponent = null

    @property(ProgressBarComponent)
    levelProgressBar: ProgressBarComponent = null

    @property(LabelComponent)
    gifLabel: LabelComponent = null

    @property(ProgressBarComponent)
    gifProgressBar: ProgressBarComponent = null

    @property(LabelComponent)
    rewardExpLabel: LabelComponent = null

    @property(LabelComponent)
    rewardGifLabel: LabelComponent = null

    @property(LabelComponent)
    rewardMoney: LabelComponent = null

    @property(Node)
    rewardContent: Node = null

    @property(LoadPage)
    loadPage: LoadPage = null

    @property(Node)
    getButtons: Node = null

    @property(Node)
    continueButtons: Node = null

    private hadShow: boolean = false
    private rankResult = null

    private rewardExp: number = 0
    private rewardGif: number = 0
    private rewardMey: number = 0

    private itemList: LevelRewardItem[] = []

    start() {
        this.continueButton.on(Node.EventType.TOUCH_END, this.onContinueButton, this)
        this.backToMainButton.on(Node.EventType.TOUCH_END, this.onBackToMain, this)
        this.rewardButton.on(Node.EventType.TOUCH_END, this.onRewardButton, this)
        this.rewardx2Button.on(Node.EventType.TOUCH_END, this.onRewardx2Button, this)
        this.initReward()
    }

    onContinueButton() {
        ConfigMgr.getInstance().setupAIConfig(4)
        this.loadPage.node.active = true
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
            this.setProgress(progress)
        }, () => {
            this.setProgress(1)
            this.loadPage.playerFinish = true
            this.loadPage.loadFinish()
        })

    }

    setProgress(num: number) {
        this.loadPage.playerProgress.fillRange = num
    }

    show(result?) {
        if (this.hadShow) return
        this.hadShow = true
        this.node.active = true
        this.resultLabel.string = "第" + result.rank + "名"
        tween(this.resultLabel.node)
            .to(2, { scale: new Vec3(2, 2, 2) })
            .call(() => {
                var callBack = function () {
                    //AdManager.getInstance().showInters()
                    this.rankResult = result
                    this.resultNode.active = false
                    this.settle.active = true
                    if (result.rank == 1) {
                        this.rewardExpLabel.string = 300
                        this.rewardGifLabel.string = 30
                        this.rewardMoney.string = result.rewardMoney
                        this.getButtons.active = true
                    } else {
                        this.rewardExpLabel.string = 50
                        this.rewardGifLabel.string = 5
                        this.rewardMoney.string = 50
                        this.rankResult.rewardMoney = 50
                        this.continueButtons.active = true
                        this.showSettle(result)
                    }
                }.bind(this)
                let data = {
                    callBack: callBack
                }
                //this.settle.active = true
                this.resultLabel.node.active = false
                DialogManager.getInstance().showDlg("GreenBoxGifDialog", data)
            })
            .start()
    }

    showSettle(rankResult, isDouble: boolean = false) {
        let rewardExp = 0
        let rewardGif = 0
        let rewardMoney = 0
        if (this.rankResult.rank == 1) {
            rewardExp = 300
            rewardGif = 30
        } else {
            rewardExp = 50
            rewardGif = 5
        }
        rewardMoney = rankResult.rewardMoney

        if (isDouble) {
            rewardExp *= 2
            rewardGif *= 2
        }

        this.rewardExp += rewardExp
        this.rewardGif += rewardGif
        this.rewardMey += rewardMoney

        //设置经验
        let upgradeSystem = new UpgradeSystem()
        upgradeSystem.setExp(StorgeMgr.getInstance().totalExp)
        //当前进度
        let currentLevevl = upgradeSystem.getCurrentLevel()
        let currentProgress = upgradeSystem.getCurrentLvExp() / upgradeSystem.getCurrentUpgradeExp()
        this.levelProgressBar.progress = currentProgress
        //现在的进度
        let upgradeResult = upgradeSystem.addExp(rewardExp)
        StorgeMgr.getInstance().totalExp += rewardExp
        StorgeMgr.getInstance().update()
        let afterLevel = upgradeSystem.getCurrentLevel()
        let exp = upgradeSystem.getCurrentLvExp()
        let upgradeExp = upgradeSystem.getCurrentUpgradeExp()
        let progress = exp / upgradeExp
        let subsecion = false
        if (currentLevevl < afterLevel) {
            subsecion = true
        }
        this.currentLevelLabel.string = afterLevel.toString()
        this.levelBarLabel.string = exp.toString() + "/" + upgradeExp.toString()
        console.log(progress)
        let callback = null
        if (upgradeResult) {
            callback = function () {
                let skinName = this.getLevelRewardItem(afterLevel)
                skinName.setState(afterLevel)
                let data = {
                    skinName: skinName.skinName
                }
                DialogManager.getInstance().showDlg("LevelRewardDialog", data)
            }.bind(this)
        }
        this.setExpBar(subsecion, progress, callback)

        //设置礼物箱进度
        let boxSubsecion = false
        let boxCallback = null
        let currentGifProgress = StorgeMgr.getInstance().giftBoxProgress
        let gifProgresss = currentGifProgress / 100
        this.gifProgressBar.progress = gifProgresss
        let afterProgress = currentGifProgress + rewardGif
        if (afterProgress >= 100) {
            boxSubsecion = true
            afterProgress -= 100
            this.gifLabel.string = afterProgress.toString() + "/100"
            boxCallback = function () {
                DialogManager.getInstance().showDlg("PurpleBoxGifDialog")
            }.bind(this)
        } else {
            this.gifLabel.string = afterProgress.toString() + "/100"
        }
        StorgeMgr.getInstance().giftBoxProgress = afterProgress
        StorgeMgr.getInstance().update()
        this.setGifBar(boxSubsecion, afterProgress / 100, boxCallback)

        //设置金币
        StorgeMgr.getInstance().money += rewardMoney

        //设置奖励
        this.rewardExpLabel.string = this.rewardExp.toString()
        this.rewardGifLabel.string = this.rewardGif.toString()
        this.rewardMoney.string = this.rewardMey.toString()
    }

    setExpBar(subsecion: boolean, value: number, callback) {
        if (subsecion) {
            tween(this.levelProgressBar)
                .to(1, { progress: 1 })
                .call(() => {
                    this.levelProgressBar.progress = 0
                })
                .to(1, { progress: value })
                .call(() => {
                    this.continueButtons.active = true
                    this.getButtons.active = false
                    if (callback) callback()
                })
                .start()
        } else {
            tween(this.levelProgressBar)
                .to(1, { progress: value })
                .call(() => {
                    this.continueButtons.active = true
                    this.getButtons.active = false
                    if (callback) callback()
                })
                .start()
        }
    }

    setGifBar(subsecion: boolean, value: number, callback) {
        if (subsecion) {
            tween(this.gifProgressBar)
                .to(1, { progress: 1 })
                .call(() => {
                    this.gifProgressBar.progress = 0
                    if (callback) {
                        this.continueButtons.active = true
                        this.getButtons.active = false
                        callback()
                    }
                })
                .to(1, { progress: value })
                .start()
        } else {
            tween(this.gifProgressBar)
                .to(1, { progress: value })
                .call(() => {
                    this.continueButtons.active = true
                    this.getButtons.active = false
                })
                .start()
        }
    }

    onRewardButton() {
        this.getButtons.active = false
        this.showSettle(this.rankResult)
    }

    onRewardx2Button() {
        var callback = function () {
            this.getButtons.active = false
            this.rewardx2Button.getComponent(SpriteComponent).color = new Color(60, 60, 60, 255)
            this.rewardx2Button.off(Node.EventType.TOUCH_END, this.onRewardx2Button, this)
            this.rankResult.rewardMoney *= 2
            this.showSettle(this.rankResult, true)
        }.bind(this)
        AdManager.getInstance().showVideo(callback)
    }

    initReward() {
        let upgradeSystem = new UpgradeSystem()
        upgradeSystem.setExp(StorgeMgr.getInstance().totalExp)
        let currentLevel = upgradeSystem.getCurrentLevel()
        let rewardConfig = ConfigMgr.getInstance().getLevelRewardConfig().json
        for (let i = currentLevel; i < 18; i++) {
            let config = rewardConfig[i]
            let item = instantiate(resources.get("UI/LevelRewaedItem"))
            item.setParent(this.rewardContent)
            let itemComt = item.getComponent(LevelRewardItem)
            if (itemComt) {
                this.itemList.push(itemComt)
                itemComt.initRewardItem(config, currentLevel)
            }
        }
        this.levelProgressBar.progress = upgradeSystem.getCurrentLvExp() / upgradeSystem.getCurrentUpgradeExp()
        this.levelBarLabel.string = upgradeSystem.getCurrentLvExp().toString() + "/" + upgradeSystem.getCurrentUpgradeExp().toString()
        this.gifProgressBar.progress = StorgeMgr.getInstance().giftBoxProgress / 100
        this.gifLabel.string = StorgeMgr.getInstance().giftBoxProgress.toString() + "/100"
    }

    onBackToMain() {
        AdManager.getInstance().showInters()
        var callBack = function () {
            UIUtility.getInstance().loadScene("MainScene")
        }.bind(this)
        let data = {
            confirmCallback: callBack,
            cancleCallback: null,
            label: '是否退出到主界面？'
        }
        DialogManager.getInstance().showDlg("ConfirmDialog", data)
    }

    getLevelRewardItem(level: number) {
        for (let item of this.itemList) {
            if (item.level == level) {
                return item
            }
        }
    }
}
