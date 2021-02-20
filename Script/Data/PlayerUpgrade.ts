import { _decorator, Component, Node } from 'cc';
import { UpgradeSystem } from './UpgradeSystem';
const { ccclass, property } = _decorator;

@ccclass('PlayerUpgrade')
export class PlayerUpgrade extends UpgradeSystem {

    private static playerUpgrade: PlayerUpgrade
    public static getInstance(): PlayerUpgrade {
        if (this.playerUpgrade == null) {
            this.playerUpgrade = new PlayerUpgrade()
        }
        return PlayerUpgrade.playerUpgrade
    }

    init(exp: number) {
        this.setExp(exp)
    }

}
