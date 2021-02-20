import { _decorator, Component, Node, instantiate, resources, find, RigidBody, RigidBodyComponent, Vec3, Vec4 } from 'cc';
import { BackFireBuff } from '../Buff/BackFireBuff';
import { MultipleShotBuff } from '../Buff/MultipleShotBuff';
import { SplitFireBuff } from '../Buff/SplitFireBuff';
import { DynamiteBullet } from '../Bullet/DynamiteBullet';
import { ObjectPoolMgr } from '../Managers/ObjectPoolMgr';
import { MathTool } from '../Tool/MathTool';
import { IWeapon } from './IWeapon';
const { ccclass, property } = _decorator;

@ccclass('DynamiteGun')
export class DynamiteGun extends IWeapon {

    getWeaponName() {
        return "DynamiteGun"
    }

    attack() {
        super.attack()
        let shotCount = 1
        let multipleShotBuff = this.player.node.getComponent(MultipleShotBuff)
        if (multipleShotBuff) {
            shotCount += multipleShotBuff.getShotConnt()
        }
        for (let i = 0; i < shotCount; i++) {
            let delayTime = i * 0.2
            this.scheduleOnce(() => {
                if(this.player.node){
                    this.shot(this.rayPoint.forward.add(new Vec3(0, 1, 0)), this.firePoint.getWorldPosition())
                    if (this.player.node.getComponent(BackFireBuff)) {
                        let dir = this.rayPoint.forward.multiplyScalar(-1).add(new Vec3(0, 1, 0))
                        let bulletStartPos = this.firePoint.getWorldPosition().add(this.rayPoint.forward.multiplyScalar(-2))
                        this.shot(dir, bulletStartPos)
                    }
                    if (this.player.node.getComponent(SplitFireBuff)) {
                        let dir1 = MathTool.getRotateVec(this.rayPoint.forward, 45, 1)
                        let startPos1 = this.rayPoint.worldPosition.add(dir1.clone().multiplyScalar(0.5))
                        this.shot(dir1, startPos1)
    
                        let dir2 = MathTool.getRotateVec(this.rayPoint.forward, -45, 1)
                        let startPos2 = this.rayPoint.worldPosition.add(dir2.clone().multiplyScalar(0.5))
                        this.shot(dir2, startPos2)
                    }
                }
            }, delayTime)
        }
    }

    shot(dir, bulletStartPos) {
        let node = ObjectPoolMgr.getInstance().get("DynamiteBullet")
        node.active = true
        node.getComponent(DynamiteBullet)?.init(bulletStartPos, dir, this.player)
    }

    getAttackRangeColor():Vec4{
        return new Vec4(255,97,97,255)
    }

}
