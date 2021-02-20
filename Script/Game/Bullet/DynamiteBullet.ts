// Learn TypeScript:
import { _decorator, Component, Node, tween, Vec3, RigidBodyComponent, random, Vec2, Color } from 'cc';
import { Contants } from '../../Data/Contants';
import { CustomEventListener } from '../../Data/CustomEventListener';
import { ShiledBuff } from '../Buff/ShiledBuff';
import { ObjectPoolMgr } from '../Managers/ObjectPoolMgr';
import { PoolObjLifeCycle } from '../ObjectPool/PoolObjLifeCycle';
import { Bullet } from './Bullet';
const { ccclass } = _decorator;

@ccclass('DynamiteBullet')
export class DynamiteBullet extends Bullet {


    update(deltaTime: number) {
        if (!this.isBomb) {
            this.moveTime += deltaTime
            if (this.moveTime >= this.maxMoveTime) {
                this.bomb()
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
        let rigiBody = this.node.getComponent(RigidBodyComponent)
        // if (this.player.lockedEnemy) {
        //     this.moveDir = this.player.lockedEnemy.node.worldPosition.subtract(this.player.node.worldPosition).normalize()
        //     let moveDis = Vec3.distance(this.player.lockedEnemy.node.worldPosition,this.player.node.worldPosition)
        //     rigiBody.setLinearVelocity(this.moveDir.multiplyScalar(moveDis*0.2))
        //     rigiBody.setAngularVelocity(this.moveDir)
        // }else{
        //let hitRate = random()
        // if (hitRate > this.player.weapon.hitRate) {
        //     let symbol = (random() - 0.5) > 0 ? -1 : 1
        //     let weapon = this.player.weapon
        //     let randomOffset = (weapon.minOffset + (weapon.maxOffset - weapon.minOffset) * random()) * symbol
        //     let offsetX = this.moveDir.x * Math.cos(randomOffset * Math.PI / 180) - this.moveDir.z * Math.sin(randomOffset * Math.PI / 180)
        //     let offsetZ = this.moveDir.z * Math.cos(randomOffset * Math.PI / 180) + this.moveDir.x * Math.sin(randomOffset * Math.PI / 180)
        //     let moveDir = new Vec3(offsetX, 0, offsetZ)
        //     this.moveDir = moveDir.normalize()
        // }
        let scase = 1
        if(this.player.lockedEnemy){
            scase =  Vec3.distance(this.player.lockedEnemy.node.worldPosition,this.player.node.worldPosition) * 0.2
        }
        rigiBody.setLinearVelocity(this.moveDir.multiplyScalar(scase*6))
        rigiBody.setAngularVelocity(this.moveDir)
        //}
    }

    bomb() {
        if (this.player && this.player.playerMgr) {
            this.isBomb = true
            let allPlays = this.player.playerMgr.getAllPlayers()
            for (let i = 0; i < allPlays.length; i++) {
                if (allPlays[i] != this.player) {
                    let attackedPlayer = allPlays[i]
                    let dis = Vec3.distance(attackedPlayer.node.worldPosition, this.node.worldPosition)
                    if (dis < 3) {
                        let shieldBuff = attackedPlayer.node.getComponent(ShiledBuff)
                        let resist = false
                        if (shieldBuff) {
                            let vec2 = new Vec2(this.node.worldPosition.x, this.node.worldPosition.z)
                            resist = shieldBuff.getResist(vec2)
                        }
                        if (!resist) {
                            if (!attackedPlayer.hunmanAttr.isDead) {
                                let isdead = attackedPlayer.attacked(this.player.getDamage())
                                if (isdead[0]) {
                                    let exp = attackedPlayer.getKilledExp()
                                    this.player.addKillCount(exp)
                                    this.player.addRewardMoney(attackedPlayer.getLevel())
                                    CustomEventListener.dispatchEvent(Contants.EventName.startKillReport,
                                        this.player.getName(),attackedPlayer.getName())
                                }
                                if (isdead[1] != 0 && !this.player.isAi) {
                                    CustomEventListener.dispatchEvent(Contants.EventName.ShowDamage,
                                        attackedPlayer.node.getWorldPosition(), new Color(255, 41, 41, 255), isdead[1])
                                }
                            }
                        }
                    }
                }
            }
            let bomb = ObjectPoolMgr.getInstance().get("DynamiteBomb")
            var callBack = function () {
                bomb.setWorldPosition(this.node.worldPosition)
            }.bind(this)
            bomb.getComponent(PoolObjLifeCycle).startLife(callBack)
            ObjectPoolMgr.getInstance().put(this.node)
        }
    }
}
