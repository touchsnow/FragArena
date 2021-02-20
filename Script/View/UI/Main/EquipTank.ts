import { _decorator, Component, Node, SpriteComponent, Sprite, CCInteger, resources, instantiate, CCBoolean } from 'cc';
import DialogManager from '../../../../Framework3D/Src/Base/DialogManager';
import { Contants } from '../../../Data/Contants';
import { CustomEventListener } from '../../../Data/CustomEventListener';
import { AdManager } from '../../../Game/Managers/AdManager';
import { ConfigMgr } from '../../../Game/Managers/ConfigMgr';
import { StorgeMgr } from '../../../Game/Managers/StorgeMgr';
import { KnapsackSubPage } from './KnapsackSubPage';
import { StoreItem } from './StoreItem';
const { ccclass, property } = _decorator;

@ccclass('EquipTank')
export class EquipTank extends Component {

    @property(SpriteComponent)
    sprite: SpriteComponent = null

    @property(CCInteger)
    unlockMoney: number = 0

    @property(Node)
    lockNode: Node = null

    @property(KnapsackSubPage)
    knapsackSubPage: KnapsackSubPage = null

    @property(CCBoolean)
    isFree: boolean = false

    @property(CCBoolean)
    isAdUnclok: boolean = false

    private tankName: string = ""

    start() {
        this.tankName = this.node.name
        this.updateTank()
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
    }

    updateTank() {
        if (this.getUnlockState() || this.isFree) {
            this.lockNode.active = false
            let itemName = this.getStorgeItem()
            if (itemName) {
                let itemPrefba = instantiate(resources.get("UI/StoreItem"))
                itemPrefba.setParent(this.node)
                itemPrefba.setPosition(0, 0, 0)
                let cardConfig = ConfigMgr.getInstance().getDrwaCardConfig().json
                let data = cardConfig[itemName]
                itemPrefba.getComponent(StoreItem).set(data, this.knapsackSubPage)
            }
        }
    }

    setUnlockState() {
        this.lockNode.active = false
        let key = this.tankName + "UnLock" + Contants.gameVer
        StorgeMgr.getInstance().set(key, true)
    }

    getUnlockState() {
        let key = this.tankName + "UnLock" + Contants.gameVer
        return StorgeMgr.getInstance().get(key, false)
    }

    setStorgeItem(value: string) {
        let key = this.tankName + "itemName" + Contants.gameVer
        StorgeMgr.getInstance().set(key, value)
    }

    getStorgeItem() {
        let key = this.tankName + "itemName" + Contants.gameVer
        return StorgeMgr.getInstance().get(key, null)
    }

    setItem(itemStore: StoreItem) {
        if (this.node.children[3]) {
            let currentItem = this.node.children[3].getComponent(StoreItem)
            if (currentItem) {
                let putInPage = this.knapsackSubPage.getAblePutPage()
                putInPage.putIn(currentItem)
            }
        }
        itemStore.node.setParent(this.node)
        itemStore.node.setPosition(0, 0, 0)
    }

    unLock() {
        if (!this.getUnlockState()) {
            this.lockNode.active = false
            this.setUnlockState()
        }
    }

    onTouch() {
        if (!this.lockNode.active) return
        if (this.isAdUnclok) {
            var confirmCallback = function () {
                var vedioCB = function () {
                    CustomEventListener.dispatchEvent(Contants.EventName.UpdataMainUiDiaplay)
                    this.unLock()
                }.bind(this)
                AdManager.getInstance().showVideo(vedioCB)
            }.bind(this)
            let data = {
                confirmCallback: confirmCallback,
                cancleCallback: null,
                label: "是否观看视频解锁此技能槽"
            }
            DialogManager.getInstance().showDlg("ConfirmDialog", data)
        } else {
            var confirmCallback = function () {
                let result = StorgeMgr.getInstance().money - this.unlockMoney
                if (result >= 0) {
                    StorgeMgr.getInstance().money -= this.unlockMoney
                    StorgeMgr.getInstance().update()
                    CustomEventListener.dispatchEvent(Contants.EventName.UpdataMainUiDiaplay)
                    this.unLock()
                } else {
                    let tipdata = {
                        label: "金币不足，无法解锁"
                    }
                    DialogManager.getInstance().showDlg("TipDialog", tipdata)
                }
            }.bind(this)

            let data = {
                confirmCallback: confirmCallback,
                cancleCallback: null,
                label: "是否花费" + this.unlockMoney.toString() + "金币解锁此技能槽"
            }
            DialogManager.getInstance().showDlg("ConfirmDialog", data)
        }
    }

    saveTank() {
        if (this.node.children[3]) {
            let currentItem = this.node.children[3].getComponent(StoreItem)
            if (currentItem) {
                this.setStorgeItem(currentItem.engName)
                return currentItem.engName
            } else {
                this.setStorgeItem(null)
                return null
            }
        } else {
            this.setStorgeItem(null)
            return null
        }
    }

}
