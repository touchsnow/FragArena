// Learn TypeScript:
import { _decorator, Component, Node } from 'cc';
import { AddSpeedBuff } from '../Buff/AddSpeedBuff';
import { BasePlayer } from '../Player/BasePlayer';
import { Goods } from './Goods';
const { ccclass, property } = _decorator;

@ccclass('SpeedGoods')
export class SpeedGoods extends Goods {
    
    giveReward(player:BasePlayer){
        super.giveReward(player)
        player.node.addComponent(AddSpeedBuff).startBuff(player,"AddSpeedBuff")
    }
}
