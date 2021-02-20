import { _decorator, Component, Node, BatchingUtility, find, CCBoolean, MeshColliderComponent, MeshRenderer, MeshCollider, RigidBodyComponent, CCInteger } from 'cc';
import { Contants } from '../../Data/Contants';
const { ccclass, property } = _decorator;

@ccclass('StaticNode')
export class StaticNode extends Component {

    @property(CCBoolean)
    spwanColliderMesh: boolean = false

    @property(CCBoolean)
    enabledMeshRenderer: boolean = false

    @property(CCInteger)
    groupIndex: number = 0

    start() {

        let staticNode = find("Evn/Environment/StaticEnvironment/" + this.node.name) as Node
        //console.log(staticNode)
        BatchingUtility.batchStaticModel(this.node, staticNode)
        if (this.spwanColliderMesh) {
            this.scheduleOnce(() => {
                let colliderComt = staticNode.addComponent(MeshColliderComponent)
                let meshComt = staticNode.getComponent(MeshRenderer)
                if (meshComt) colliderComt.mesh = meshComt.mesh
                if (this.enabledMeshRenderer) {
                    meshComt.enabled = false
                }
                this.scheduleOnce(() => {
                    colliderComt.isTrigger = true
                    colliderComt.isTrigger = false
                }, 0)
                //设置组
                let groupList = Contants.MaskGroups
                colliderComt.setGroup(groupList[this.groupIndex])
                colliderComt.setMask(groupList[this.groupIndex])
                colliderComt.addMask(groupList[0])
                colliderComt.addMask(groupList[1])
                colliderComt.addMask(groupList[2])
                colliderComt.addMask(groupList[3])
                colliderComt.addMask(groupList[4])
                colliderComt.addMask(groupList[5])

                colliderComt.addGroup(groupList[0])
                colliderComt.addGroup(groupList[1])
                colliderComt.addGroup(groupList[2])
                colliderComt.addGroup(groupList[3])
                colliderComt.addGroup(groupList[4])
                colliderComt.addGroup(groupList[5])
            }, 0)
        }
        // let meshComt = staticNode.getComponent(MeshRenderer)
        // meshComt.enabled = false
    }
}
