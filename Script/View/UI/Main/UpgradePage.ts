import { _decorator, Component, Node, LabelComponent, ProgressBarComponent, resources, instantiate, LayoutComponent } from 'cc';
import DialogManager from '../../../../Framework3D/Src/Base/DialogManager';
import { Contants } from '../../../Data/Contants';
import { CustomEventListener } from '../../../Data/CustomEventListener';
import { ConfigMgr } from '../../../Game/Managers/ConfigMgr';
import { StorgeMgr } from '../../../Game/Managers/StorgeMgr';
import { KnapsackSubPage } from './KnapsackSubPage';
import { StoreItem } from './StoreItem';
const { ccclass, property } = _decorator;

@ccclass('UpgradePage')
export class UpgradePage extends KnapsackSubPage {

    @property(Node)
    currentContent: Node = null

    @property(LabelComponent)
    currtenAddLabel: LabelComponent = null

    @property(Node)
    upgradeContent: Node = null

    @property(LabelComponent)
    upgradeAddLabel: LabelComponent = null

    @property(Node)
    upgradeButton: Node = null

    @property(LabelComponent)
    upgradeMoneyLabel: LabelComponent = null

    @property(Node)
    contentList: Node = null

    @property(ProgressBarComponent)
    progressBar: ProgressBarComponent = null

    @property(Node)
    backButton: Node = null

    @property(Node)
    upgradeButtonSheild: Node = null

    private lastPage: KnapsackSubPage = null
    private currentItem: StoreItem = null
    private upgradedItem: StoreItem = null

    private unlockMoney: number = 0

    getPageName() {
        return "UpgradePage"
    }

    start() {
        this.backButton.on(Node.EventType.TOUCH_END, this.onBackButton, this)
        this.upgradeButton.on(Node.EventType.TOUCH_END, this.onUpgradeButton, this)
    }

    update() {

        this.progressBar.progress = this.getCurrentCount() / 3
        if (this.progressBar.progress >= 1) {
            this.setUpgradeButton(true)
        } else {
            this.setUpgradeButton(false)
        }
    }

    setUpgradeItem(item: StoreItem, lastPage: KnapsackSubPage) {
        console.log(lastPage)
        this.lastPage = lastPage
        this.currentItem = item

        //upgradedItem
        let cardConfig = ConfigMgr.getInstance().getDrwaCardConfig().json
        let itemPrefba = instantiate(resources.get("UI/StoreItem"))
        itemPrefba.setParent(this.upgradeContent)
        itemPrefba.setPosition(0, 0, 0)
        let name = this.currentItem.engName.substring(0,this.currentItem.engName.length-1)
        console.log(name)
        let upgradeItemName = name + (this.currentItem.level + 1).toString()
        let data = cardConfig[upgradeItemName]
        this.upgradedItem = itemPrefba.getComponent(StoreItem)
        this.upgradedItem.set(data, this)
        this.upgradeAddLabel.string = this.upgradedItem.label

        //currentItem
        this.currentItem.node.setParent(this.currentContent)
        this.currentItem.node.setPosition(0, 0, 0)
        this.currentItem.currentPage = this
        this.currtenAddLabel.string = this.currentItem.label

        this.unlockMoney = 3000 * this.currentItem.level
        this.upgradeMoneyLabel.string = this.unlockMoney.toString()
    }

    onBackButton() {

        this.lastPage.putIn(this.currentItem)
        for (let content of this.contentList.children) {
            if (content.children[0]) {
                let item = content.children[0].getComponent(StoreItem)
                if (item) {
                    this.getAblePutPage().putIn(item)
                }
            }
        }
        this.kanpsackPage.showEquitPage()
    }

    putIn(storeItem: StoreItem) {
        if (storeItem.level !== this.currentItem.level) {
            let data = {
                label: "需要相同等级的卡片才能升级"
            }
            DialogManager.getInstance().showDlg("TipDialog", data)
            return
        }
        for (let i = 0; i < this.contentList.children.length; i++) {
            let content = this.contentList.children[i]
            if (!content.children[0]) {
                storeItem.node.setParent(content)
                storeItem.node.setPosition(0, 0, 0)
                storeItem.currentPage = this
                storeItem.putAnim()
                break
            }
            if (i == 2) {
                let item = this.contentList.children[2].children[0].getComponent(StoreItem)
                if (item) {
                    let page = this.getAblePutPage()
                    page.putIn(item)
                    storeItem.node.setParent(content)
                    storeItem.node.setPosition(0, 0, 0)
                    storeItem.currentPage = this
                }
            }
        }
    }

    setUpgradeButton(state: boolean) {
        if (state) {
            this.upgradeButtonSheild.active = false
        } else {
            this.upgradeButtonSheild.active = true
        }
    }

    onUpgradeButton() {
        if (this.progressBar.progress >= 1) {
            let result = StorgeMgr.getInstance().money - this.unlockMoney
            if (result < 0) {
                let tipdata = {
                    label: "金币不足"
                }
                DialogManager.getInstance().showDlg("TipDialog", tipdata)
            } else {
                StorgeMgr.getInstance().money -= this.unlockMoney
                StorgeMgr.getInstance().update()
                CustomEventListener.dispatchEvent(Contants.EventName.UpdataMainUiDiaplay)
                let upgradeItemName = this.upgradedItem.engName
                let data = {
                    itemName: upgradeItemName
                }
                let page = this.lastPage
                console.log(this.lastPage)
                page.putIn(this.upgradedItem)
                this.currentItem.node.destroy()
                for (let content of this.contentList.children) {
                    let item = content.children[0]
                    if (item) {
                        item.destroy()
                    }
                }
                this.kanpsackPage.showEquitPage()
                DialogManager.getInstance().showDlg("UpgradeDialog", data)
            }
        }
    }

    getCurrentCount() {
        let count = 0
        for (let content of this.contentList.children) {
            if (content.children[0]) {
                count += 1
            }
        }
        return count
    }

}
