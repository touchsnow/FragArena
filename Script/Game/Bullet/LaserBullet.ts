import { _decorator, Component, Node, Vec3, geometry, PhysicsSystem, PhysicsRayResult, Vec2, Color } from 'cc';
import { Contants } from '../../Data/Contants';
import { CustomEventListener } from '../../Data/CustomEventListener';
import { ShiledBuff } from '../Buff/ShiledBuff';
import { BasePlayer } from '../Player/BasePlayer';
import { Bullet } from './Bullet';
import { ContinuousBullet } from './ContinuousBullet';
const { ccclass, property } = _decorator;

@ccclass('LaserBullet')
export class LaserBullet extends ContinuousBullet {

    public onFire: boolean = false

    /**射线 */
    private ray = new geometry.Ray()

    //private firePoint: Node = null

    private rayPoint: Node = null

    private maxDis: number = 30

    private offsetRayDis: number = 0

    @property(Node)
    startNode: Node = null

    @property(Node)
    endNode: Node = null

    @property(Node)
    startParticle: Node = null

    @property(Node)
    endParticle: Node = null

    @property(Node)
    laser: Node = null

    update(dt: number) {
        if (this.onFire) {
            this.setBulletLenght(dt)
            this.updateParticle()
        }
    }

    // takeDamage() {
    //     let random = Math.random()
    //     if (random > this.player.weapon.hitRate) return
    //     super.takeDamage()
    // }

    updateParticle() {
        this.startParticle.setWorldPosition(this.startNode.worldPosition)
        this.endParticle.setWorldPosition(this.endNode.worldPosition)
    }

    initForContinuous(agrs: any) {
        this.firePoint = agrs[0]
        this.rayPoint = agrs[1]
        this.player = agrs[2]
        this.offsetAngle = agrs[3]
        this.offsetRayDis = agrs[4]
        this.startPos = this.rayPoint.worldPosition
    }

    setBulletLenght(dt: number) {
        this.node.setWorldPosition(this.firePoint.getWorldPosition())
        this.ray.o = this.rayPoint.worldPosition.add(this.rayPoint.forward.multiplyScalar(this.offsetRayDis))
        let offsetX = this.rayPoint.forward.x * Math.cos(this.offsetAngle * Math.PI / 180) - this.rayPoint.forward.z * Math.sin(this.offsetAngle * Math.PI / 180)
        let offsetZ = this.rayPoint.forward.z * Math.cos(this.offsetAngle * Math.PI / 180) + this.rayPoint.forward.x * Math.sin(this.offsetAngle * Math.PI / 180)
        this.ray.d = new Vec3(offsetX, this.rayPoint.forward.y, offsetZ)
        let hitPoint = null
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
                            NearestNode = r[i]
                        }
                    }
                }
                let enemy = NearestNode.collider.node.getComponent(BasePlayer)
                if (enemy) {
                    this.attackTime += dt
                    if (this.attackTime > this.player.getDamageInterval()) {
                        this.attackTime = 0
                        let random = Math.random()
                        if (random > this.player.weapon.hitRate) return
                        let shieldBuff = enemy.node.getComponent(ShiledBuff)
                        let resist = false
                        if (shieldBuff) {
                            let vec2 = new Vec2(this.player.node.worldPosition.x, this.player.node.worldPosition.z)
                            resist = shieldBuff.getResist(vec2)
                        }

                        if (!resist) {
                            let isdead = enemy.attacked(this.player.getDamage())
                            if (isdead[0]) {
                                let exp = enemy.getKilledExp()
                                this.player.addKillCount(exp)
                                this.player.addRewardMoney(enemy.getLevel())
                                CustomEventListener.dispatchEvent(Contants.EventName.startKillReport,
                                    this.player.getName(),enemy.getName())

                            }
                            if (isdead[1] != 0 && !this.player.isAi) {
                                enemy.addDebuff("LaserDeBuff", this.player)
                                // CustomEventListener.dispatchEvent(Contants.EventName.ShowDamage,
                                //     enemy.node.getWorldPosition(), new Color(255, 133, 0, 255), isdead[1])
                            }
                        }
                    }
                }
                if (Vec3.distance(this.node.worldPosition, NearestNode.hitPoint) < this.maxDis) {
                    hitPoint = NearestNode.hitPoint
                }
            }
        }

        if (!hitPoint) {
            hitPoint = this.rayPoint.getWorldPosition().add(this.rayPoint.forward.clone().multiplyScalar(this.maxDis))
        }

        this.node.lookAt(hitPoint)
        let length = Vec3.distance(this.node.worldPosition, hitPoint)
        this.laser.setScale(1, 1, length)
    }
}
