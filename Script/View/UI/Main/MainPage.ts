import { _decorator, Component, Node, LabelComponent, Label, ProgressBar, ProgressBarComponent, instantiate, resources, Prefab, Asset, SpriteComponent } from 'cc';
import DialogManager from '../../../../Framework3D/Src/Base/DialogManager';
import PlatformManager from '../../../../Framework3D/Src/Base/PlatformManager';
import { Contants } from '../../../Data/Contants';
import { UpgradeSystem } from '../../../Data/UpgradeSystem';
import { AdManager } from '../../../Game/Managers/AdManager';
import { ConfigMgr } from '../../../Game/Managers/ConfigMgr';
import { FrangArenaAudioMgr } from '../../../Game/Managers/FrangArenaAudioMgr';
import { StorgeMgr } from '../../../Game/Managers/StorgeMgr';
import { UiNodeBreath } from '../../../Game/Tool/UiNodeBreath';
import { UIDisplayModel } from '../../Other/UIDisplayModel';
import { MainUI } from '../MainUI';
import { LimitTimeReward } from './LimitTimeReward';
import { LoadPage } from './LoadPage';
const { ccclass, property } = _decorator;

@ccclass('MainPage')
export class MainPage extends Component {

    @property(LabelComponent)
    playerName: LabelComponent = null

    @property(LabelComponent)
    palyerLevel: LabelComponent = null

    @property(ProgressBarComponent)
    levelBar: ProgressBarComponent = null

    @property(Node)
    changeNameButton: Node = null

    @property(Node)
    skinButton: Node = null

    @property(Node)
    startButton: Node = null

    @property(Node)
    testButton: Node = null

    @property(Node)
    giftBoxButton: Node = null

    @property(LabelComponent)
    gifBoxLabel: LabelComponent = null

    @property(ProgressBarComponent)
    giftBar: ProgressBarComponent = null

    @property(Node)
    loading: Node = null

    @property(MainUI)
    mainUI: MainUI = null

    @property(Node)
    roleNode: Node = null

    @property(Node)
    loadRoleIcon: Node = null

    @property(LimitTimeReward)
    limitReward: LimitTimeReward = null

    @property(Node)
    mainCamera: Node = null

    @property(Node)
    signButton: Node = null

    @property(Node)
    restricSkinButton: Node = null

    @property(Node)
    lotteryButton: Node = null

    @property(LoadPage)
    loadPage: LoadPage = null

    @property(SpriteComponent)
    selfLoadProgress: SpriteComponent = null

    @property(Node)
    electBox: Node = null

    start() {
        this.changeNameButton.on(Node.EventType.TOUCH_END, this.onChangeNameButton, this)
        this.skinButton.on(Node.EventType.TOUCH_END, this.onSkinButton, this)
        this.startButton.on(Node.EventType.TOUCH_END, this.onStartButton, this)
        this.giftBoxButton.on(Node.EventType.TOUCH_END, this.onGiftBoxButton, this)
        this.testButton.on(Node.EventType.TOUCH_END, this.onTestButton, this)
        this.signButton.on(Node.EventType.TOUCH_END, this.onSignButton, this)
        this.restricSkinButton.on(Node.EventType.TOUCH_END, this.onRestricSkinButton, this)
        this.lotteryButton.on(Node.EventType.TOUCH_END, this.onLotteryButton, this)
        this.electBox.on(Node.EventType.TOUCH_END, this.onElectBox, this)
        this.updateMainPage()

        if (StorgeMgr.getInstance().newUser) {
            // var touchCB = function () {
            //     this.loading.active = true
            //     // this.scheduleOnce(()=>{
            //     //     FrangArenaAudioMgr.getInstance().playFitstAuido()
            //     // },0)
            //     let loadArray = []
            //     ConfigMgr.getInstance().setupAIConfig(4)
            //     let aiConfigs = ConfigMgr.getInstance().getPlayerConfig()
            //     for (let ai of aiConfigs) {
            //         loadArray.push("Player/" + ai.skin)
            //     }

            //     resources.load(loadArray, Asset, (completedCount, totalCount) => {
            //         let progress = completedCount / totalCount;
            //         if (isNaN(progress)) {
            //             return;
            //         }
            //         this.setProgress(progress)
            //     }, () => {
            //         this.setProgress(1)
            //         this.loadPage.playerFinish = true
            //         this.loadPage.loadFinish()
            //     })
            // }.bind(this)
            // let data = {
            //     touchCB: touchCB,
            //     touchNode: this.startButton
            // }
            // DialogManager.getInstance().showDlg("GuideDialog", data)
            this.scheduleOnce(() => {
                this.loading.active = true
                // this.scheduleOnce(()=>{
                //     FrangArenaAudioMgr.getInstance().playFitstAuido()
                // },0)
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
            }, 0)
        }

        if (PlatformManager.getInstance().isOppo()) {
            //@ts-ignore
            if (qg.getSystemInfoSync().platformVersionCode >= 1076) {
                this.electBox.active = true
            }
        }
    }

    show() {
        for (let element of this.roleNode.children) {
            element.active = false
        }
        this.node.active = true
        this.mainCamera.active = true
        this.updateMainPage()
    }

    hide() {
        this.node.active = false
        this.mainCamera.active = false
    }

    onElectBox() {
        AdManager.getInstance().showNavigateBoxPortal()
    }

