import { _decorator, Component, Node } from 'cc';
import { BasePlayer } from '../Player/BasePlayer';
import { BaseBuff } from './BaseBuff';
const { ccclass, property } = _decorator;

@ccclass('DeBuff')
export class DeBuff extends BaseBuff {

    protected givePlayer: BasePlayer

    startDeBuff(player: BasePlayer, givePlayer: BasePlayer,buffName: string) {
        super.startBuff(player,buffName)
        this.givePlayer = givePlayer
    }

    update(dt: number) {
        super.update(dt)
    }

    refresh(givePlayer?: BasePlayer) {
        if(givePlayer){
            this.givePlayer = givePlayer
        }
    }
}
