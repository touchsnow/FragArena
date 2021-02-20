import { _decorator, Component, Node } from 'cc';
import { Contants } from '../../Data/Contants';
import { CustomEventListener } from '../../Data/CustomEventListener';
import { Player } from '../../Game/Player/Player';
import { RankItem } from './RankItem';
const { ccclass, property } = _decorator;

@ccclass('RightRankUI')
export class RightRankUI extends Component {

    @property([RankItem])
    itemList: RankItem[] = []

    @property(Node)
    tempPlace: Node = null

    start() {
        CustomEventListener.on(Contants.EventName.UpdateRightRankUI, this.updateRank, this)
    }

    updateRank() {
        for (let item of this.itemList) {
            item.updateRankDisplay()
            item.node.setParent(this.tempPlace)
        }
        for (let i = 0; i < this.itemList.length; i++) {
            let maxKillCount = 0
            let maxItem: RankItem = null
            for (let item of this.tempPlace.children) {
                let rankItem = item.getComponent(RankItem)
                if (rankItem.getKillCount() >= maxKillCount) {
                    maxKillCount = rankItem.getKillCount()
                    maxItem = rankItem
                }
            }
            if (maxItem) {
                maxItem.node.setParent(this.node)
            }
        }
    }

    getResult() {
        for (let i = 0; i < this.node.children.length; i++) {
            let rankItem = this.node.children[i].getComponent(RankItem)
            if (!rankItem) continue
            let player = this.node.children[i].getComponent(RankItem).player
            if (player) {
                if (player instanceof Player) {
                    if (i !== 0) {
                        return false
                    } else {
                        return true
                    }
                }
            }

        }
    }

    onDestroy() {
        CustomEventListener.off(Contants.EventName.UpdateRightRankUI, this.updateRank, this)
    }

}
