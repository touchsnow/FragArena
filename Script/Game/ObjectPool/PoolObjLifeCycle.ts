import { _decorator, Component, Node, game } from 'cc';
import { ObjectPoolMgr } from '../Managers/ObjectPoolMgr';
const { ccclass, property } = _decorator;

@ccclass('PoolObjLifeCycle')
export class PoolObjLifeCycle extends Component {

    startLife(callBack?) { }
    endLife(callBack?) { }
    protected recycle() {
        ObjectPoolMgr.getInstance().put(this.node)
    }

}
