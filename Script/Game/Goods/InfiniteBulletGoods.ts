import { _decorator, Component, Node } from 'cc';
import { InfiniteBulletBuff } from '../Buff/InfiniteBulletBuff';
import { BasePlayer } from '../Player/BasePlayer';
import { Goods } from './Goods';
const { ccclass, property } = _decorator;

@ccclass('InfiniteBulletGoods')
export class InfiniteBulletGoods extends Goods {

    giveReward(player: BasePlayer) {
        super.giveReward(player)
        player.node.addComponent(InfiniteBulletBuff).startBuff(player,"InfiniteBulletBuff")
    }
}
