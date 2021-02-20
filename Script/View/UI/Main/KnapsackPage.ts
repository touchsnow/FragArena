import { _decorator, Component, Node } from 'cc';
import { MainUI } from '../MainUI';
import { EquipPage } from './EquipPage';
import { KnapsackSubPage } from './KnapsackSubPage';
import { StorePage } from './StorePage';
import { UpgradePage } from './UpgradePage';
const { ccclass, property } = _decorator;

@ccclass('KnapsackPage')
export class KnapsackPage extends Component {

    @property(Node)
    camera: Node = null

    @property(Node)
    rolePoint: Node = null

    @property(Node)
    backMainButton: Node = null

    @property(MainUI)
    mainUI: MainUI = null

    @property(EquipPage)
    equipPage: EquipPage = null

    @property(StorePage)
    storePage: StorePage = null

    @property(UpgradePage)
    upgradePage: UpgradePage = null

    start() {
        this.backMainButton.on(Node.EventType.TOUCH_END, this.onBackMain, this)
        this.equipPage.init(this)
        this.storePage.init(this)
        this.upgradePage.init(this)
    }

    show() {
        this.camera.active = true
        this.node.active = true
        this.updateKnapsackPage()
        
    }

    hide() {
        this.node.active = false
        this.camera.active = false
        
    }

    updateKnapsackPage() {
        this.equipPage.updateEquiPage()
        this.storePage.updateStore()
    }

    onBackMain() {
        this.mainUI.switchToMainPage()
        this.storePage.saveStore()
        this.equipPage.saveStore()
    }

    getAblePutPage(subPage: KnapsackSubPage) {
        if (this.equipPage.getPageName() != subPage.getPageName() && this.equipPage.node.active) {
            return this.equipPage
        }
        if (this.storePage.getPageName() != subPage.getPageName() && this.storePage.node.active) {
            return this.storePage
        }
        if (this.upgradePage.getPageName() != subPage.getPageName() && this.upgradePage.node.active) {
            return this.upgradePage
        }
    }

    showUpgradePage() {
        this.equipPage.node.active = false
        this.upgradePage.node.active = true
    }

    showEquitPage(){
        this.equipPage.node.active = true
        this.upgradePage.node.active = false
    }

}
