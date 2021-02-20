import { _decorator, Component, Node, CCInteger, AnimationComponent, SpriteComponent, Sprite, LabelComponent, resources, SpriteFrame } from 'cc';
import { AdManager } from '../../Game/Managers/AdManager';
import { ConfigMgr } from '../../Game/Managers/ConfigMgr';
import { StorgeMgr } from '../../Game/Managers/StorgeMgr';
const { ccclass, property } = _decorator;

@ccclass('GifBox')
export class GifBox extends Component {


    @property(CCInteger)
    commonPro: number = 0

    @property(CCInteger)
    rarePro: number = 0

    @property(CCInteger)
    epicPro: number = 0

    @property(AnimationComponent)
    anim: AnimationComponent = null
    @property(SpriteComponent)
    sprite: SpriteComponent = null

    @property(LabelComponent)
    label: LabelComponent = null

    @property(Node)
    adNode: Node = null

    itemName: string = ""

    hadOpen: boolean = false

    commomList: string[] = ["AttackSpeed1", "Damage1", "BloodReturn1", "Speed1", "MoreExp1", "Armor1", "AttackBloodReturn1"]
    rareList: string[] = ["AttackSpeed2", "Damage2", "BloodReturn2", "Speed2", "MoreExp2", "Armor2", "AttackBloodReturn2"]
    epicList: string[] = ["AttackSpeed3", "Damage3", "BloodReturn3", "Speed3", "MoreExp3", "Armor3", "AttackBloodReturn3"]

    start() {
        this.init()
    }

    init() {
        let allPro = this.commonPro + this.rarePro + this.epicPro
        let randomPro = Math.random() * allPro
        if (randomPro < this.commonPro) {
            let itemName = this.getRandomItem(this.commomList)
            this.setitem(itemName)
        } else if (randomPro < this.commonPro + this.rarePro) {
            let itemName = this.getRandomItem(this.rareList)
            this.setitem(itemName)
        } else {
            let itemName = this.getRandomItem(this.epicList)
            this.setitem(itemName)
        }
    }

    getRandomItem(list: string[]) {
        let randomIndex = Math.floor(Math.random() * list.length)
        return list[randomIndex]
    }

    setitem(cardName: string) {
        let config = ConfigMgr.getInstance().getDrwaCardConfig().json[cardName]
        resources.load(config.spritePath, SpriteFrame, (err, spriteFrame) => {
            if(err){
                return
            }
            if(this.sprite && spriteFrame){
                this.sprite.spriteFrame = spriteFrame
            }
        })
        this.label.string = config.label
        this.itemName = cardName
    }

    onTouch() {
        if (this.hadOpen) return
        if (this.adNode.active) {
            var callback = function () {
                this.anim.play()
                this.adNode.active = false
                this.hadOpen = true
                StorgeMgr.getInstance().storeItemLIst.push(this.itemName)
                StorgeMgr.getInstance().update()
            }.bind(this)
            AdManager.getInstance().showVideo(callback)
        } else {
            this.anim.play()
            this.adNode.active = false
            this.hadOpen = true
            StorgeMgr.getInstance().storeItemLIst.push(this.itemName)
            StorgeMgr.getInstance().update()
        }
    }

    setAd() {
        if (this.hadOpen) {
            this.adNode.active = false
        } else {
            this.adNode.active = true
        }
    }

}
