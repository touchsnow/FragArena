import { _decorator, Component, Node, Vec3, AudioSourceComponent, Vec2, Quat } from 'cc';
import PlatformManager from '../../../Framework3D/Src/Base/PlatformManager';
import { Contants } from '../../Data/Contants';
import { CustomEventListener } from '../../Data/CustomEventListener';
import { ShiledBuff } from '../Buff/ShiledBuff';
import AudioQgManager from '../Managers/AudioQgManager';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

@ccclass('ContinuousBullet')
export class ContinuousBullet extends Bullet {

    protected attackRange: number = 0

    // @property(AudioSourceComponent)
    // audio: AudioSourceComponent = null

    public onFire: boolean = false
    protected firePoint: Node = null
    protected attackTime: number = 0
    protected offsetAngle: number = 0

    private agAudio = null

    update(dt: number) {
        this.node.setWorldRotation(this.firePoint.worldRotation)
        let quat: Quat = new Quat()
        Quat.fromEuler(quat, 0, this.offsetAngle, 0)
        this.node.rotate(quat, Node.NodeSpace.WORLD)
        this.node.setWorldPosition(this.firePoint.worldPosition)
        if (this.onFire) {
            this.attackTime += dt
            if (this.attackTime > this.player.getDamageInterval()) {
                this.attackTime = 0
                this.takeDamage()
            }
        }
    }

    attack() {
        if (this.onFire) return
        this.onFire = true
        this.node.active = true

        //        if (PlatformManager.getInstance().isOppo()) {
        if (!this.agAudio) {
                this.agAudio = AudioQgManager.getInstance().getQgAudio("ContinuousBullet")
        } else {
            this.agAudio.play()
        }
        // } else {
        //     this.audio.loop = true
        //     this.audio.clip.play()
        // }
    }

    stopAttack() {
        if (!this.onFire) return
        this.onFire = false
        this.node.active = false
        //if (PlatformManager.getInstance().isOppo()) {
        if (this.agAudio) {
            this.agAudio.stop()
        }
        // } else {
        //     this.audio.clip.stop()
        // }
    }

    initForContinuous(agrs: any) {

    }

    takeDamage(buff?: string) {
        let allPlays = this.player.playerMgr.getAllPlayers()
        for (let i = 0; i < allPlays.length; i++) {
            if (allPlays[i] != this.player) {
                let attackedPlayer = allPlays[i]
                let dis = Vec3.distance(attackedPlayer.node.worldPosition, this.node.worldPosition)
                if (dis < this.attackRange) {
                    let angle = Vec3.angle(this.node.forward, attackedPlayer.node.getWorldPosition().subtract(this.node.getWorldPosition()))
                    if (angle < 0.7) {
                        let shieldBuff = attackedPlayer.node.getComponent(ShiledBuff)
                        let resist = false
                        if (shieldBuff) {
                            let vec2 = new Vec2(this.player.node.worldPosition.x, this.player.node.worldPosition.z)
                            resist = shieldBuff.getResist(vec2)
                        }
                        if (!resist) {
                            let isdead = attackedPlayer.attacked(this.player.getDamage())
                            if (buff) {
                                attackedPlayer.addDebuff(buff, this.player)
                            }
                            if (isdead[0]) {
                                let exp = attackedPlayer.getKilledExp()
                                this.player.addKillCount(exp)
                                this.player.addRewardMoney(attackedPlayer.getLevel())
                                CustomEventListener.dispatchEvent(Contants.EventName.startKillReport,
                                    this.player.getName(), attackedPlayer.getName())
                            }
                        }
                    }
                }
            }
        }
    }

    onDestroy() {
        if (this.agAudio) {
            this.agAudio.stop()
        }
    }

}
