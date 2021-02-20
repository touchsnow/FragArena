import { _decorator, Component, Node, Vec3, SpriteComponent, resources, SpriteFrame, UITransform, color, Color } from 'cc';
import { Contants } from '../../../Data/Contants';
import { CustomEventListener } from '../../../Data/CustomEventListener';
import { UpgradeSystem } from '../../../Data/UpgradeSystem';
import { StorgeMgr } from '../../../Game/Managers/StorgeMgr';
import { SkinPage } from './SkinPage';
const { ccclass, property } = _decorator;

@ccclass('SkinItem')
export class SkinItem extends Component {

    @property(SpriteComponent)
    sprite: SpriteComponent = null

    @property(Node)
    lockNode: Node = null

    private centerNode: Node = null
    private dis: number = 0

    public describe: string = ""
    public cnName: string = ""
    public engName: string = ""
    public spritePath: string = ""
    public buffList: string[] = []
    public unlockLevel: number = 0
    public unlockMoney: number = 0
    public unlockLabel: string = ""

    init(item, skinPage: SkinPage) {
        this.centerNode = skinPage.centerNode
        this.cnName = item.cnName
        this.describe = item.describe
        this.spritePath = item.spritePath
        this.engName = item.engName
        this.buffList = item.buffList
        this.unlockLevel = item.unlockLevel
        this.unlockMoney = item.unlockMoney
        this.unlockLabel = item.unlockLabel
        let skinList = StorgeMgr.getInstance().ownedSkin
        if (skinList.indexOf(this.engName) == -1) {
            this.sprite.color = new Color(30, 30, 30, 255)
        }
        resources.load(this.spritePath, SpriteFrame, (err, spriteFrame) => {
            if (err) {
                return
            }
            if (this.sprite && spriteFrame) {
                this.sprite.spriteFrame = spriteFrame
            }
        })
        if (this.getUnlockState() == 3) {
            this.lockNode.active = true
        }
    }

    update() {
        this.dis = Vec3.distance(this.centerNode.worldPosition, this.node.worldPosition)
        if (this.dis > 800) this.dis = 800
        let scale = -0.000625 * this.dis + 1
        this.node.setScale(scale, scale, scale)
    }


    getUnlockState() {

        let skinList = StorgeMgr.getInstance().ownedSkin
        let upgradesystem = new UpgradeSystem()
        upgradesystem.setExp(StorgeMgr.getInstance().totalExp)
        let currentLevel = upgradesystem.getCurrentLevel()
        if (skinList.indexOf(this.engName) !== -1) {
            return 0
        } else if (this.unlockLabel !== "") {
            return 3
        }
        else if (this.unlockLevel <= currentLevel) {
            return 1
        }
        else {
            return 2
        }
    }

    uplock() {
        this.sprite.color = new Color(255, 255, 255, 255)
        this.lockNode.active = false
        StorgeMgr.getInstance().money -= this.unlockMoney
        StorgeMgr.getInstance().ownedSkin.push(this.engName)
        StorgeMgr.getInstance().update()
        CustomEventListener.dispatchEvent(Contants.EventName.UpdataMainUiDiaplay)

    }

    updateDisplay() {
        let skinList = StorgeMgr.getInstance().ownedSkin
        if (skinList.indexOf(this.engName) == -1) {
            this.sprite.color = new Color(30, 30, 30, 255)
        } else {
            this.sprite.color = new Color(255, 255, 255, 255)
        }
        if (this.getUnlockState() == 3) {
            this.lockNode.active = true
        }
        if (this.getUnlockState() == 0) {
            this.lockNode.active = false
        }
    }

}
