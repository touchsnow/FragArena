import { _decorator, Component, spriteAssembler, SpriteComponent, resources, SpriteFrame, Node, LabelComponent, tween, Vec3 } from 'cc';
import AudioManager from '../../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../../Framework3D/Src/Base/DialogManager';
import { KnapsackSubPage } from './KnapsackSubPage';
const { ccclass, property } = _decorator;

@ccclass('StoreItem')
export class StoreItem extends Component {

    public label: string = ""
    public spritePath: string = ""
    public caseValue: number = -1
    public engName: string = ""
    public addition: number = 0
    public level: number = 0

    public currentPage: KnapsackSubPage = null

    @property(SpriteComponent)
    sprite: SpriteComponent = null

    @property(LabelComponent)
    levelLabel: LabelComponent = null

    @property(LabelComponent)
    additionLabel: LabelComponent = null

    start() {
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
    }

    set(data, knapsackSubPage: KnapsackSubPage) {
        Object.assign(this, data)
        console.log(this.sprite)
        resources.load(this.spritePath, SpriteFrame, (err, spriteFrame) => {
            if (err) return
            if(this.sprite && spriteFrame){
                this.sprite.spriteFrame = spriteFrame
            }
        })
        this.currentPage = knapsackSubPage
        this.levelLabel.string = this.level.toString()
        this.additionLabel.string = this.label
    }

    onTouch() {
        //判断放进的页面
        let currentPageName = this.currentPage.getPageName()
        let putInPage = this.currentPage.getAblePutPage()

        if (currentPageName == "UpgradePage" || putInPage.getPageName() == "UpgradePage") {
            putInPage.putIn(this)
        } else if (currentPageName == "EquipPage") {

            let equitActive = false
            let unEquitActive = true
            let upgrafeActive = true
            if (this.level == 3) {
                upgrafeActive = false
            }
            let itemName = this.engName

            var equitCallback = function () {
            }.bind(this)
            var unEquitCallback = function () {
                putInPage.putIn(this)
            }.bind(this)
            var upgradeCallback = function () {
                this.currentPage.kanpsackPage.showUpgradePage()
                this.currentPage.kanpsackPage.upgradePage.setUpgradeItem(this, this.currentPage.kanpsackPage.equipPage)
            }.bind(this)

            let data = {
                equitCallback: equitCallback,
                unEquitCallback: unEquitCallback,
                upgradeCallback: upgradeCallback,
                equitButtonActive: equitActive,
                unEquitButtonActive: unEquitActive,
                upgradeButtonActive: upgrafeActive,
                itemName: itemName
            }
            DialogManager.getInstance().showDlg("StoreItemDialog", data)

        } else if (currentPageName == "StorePage") {
            let equitActive = true
            let unEquitActive = false
            let upgrafeActive = true
            if (this.level == 3) {
                upgrafeActive = false
            }
            let itemName = this.engName
            var equitCallback = function () {
                putInPage.putIn(this)
            }.bind(this)
            var unEquitCallback = function () {
                console.log("unEquitCallback")
            }.bind(this)

            var upgradeCallback = function () {
                this.currentPage.kanpsackPage.showUpgradePage()
                this.currentPage.kanpsackPage.upgradePage.setUpgradeItem(this, this.currentPage.kanpsackPage.storePage)
            }.bind(this)

            let data = {
                equitCallback: equitCallback,
                unEquitCallback: unEquitCallback,
                upgradeCallback: upgradeCallback,
                equitButtonActive: equitActive,
                unEquitButtonActive: unEquitActive,
                upgradeButtonActive: upgrafeActive,
                itemName: itemName
            }
            
            DialogManager.getInstance().showDlg("StoreItemDialog", data)
        }

    }

    putAnim() {
        AudioManager.getInstance().playEffectByPath("StoreItem")
        this.node.setScale(1.2, 1.2, 1.2)
        tween(this.node)
            .to(0.1, { scale: new Vec3(1, 1, 1) })
            .start()
    }
}
