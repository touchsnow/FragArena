import { _decorator, Component, Node, resources, instantiate, find, Vec3, Vec4 } from 'cc';
import { BackFireBuff } from '../Buff/BackFireBuff';
import { MultipleShotBuff } from '../Buff/MultipleShotBuff';
import { SplitFireBuff } from '../Buff/SplitFireBuff';
import { TeslaBullet } from '../Bullet/TeslaBullet';
import { ObjectPoolMgr } from '../Managers/ObjectPoolMgr';
import { MathTool } from '../Tool/MathTool';
import { IWeapon } from './IWeapon';
const { ccclass, property } = _decorator;

@ccclass('TeslaGun')
export class TeslaGun extends IWeapon {


    getWeaponName() {
        return "TeslaGun"
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
                    this.shot(this.rayPoint.forward, this.rayPoint.getWorldPosition())
                    if (this.player.node.getComponent(BackFireBuff)) {
                        let dir = this.rayPoint.forward.multiplyScalar(-1)
                        let startPos = this.rayPoint.getWorldPosition()
                        this.shot(dir, startPos)
                    }
    
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
        let node = ObjectPoolMgr.getInstance().get("TeslaBullet")
        node.active = true
        let bullet = node.getComponent(TeslaBullet)
        if (bullet) {
            bullet.init(rayStart, dir, this.player)
        }
    }

    // enablePeculiarity() {
    //     if (this.player) {
    //         let attackRange = this.player.node.getChildByName("AttackRange")
    //         let scale = this.attackRange / 6
    //         let oriScale = new Vec3(0.2, 0.2, 0.2)
    //         attackRange.setScale(oriScale.multiplyScalar(scale))
    //         this.player.attackRange = this.attackRange / 6
    //     }
    // }

    getAttackRangeColor():Vec4{
        return new Vec4(0,0,255,255)
    }
}
