import { _decorator, Component, Node, tween, Vec3, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UiNodeBreath')
export class UiNodeBreath extends Component {

    private tween: Tween<Node> = null

    onLoad() {
        this.tween = tween(this.node)
            .to(0.6, { scale: new Vec3(1.1, 1.1, 1.1) })
            .to(0.6, { scale: new Vec3(1, 1, 1) })
            .union()
            .repeatForever()
    }

    start() {
        this.tween.start()
    }

    startTween() {
        this.tween.start()
    }

    stopTween() {
        this.scheduleOnce(()=>{
            this.node.setScale(1,1,1)
            this.tween.stop()
        },0)

    }

}