    updateMainPage() {
        this.playerName.string = StorgeMgr.getInstance().playerName
        let upgradeSystem = new UpgradeSystem()
        upgradeSystem.setExp(StorgeMgr.getInstance().totalExp)
        this.palyerLevel.string = upgradeSystem.getCurrentLevel().toString()
        let currentExp = upgradeSystem.getCurrentLvExp()
        let upgradeExp = upgradeSystem.getCurrentUpgradeExp()
        this.levelBar.progress = currentExp / upgradeExp
        this.gifBoxLabel.string = StorgeMgr.getInstance().giftBoxProgress.toString() + "/100"
        if (StorgeMgr.getInstance().giftBoxProgress >= 100) {
            this.gifBoxLabel.string = "100/100"
            this.gifBoxLabel.node.parent.getComponent(UiNodeBreath).startTween()
        } else {
            this.gifBoxLabel.node.parent.setScale(1, 1, 1)
            this.gifBoxLabel.node.parent.getComponent(UiNodeBreath).stopTween()
        }
        this.giftBar.progress = StorgeMgr.getInstance().giftBoxProgress / 100
        let currentSkin = StorgeMgr.getInstance().currentSkin

        for (let element of this.roleNode.children) {
            element.active = false
        }
        let role = this.roleNode.getChildByName(currentSkin)
        if (role) {
            role.active = true
        } else {
            this.loadRoleIcon.active = true
            resources.load("Player/" + currentSkin, Prefab, (err: Error, prefab: Prefab): void => {
                let role = instantiate(prefab)
                role.setParent(this.roleNode)
                role.setPosition(0, 0, 0)
                role.setRotationFromEuler(0, 0, 0)
                role.getComponent(UIDisplayModel).uiModelinit()
                this.loadRoleIcon.active = false
            })
        }
        this.limitReward.updateLimit()

        if (StorgeMgr.getInstance().ownedSkin.indexOf("Landlubber") !== -1) {
            this.restricSkinButton.active = false
        }

        //是否已领取签到
        let key = new Date().toLocaleDateString() + "SignReward" + Contants.gameVer
        if (StorgeMgr.getInstance().get(key, false)) {
            this.signButton.getChildByName("RedPoint").active = false
        } else {
            this.signButton.getChildByName("RedPoint").active = true
        }


    }

    onChangeNameButton() {
        var callback = function () {
            this.updateMainPage()
        }.bind(this)
        let data = {
            callback: callback
        }
        DialogManager.getInstance().showDlg("ChangeNameDialog", data)
    }

    onSkinButton() {
        this.mainUI.switchToSkinPage()
        console.log("onSkinButton")
    }

    onStartButton() {

        let ownedSkin = StorgeMgr.getInstance().ownedSkin
        let allSkin = ConfigMgr.getInstance().getSkinConfig().json["skinList"]

        if (ownedSkin.length == allSkin.length) {
            Contants.deBugMode = false
            this.loading.active = true
            // this.scheduleOnce(()=>{
            //     FrangArenaAudioMgr.getInstance().playFitstAuido()
            // },0)
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
        } else {
            var callBack = function () {
                Contants.deBugMode = false
                this.loading.active = true
                // this.scheduleOnce(()=>{
                //     FrangArenaAudioMgr.getInstance().playFitstAuido()
                // },0)
            }.bind(this)
            let data = {
                callBack: callBack,
                mainPage: this
            }
            DialogManager.getInstance().showDlg("TrySkinDialog", data)
        }
    }

    onTestButton() {
        Contants.deBugMode = true
        let ownedSkin = StorgeMgr.getInstance().ownedSkin
        let allSkin = ConfigMgr.getInstance().getSkinConfig().json["skinList"]

        if (ownedSkin.length == allSkin.length) {
            this.loading.active = true
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
        } else {
            var callBack = function () {
                this.loading.active = true
            }.bind(this)
            let data = {
                callBack: callBack,
                mainPage: this
            }
            DialogManager.getInstance().showDlg("TrySkinDialog", data)
        }
    }

    onGiftBoxButton() {
        console.log("onGiftBoxButton")
        if (StorgeMgr.getInstance().giftBoxProgress >= 100) {
            StorgeMgr.getInstance().giftBoxProgress -= 100
            StorgeMgr.getInstance().update()
            this.updateMainPage()
            DialogManager.getInstance().showDlg("PurpleBoxGifDialog")
        }
    }

    onSignButton() {
        var callback = function () {
            this.mainUI.updateMainUIDisplay()
            this.updateMainPage()
        }.bind(this)
        let data = {
            closeCallBack: callback
        }
        DialogManager.getInstance().showDlg("SignRewardDialog", data)
    }

    onRestricSkinButton() {
        var callback = function () {
            this.updateMainPage()
        }.bind(this)
        let data = {
            callback: callback
        }
        DialogManager.getInstance().showDlg("RestrictSkinDialog", data)
    }

    onLotteryButton() {
        let colseCallBakc = function () {
            this.mainUI.updateMainUIDisplay()
            this.updateMainPage()
        }.bind(this)
        let data = {
            colseCallBakc: colseCallBakc
        }
        DialogManager.getInstance().showDlg("LotteryDialog", data)
    }

    setProgress(num: number) {
        this.selfLoadProgress.fillRange = num
    }

}
