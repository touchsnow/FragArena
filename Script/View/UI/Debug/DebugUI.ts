import { _decorator, Component, Node } from 'cc';
import { Contants } from '../../../Data/Contants';
import { BasePlayer } from '../../../Game/Player/BasePlayer';
import { BuffPage } from './BuffPage';
import { WeaponPage } from './WeaponPage';
const { ccclass, property } = _decorator;

@ccclass('DebugUI')
export class DebugUI extends Component {

    @property(Node)
    weaponButton: Node = null

    @property(Node)
    buffButtton: Node = null

    @property(WeaponPage)
    weaponUI: WeaponPage = null

    @property(BuffPage)
    buffUI: BuffPage = null

    @property(Node)
    aiSwitch: Node = null

    start() {
        // this.weaponButton.on(Node.EventType.TOUCH_END, this.onWeaponButton, this)
        // this.buffButtton.on(Node.EventType.TOUCH_END, this.onBuffButton, this)
        // this.onWeaponButton()
        // this.weaponUI.initWeaponPage()
        // this.weaponUI.updateWeaponInfo()
    }

    initDebugUI(player: BasePlayer) {
        this.weaponButton.on(Node.EventType.TOUCH_END, this.onWeaponButton, this)
        this.buffButtton.on(Node.EventType.TOUCH_END, this.onBuffButton, this)
        this.aiSwitch.on(Node.EventType.TOUCH_END, this.onAiSwitch, this)
        this.onWeaponButton()
        this.weaponUI.initWeaponPage(player)
        this.buffUI.initBuffPage(player)
        this.weaponUI.updateWeaponInfo()
    }

    onWeaponButton() {
        this.weaponUI.node.active = true
        this.buffUI.node.active = false
    }

    onBuffButton() {
        this.buffUI.node.active = true
        this.weaponUI.node.active = false
    }

    onAiSwitch() {
        Contants.deBugAiSwitch = !Contants.deBugAiSwitch
    }

}
