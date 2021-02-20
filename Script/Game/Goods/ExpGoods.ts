import { _decorator, Component, Node } from 'cc';
import { BasePlayer } from '../Player/BasePlayer';
import { Goods } from './Goods';
const { ccclass, property } = _decorator;

@ccclass('ExpGoods')
export class ExpGoods extends Goods {
    giveReward(player: BasePlayer) {
        super.giveReward(player)
        player.addExp(25)
    }
}
