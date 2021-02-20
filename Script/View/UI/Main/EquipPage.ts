import { _decorator, Component, Node, LabelComponent } from 'cc';
import { ConfigMgr } from '../../../Game/Managers/ConfigMgr';
import { StorgeMgr } from '../../../Game/Managers/StorgeMgr';
import { EquipTank } from './EquipTank';
import { KnapsackSubPage } from './KnapsackSubPage';
import { SkinBuff } from './SkinBuff';
import { StoreItem } from './StoreItem';
const { ccclass, property } = _decorator;

@ccclass('EquipPage')
export class EquipPage extends KnapsackSubPage {

    @property(LabelComponent)
    skinName: LabelComponent = null

    @property(LabelComponent)
    skinDescribe: LabelComponent = null

    @property([SkinBuff])
    skinBuffs: SkinBuff[] = []

    @property([EquipTank])
    equipTank: EquipTank[] = []

    start() {
        this.updateEquiPage()
    }

    updateEquiPage() {
        let currentSkinName = StorgeMgr.getInstance().currentSkin
        let skinConfig = ConfigMgr.getInstance().getSkinConfig().json
        let config = skinConfig[currentSkinName]
        for (let skinBuff of this.skinBuffs) {
            skinBuff.node.active = false
        }
        this.skinName.string = config.cnName
        this.skinDescribe.string = config.describe
        let skinBuffList = config.buffList
        for (let i = 0; i < skinBuffList.length; i++) {
            let skinBuff = this.skinBuffs[i]
            let buffConfig = ConfigMgr.getInstance().getDrwaCardConfig().json[skinBuffList[i]]
            skinBuff.setDisplay(buffConfig)
            skinBuff.node.active = true
        }
    }

    putIn(storeItem: StoreItem) {
        let tank = this.getAblePutTank()
        if (tank) {
            tank.setItem(storeItem)
            storeItem.currentPage = this
            storeItem.putAnim()
        } else {
        }
    }

    getAblePutTank() {
        let unlockTank: EquipTank[] = []
        for (let i = 0; i < this.equipTank.length; i++) {
            if (!this.equipTank[i].lockNode.active) {
                unlockTank.push(this.equipTank[i])
            }
        }
        for (let i = 0; i < unlockTank.length; i++) {
            if (!unlockTank[i].lockNode.active) {
                if (!unlockTank[i].node.children[3]) {
                    return unlockTank[i]
                }
                if (i == unlockTank.length - 1) {
                    return unlockTank[i]
                }
            }
        }
        return null
    }

    getPageName() {
        return "EquipPage"
    }

    saveStore() {
        StorgeMgr.getInstance().tankItemList = []
        for (let tank of this.equipTank) {
            let engName = tank.saveTank()
            if (engName) {
                StorgeMgr.getInstance().tankItemList.push(engName)
            }
        }
        StorgeMgr.getInstance().update()
    }
}
