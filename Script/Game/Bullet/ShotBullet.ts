// Learn TypeScript:
import { _decorator, Component, Node, Vec3, tween, PhysicsSystem, PhysicsRayResult, geometry, random, Vec2, Color } from 'cc';
import BoxController from '../../../Framework3D/Src/AD/ads/boxAd/BoxController';
import { Contants } from '../../Data/Contants';
import { CustomEventListener } from '../../Data/CustomEventListener';
import { ShiledBuff } from '../Buff/ShiledBuff';
import { ObjectPoolMgr } from '../Managers/ObjectPoolMgr';
import { PoolObjLifeCycle } from '../ObjectPool/PoolObjLifeCycle';
import { BasePlayer } from '../Player/BasePlayer';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

@ccclass('ShotBullet')
export class ShotBullet extends Bullet {

    /**射线 */
    protected ray = new geometry.Ray()

    private maxDis: number = 6

    @property(Node)
    startFire: Node = null

    @property(Node)
    endFire: Node = null

    private endFireEnable: boolean = false
    private hadChangeDir: boolean = false
    private hadHitPoint: boolean = false

    start() {

    }

    update(dt: number) {
        if (!this.isBomb) {
            this.moveTime += dt
            this.node.setWorldPosition(this.node.getWorldPosition().add(this.moveDir.clone().multiplyScalar(0.2)))
            if (this.player.aroundEnemy != null && this.player.aroundEnemy.length > 0) {
                for (let i = 0; i < this.player.aroundEnemy.length; i++) {
                    let emery = this.player.aroundEnemy[i]
                    if (emery && Vec3.distance(this.node.worldPosition, emery.node.worldPosition) <= 0.7 && !this.hadChangeDir) {
                        this.bomb(emery)
                    }
                }
            }
            else if (Vec3.distance(this.node.worldPosition, this.endPos) <= 0.7 && this.hadHitPoint) {
                this.changeDir()
            }
            if (this.moveTime > this.maxMoveTime) {
                this.destroySelf()
            }
            if (this.moveTime > 0.2 && !this.endFireEnable) {
                this.enableEndFire()
            }
        }
    }

    init(startPos: Vec3, moveDir: Vec3 = new Vec3, player = null, endPos: Vec3 = new Vec3(10000, 0, 0)) {
        this.isBomb = false
        this.moveTime = 0
        this.startPos = startPos
        this.startFire.active = true
        this.endFire.active = false
        this.endFireEnable = false
        this.hadChangeDir = false
        this.hadHitPoint = false
        this.moveDir = this.node.forward
        this.node.setWorldPosition(this.startPos)
        this.player = player
        this.maxMoveTime = this.player.weapon.attackRange
        this.ray.o = this.startPos
        this.ray.d = this.moveDir
        if (PhysicsSystem.instance.raycast(this.ray)) {
            const r = PhysicsSystem.instance.raycastResults;
            if (r.length > 0) {
                let NearestNode: PhysicsRayResult = null
                for (let i = 0; i < r.length; i++) {
                    if (i === 0) {
                        NearestNode = r[i]
                    }
                    else {
                        if (NearestNode.distance > r[i].distance) {
                            if (!r[i].collider.node.getComponent(BasePlayer)) {
                                NearestNode = r[i]
                            } else {
                            }
                        }
                    }
                }
                let hitPoint = NearestNode.hitPoint
                if (Vec3.distance(this.node.worldPosition, hitPoint) < this.maxDis) {
                    this.endPos = hitPoint
                    this.hadHitPoint = true
                } else {
                    this.endPos = this.node.getWorldPosition().add(this.node.forward.normalize().multiplyScalar(this.maxDis))
                }
            }
        } else {
            this.endPos = this.node.getWorldPosition().add(this.node.forward.normalize().multiplyScalar(this.maxDis))
        }
    }

    bomb(enermy?: BasePlayer) {
        if (enermy && !enermy.hunmanAttr.isDead) {
            enermy.rigidBody.applyImpulse(this.node.forward.multiplyScalar(15))
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
            this.changeDir()
        }
    }

    destroySelf() {
        this.isBomb = true
        ObjectPoolMgr.getInstance().put(this.node)
    }

    enableEndFire() {
        this.endFire.setScale(1, 1, 1)
        tween(this.endFire)
            .to(0.3, { scale: new Vec3(0, 0, 0) }, { easing: "circInOut" })
            .start()
        this.endFireEnable = true
        this.startFire.active = false
        this.endFire.active = true
    }

    changeDir() {
        if (this.hadChangeDir) return
        this.hadChangeDir = true
        let rotateY = 180 + (Math.random() - 0.5) * 60
        let rotateX = (Math.random() - 0.5) * 60
        let currentEulerAngle = this.node.eulerAngles.clone()
        currentEulerAngle.x += rotateX
        currentEulerAngle.y += rotateY
        this.node.setRotationFromEuler(currentEulerAngle.x, currentEulerAngle.y, currentEulerAngle.z)
        this.moveDir = this.node.forward
        let bomb = ObjectPoolMgr.getInstance().get("ShotBomb")
        var callback = function () {
            bomb.setWorldPosition(this.node.worldPosition)
        }.bind(this)
        bomb.getComponent(PoolObjLifeCycle).startLife(callback)

    }
}

