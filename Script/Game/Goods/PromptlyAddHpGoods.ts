import { _decorator, Component, Node } from 'cc';
import { ConfigMgr } from '../Managers/ConfigMgr';
import { BasePlayer } from '../Player/BasePlayer';
import { Goods } from './Goods';
const { ccclass } = _decorator;

@ccclass('PromptlyAddHpGoods')
export class PromptlyAddHpGoods extends Goods {

    giveReward(player: BasePlayer) {
        super.giveReward(player)
        let config = ConfigMgr.getInstance().getBuffConfig().json["PromptlyAddHpBuff"]
        player.hunmanAttr.currentHp += config.addition * player.hunmanAttr.maxHp
        if (player.hunmanAttr.currentHp > player.hunmanAttr.maxHp) {
            player.hunmanAttr.currentHp = player.hunmanAttr.maxHp
        }
    }
}
