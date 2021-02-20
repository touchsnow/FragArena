import { _decorator, Component, Node, SpriteComponent, LabelComponent, resources } from 'cc';
import { BuffPage } from './BuffPage';
const { ccclass, property } = _decorator;

@ccclass('CradItem')
export class CradItem extends Component {

    @property(SpriteComponent)
    sprite: SpriteComponent = null

    @property(LabelComponent)
    laebl: LabelComponent = null

    buffPage: BuffPage = null

    data = null

    start() {
        this.node.on(Node.EventType.TOUCH_END, this.onTouch, this)
    }

    set(buffPage: BuffPage, data) {
        this.buffPage = buffPage
        this.data = data
        // console.log(data)
        this.laebl.string = this.data.label
        let sprite = resources.get(this.data.spritePath)
        if (this.sprite.spriteFrame && sprite) {
            this.sprite.spriteFrame = resources.get(this.data.spritePath)
        }
    }

    onTouch() {
        this.buffPage.setBuff(this)
    }

}
