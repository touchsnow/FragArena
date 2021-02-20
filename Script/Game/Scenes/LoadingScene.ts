import { _decorator, resources, Prefab, director, LabelComponent } from 'cc';
import BaseLoadingScene from '../../../Framework3D/Src/Base/BaseLoadingScene';
import PlatformManager from '../../../Framework3D/Src/Base/PlatformManager';
import UIUtility from '../../../Framework3D/Src/Base/UIUtility';
import { PlayerUpgrade } from '../../Data/PlayerUpgrade';
import { ConfigMgr } from '../Managers/ConfigMgr';
import { ObjectPoolMgr } from '../Managers/ObjectPoolMgr';
import { SignMgr } from '../Managers/SignMgr';
import { StorgeMgr } from '../Managers/StorgeMgr';
const { ccclass, property } = _decorator;

@ccclass('LoadingScene')
export class LoadingScene extends BaseLoadingScene {

    start() {
        ConfigMgr.getInstance().init()
        ObjectPoolMgr.getInstance().init()
        StorgeMgr.getInstance().init()
        SignMgr.getInstance().init()
        let totalExp = StorgeMgr.getInstance().totalExp
        PlayerUpgrade.getInstance().init(totalExp)
        super.start()
        //加载初始角色
        let skin = "Player/" + StorgeMgr.getInstance().currentSkin
        resources.load(skin, Prefab, (err: Error, prefab: Prefab): void => { })
        director.preloadScene("MainScene")
        director.preloadScene("GameScene")

        console.log("当前平台:"+ PlatformManager.getInstance().getChannel())
        
    }

    onLoadResFinished() {
        let skin = "Player/" + StorgeMgr.getInstance().currentSkin
        resources.load(skin, Prefab, (err: Error, prefab: Prefab): void => {
            UIUtility.getInstance().loadScene("MainScene")
        })
    }

}
