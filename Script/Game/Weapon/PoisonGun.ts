// Learn TypeScript:
import { _decorator, Component, Node, resources, instantiate, find, Vec4 } from 'cc';
import { BackFireBuff } from '../Buff/BackFireBuff';
import { SplitFireBuff } from '../Buff/SplitFireBuff';
import { ContinuousBullet } from '../Bullet/ContinuousBullet';
import { ContinuousGun } from './ContinuousGun';
const { ccclass, property } = _decorator;

@ccclass('PoisonGun')
export class PoisonGun extends ContinuousGun {

    getWeaponName() {
        return "PoisonGun"
    }

    startAttack() {
        super.startAttack()
        this.shot()
        if (this.player.node.getComponent(BackFireBuff)) {
            this.backShot()
        }
        if (this.player.node.getComponent(SplitFireBuff)) {
            this.RigthFrontShot()
            this.LeftFrontShot()
        }
    }

    shot() {
        if (!this.bullet) {
            let node = instantiate(resources.get("Bullet/PoisonBullet")) as Node
            node.setParent(find("BulletPoint"))
            let bulletNode = node.getComponent(ContinuousBullet)
            if (bulletNode) {
                this.bullet = bulletNode
                let args = [this.rayPoint, this.player, 0]
                this.bullet.initForContinuous(args)
                this.bulletList.push(this.bullet)
                if (!this.bullet.onFire) {
                    this.bullet.attack()
                }
            }
        } else {
            if (!this.bullet.onFire) {
                this.bullet.attack()
            }
        }
    }

    backShot() {
        if (!this.backBullet) {
            let node = instantiate(resources.get("Bullet/PoisonBullet")) as Node
            node.setParent(find("BulletPoint"))
            let bulletNode = node.getComponent(ContinuousBullet)
            if (bulletNode) {
                this.backBullet = bulletNode
                let args = [this.rayPoint, this.player, 180]
                this.backBullet.initForContinuous(args)
                this.bulletList.push(this.backBullet)
                if (!this.backBullet.onFire) {
                    this.backBullet.attack()
                }
            }
        } else {
            if (!this.backBullet.onFire) {
                this.backBullet.attack()
            }
        }
    }

    RigthFrontShot() {
        if (!this.rightFrontBullet) {
            let node = instantiate(resources.get("Bullet/PoisonBullet")) as Node
            node.setParent(find("BulletPoint"))
            let bulletNode = node.getComponent(ContinuousBullet)
            if (bulletNode) {
                this.rightFrontBullet = bulletNode
                let args = [this.rayPoint, this.player, 45]
                this.rightFrontBullet.initForContinuous(args)
                this.bulletList.push(this.rightFrontBullet)
                if (!this.rightFrontBullet.onFire) {
                    this.rightFrontBullet.attack()
                }
            }
        } else {
            if (!this.rightFrontBullet.onFire) {
                this.rightFrontBullet.attack()
            }
        }
    }

    LeftFrontShot() {
        if (!this.leftFrontBullet) {
            let node = instantiate(resources.get("Bullet/PoisonBullet")) as Node
            node.setParent(find("BulletPoint"))
            let bulletNode = node.getComponent(ContinuousBullet)
            if (bulletNode) {
                this.leftFrontBullet = bulletNode
                let args = [this.rayPoint, this.player, -45]
                this.leftFrontBullet.initForContinuous(args)
                this.bulletList.push(this.leftFrontBullet)
                if (!this.leftFrontBullet.onFire) {
                    this.leftFrontBullet.attack()
                }
            }
        } else {
            if (!this.leftFrontBullet.onFire) {
                this.leftFrontBullet.attack()
            }
        }
    }

    getAttackRangeColor():Vec4{
        return new Vec4(0,104,58,255)
    }
}
