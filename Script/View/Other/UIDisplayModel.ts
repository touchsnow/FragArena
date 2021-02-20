import { _decorator, Component, Node, RigidBody, RigidBodyComponent, ColliderComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIDisplayModel')
export class UIDisplayModel extends Component {

    @property([Node])
    enableList: Node[] = []

    @property(RigidBodyComponent)
    rigidbody: RigidBodyComponent = null

    @property(ColliderComponent)
    collider: ColliderComponent = null

    uiModelinit(){
        this.rigidbody.enabled = false
        this.collider.enabled = false
        for (let item of this.enableList) {
            item.active = true
        }
    }

}
