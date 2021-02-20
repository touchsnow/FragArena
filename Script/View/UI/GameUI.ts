import { _decorator, Component, Node, Vec3, Vec2, Touch, systemEvent, SystemEvent, EventKeyboard, macro, find, UITransform, LabelComponent, Color, CameraComponent, TiledUserNodeData, instantiate, resources, tween } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import DialogManager from '../../../Framework3D/Src/Base/DialogManager';
import UIUtility from '../../../Framework3D/Src/Base/UIUtility';
import { Contants } from '../../Data/Contants';
import { CustomEventListener } from '../../Data/CustomEventListener';
import { AdManager } from '../../Game/Managers/AdManager';
import { ObjectPoolMgr } from '../../Game/Managers/ObjectPoolMgr';
import { StorgeMgr } from '../../Game/Managers/StorgeMgr';
import { PoolObjLifeCycle } from '../../Game/ObjectPool/PoolObjLifeCycle';
import { DrawCard } from '../Other/DrawCard';
import { RightRankUI } from '../Other/RightRankUI';
import { TopUIInfo } from '../Other/TopUIInfo';
import { NodeMotion } from '../Tool/NodeMotion';
import { DebugUI } from './Debug/DebugUI';
import { KillReport } from './KillReport';
import { RevivePage } from './RevivePage';
import { SettlePage } from './SettlePage';
const { ccclass, property } = _decorator;

@ccclass('GameUI')
export class GameUI extends Component {

    @property(Node)
    movePad: Node = null

    @property(Node)
    movePadGuide: Node = null

    @property(Node)
    moveThumb: Node = null

    @property(Node)
    attackNode: Node = null

    @property(Node)
    attackNodeGuide: Node = null

    @property(Node)
    backMainButton: Node = null

    gameMgr: any = null

    @property(Node)
    palyerInfo: Node = null

    @property(LabelComponent)
    timeLabel: LabelComponent = null

    @property(TopUIInfo)
    topUIInfo: TopUIInfo = null

    @property(RightRankUI)
    rightRankUI: RightRankUI = null

    @property(DrawCard)
    drawCard: DrawCard = null

    @property(SettlePage)
    settlePage: SettlePage = null

    // @property(Node)
    // drawButton: Node = null

    @property(RevivePage)
    revivePage: RevivePage = null

    @property(Node)
    loading: Node = null

    @property(DebugUI)
    debugUI: DebugUI = null

    @property(CameraComponent)
    mainCamera: CameraComponent = null

    @property(KillReport)
    killReport: KillReport = null

    private timeDown: number = 0

    /**movePad的原始位置 */
    private movePadPos: Vec3 = new Vec3()
    /**开始触摸到当前触摸的方向 */
    private directStartToCurrent2D: Vec2 = new Vec2()
    /**开始触摸到当前触摸的方向 */
    private directStartToCurrent3D: Vec3 = new Vec3()
    /**开始触摸的坐标 */
    private touchStartPos: Vec2 = new Vec2()
    /**当前触摸的坐标 */
    private touchCurrentPos: Vec2 = new Vec2()

