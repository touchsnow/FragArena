import { _decorator, Component, Node, LabelComponent, resources, instantiate, find, Vec3, tween } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../Framework3D/Src/Base/DialogManager';
import { Contants } from '../../Data/Contants';
import { CustomEventListener } from '../../Data/CustomEventListener';
import { AdManager } from '../../Game/Managers/AdManager';
import { StorgeMgr } from '../../Game/Managers/StorgeMgr';
import { NodeMotion } from '../Tool/NodeMotion';
const { ccclass, property } = _decorator;

@ccclass('MainUI')
export class MainUI extends Component {

    @property(Node)
    mainPageNode: Node = null

    @property(Node)
    skinPageNode: Node = null

    @property(Node)
    knapsackPageNode: Node = null

    @property(LabelComponent)
    moneyLabel: LabelComponent = null

    @property(Node)
    addMoneyButton: Node = null

    @property(Node)
    settingButton: Node = null

    @property(Node)
    knapsackPageButton: Node = null

    private mainPage = null

    private skinPage = null

    private knapsackPage = null

    start() {
        this.mainPage = this.mainPageNode.getComponent("MainPage")
        this.skinPage = this.skinPageNode.getComponent("SkinPage")
        this.knapsackPage = this.knapsackPageNode.getComponent("KnapsackPage")
        this.addMoneyButton.on(Node.EventType.TOUCH_END, this.onAddMoneyButton, this)
        this.settingButton.on(Node.EventType.TOUCH_END, this.onSettingButton, this)
        this.knapsackPageButton.on(Node.EventType.TOUCH_END, this.switchToKnapsackPage, this)
        CustomEventListener.on(Contants.EventName.UpdataMainUiDiaplay, this.updateMainUIDisplay, this)
        this.updateMainUIDisplay()
        StorgeMgr.getInstance().trySkin = ""
        StorgeMgr.getInstance().update()

        var signCloseCB = function () {
            this.mainPage.updateMainPage()
        }.bind(this)
        let key = new Date().toLocaleDateString() + "SignReward" + Contants.gameVer
        if (!StorgeMgr.getInstance().newUser && !StorgeMgr.getInstance().get(key, false)) {
            let data = {
                closeCallBack: signCloseCB
            }
            DialogManager.getInstance().showDlg("SignRewardDialog", data)
        }

    }

    onStartButton() {

    }

    switchToSkinPage() {
        this.mainPage.hide()
        this.knapsackPage.hide()
        this.skinPage.show()
    }

    switchToMainPage() {
        this.skinPage.hide()
        this.knapsackPage.hide()
        this.mainPage.show()
        AdManager.getInstance().showInters()
    }

    switchToKnapsackPage() {
        this.skinPage.hide()
        this.knapsackPage.show()
        this.mainPage.hide()
    }

    updateMainUIDisplay() {
        this.moneyLabel.string = StorgeMgr.getInstance().money.toString()
    }

    onAddMoneyButton() {
        var callback = function () {
            var videoCallback = function () {
                this.addMoneyAnim(10, 20)
                let data = {
                    label: "恭喜获得金币200"
                }
                DialogManager.getInstance().showDlg("TipDialog", data)
                this.updateMainUIDisplay()
            }.bind(this)
            AdManager.getInstance().showVideo(videoCallback)
        }.bind(this)

        let data = {
            confirmCallback: callback,
            cancleCallback: null,
            label: "观看视频可获得200金币"
        }
        DialogManager.getInstance().showDlg("ConfirmDialog", data)
    }

    onSettingButton() {
        DialogManager.getInstance().showDlg("SettingDialog")
    }

    addMoneyAnim(count: number, num: number) {
        AudioManager.getInstance().playEffectByPath("ReceivingMoney")
        let endPos = this.addMoneyButton.getChildByName("MoneyIcon").getWorldPosition()
        let icon = this.addMoneyButton.getChildByName("MoneyIcon")
        let startPos = this.node.getWorldPosition()
        for (let i = 0; i < count; i++) {
            let moneyNode = instantiate(resources.get("UI/Money"))
            moneyNode.setParent(find("Canvas"))
            var endCB = function () {
                StorgeMgr.getInstance().money += num
                StorgeMgr.getInstance().update()
                this.updateMainUIDisplay()
                icon.setScale(1.1, 1.1, 1.1)
                tween(icon)
                    .to(0.1, { scale: new Vec3(1, 1, 1) })
                    .start()
            }.bind(this)
            moneyNode.addComponent(NodeMotion).init(moneyNode, startPos, endPos, endCB)
        }
    }

    addEnergy(count: number, num: number) {
        let endPos = this.mainPage.giftBoxButton.getChildByName("EnegryIcon").getWorldPosition()
        let icon = this.mainPage.giftBoxButton.getChildByName("EnegryIcon")
        let startPos = this.node.getWorldPosition()
        for (let i = 0; i < count; i++) {
            let energyNode = instantiate(resources.get("UI/Energy"))
            energyNode.setParent(find("Canvas"))
            var endCB = function () {
                StorgeMgr.getInstance().giftBoxProgress += num
                StorgeMgr.getInstance().update()
                this.mainPage.updateMainPage()
                icon.setScale(1.1, 1.1, 1.1)
                tween(icon)
                    .to(0.1, { scale: new Vec3(1, 1, 1) })
                    .start()
            }.bind(this)
            energyNode.addComponent(NodeMotion).init(energyNode, startPos, endPos, endCB)
        }
    }

    onDestroy() {
        CustomEventListener.off(Contants.EventName.UpdataMainUiDiaplay, this.updateMainUIDisplay, this)
    }

}
