import { _decorator, Component, Node, SpriteComponent, LabelComponent, SpriteFrame, resources, find } from 'cc';
import { Contants } from '../../Data/Contants';
import { CustomEventListener } from '../../Data/CustomEventListener';
import { DrawCardMgr } from '../../Game/Managers/DrwaCardMgr';
import { BasePlayer } from '../../Game/Player/BasePlayer';
const { ccclass, property } = _decorator;

@ccclass('CardItem')
export class CardItem {
    @property(SpriteComponent)
    cardSprite: SpriteComponent = null

    @property(LabelComponent)
    cardLabel: LabelComponent = null

    @property(Node)
    selfNode: Node = null

    private itemValue: number = 0
    public engname: string = ""
    private addition: number = 0
    setSprite(spriteFrame: SpriteFrame) {
        if(this.cardSprite && spriteFrame){
            this.cardSprite.spriteFrame = spriteFrame
        }
    }

    setLabel(label: string) {
        this.cardLabel.string = label
    }

    setItem(agrs) {
        this.cardLabel.string = agrs.label
        let sprite = resources.get(agrs.spritePath)
        if(this.cardSprite && sprite){
            this.cardSprite.spriteFrame = resources.get(agrs.spritePath)
        }
        this.itemValue = agrs.caseValue
        this.engname = agrs.engName
        this.addition = agrs.addition
    }

    enableItem(player: BasePlayer) {
      //  console.log("应用Buff：" + this.cardLabel.string)
        DrawCardMgr.getInstance().enableItemBuff(player, this.itemValue, this.addition)
    }
}


@ccclass('DrawCard')
export class DrawCard extends Component {

    private drawing: boolean = false
    private hadDrawItem: string[] = []

    @property([SpriteFrame])
    switchList: SpriteFrame[] = []

    player: BasePlayer = null

    @property(CardItem)
    itemOne: CardItem = null

    @property(CardItem)
    itemTwo: CardItem = null

    @property(CardItem)
    itemThree: CardItem = null

    initDrawCard(player: BasePlayer) {
        this.player = player
        CustomEventListener.on(Contants.EventName.DrawCard, this.draw, this)
    }

    endDrawTime = 1
    currentDrawTime: number = 0
    subDrawTIme: number = 0.05
    currentSubDrawTime: number = 0
    hadDrawWeapon: boolean = false

    update(dt) {
        if (this.drawing) {
            this.currentDrawTime += dt
            this.currentSubDrawTime += dt
            if (this.currentSubDrawTime > this.subDrawTIme) {
                this.currentSubDrawTime = 0
                this.switchSprite()
            }
            if (this.currentDrawTime > this.endDrawTime) {
                this.endDraw()
            }
        }
    }

    draw() {
        this.drawing = true
        this.node.active = true
        this.currentDrawTime = 0
        this.currentSubDrawTime = 0
        this.itemOne.selfNode.off(Node.EventType.TOUCH_END, this.onTouchOne, this)
        this.itemTwo.selfNode.off(Node.EventType.TOUCH_END, this.onTouchTow, this)
        this.itemThree.selfNode.off(Node.EventType.TOUCH_END, this.onTouchThree, this)
        this.itemOne.setLabel("")
        this.itemTwo.setLabel("")
        this.itemThree.setLabel("")
    }

    switchSprite() {
        //console.log('切换卡牌')
        let random1 = Math.ceil(Math.random() * (this.switchList.length - 1))
        let random2 = Math.ceil(Math.random() * (this.switchList.length - 1))
        let random3 = Math.ceil(Math.random() * (this.switchList.length - 1))
        this.itemOne.setSprite(this.switchList[random1])
        this.itemTwo.setSprite(this.switchList[random2])
        this.itemThree.setSprite(this.switchList[random3])
    }

    endDraw() {
        this.drawing = false
        let drawItem = null
        if (!this.hadDrawWeapon) {
            this.hadDrawWeapon = true
            drawItem = DrawCardMgr.getInstance().getRandomWeaponItem(this.hadDrawItem)
        } else {
            drawItem = DrawCardMgr.getInstance().getRandomBuffItem(this.player,[])
        }
        //console.log(drawItem.length)
        if (drawItem.length == 3) {
            this.itemOne.setItem(drawItem[0])
            this.itemTwo.setItem(drawItem[1])
            this.itemThree.setItem(drawItem[2])
            this.itemOne.selfNode.on(Node.EventType.TOUCH_END, this.onTouchOne, this)
            this.itemTwo.selfNode.on(Node.EventType.TOUCH_END, this.onTouchTow, this)
            this.itemThree.selfNode.on(Node.EventType.TOUCH_END, this.onTouchThree, this)
        }
    }

    onTouchOne() {
        this.hadDrawItem.push(this.itemOne.engname)
        this.itemOne.enableItem(this.player)
        this.node.active = false
    }

    onTouchTow() {
        this.hadDrawItem.push(this.itemTwo.engname)
        this.itemTwo.enableItem(this.player)
        this.node.active = false
    }

    onTouchThree() {
        this.hadDrawItem.push(this.itemThree.engname)
        this.itemThree.enableItem(this.player)
        this.node.active = false

    }

    onDestroy() {
        CustomEventListener.off(Contants.EventName.DrawCard, this.draw, this)
    }

}
