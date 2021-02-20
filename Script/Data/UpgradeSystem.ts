import { RenderTexture, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UpgradeSystem')
export class UpgradeSystem {

    upgradeData = [
        280,
        340,
        460,
        640,
        880,
        1150,
        1180,
        1270,
        1350,
        1425,
        1495,
        1565,
        1685,
        1705,
        1775,
        1870,
        1915
    ]

    constructor(totalExp: number = 0) {
        this.totalExp = totalExp
        this.setExp(this.totalExp)
    }

    private totalExp: number = 0
    private currentLvExp: number = 0
    private currentUpgradeExp: number = 0
    private currentLevel: number = 1

    setExp(exp: number) {
        this.totalExp = exp
        let accumulateExp = 0
        for (let i = 0; i < this.upgradeData.length; i++) {
            accumulateExp += this.upgradeData[i]
            if (accumulateExp > this.totalExp) {
                this.currentLvExp = this.upgradeData[i] - (accumulateExp - this.totalExp)
                this.currentLevel = i + 1
                this.currentUpgradeExp = this.upgradeData[i]
                break
            } else if (accumulateExp == this.totalExp) {
                this.currentLvExp = 0
                this.currentLevel = i + 2
                this.currentUpgradeExp = this.upgradeData[i + 1]
                break
            } else {
                continue
            }
        }
    }

    addExp(exp: number) {
        let beforeLevel = this.getCurrentLevel()
        this.totalExp += exp
        this.setExp(this.totalExp)
        let currentLevel = this.getCurrentLevel()
        if (currentLevel > beforeLevel) {
            return true
        } else {
            return false
        }
    }

    getCurrentLevel() {
        return this.currentLevel
    }

    getCurrentLvExp() {
        return this.currentLvExp
    }

    getCurrentUpgradeExp() {
        return this.currentUpgradeExp
    }

}
