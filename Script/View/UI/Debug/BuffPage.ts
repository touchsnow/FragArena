import { _decorator, Component, Node, EditBox, instantiate, resources, LabelComponent } from 'cc';
import { AddSpeedBuff } from '../../../Game/Buff/AddSpeedBuff';
import { AttackUpperBuff } from '../../../Game/Buff/AttackUpperBuff';
import { HealthBuff } from '../../../Game/Buff/HealthBuff';
import { InfiniteBulletBuff } from '../../../Game/Buff/InfiniteBulletBuff';
import { ConfigMgr } from '../../../Game/Managers/ConfigMgr';
import { DrawCardMgr } from '../../../Game/Managers/DrwaCardMgr';
import { BasePlayer } from '../../../Game/Player/BasePlayer';
import { CradItem } from './CradItem';
const { ccclass, property } = _decorator;

@ccclass('BuffPage')
export class BuffPage extends Component {

    private player: BasePlayer

    @property(EditBox)
    timeEditBox: EditBox = null

    @property(EditBox)
    additionEdixBox: EditBox = null

    @property(Node)
    enabledButton: Node = null

    @property(Node)
    speedbuff: Node = null

    @property(Node)
    addHpbuff: Node = null

    @property(Node)
    bulletbuff: Node = null

    @property(Node)
    addDamagebuff: Node = null

    @property(Node)
    recoverHpbuff: Node = null

    @property(Node)
    cardContent: Node = null

    @property(LabelComponent)
    currentSellectBuff: LabelComponent = null

    private currentTime: number = 15
    private currentaddition: number = 0.5
    private currentBuff: CradItem = null

    start() {
        this.timeEditBox.node.on('text-changed', this.onTimeEditBox, this);
        this.additionEdixBox.node.on('text-changed', this.onAdditionEdixBox, this);
        this.enabledButton.on(Node.EventType.TOUCH_END, this.onEnabelButton, this)
        this.timeEditBox.string = this.currentTime.toString()
        this.additionEdixBox.string = this.currentaddition.toString()

        let cardConfig = ConfigMgr.getInstance().getDrwaCardConfig()
        let cardList = DrawCardMgr.getInstance().cardItemBuffList
       // console.log(cardList)
        for (let card of cardList) {
            let cardItem = instantiate(resources.get("UI/CardItem"))
        //    console.log(cardItem)
            cardItem.getComponent(CradItem).set(this, cardConfig.json[card])
            cardItem.setParent(this.cardContent)
        }

        this.speedbuff.on(Node.EventType.TOUCH_END, this.onSpeedBuff, this)
        this.addHpbuff.on(Node.EventType.TOUCH_END, this.onAddHpbuff, this)
        this.bulletbuff.on(Node.EventType.TOUCH_END, this.onBulletbuff, this)
        this.addDamagebuff.on(Node.EventType.TOUCH_END, this.onAddDamagebuff, this)
        this.recoverHpbuff.on(Node.EventType.TOUCH_END, this.onRecoverHpbuff, this)
    }

    onEnabelButton() {
        if (this.currentBuff) {
            DrawCardMgr.getInstance().enableItemBuff(this.player, this.currentBuff.data.caseValue, this.currentaddition)
        }
    }

    initBuffPage(player: BasePlayer) {
        this.player = player
    }

    onTimeEditBox(editbox: EditBox) {
        this.currentTime = Number(editbox.string)
    }

    onAdditionEdixBox(editbox: EditBox) {
        this.currentaddition = Number(editbox.string)
    }

    setBuff(cardItem: CradItem) {
        this.currentSellectBuff.string = cardItem.data.label
        this.currentBuff = cardItem
    }

    onSpeedBuff() {
        this.player.node.addComponent(AddSpeedBuff).debugStartBuff(this.player, "AddSpeedBuff", this.currentTime, this.currentaddition)
    }

    onAddHpbuff() {
        this.player.hunmanAttr.currentHp += this.player.hunmanAttr.maxHp * this.currentaddition
        if (this.player.hunmanAttr.currentHp > this.player.hunmanAttr.maxHp) {
            this.player.hunmanAttr.currentHp = this.player.hunmanAttr.maxHp
        }
    }

    onBulletbuff() {
        this.player.node.addComponent(InfiniteBulletBuff).debugStartBuff(this.player, "InfiniteBulletBuff", this.currentTime, this.currentaddition)
    }

    onAddDamagebuff() {
        this.player.node.addComponent(AttackUpperBuff).debugStartBuff(this.player, "AttackUpperBuff", this.currentTime, this.currentaddition)
    }

    onRecoverHpbuff() {
        this.player.node.addComponent(HealthBuff).debugStartBuff(this.player, "HealthBuff", this.currentTime, this.currentaddition)
    }

}
