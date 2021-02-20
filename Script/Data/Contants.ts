import { _decorator, Component, Node, RigidBodyComponent } from 'cc';
const { ccclass, property } = _decorator;

/**刚体分组 */
export class GroupAndMask {
    public Group =
        [
            1 << 0,
            1 << 1,
            1 << 2,
            1 << 3,
            1 << 4,
            1 << 5,
            1 << 6,
            1 << 7,
            1 << 8,
            1 << 9,
            1 << 10,
            1 << 11,
            1 << 12,
            1 << 13,
            1 << 14,
            1 << 15,
            1 << 16,
            1 << 17,
            1 << 18,
            1 << 19,
            1 << 20,
            1 << 21,
            1 << 22,
            1 << 23,
            1 << 24,
            1 << 25,
            1 << 26,
            1 << 27,
            1 << 28,
            1 << 29,
        ]
}

/**监听事件名字 */
enum EventName {
    UpdateTopUIInfo = "UpdateTopUIInfo",
    UpdateRightRankUI = "UpdateRightRankUI",
    DrawCard = "DrawCard",
    EndGame = "EndGame",
    ShowRevivePage = "ShowRevivePage",
    UpdataMainUiDiaplay = "UpdataMainUiDiaplay",
    ShowDamage = "ShowDamage",
    startKillReport = "startKillReport"
}

@ccclass('Contants')
export class Contants extends Component {
    static MaskGroups = new GroupAndMask().Group
    public static EventName = EventName
    static gameVer: number = 6.1
    static deBugMode: boolean = false
    static deBugAiSwitch: boolean = false
}
