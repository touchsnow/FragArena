import { _decorator } from 'cc';
import { AttackUpperBuff } from '../Buff/AttackUpperBuff';
import { BasePlayer } from '../Player/BasePlayer';
import { Goods } from './Goods';
const { ccclass } = _decorator;

@ccclass('AttackUpperGoods')
export class AttackUpperGoods extends Goods {

    giveReward(player: BasePlayer) {
        super.giveReward(player)
        player.node.addComponent(AttackUpperBuff).startBuff(player,"AttackUpperBuff")
    }

}
