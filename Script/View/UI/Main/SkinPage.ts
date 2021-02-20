import { _decorator, Component, Node, JsonAsset, resources, instantiate, UITransform, director, TypeScript, view, Vec3, tween, LabelComponent, Label } from 'cc';
import DialogManager from '../../../../Framework3D/Src/Base/DialogManager';
import { ConfigMgr } from '../../../Game/Managers/ConfigMgr';
import { StorgeMgr } from '../../../Game/Managers/StorgeMgr';
import { MainUI } from '../MainUI';
import { SkinBuff } from './SkinBuff';
import { SkinItem } from './SkinItem';
const { ccclass, property } = _decorator;

@ccclass('SkinPage')
export class SkinPage extends Component {

    @property(Node)
    content: Node = null

    @property(Node)
    fillNode: Node = null

    @property(Node)
    centerNode: Node = null

    @property(Node)
    touchNode: Node = null

    @property([SkinBuff])
    skinBuffs: SkinBuff[] = []

    @property(LabelComponent)
    skinName: LabelComponent = null

    @property(LabelComponent)
    skinDescribe: LabelComponent = null

    @property(Node)
    selletButton: Node = null

    @property(Node)
    unlockButton: Node = null

    @property(Node)
    cannotUnlockButton: Node = null

    @property(Node)
    backMianButton: Node = null

    @property(MainUI)
    mainUI: MainUI = null

    @property(Node)
    unlockConditionNode: Node = null

    @property(LabelComponent)
    unlockLevelLabel: LabelComponent = null

    @property(LabelComponent)
    unlcokMoneyLabel: LabelComponent = null

    @property(Node)
    roleNode = null

    @property(LabelComponent)
    unlockLabel: LabelComponent = null

    private skinList: SkinItem[] = []
    private sellectSkin: SkinItem = null

    start() {
        let contentSize = director.getWinSize()
        this.fillNode.getComponent(UITransform).setContentSize(contentSize.width / 2 - 200, 100)
        let skinConfig = ConfigMgr.getInstance().getSkinConfig().json
        let skinList = skinConfig["skinList"]
        for (let skinItem of skinList) {
            let prefab = instantiate(resources.get("UI/SkinItem"))
            prefab.setParent(this.content)
            let item = prefab.getComponent(SkinItem)
            item.init(skinConfig[skinItem], this)
            this.skinList.push(item)
        }
        let lasterNode = instantiate(this.fillNode)
        lasterNode.setParent(this.content)
        this.touchNode.on(Node.EventType.TOUCH_END, this.onTouchEnd, this)
        this.backMianButton.on(Node.EventType.TOUCH_END, this.onBackMianButton, this)
        this.selletButton.on(Node.EventType.TOUCH_END, this.onSellectButton, this)
        this.unlockButton.on(Node.EventType.TOUCH_END, this.onUnlockButton, this)
        this.cannotUnlockButton.on(Node.EventType.TOUCH_END, this.onCannotUnlockButton, this)
        this.scheduleOnce(() => {
            for (let skinItem of this.skinList) {
                if (skinItem.engName == StorgeMgr.getInstance().currentSkin) {
                    this.sellectSkin = skinItem
                    break
                }
            }
            let offset = this.sellectSkin.node.worldPosition.clone().subtract(this.centerNode.worldPosition)
            let targetPos = this.content.worldPosition.clone().subtract(offset)
            this.content.setWorldPosition(targetPos)
            this.onTouchEnd()
        }, 0)
    }

    show() {
        for (let element of this.roleNode.children) {
            element.active = false
        }
        this.node.active = true
        for(let skin of this.skinList){
            skin.updateDisplay()
        }
    }

    hide() {
        this.node.active = false
    }

    onTouchEnd() {
        let sellectSkin: SkinItem = null
        let minDis = 10000
        for (let item of this.skinList) {
            let dis = Vec3.distance(this.centerNode.worldPosition, item.node.worldPosition)
            if (minDis > dis) {
                minDis = dis
                sellectSkin = item
            }
        }
        if (sellectSkin) {
            let offset = sellectSkin.node.worldPosition.clone().subtract(this.centerNode.worldPosition)
            let targetPos = this.content.worldPosition.clone().subtract(offset)
            for (let skinBuff of this.skinBuffs) {
                skinBuff.node.active = false
            }
            this.skinName.string = sellectSkin.cnName
            this.skinDescribe.string = sellectSkin.describe
            let skinBuffList = sellectSkin.buffList
            for (let i = 0; i < skinBuffList.length; i++) {
                let skinBuff = this.skinBuffs[i]
                let buffConfig = ConfigMgr.getInstance().getDrwaCardConfig().json[skinBuffList[i]]
                skinBuff.setDisplay(buffConfig)
                skinBuff.node.active = true
            }
            tween(this.content)
                .to(0.2, { worldPosition: targetPos })
                .start()
            this.sellectSkin = sellectSkin
            let unlockCondition = sellectSkin.getUnlockState()

            this.selletButton.active = false
            this.unlockButton.active = false
            this.cannotUnlockButton.active = false

            //已经解锁
            if (unlockCondition == 0) {
                this.selletButton.active = true
                this.unlockConditionNode.active = false
            }
            //未解锁
            if (unlockCondition == 1) {
                this.unlockButton.active = true
                this.unlockConditionNode.active = true
                this.unlockLevelLabel.string = "需等级：" + this.sellectSkin.unlockLevel.toString()
                this.unlcokMoneyLabel.string = "：" + this.sellectSkin.unlockMoney.toString()
                this.unlockLabel.string = this.sellectSkin.unlockLabel
            }
            //不能解锁
            if (unlockCondition == 2) {
                this.cannotUnlockButton.active = true
                this.unlockButton.active = true
                this.unlockConditionNode.active = true
                this.unlockLevelLabel.string = "需等级：" + this.sellectSkin.unlockLevel.toString()
                this.unlcokMoneyLabel.string = "：" + this.sellectSkin.unlockMoney.toString()
                this.unlockLabel.string = this.sellectSkin.unlockLabel
            }
            //特殊解锁
            if(unlockCondition == 3){
                this.cannotUnlockButton.active = true
                this.unlockButton.active = true
                this.unlockConditionNode.active = true
                this.unlockLevelLabel.string = "需等级：" + this.sellectSkin.unlockLevel.toString()
                this.unlcokMoneyLabel.string = "：" + this.sellectSkin.unlockMoney.toString()
                this.unlockLabel.string = this.sellectSkin.unlockLabel
            }
        }
    }

    onBackMianButton() {
        this.mainUI.switchToMainPage()
    }

    onSellectButton() {
        if (this.sellectSkin) {
            StorgeMgr.getInstance().currentSkin = this.sellectSkin.engName
            StorgeMgr.getInstance().update()
        }
        this.mainUI.switchToMainPage()
    }

    onUnlockButton() {
        if (this.sellectSkin.unlockMoney > StorgeMgr.getInstance().money) {
            let data = {
                label: "金币不够"
            }
            DialogManager.getInstance().showDlg("TipDialog", data)
        } else {
            this.sellectSkin.uplock()
            this.onTouchEnd()
        }
    }

    onCannotUnlockButton() {
        // if (this.sellectSkin.unlockMoney > StorgeMgr.getInstance().money) {
        //     let data = {
        //         label: "金币不够"
        //     }
        //     DialogManager.getInstance().showDlg("TipDialog", data)
        // } else {
        //     this.sellectSkin.uplock()
        //     this.onTouchEnd()
        // }
    }
}
