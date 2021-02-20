import { _decorator, Component, Node, resources, instantiate, find, PhysicsSystem, PhysicsRayResult, Vec3 } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import { BackFireBuff } from '../Buff/BackFireBuff';
import { MultipleShotBuff } from '../Buff/MultipleShotBuff';
import { SplitFireBuff } from '../Buff/SplitFireBuff';
import { PistolBullet } from '../Bullet/PistolBullet';
import { FrangArenaAudioMgr } from '../Managers/FrangArenaAudioMgr';
import { ObjectPoolMgr } from '../Managers/ObjectPoolMgr';
import { BasePlayer } from '../Player/BasePlayer';
import { MathTool } from '../Tool/MathTool';
import { IWeapon } from './IWeapon';
const { ccclass, property } = _decorator;

@ccclass('Pistol')
export class Pistol extends IWeapon {

    getWeaponName() {
        return "Pistol"
    }

    attack() {
        super.attack()
        //多发子弹
        let shotCount = 1
        let multipleShotBuff = this.player.node.getComponent(MultipleShotBuff)
        if (multipleShotBuff) {
            shotCount += multipleShotBuff.getShotConnt()
        }
        for (let i = 0; i < shotCount; i++) {
            let delayTime = i * 0.08
            //let delayTime = i * 2
            this.scheduleOnce(() => {
                if(this.player.node){
                    this.shot(this.rayPoint.forward, this.rayPoint.worldPosition)
                    //背后开火
                    if (this.player.node.getComponent(BackFireBuff)) {
                        let dir = this.rayPoint.forward.multiplyScalar(-1)
                        let startPos = this.rayPoint.worldPosition.add(this.rayPoint.forward.multiplyScalar(-0.5))
                        this.shot(dir, startPos)
                    }
                    //双向开火
                    if (this.player.node.getComponent(SplitFireBuff)) {
                        let dir1 = MathTool.getRotateVec(this.rayPoint.forward, 45, 1)
                        let startPos1 = this.rayPoint.worldPosition
                        this.shot(dir1, startPos1)
    
                        let dir2 = MathTool.getRotateVec(this.rayPoint.forward, -45, 1)
                        let startPos2 = this.rayPoint.worldPosition
                        this.shot(dir2, startPos2)
                    }
                }
            }, delayTime)
        }
    }

    shot(dir: Vec3, rayStart: Vec3) {
        let node = ObjectPoolMgr.getInstance().get("PistolBullet")
        let moveDir = dir
        this.ray.d = moveDir.normalize()
        this.ray.o = rayStart
        let bulletStartPos = this.firePoint.getWorldPosition()
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
                let bullet = node.getComponent(PistolBullet)
                if (bullet) {
                    //console.log("有碰到点的")
                    bullet.init(bulletStartPos, moveDir, this.player, hitPoint)
                }
            }
        } else {
            let bullet = node.getComponent(PistolBullet)
            if (bullet) {
                // console.log("没碰到点的")
                bullet.init(bulletStartPos, moveDir, this.player)
            }
        }
        FrangArenaAudioMgr.getInstance().playEffectByPath(this.player.node.worldPosition,"PistolGun")
    }

}
