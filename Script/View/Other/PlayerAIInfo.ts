// Learn TypeScript:
import { _decorator, Component, Node, LabelComponent } from 'cc';
import { BasePlayer } from '../../Game/Player/BasePlayer';
import { PlayerInfo } from './PlayerInfo';
const { ccclass, property } = _decorator;

@ccclass('PlayerAIInfo')
export class PlayerAIInfo extends PlayerInfo {

    @property(LabelComponent)
    levelLabel: LabelComponent = null


    start() {
        super.start()
    }

    init(player: BasePlayer) {
        super.init(player)
        this.levelLabel.string = player.getLevel().toString()
    }

    updateDiaplay(){
        super.updateDiaplay()
        if(this.player){
            this.levelLabel.string = this.player.getLevel().toString()
        }
    }
}
