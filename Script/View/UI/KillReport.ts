import { _decorator, Component, Node, LabelComponent, Tween, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('KillReport')
export class KillReport extends Component {

    @property(LabelComponent)
    killerName: LabelComponent = null

    @property(LabelComponent)
    beKillerName: LabelComponent = null

    @property(Node)
    moveNode: Node = null

    tween: Tween<Node> = null

    start() {
        
    }

    report(killerName: string, beKillName: string) {
        if (this.tween) {
            this.tween.stop()
        }
        this.killerName.string = killerName.substring(0,5)
        this.beKillerName.string = beKillName.substring(0,5)
        this.moveNode.setPosition(-550, 0, 0)
        this.tween = tween(this.moveNode)
            .to(0.3, { position: new Vec3(0, 0, 0) },{easing:"circInOut"})
            .start()
    }

}
