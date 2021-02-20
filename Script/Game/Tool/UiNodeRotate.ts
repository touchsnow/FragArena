import { _decorator, Component, Node, CCInteger } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UiNodeRotate')
export class UiNodeRotate extends Component {

    @property(CCInteger)
    speed: number = 0

    start() {
        
    }

    update(dt: number) {
        let pos = this.node.eulerAngles.clone()
        pos.z += this.speed * dt
        this.node.setRotationFromEuler(pos.x, pos.y, pos.z)
    }


}
