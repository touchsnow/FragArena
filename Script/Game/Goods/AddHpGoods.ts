import { _decorator, Component, Node } from 'cc';
import { HealthBuff } from '../Buff/HealthBuff';
import { HealthBuffObject } from '../ObjectPool/HealthBuffObject';
import { BasePlayer } from '../Player/BasePlayer';
import { Goods } from './Goods';
const { ccclass, property } = _decorator;

@ccclass('AddHpGoods')
export class AddHpGoods extends Goods {

    giveReward(player: BasePlayer) {
        super.giveReward(player)
        player.node.addComponent(HealthBuff).startBuff(player,"HealthBuff")
    }

}
