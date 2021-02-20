import { _decorator, Component, Node, Vec3, tween, random, Quat, Vec2, Color } from 'cc';
import { Contants } from '../../Data/Contants';
import { CustomEventListener } from '../../Data/CustomEventListener';
import { ShiledBuff } from '../Buff/ShiledBuff';
import { ObjectPoolMgr } from '../Managers/ObjectPoolMgr';
import { PoolObjLifeCycle } from '../ObjectPool/PoolObjLifeCycle';
import { BasePlayer } from '../Player/BasePlayer';
import { MathTool } from '../Tool/MathTool';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

@ccclass('PistolBullet')
export class PistolBullet extends Bullet {


    start() {

    }

    @property(Node)
    model: Node = null

    private emery: BasePlayer = null

    private followMove: boolean = false

    update(dt: number) {
        if (!this.isBomb) {
            this.moveTime += dt
            if (this.followMove && this.emery.node) {
                //目标判断
                let moveDir = this.emery.node.getWorldPosition().subtract(this.node.getWorldPosition()).normalize()
                this.node.setWorldPosition(this.node.getWorldPosition().add(moveDir.clone().multiplyScalar(0.2)))
                if (this.emery) {
                    if (Vec3.distance(this.node.worldPosition, this.emery.node.worldPosition) <= 1) {
                        this.bomb(this.player.lockedEnemy)
                    }
                }
                else if (Vec3.distance(this.node.worldPosition, this.endPos) <= 1) {
                    this.bomb(this.player.lockedEnemy)
                }
            } else {
                //全局判断
                this.node.setWorldPosition(this.node.getWorldPosition().add(this.moveDir.clone().multiplyScalar(0.2)))
                if (this.player.aroundEnemy != null && this.player.aroundEnemy.length > 0) {
                    for (let i = 0; i < this.player.aroundEnemy.length; i++) {
                        let emery = this.player.aroundEnemy[i]
                        if (emery) {
                            if (Vec3.distance(this.node.worldPosition, emery.node.worldPosition) <= 1) {
                                this.bomb(emery)
                            }
                        }
                    }
                } else if (Vec3.distance(this.node.worldPosition, this.endPos) <= 1) {
                    this.bomb()
                }
            }
            if (this.moveTime > this.maxMoveTime) {
                this.destroySelf()
            }
        }
    }

    init(startPos: Vec3, moveDir: Vec3, player = null, endPos: Vec3 = new Vec3(10000, 0, 0)) {
        this.isBomb = false
        this.moveTime = 0
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
            let targetDir = this.emery.node.getWorldPosition().subtract(this.player.node.getWorldPosition()).normalize()
            let angle1 = MathTool.getAngleByVector(-targetDir.x, -targetDir.z)
            let angle2 = MathTool.getAngleByVector(-this.moveDir.x, -this.moveDir.z)
            let angle = Math.abs(angle1 - angle2)
            if (Math.abs(angle) < 40) {
                this.followMove = true
            }
        }
        let hitRate = random()
        let maxHitRate = random() * 0.2 + 0.6

        if (!this.player.isAi) {
            maxHitRate = this.player.weapon.hitRate
        }

        if (hitRate > maxHitRate) {
            this.followMove = false
            let symbol = (random() - 0.5) > 0 ? -1 : 1
            let weapon = this.player.weapon
            let randomOffset = (weapon.minOffset + (weapon.maxOffset - weapon.minOffset) * random()) * symbol
            let offsetX = this.moveDir.x * Math.cos(randomOffset * Math.PI / 180) - this.moveDir.z * Math.sin(randomOffset * Math.PI / 180)
            let offsetZ = this.moveDir.z * Math.cos(randomOffset * Math.PI / 180) + this.moveDir.x * Math.sin(randomOffset * Math.PI / 180)
            let moveDir = new Vec3(offsetX, 0, offsetZ)
            this.moveDir = moveDir.normalize()
        }

        this.node.setWorldPosition(this.startPos)
        let euler = new Vec3(-38, 0, 2.33)
        let quat = new Quat()
        Quat.fromEuler(quat, euler.x, euler.y, euler.z)
        this.model.setWorldRotation(quat)
        this.node.active = true
    }

    bomb(enery?: BasePlayer) {
        if (enery && !enery.hunmanAttr.isDead) {
            let shieldBuff = enery.node.getComponent(ShiledBuff)
            let resist = false
            if (shieldBuff) {
                let vec2 = new Vec2(this.player.node.worldPosition.x, this.player.node.worldPosition.z)
                resist = shieldBuff.getResist(vec2)
            }
            if (!resist) {
                let isdead = enery.attacked(this.player.getDamage())
                if (isdead[0]) {
                    let exp = enery.getKilledExp()
                    this.player.addKillCount(exp)
                    this.player.addRewardMoney(enery.getLevel())
                    CustomEventListener.dispatchEvent(Contants.EventName.startKillReport,
                        this.player.getName(),enery.getName())
                }
                if (isdead[1] != 0 && !this.player.isAi) {
                    CustomEventListener.dispatchEvent(Contants.EventName.ShowDamage,
                        enery.node.getWorldPosition(), new Color(156, 239, 255, 255), isdead[1])
                }
            }
        }
        let bomb = ObjectPoolMgr.getInstance().get("PistolBomb")
        var callBack = function () {
            bomb.setWorldPosition(this.node.getWorldPosition())
        }.bind(this)
        bomb.getComponent(PoolObjLifeCycle).startLife(callBack)
        this.destroySelf()
    }

    destroySelf() {
        this.isBomb = true
        this.node.active = false
        ObjectPoolMgr.getInstance().put(this.node)
    }
}
