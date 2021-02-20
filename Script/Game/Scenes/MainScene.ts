import { _decorator, Component, Node, resources, Prefab, instantiate } from 'cc';
import BaseScene from '../../../Framework3D/Src/Base/BaseScene';
import UIUtility from '../../../Framework3D/Src/Base/UIUtility';
import { AdManager } from '../Managers/AdManager';
const { ccclass, property } = _decorator;

@ccclass('MainScene')
export class MainScene extends BaseScene {

    @property(Node)
    rolePoint: Node = null

    start() {
        super.start()
        AdManager.getInstance().hideBanner()
        AdManager.getInstance().showBanner()
    }

}
