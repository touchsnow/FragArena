import { _decorator, Component, Node, tween, LabelComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RandomTip')
export class RandomTip extends Component {

    @property(LabelComponent)
    label: LabelComponent = null

    tipList: string[] = [
        
        "总共有10把武器，且每把五个各具特色，每个玩家都能随机抽取到一把。",
        "玩家每次升级都可以抽取卡片提升自己的能力",
        "获取胜利和提升等级后，可以去皮肤商店购买英雄皮肤，会有额外的属性加成",
        "在一定时间击杀敌人，击杀的越多，越能提升装备属性，会变得越来越强大",
        "地图上的紫色水晶可以捡起，会增加自己的经验值，从而更快提升等级",
        "一开始每个人都是小手枪，升级后可获取特色武器",
        "【炸药】对一定范围的敌人造成伤害,威力大，但准确率低",
        "【火箭筒】向前发射一枚导弹，威力巨大，可击退敌人",
        "【加特灵机关枪】射速快，弹量多，轻便",
        "【散弹枪】距离越近，伤害越高，碰到墙壁子弹会反弹",
        "【激光枪】发射一束机关，对敌人造成严重伤害",
        "【磁暴枪】发射一个球状电，威力巨大，被球状电触碰到的人会被造成巨大伤害",
        "【火焰发射器】发射火焰，在火焰范围内，灼烧敌人",
        "【冰冻枪】对敌人造成冰冻伤害，且减速敌人，是敌人移动速度变慢",
        "【毒枪】发射有毒气体，对敌人造成毒害且减速敌人",

        "地上的紫水晶可以增加经验",
        "先捡4个紫水晶再杀一个敌人升到2级，升级你的装备，取得优势",
        "【冰冻枪】可以同时降低敌人的攻击速度和移动速度",
        "【火焰发射器】有额外的燃烧伤害",
        "【火箭筒】由于后坐力的影响，命中率不太稳定",
        "【散弹枪】根据击中的子弹数量计算伤害，越接近你的敌人，命中的子弹数将越多，伤害也越高",
        "【加特林机枪】命中率不太稳定",
        "【激光枪】控制好方向，远程击杀敌人",
        "【炸药】有范围伤害，注意保持距离",
        "【磁暴枪】远离磁暴枪的子弹中心",
        "【毒气枪】拥有减速敌人和持续伤害能力"
    ]

    start() {
        tween(this.node)
            .call(() => {
                this.showRandomTip()
            })
            .delay(6)
            .union()
            .repeatForever()
            .start()
    }

    showRandomTip() {
        let random = Math.floor(Math.random() * this.tipList.length)
        let label = this.tipList[random]
        this.label.string = label
    }

}
