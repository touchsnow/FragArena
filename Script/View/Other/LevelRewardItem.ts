import { _decorator, Component, Node, SpriteComponent, LabelComponent, resources, SpriteFrame, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LevelRewardItem')
export class LevelRewardItem extends Component {

    @property(SpriteComponent)
    sprite: SpriteComponent = null

    @property(LabelComponent)
    label: LabelComponent = null

    public level: number = 0
    public skinName: string = ""

    initRewardItem(data, level: number) {
        this.level = data.level
        this.skinName = data.skinName
        resources.load(data.spritePath, SpriteFrame, (err, spriteFrame) => {
            if(err){
                return
            }
            if(this.sprite && spriteFrame){
                this.sprite.spriteFrame = spriteFrame
            }
        })
        this.label.string = "Level " + data.level
        this.setState(level)
    }

    setState(level:number) {
        if(this.level<=level){
            this.sprite.color = new Color(255,255,255,255)
        }
    }

}
