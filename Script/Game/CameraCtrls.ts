import { _decorator, Component, Node, Vec3, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CameraCtrls')
export class CameraCtrls extends Component {

    @property(Node)
    public followTarget: Node = null

    @property(Vec3)
    public offset: Vec3 = new Vec3()

    public originalOffset: Vec3 = new Vec3()
    private targetPos: Vec3 = new Vec3()
    private realPos: Vec3 = new Vec3()

    start() {
        this.originalOffset = this.offset.clone()
    }

    update(deltaTime: number) {
        if (this.followTarget) {
            this.targetPos = new Vec3(this.followTarget.worldPosition.x - this.offset.x, this.followTarget.worldPosition.y - this.offset.y - 2, this.followTarget.worldPosition.z - this.offset.z)
            Vec3.lerp(this.realPos, this.node.worldPosition, this.targetPos, 0.05)
            this.node.setWorldPosition(this.realPos)
        }
    }

    init(target:Node){
        this.followTarget = target
        this.targetPos = new Vec3(this.followTarget.worldPosition.x - this.offset.x, this.followTarget.worldPosition.y - this.offset.y, this.followTarget.worldPosition.z - this.offset.z)
        this.node.setWorldPosition(this.targetPos)
    }
}
