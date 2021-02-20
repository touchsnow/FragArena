import { _decorator, Vec2, Vec3, math } from 'cc';
import { Contants } from '../../Data/Contants';
import { CustomEventListener } from '../../Data/CustomEventListener';
import { PlayerConfig } from '../../Data/PlayerConfig';
import { AdManager } from '../Managers/AdManager';
import { ConfigMgr } from '../Managers/ConfigMgr';
import { DrawCardMgr } from '../Managers/DrwaCardMgr';
import { FrangArenaAudioMgr } from '../Managers/FrangArenaAudioMgr';
import { ObjectPoolMgr } from '../Managers/ObjectPoolMgr';
import { PlayerMgr } from '../Managers/PlayerMgr';
import { StorgeMgr } from '../Managers/StorgeMgr';
import { PoolObjLifeCycle } from '../ObjectPool/PoolObjLifeCycle';
import { BasePlayer } from './BasePlayer';
const { ccclass, property } = _decorator;


@ccclass('Player')
export class Player extends BasePlayer {

    /**要旋转到的目标角度 */
    private targetAngleY: number = 0
    /**开始触摸到当前触摸的方向 */
    private directStartToCurrent2D: Vec2 = new Vec2()

    private rotateCurrent2D: Vec2 = new Vec2()
    /**开始触摸到当前触摸3D的方向 */
    private directStartToCurrent3D: Vec3 = new Vec3()

    private countinueKillCount = 0


    init(playerMgr: PlayerMgr, playerConfig: PlayerConfig) {
        super.init(playerMgr, playerConfig)
        //应用皮肤加成
        let buffs = StorgeMgr.getInstance().tankItemList
        if (buffs.length > 0) {
            for (let buffName of buffs) {
                let drawItem = ConfigMgr.getInstance().getDrwaCardConfig().json[buffName]
                DrawCardMgr.getInstance().enableItemBuff(this, drawItem.caseValue, drawItem.addition)
            }
        }
    }

    update(dt: number) {
        if (this.hunmanAttr.isDead) return
        super.update(dt)
        this.transitionCtrl()
        this.playerInfo.updateDiaplay()
    }

    /**移动控制 */
    transitionCtrl() {
        if (this.moveState === this.MoveState.Move) {
            this.directStartToCurrent3D = new Vec3(this.directStartToCurrent2D.x, 0, -this.directStartToCurrent2D.y).normalize()
            this.posCtrl(this.directStartToCurrent3D)
            if (!this.lockedEnemy) {
                this.targetAngleY = -this.getAngleByVector(this.rotateCurrent2D.x, this.rotateCurrent2D.y)
                this.rotateCtrl(this.targetAngleY)
            }
        } else {
            this.rigidBody.setLinearVelocity(new Vec3(0, 0, 0))
        }
        if (this.lockedEnemy && !this.lockedEnemy.hunmanAttr.isDead) {
            let dir = this.lockedEnemy.node.worldPosition.clone().subtract(this.node.worldPosition).normalize()
            let directStartToCurrent2D = new Vec2(-dir.x, -dir.z)
            this.targetAngleY = this.getAngleByVector(directStartToCurrent2D.x, directStartToCurrent2D.y)
            this.rotateCurrent2D = new Vec2(dir.x, -dir.z)

            this.rotateCtrl(this.targetAngleY)
        }
    }

    /**设置移动方向 */
    setMove(vec: Vec2) {
        if (this.moveState != this.MoveState.Move) {
            this.setRunAnim()
        }
        this.directStartToCurrent2D = vec
        this.rotateCurrent2D = vec
    }

    attacked(damage: number): [boolean, number] {
        AdManager.getInstance().phoneVibrate()
        return super.attacked(damage)
    }

    /**停止移动 */
    setStop() {
        this.rigidBody.setLinearVelocity(new Vec3(0, 0, 0))
        this.setIdleAnim()
    }

    addKillCount(exp: number) {
        let result = super.addKillCount(exp)
        this.countinueKillCount += 1
        FrangArenaAudioMgr.getInstance().playKillSoundByCount(this, this.countinueKillCount)
        CustomEventListener.dispatchEvent(Contants.EventName.UpdateTopUIInfo)
        return result
    }

    addExp(exp: number) {
        let result = super.addExp(exp)
        CustomEventListener.dispatchEvent(Contants.EventName.UpdateTopUIInfo)
        if (result && !Contants.deBugMode) {
            CustomEventListener.dispatchEvent(Contants.EventName.DrawCard)
        }
        return result
    }

    dead() {
        this.hunmanAttr.isDead = true
        this.node.active = false
        this.countinueKillCount = 0
        FrangArenaAudioMgr.getInstance().playKillSoundByID(10)
        let deadEffect = ObjectPoolMgr.getInstance().get("RoleDeath")
        deadEffect.active = true
        if (deadEffect) {
            var callBack = function () {
                deadEffect.setWorldPosition(this.node.worldPosition)
            }.bind(this)
            deadEffect.getComponent(PoolObjLifeCycle).startLife(callBack)
        }
        this.playerMgr.setDead(this)

        var callBack = function () {
            this.playerMgr.setResurgence(this)
        }.bind(this)

        var skipCallback = function () {
            CustomEventListener.dispatchEvent(Contants.EventName.EndGame)
        }.bind(this)

        let data = {
            resurgenceCallBack: callBack,
            skipCallback: skipCallback
        }
        CustomEventListener.dispatchEvent(Contants.EventName.ShowRevivePage, callBack, skipCallback)
    }

    detectEnemy() {
        let allPlayer = this.playerMgr.getAllPlayers()
        let lockedEnemy = null
        let minDis = 99999
        this.aroundEnemy = []
        for (let i = 0; i < allPlayer.length; i++) {
            let player = allPlayer[i]
            if (player == this) continue
            let dis = Vec3.distance(this.node.worldPosition, player.node.worldPosition)
            if (dis < this.attackRange) {
                this.aroundEnemy.push(player)
                if (dis < minDis) {
                    lockedEnemy = player
                    minDis = dis
                }
            }
        }
        if (this.lockedEnemy) {
            this.lockedEnemy.matMgr.hideOutLine()
        }
        this.lockedEnemy = lockedEnemy
        if (this.lockedEnemy) {
            this.lockedEnemy.matMgr.showOutLine(math.color(255, 0, 0, 255))
        }
    }
}
