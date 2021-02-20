import { _decorator, Component, Node, Vec3, tween, random, Vec2, Color } from 'cc';
import { Contants } from '../../Data/Contants';
import { CustomEventListener } from '../../Data/CustomEventListener';
import { ShiledBuff } from '../Buff/ShiledBuff';
import { ObjectPoolMgr } from '../Managers/ObjectPoolMgr';
import { PoolObjLifeCycle } from '../ObjectPool/PoolObjLifeCycle';
import { BasePlayer } from '../Player/BasePlayer';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

@ccclass('RockBullet')
export class RockBullet extends Bullet {

    private moveSpeedScale: number = 0

    private emery: BasePlayer = null

    private followMove: boolean = false

    update(dt: number) {
        if (this.isBomb) return
        this.moveTime += dt
        this.moveSpeedScale += dt * 0.5
        if (this.followMove && this.emery.node) {
            //目标判断
            let moveDir = this.emery.node.getWorldPosition().subtract(this.node.getWorldPosition()).normalize()
            this.node.setWorldPosition(this.node.getWorldPosition().add(moveDir.clone().multiplyScalar(this.moveSpeedScale)))
            this.node.lookAt(this.emery.node.getWorldPosition())
            if (this.emery) {
                if (Vec3.distance(this.node.worldPosition, this.emery.node.worldPosition) <= 1) {
                    this.bomb(this.emery)
                }
            }
            else if (Vec3.distance(this.node.worldPosition, this.endPos) <= 1) {
                this.bomb(this.emery)
            }
        } else {
            //全局判断
            this.node.setWorldPosition(this.node.getWorldPosition().add(this.node.forward.multiplyScalar(this.moveSpeedScale)))
            if (this.player.aroundEnemy != null && this.player.aroundEnemy.length > 0) {
                for (let i = 0; i < this.player.aroundEnemy.length; i++) {
                    let emery = this.player.aroundEnemy[i]
                    if (emery) {
                        if (Vec3.distance(this.node.worldPosition, emery.node.worldPosition) <= 1) {
                            this.bomb(emery)
                        }
                    }
                }
            }
            if (Vec3.distance(this.node.worldPosition, this.endPos) <= 1) {
                this.bomb()
            }
        }
        if (this.moveTime > this.maxMoveTime) {
            this.destroySelf()
        }
    }

    init(startPos: Vec3, moveDir: Vec3, player = null, endPos: Vec3 = new Vec3(10000, 0, 0)) {
        this.isBomb = false
        this.moveTime = 0
        this.moveSpeedScale = 0
        this.startPos = startPos
        this.endPos = endPos
        this.moveDir = moveDir.normalize()
        this.player = player
        this.maxMoveTime = this.player.weapon.attackRange
        this.emery = null
        this.followMove = false
        let allPlayer = this.player.playerMgr.getAllPlayers()
        for (let player of allPlayer) {
            if (player == this.player.lockedEnemy) {
                this.emery = player
            }
        }
        if (this.emery) {
            let targetDir = this.emery.node.getWorldPosition().subtract(this.node.getWorldPosition()).normalize()
            let angle = Vec3.angle(this.moveDir, targetDir) * 180 / Math.PI
            if (Math.abs(angle) < 40) {
                this.followMove = true
            }
        }
        let hitRate = random()
        if (hitRate > this.player.weapon.hitRate) {
            this.followMove = false
            let symbol = (random() - 0.5) > 0 ? -1 : 1
            let weapon = this.player.weapon
            let randomOffset = (weapon.minOffset + (weapon.maxOffset - weapon.minOffset) * random()) * symbol
            let offsetX = this.moveDir.x * Math.cos(randomOffset * Math.PI / 180) - this.moveDir.z * Math.sin(randomOffset * Math.PI / 180)
            let offsetZ = this.moveDir.z * Math.cos(randomOffset * Math.PI / 180) + this.moveDir.x * Math.sin(randomOffset * Math.PI / 180)
            let moveDir = new Vec3(offsetX, 0, offsetZ)
            this.moveDir = moveDir.normalize()
        }
        this.node.lookAt(new Vec3(this.moveDir.multiplyScalar(10000)))
    }

    bomb(enermy?: BasePlayer) {
        if (enermy && !enermy.hunmanAttr.isDead) {
            enermy.rigidBody.applyImpulse(this.node.forward.multiplyScalar(30))
            let shieldBuff = enermy.node.getComponent(ShiledBuff)
            let resist = false
            if (shieldBuff) {
                let vec2 = new Vec2(this.player.node.worldPosition.x, this.player.node.worldPosition.z)
                resist = shieldBuff.getResist(vec2)
            }
            if (!resist) {
                let isdead = enermy.attacked(this.player.getDamage())
                if (isdead[0]) {
                    let exp = enermy.getKilledExp()
                    this.player.addKillCount(exp)
                    this.player.addRewardMoney(enermy.getLevel())
                    CustomEventListener.dispatchEvent(Contants.EventName.startKillReport,
                        this.player.getName(),enermy.getName())
                }
                if (isdead[1] != 0 && !this.player.isAi) {
                    CustomEventListener.dispatchEvent(Contants.EventName.ShowDamage,
                        enermy.node.getWorldPosition(), new Color(255, 221, 42, 255), isdead[1])
                }
            }
        }
        let bomb = ObjectPoolMgr.getInstance().get("RockBomb")
        var callBack = function () {
            bomb.setWorldPosition(this.node.worldPosition)
        }.bind(this)
        bomb.getComponent(PoolObjLifeCycle).startLife(callBack)
        this.destroySelf()
    }

    destroySelf() {
        this.isBomb = true
        ObjectPoolMgr.getInstance().put(this.node)
    }

}