    start() {
        this.gameMgr = find("GameMgr").getComponent("GameMgr")
        this.movePadPos = this.movePad.getWorldPosition()
        this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this)
        this.attackNode.on(Node.EventType.TOUCH_START, this.onAttackTouchStart, this)
        this.attackNode.on(Node.EventType.TOUCH_END, this.onAttackTouchEnd, this)
        this.attackNode.on(Node.EventType.TOUCH_CANCEL, this.onAttackTouchEnd, this)
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
        this.backMainButton.on(Node.EventType.TOUCH_END, this.onBackMainButton, this)
        //this.drawButton.on(Node.EventType.TOUCH_END, this.onDrawButton, this)
        CustomEventListener.on(Contants.EventName.ShowRevivePage, this.showRevivePage, this)
        CustomEventListener.on(Contants.EventName.ShowDamage, this.showDamage, this)
        CustomEventListener.on(Contants.EventName.startKillReport, this.startKillReport, this)
        if (Contants.deBugMode) {
            this.debugUI.node.active = true
            this.rightRankUI.node.active = false
        }
        if (!StorgeMgr.getInstance().newUser) {
            this.movePadGuide.active = false
            this.attackNodeGuide.active = false
        }
        StorgeMgr.getInstance().newUser = false
        StorgeMgr.getInstance().update()
    }

    // onDrawButton() {
    //     this.drawCard.draw()
    // }

    update(dt: number) {
        this.timeDown -= dt
        let minutes = Math.round((this.timeDown - 30) / 60) % 60;
        let seconds = this.timeDown % 60;
        this.timeLabel.string = (minutes > 9 ? minutes.toFixed(0) : "0" + minutes.toFixed(0)) + ":" + (seconds > 9 ? seconds.toFixed(0) : "0" + seconds.toFixed(0))
    }

    onTouchStart() {
        this.movePadGuide.active = false
    }

    onTouchMove(e: Touch, a: any) {
        e.getStartLocation(this.touchStartPos)
        e.getLocation(this.touchCurrentPos)
        Vec2.subtract(this.directStartToCurrent2D, this.touchCurrentPos, this.touchStartPos)
        this.gameMgr.onTouchMove(this.directStartToCurrent2D)
        let uiStartPos: Vec2 = new Vec2()
        let uiPos: Vec2 = new Vec2()
        e.getUIStartLocation(uiStartPos)
        e.getUILocation(uiPos)
        let dis = Vec2.distance(uiPos, uiStartPos)
        this.movePad.setWorldPosition(new Vec3(uiStartPos.x, uiStartPos.y, 0))
        this.moveThumb.active = true
        let maxLength = this.movePad.getComponent(UITransform).contentSize.x / 2
        if (dis >= maxLength) {
            let Vec2 = uiPos.subtract(uiStartPos)
            uiPos = Vec2.normalize().multiplyScalar(maxLength)
            this.moveThumb.setPosition(new Vec3(uiPos.x, uiPos.y, 0))
        } else {
            this.moveThumb.setWorldPosition(new Vec3(uiPos.x, uiPos.y, 0))
        }
    }

    onTouchEnd() {
        this.gameMgr.onTouchEnd()
        this.moveThumb.active = false
        this.movePad.setWorldPosition(this.movePadPos)
    }

    onAttackTouchStart() {
        this.attackNodeGuide.active = false
        let palyer = this.gameMgr.playerMgr.player
        palyer.startAttack()
    }

    onAttackTouchEnd() {
        let palyer = this.gameMgr.playerMgr.player
        palyer.stopAttack()
    }

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case macro.KEY.w:
                this.onAttackTouchStart()
                break
        }
    }

    setTimeDown(time: number) {
        this.timeDown = time
    }

    setEndGame() {
        this.palyerInfo.active = false
        this.movePad.active = false
        this.attackNode.active = false
        this.timeLabel.node.active = false
        this.revivePage.node.active = false
    }

    onBackMainButton() {
        AdManager.getInstance().showInters()
        var callBack = function () {
            this.gameMgr.endGame(false)
            UIUtility.getInstance().loadScene("MainScene")
        }.bind(this)
        let data = {
            confirmCallback: callBack,
            cancleCallback: null,
            label: '是否退出到主界面？'
        }
        DialogManager.getInstance().showDlg("ConfirmDialog", data)
    }

    showRevivePage(callback1, callback2) {
        this.revivePage.show(callback1, callback2)
    }

    showDamage(worldPos: Vec3, color: Color, damage: number) {
        let label = ObjectPoolMgr.getInstance().getUIObj("DamageLabel")
        label.active = true
        label.setParent(this.node)
        let pos = this.mainCamera.convertToUINode(worldPos, this.node)
        label.setPosition(pos)
        label.getComponent(LabelComponent).string = damage.toFixed(2)
        label.getComponent(LabelComponent).color = color
        label.getComponent(PoolObjLifeCycle).startLife()
    }

    startKillReport(killName: string, beKillName: string) {
        this.killReport.report(killName, beKillName)
    }

    addMoneyAnim(count: number, num: number) {
        AudioManager.getInstance().playEffectByPath("ReceivingMoney")
        let endPos = this.backMainButton.getWorldPosition()
        let icon = this.backMainButton
        let startPos = this.node.getWorldPosition()
        for (let i = 0; i < count; i++) {
            let moneyNode = instantiate(resources.get("UI/Money"))
            moneyNode.setParent(find("Canvas"))
            var endCB = function () {
                StorgeMgr.getInstance().money += num
                StorgeMgr.getInstance().update()
                icon.setScale(1.1, 1.1, 1.1)
                tween(icon)
                    .to(0.1, { scale: new Vec3(1, 1, 1) })
                    .start()
            }.bind(this)
            moneyNode.addComponent(NodeMotion).init(moneyNode, startPos, endPos, endCB)
        }
    }

    addEnergy(count: number, num: number) {
        let endPos = this.backMainButton.getWorldPosition()
        let icon = this.backMainButton
        let startPos = this.node.getWorldPosition()
        for (let i = 0; i < count; i++) {
            let energyNode = instantiate(resources.get("UI/Energy"))
            energyNode.setParent(find("Canvas"))
            var endCB = function () {
                StorgeMgr.getInstance().giftBoxProgress += num
                StorgeMgr.getInstance().update()
                icon.setScale(1.1, 1.1, 1.1)
                tween(icon)
                    .to(0.1, { scale: new Vec3(1, 1, 1) })
                    .start()
            }.bind(this)
            energyNode.addComponent(NodeMotion).init(energyNode, startPos, endPos, endCB)
        }
    }



    onDestroy() {
        CustomEventListener.off(Contants.EventName.ShowRevivePage, this.showRevivePage, this)
        CustomEventListener.off(Contants.EventName.ShowDamage, this.showDamage, this)
        CustomEventListener.off(Contants.EventName.startKillReport, this.startKillReport, this)
    }

}
