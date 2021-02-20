import { _decorator, Component, Node, Vec3, tween, random, Vec2, Color } from 'cc';
import { Contants } from '../../Data/Contants';
import { CustomEventListener } from '../../Data/CustomEventListener';
import { ShiledBuff } from '../Buff/ShiledBuff';
import { ObjectPoolMgr } from '../Managers/ObjectPoolMgr';
import { PoolObjLifeCycle } from '../ObjectPool/PoolObjLifeCycle';
import { BasePlayer } from '../Player/BasePlayer';
import { MathTool } from '../Tool/MathTool';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

@ccclass('MachineBullet')
export class MachineBullet extends Bullet {

    update(dt: number) {
        if (!this.isBomb) {
            this.moveTime += dt
            this.node.setWorldPosition(this.node.getWorldPosition().add(this.moveDir.clone().multiplyScalar(0.7)))
            if (this.player.aroundEnemy != null && this.player.aroundEnemy.length > 0) {
                for (let i = 0; i < this.player.aroundEnemy.length; i++) {
                    let emery = this.player.aroundEnemy[i]
                    if (emery) {
                        if (Vec3.distance(this.node.worldPosition, emery.node.worldPosition) <= 1) {
                            this.bomb(emery)
                        }
                    }
                    else if (Vec3.distance(this.node.worldPosition, this.endPos) <= 1) {
                        this.bomb(emery)
                    }
                }
            }
            if (Vec3.distance(this.node.worldPosition, this.endPos) <= 1) {
                this.bomb()
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
        this.node.setWorldPosition(this.startPos)
        this.player = player
        this.maxMoveTime = this.player.weapon.attackRange
        let hitRate = random()
        if (hitRate > this.player.weapon.hitRate) {
            let symbol = (random() - 0.5) > 0 ? -1 : 1
            let weapon = this.player.weapon
            let randomOffset = (weapon.minOffset + (weapon.maxOffset - weapon.minOffset) * random()) * symbol
            let offsetX = this.moveDir.x * Math.cos(randomOffset * Math.PI / 180) - this.moveDir.z * Math.sin(randomOffset * Math.PI / 180)
            let offsetZ = this.moveDir.z * Math.cos(randomOffset * Math.PI / 180) + this.moveDir.x * Math.sin(randomOffset * Math.PI / 180)
            let moveDir = new Vec3(offsetX, 0, offsetZ)
            this.moveDir = moveDir.normalize()
        }
        let angle = MathTool.getAngleByVector(-this.moveDir.x, -this.moveDir.z)
        this.node.setWorldRotationFromEuler(0, angle, 0)
    }

    bomb(ernemy?: BasePlayer) {
        if (ernemy && !ernemy.hunmanAttr.isDead) {
            let shieldBuff = ernemy.node.getComponent(ShiledBuff)
            let resist = false
            if (shieldBuff) {
                let vec2 = new Vec2(this.player.node.worldPosition.x, this.player.node.worldPosition.z)
                resist = shieldBuff.getResist(vec2)
            }
            if (!resist) {
                let isdead = ernemy.attacked(this.player.getDamage())
                if (isdead[0]) {
                    let exp = ernemy.getKilledExp()
                    this.player.addKillCount(exp)
                    this.player.addRewardMoney(ernemy.getLevel())
                    CustomEventListener.dispatchEvent(Contants.EventName.startKillReport,
                        this.player.getName(),ernemy.getName())
                }
                if (isdead[1] != 0 && !this.player.isAi) {
                    CustomEventListener.dispatchEvent(Contants.EventName.ShowDamage,
                        ernemy.node.getWorldPosition(), new Color(255, 221, 42, 255), isdead[1])
                }
            }
        }
        let bomb = ObjectPoolMgr.getInstance().get("MachineBomb")
        var callBack = function () {
            bomb.setWorldPosition(this.node.worldPosition)
        }.bind(this)
        bomb.getComponent(PoolObjLifeCycle).startLife(callBack)
        this.destroySelf()
    }

    destroySelf() {
        this.isBomb = true

        ObjectPoolMgr.getInstance().put(this.node)
        // tween(this.node)
        //     .to(0.2, { scale: new Vec3(2, 2, 2) })
        //     .call(() => {
        //         this.node.destroy()
        //     })
        //     .start()
    }

    spawnLine() {
        let line = ObjectPoolMgr.getInstance().get("MachineLight")
        var callBack = function () {
            line.setWorldPosition(this.node.worldPosition)
            line.setWorldRotation(this.node.worldRotation)
        }.bind(this)
        line.getComponent(PoolObjLifeCycle).startLife(callBack)
    }




}
