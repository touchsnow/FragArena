import { _decorator, Component, Node, labelAssembler, LabelComponent, SpriteComponent } from 'cc';
import { Contants } from '../../Data/Contants';
import { CustomEventListener } from '../../Data/CustomEventListener';
import { BasePlayer } from '../../Game/Player/BasePlayer';
const { ccclass, property } = _decorator;

@ccclass('TopUIInfo')
export class TopUIInfo extends Component {

    @property(LabelComponent)
    expLabel: LabelComponent = null

    @property(LabelComponent)
    levelLabel: LabelComponent = null

    @property(SpriteComponent)
    expBar: SpriteComponent = null

    private player: BasePlayer = null

    init(player: BasePlayer) {
        this.player = player
        this.updateDisplay()
        CustomEventListener.on(Contants.EventName.UpdateTopUIInfo, this.updateDisplay, this)
    }

    updateDisplay() {
        let upgradeSystem = this.player.upgradeSystem
        let currentExp = upgradeSystem.getCurrentLvExp()
        let currentUpgradeExp = upgradeSystem.getCurrentUpgradeExp()
        let currentLevel = upgradeSystem.getCurrentLevel()
        let expLabelStr = currentExp.toFixed(0) + "/" + currentUpgradeExp.toString()
        let levelStr = "Level " + currentLevel.toString()
        this.expLabel.string = expLabelStr
        this.levelLabel.string = levelStr
        this.expBar.fillRange = currentExp / currentUpgradeExp
    }

    onDestroy() {
        CustomEventListener.off(Contants.EventName.UpdateTopUIInfo, this.updateDisplay, this)

    }



}
