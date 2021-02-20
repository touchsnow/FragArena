import { _decorator, Node, Vec3, Quat, Vec4 } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import { BackFireBuff } from '../Buff/BackFireBuff';
import { MultipleShotBuff } from '../Buff/MultipleShotBuff';
import { SplitFireBuff } from '../Buff/SplitFireBuff';
import { ShotBullet } from '../Bullet/ShotBullet';
import { FrangArenaAudioMgr } from '../Managers/FrangArenaAudioMgr';
import { ObjectPoolMgr } from '../Managers/ObjectPoolMgr';
import { PoolObjLifeCycle } from '../ObjectPool/PoolObjLifeCycle';
import { IWeapon } from './IWeapon';
const { ccclass, property } = _decorator;

@ccclass('ShotGun')
export class ShotGun extends IWeapon {

    private bulletAngels = [
        [0, 0, 0],
        [0, 10, 0],
        [0, 20, 0],
        [0, -10, 0],
        [0, -20, 0]
    ]

    getWeaponName() {
        return "ShotGun"
    }

    attack() {
        super.attack()
        let shotCount = 1
        let multipleShotBuff = this.player.node.getComponent(MultipleShotBuff)
        if (multipleShotBuff) {
            shotCount += multipleShotBuff.getShotConnt()
        }
        for (let i = 0; i < shotCount; i++) {
            let delayTime = i * 0.15
            this.scheduleOnce(() => {
                if(this.player.node){
                    this.shot(0, this.rayPoint.getWorldPosition())
                    if (this.player.node.getComponent(BackFireBuff)) {
                        this.shot(180, this.rayPoint.getWorldPosition().add(this.rayPoint.forward.multiplyScalar(-1)))
                    }
                    if (this.player.node.getComponent(SplitFireBuff)) {
                        this.shot(45, this.rayPoint.getWorldPosition())
                        this.shot(-45, this.rayPoint.getWorldPosition())
                    }
                }
            }, delayTime)
        }

    }

    shot(offset: number, startPos: Vec3) {
        let gunFire = ObjectPoolMgr.getInstance().get("ShotFire")
        var callback = function () {
            gunFire.setWorldPosition(this.rayPoint.worldPosition)
            gunFire.setWorldRotation(this.rayPoint.worldRotation)
        }.bind(this)
        gunFire.getComponent(PoolObjLifeCycle).startLife(callback)

        this.bulletAngels.forEach(element => {
            let node = ObjectPoolMgr.getInstance().get("ShotBullet")
            node.active = true
            let bulletStartPos = startPos
            node.setWorldRotation(this.rayPoint.getWorldRotation())
            let quat: Quat = new Quat()
            Quat.fromEuler(quat, element[0], element[1] + offset, element[2])
            node.rotate(quat, Node.NodeSpace.WORLD)
            let bullet = node.getComponent(ShotBullet)
            if (bullet) {
                bullet.init(bulletStartPos, null, this.player)
            }
        })
        FrangArenaAudioMgr.getInstance().playEffectByPath(this.player.node.worldPosition,"ShotGun")
    }

    getAttackRangeColor():Vec4{
        return new Vec4(100,100,0,255)
    }
}
