import { _decorator, Component, Node, SpriteComponent, Sprite, LabelComponent, resources } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SkinBuff')
export class SkinBuff extends Component {

    @property(SpriteComponent)
    sprite: SpriteComponent = null

    @property(LabelComponent)
    label: LabelComponent = null

    setDisplay(item) {
        this.label.string = item.label
        let sprite = resources.get(item.spritePath)
        if (this.sprite && sprite) {
            this.sprite.spriteFrame = resources.get(item.spritePath)
        }
    }

}
