import { _decorator, Component, Node, LabelComponent, SpriteComponent, loader, SpriteFrame, tween, director, math, resources } from 'cc';
import { ConfigMgr } from '../../../Game/Managers/ConfigMgr';
import { FrangArenaAudioMgr } from '../../../Game/Managers/FrangArenaAudioMgr';
const { ccclass, property } = _decorator;

@ccclass('LoadPage')
export class LoadPage extends Component {

    @property(LabelComponent)
    playerName: LabelComponent = null

    @property(LabelComponent)
    AI1Name: LabelComponent = null

    @property(LabelComponent)
    AI2Name: LabelComponent = null

    @property(LabelComponent)
    AI3Name: LabelComponent = null

    @property(LabelComponent)
    AI4Name: LabelComponent = null

    @property(SpriteComponent)
    playerSprite: SpriteComponent = null

    @property(SpriteComponent)
    AI1Sprite: SpriteComponent = null

    @property(SpriteComponent)
    AI2Sprite: SpriteComponent = null

    @property(SpriteComponent)
    AI3Sprite: SpriteComponent = null

    @property(SpriteComponent)
    AI4Sprite: SpriteComponent = null

    @property(SpriteComponent)
    playerProgress: SpriteComponent = null

    @property(SpriteComponent)
    AI1Progress: SpriteComponent = null

    @property(SpriteComponent)
    AI2Progress: SpriteComponent = null

    @property(SpriteComponent)
    AI3Progress: SpriteComponent = null

    @property(SpriteComponent)
    AI4Progress: SpriteComponent = null

    @property(Node)
    playerSearchRotate: Node = null

    @property(Node)
    AI1SearchRotate: Node = null

    @property(Node)
    AI2SearchRotate: Node = null

    @property(Node)
    AI3SearchRotate: Node = null

    @property(Node)
    AI4SearchRotate: Node = null

    playerFinish: boolean = false
    AI1Finish: boolean = false
    AI2Finish: boolean = false
    AI3Finish: boolean = false
    AI4Finish: boolean = false

    search1Finish: boolean = false
    search2Finish: boolean = false
    search3Finish: boolean = false
    search4Finish: boolean = false

    start() {
        this.AI1Sprite.node.active = false
        this.AI2Sprite.node.active = false
        this.AI3Sprite.node.active = false
        this.AI4Sprite.node.active = false

        this.playerSearchRotate.active = false
        let selfConfig = ConfigMgr.getInstance().getSelfConfig()
        this.playerName.string = selfConfig.name.substring(0, 6)
        resources.load(selfConfig.headSpritePath, (err, texture) => {
            if (err) {
                return null
            } else {
                let sprite = new SpriteFrame()
                console.log(texture._texture)
                if (this.playerSprite && texture) {
                    sprite.texture = texture._texture
                    this.playerSprite.spriteFrame = sprite
                }

            }
        })

        let aiConfig = ConfigMgr.getInstance().getPlayerConfig()
        let ai1 = aiConfig[0]
        resources.load(ai1.headSpritePath, (err, texture) => {
            if (err) {
                return null
            } else {
                let sprite = new SpriteFrame()
                console.log(texture._texture)
                if (this.AI1Sprite && texture) {
                    sprite.texture = texture._texture
                    this.AI1Sprite.spriteFrame = sprite
                }
                this.search2Finish = true
                this.searchFinish()
            }

        })

        let ai2 = aiConfig[1]
        resources.load(ai2.headSpritePath, (err, texture) => {
            if (err) {
                return null
            } else {
                let sprite = new SpriteFrame()
                console.log(texture._texture)
                if (this.AI2Sprite && texture) {
                    sprite.texture = texture._texture
                    this.AI2Sprite.spriteFrame = sprite
                }
                this.search3Finish = true
                this.searchFinish()
            }
        })

        let ai3 = aiConfig[2]
        resources.load(ai3.headSpritePath, (err, texture) => {
            if (err) {
                return null
            } else {
                let sprite = new SpriteFrame()
                console.log(texture._texture)
                if (this.AI3Sprite && texture) {
                    sprite.texture = texture._texture
                    this.AI3Sprite.spriteFrame = sprite
                }
                this.search4Finish = true
                this.searchFinish()
            }
        })

        let ai4 = aiConfig[3]
        resources.load(ai4.headSpritePath, (err, texture) => {
            if (err) {
                return null
            } else {
                let sprite = new SpriteFrame()
                console.log(texture._texture)
                if (this.AI4Sprite && texture) {
                    sprite.texture = texture._texture
                    this.AI4Sprite.spriteFrame = sprite
                }
                this.search1Finish = true
                this.searchFinish()
            }
        })

        let seachTime1 = Math.random() * 4
        let seachTime2 = Math.random() * 4
        let seachTime3 = Math.random() * 4
        let seachTime4 = Math.random() * 4

        let loadTime1 = Math.random() * 6
        let loadTime2 = Math.random() * 6
        let loadTime3 = Math.random() * 6
        let loadTime4 = Math.random() * 6

        tween(this.AI1Progress)
            .delay(seachTime1)
            .call(() => {
                this.AI1Name.string = ai1.name.substring(0, 6)
                this.AI1Sprite.node.active = true
                this.AI1SearchRotate.active = false
            })
            .to(loadTime1, { fillRange: 1 })
            .call(() => {
                this.AI1Finish = true
                this.loadFinish()
            })
            .start()

        tween(this.AI2Progress)
            .delay(seachTime2)
            .call(() => {
                this.AI2Name.string = ai2.name.substring(0, 6)
                this.AI2Sprite.node.active = true
                this.AI2SearchRotate.active = false
            })
            .to(loadTime2, { fillRange: 1 })
            .call(() => {
                this.AI2Finish = true
                this.loadFinish()
            })
            .start()

        tween(this.AI3Progress)
            .delay(seachTime3)
            .call(() => {
                this.AI3Name.string = ai3.name.substring(0, 6)
                this.AI3Sprite.node.active = true
                this.AI3SearchRotate.active = false
            })
            .to(loadTime3, { fillRange: 1 })
            .call(() => {
                this.AI3Finish = true
                this.loadFinish()
            })
            .start()
        tween(this.AI4Progress)
            .delay(seachTime4)
            .call(() => {
                this.AI4Name.string = ai4.name.substring(0, 6)
                this.AI4Sprite.node.active = true
                this.AI4SearchRotate.active = false
            })
            .to(loadTime4, { fillRange: 1 })
            .call(() => {
                this.AI4Finish = true
                this.loadFinish()
            })
            .start()
    }

    loadFinish() {
        console.log("load完成了")
        if (this.AI1Finish && this.AI2Finish && this.AI3Finish && this.playerFinish) {
            director.loadScene("GameScene")
        }
    }

    searchFinish() {
        if (this.search1Finish && this.search2Finish && this.search3Finish && this.search4Finish){
            this.scheduleOnce(()=>{
                FrangArenaAudioMgr.getInstance().playFitstAuido()
            },0)
        }
    }


}
