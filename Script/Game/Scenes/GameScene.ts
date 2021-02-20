import { _decorator,  Node, instantiate, resources, Prefab } from 'cc';
import BaseScene from '../../../Framework3D/Src/Base/BaseScene';
import { AdManager } from '../Managers/AdManager';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends BaseScene {

    @property(Node)
    evn:Node = null

    start() {
        super.start()
        AdManager.getInstance().hideBanner()
        AdManager.getInstance().showBanner()
        let evn: Node = new Node
        let prefab = resources.get("Evn/Environment", Prefab)
        if (prefab) {
            evn = instantiate(prefab)
            evn.setParent(this.evn)
        }
    }
    
}
