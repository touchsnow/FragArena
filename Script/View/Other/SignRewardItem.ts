import { _decorator, Component, Node, CCInteger, sys, tween, Vec3 } from 'cc';
import { Contants } from '../../Data/Contants';
const { ccclass, property } = _decorator;

@ccclass('SignRewardItem')
export class SignRewardItem extends Component {
    @property(Node)
    ableNode: Node = null

    @property(Node)
    unableNode: Node = null

    @property(Node)
    hadReceieveNode: Node = null

    @property(CCInteger)
    caseValue: number = -1

    /**根据条件初始化领取状态 */
    init() {
        let recieved = this.getRecievedState()
        console.log(recieved)
        if (recieved) {
            this.setHadRecieve()
        } else {
            this.setAbleRecieve()
        }
    }

    /**设置可领取状态 */
    setAbleRecieve() {
        if (this.ableNode) this.ableNode.active = true
        if (this.unableNode) this.unableNode.active = false
        if (this.hadReceieveNode) this.hadReceieveNode.active = false
        this.setRecievedState(false)
    }

    /**设置不可领取状态 */
    setUnableRecieve() {
        if (this.ableNode) this.ableNode.active = false
        if (this.unableNode) this.unableNode.active = true
        if (this.hadReceieveNode) this.hadReceieveNode.active = false
    }

    /**设置已经领取状态 */
    setHadRecieve() {
        if (this.ableNode) this.ableNode.active = false
        if (this.unableNode) this.unableNode.active = false
        if (this.hadReceieveNode) this.hadReceieveNode.active = true
        tween(this.hadReceieveNode.getChildByName("Check"))
            .to(0.2, { scale: new Vec3(1.3, 1.3, 1.3) })
            .to(0.2, { scale: new Vec3(1, 1, 1) })
            .start()
        this.setRecievedState(true)
    }

    getRecievedState() {
        let data = sys.localStorage.getItem(this.node.name + Contants.gameVer)
        if (data) {
            let value = JSON.parse(data);
            return typeof value == 'undefined' || value == null ? false : value;
        }
        return false
    }

    setRecievedState(state: boolean) {
        let data = JSON.stringify(state)
        sys.localStorage.setItem(this.node.name + Contants.gameVer, data)
    }

    getCaseValue() {
        return this.caseValue
    }
}
