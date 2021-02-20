import { _decorator, Component, Node } from 'cc';
import { BaseBuff } from '../Buff/BaseBuff';
import { DeBuff } from '../Buff/DeBuff';
import { BasePlayer } from './BasePlayer';
const { ccclass, property } = _decorator;

@ccclass('PlayerBuffMgr')
export class PlayerBuffMgr extends Component {

    player: BasePlayer = null

    addDebuff(buff: string, givePlayer: BasePlayer) {
        if (this.player.hunmanAttr.isDead) return
        let hadBuff = this.player.node.getComponent(buff) as DeBuff
        if (hadBuff) {
            //  console.log("已经有了，刷新")
            hadBuff.refresh(givePlayer)
        } else {
            //  console.log("没有，添加")
            let newbuff = this.player.node.addComponent(buff) as DeBuff
            newbuff.startDeBuff(this.player, givePlayer, buff)
        }
    }

    removeAllDebuff() {
        let buffs = this.player.node.getComponents(BaseBuff)
        for (let buff of buffs) {
            buff.removeBuff()
        }
    }

}
