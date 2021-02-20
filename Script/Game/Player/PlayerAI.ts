// Learn TypeScript:
import { _decorator, Component, Node, Vec2, Vec3 } from 'cc';
import { Contants } from '../../Data/Contants';
import { PlayerConfig } from '../../Data/PlayerConfig';
import { UpgradeSystem } from '../../Data/UpgradeSystem';
import { DrawCardMgr } from '../Managers/DrwaCardMgr';
import { FrangArenaAudioMgr } from '../Managers/FrangArenaAudioMgr';
import { PlayerMgr } from '../Managers/PlayerMgr';
import { StorgeMgr } from '../Managers/StorgeMgr';
import { WeaponMgr } from '../Managers/WeaponMgr';
import { AIDifficilty } from './AIDifficilty';
import { BasePlayer } from './BasePlayer';
import { FSMController } from './FSMController/FSMController';
const { ccclass, property } = _decorator;

@ccclass('PlayerAI')
export class PlayerAI extends BasePlayer {

    /**要旋转到的目标角度 */
    private targetAngleY: number = 0

    /**开始触摸到当前触摸的方向 */
    private directStartToCurrent2D: Vec2 = new Vec2()
    /**开始触摸到当前触摸3D的方向 */
    private directStartToCurrent3D: Vec3 = new Vec3()

    fsmController: FSMController = null

    private hadGetWeapon: boolean = false

    private spawnPoint: Node = null

    private forceStopAttack: boolean = false

    aiDifficultCtrl: AIDifficilty = new AIDifficilty()

    start() {
        super.start()
        this.rigidBody.linearDamping = 0.9
        this.fsmController = new FSMController()
        this.fsmController.init(this)
        this.isAi = true
    }

    init(playerMgr: PlayerMgr, playerConfig: PlayerConfig) {
        this.isAi = true
        super.init(playerMgr, playerConfig)
        this.spawnPoint = this.node.parent
        let upgradeSystem = new UpgradeSystem()
        upgradeSystem.setExp(StorgeMgr.getInstance().totalExp)
        let currentLevel = upgradeSystem.getCurrentLevel()
        this.aiDifficultCtrl.init(currentLevel)
    }

    update(dt: number) {
        super.update(dt)
        this.aiDifficultCtrl.update(dt)
        if (this.fsmController) {
            this.fsmController.update(dt)
        }
        if (Contants.deBugMode) {
            if (Contants.deBugAiSwitch) {
                this.updateAttackState()
                this.transitionCtrl()
            } else {
                this.setStop()
                this.stopAttack()
            }
        }
        else {
            this.updateAttackState()
            this.transitionCtrl()
        }

        if (this.weapon.currentEnergy - this.weapon.consume < 0) {
            this.forceStopAttack = true
        }
        if (this.weapon.currentEnergy > 50) {
            this.forceStopAttack = false
        }
    }

    updateAttackState() {
        if (this.lockedEnemy && !this.forceStopAttack && this.aiDifficultCtrl.getAIAttackState()) {
            this.startAttack()
        } else {
            this.stopAttack()
        }
    }

    /**移动控制 */
    transitionCtrl() {
        if (this.moveState === this.MoveState.Move) {
            this.directStartToCurrent3D = new Vec3(this.directStartToCurrent2D.x, 0, -this.directStartToCurrent2D.y).normalize()
            this.posCtrl(this.directStartToCurrent3D)
            if (!this.lockedEnemy) {
                this.targetAngleY = -this.getAngleByVector(this.directStartToCurrent2D.x, this.directStartToCurrent2D.y)
                this.rotateCtrl(this.targetAngleY)
            }
        } else {
            this.rigidBody.setLinearVelocity(new Vec3(0, 0, 0))
        }
        if (this.lockedEnemy) {
            let dir = this.lockedEnemy.node.worldPosition.clone().subtract(this.node.worldPosition).normalize()
            // this.directStartToCurrent2D = new Vec2(-dir.x, -dir.z)
            // this.targetAngleY = this.getAngleByVector(this.directStartToCurrent2D.x, this.directStartToCurrent2D.y)
            let directStartToCurrent2D = new Vec2(-dir.x, -dir.z)
            this.targetAngleY = this.getAngleByVector(directStartToCurrent2D.x, directStartToCurrent2D.y)
            this.rotateCtrl(this.targetAngleY)
        }
    }

    /**设置移动方向 */
    setMove(vec: Vec2) {
        if (this.moveState != this.MoveState.Move) {
            this.setRunAnim()
        }
        this.directStartToCurrent2D = vec
    }

    /**停止移动 */
    setStop() {
        this.rigidBody.setLinearVelocity(new Vec3(0, 0, 0))
        this.setIdleAnim()
    }

    dead() {
        super.dead()
        if (this.fsmController) {
            this.fsmController.currentState.exit()
        }
        this.fsmController = null
        FrangArenaAudioMgr.getInstance().playKillSoundByCount(this, 0)
    }

    resurgence() {
        super.resurgence()
        this.scheduleOnce(() => {
            this.fsmController = new FSMController()
            this.fsmController.init(this)
        }, 0)
        if (Contants.deBugMode) {
            this.node.setWorldPosition(this.spawnPoint.worldPosition)
            this.node.setWorldRotation(this.spawnPoint.worldRotation)
        }
    }

    paralysis() {
        super.paralysis()
        if (this.fsmController) {
            this.fsmController.currentState.exit()
            this.fsmController = null
        }
    }

    addExp(exp: number) {
        let result = super.addExp(exp)
        if (result) {
            if (!this.hadGetWeapon) {
                this.hadGetWeapon = true
                this.weapon = WeaponMgr.getInstance().getRandonWeapon(this)
            } else {
                let item = DrawCardMgr.getInstance().getRandomBuffItem(this)
                DrawCardMgr.getInstance().enableItemBuff(this, item[0].caseValue, item[0].addition)
            }
            this.playerInfo.updateDiaplay()
        }
        return result
    }

}
