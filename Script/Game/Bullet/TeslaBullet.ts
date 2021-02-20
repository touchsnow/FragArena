import { _decorator, Vec3, AudioSourceComponent, random, Vec2, Color } from 'cc';
import PlatformManager from '../../../Framework3D/Src/Base/PlatformManager';
import { Contants } from '../../Data/Contants';
import { CustomEventListener } from '../../Data/CustomEventListener';
import { ShiledBuff } from '../Buff/ShiledBuff';
import AudioQgManager from '../Managers/AudioQgManager';
import { ObjectPoolMgr } from '../Managers/ObjectPoolMgr';
import { PoolObjLifeCycle } from '../ObjectPool/PoolObjLifeCycle';
import { Bullet } from './Bullet';
const { ccclass, property } = _decorator;

@ccclass('TeslaBullet')
export class TeslaBullet extends Bullet {

    @property(AudioSourceComponent)
    audio: AudioSourceComponent = null

    private attackFruq: number = 0.167
    private attackTime: number = 0

    private hadTouchEnery: boolean = false

    private qgAudio = null

    update(dt: number) {
        if (!this.isBomb) {
            this.moveTime += dt
            this.attackTime += dt
            if (!this.hadTouchEnery) {
                this.node.setWorldPosition(this.node.getWorldPosition().add(this.moveDir.clone().multiplyScalar(0.09)))
            }
            if (this.attackTime > this.attackFruq) {
                this.attackTime = 0
                let hitRate = random()
                if (this.player.weapon) {
                    if (hitRate > this.player.weapon.hitRate) {
                        this.bomb()
                    }
                }
            }
            if (this.moveTime > this.maxMoveTime) {
                this.destroySelf()
            }
        }
    }

    init(startPos: Vec3, moveDir: Vec3, player = null, endPos: Vec3 = new Vec3(10000, 0, 0)) {
        this.isBomb = false
        this.moveTime = 0
        this.attackTime = 0
        this.startPos = startPos
        this.endPos = endPos
        this.moveDir = moveDir.normalize()
        this.node.setWorldPosition(this.startPos)
        this.player = player
        this.attackFruq = this.player.getDamageInterval()
        this.maxMoveTime = this.player.weapon.attackRange
        this.hadTouchEnery = false
        if (PlatformManager.getInstance().isOppo()) {
            if (!this.qgAudio) {
                this.qgAudio = AudioQgManager.getInstance().getQgAudio("TeslaBullet", true)
            } else {
                let playSound = function () {
                    this.qgAudio.play();
                    this.qgAudio.offCanplay(playSound);
                };
                this.qgAudio.onCanplay(playSound);
            }
        } else {
            this.audio.loop = true
            this.audio.clip.play()
        }

    }

    bomb() {
        if (this.player && this.player.playerMgr) {
            let allPlays = this.player.playerMgr.getAllPlayers()
            for (let i = 0; i < allPlays.length; i++) {
                if (allPlays[i] != this.player) {
                    let attackedPlayer = allPlays[i]
                    let dis = Vec3.distance(attackedPlayer.node.worldPosition, this.node.worldPosition)
                    if (dis < 3) {
                        let bomb = ObjectPoolMgr.getInstance().get("TeslaBomb")
                        var callBack = function () {
                            bomb.setWorldPosition(attackedPlayer.node.worldPosition)
                        }.bind(this)
                        bomb.getComponent(PoolObjLifeCycle).startLife(callBack)
                        if (!attackedPlayer.hunmanAttr.isDead) {
                            let shieldBuff = attackedPlayer.node.getComponent(ShiledBuff)
                            let resist = false
                            if (shieldBuff) {
                                let vec2 = new Vec2(this.node.worldPosition.x, this.node.worldPosition.z)
                                resist = shieldBuff.getResist(vec2)
                            }
                            if (!resist) {
                                let isdead = attackedPlayer.attacked(this.player.getDamage() * (-0.33 * dis + 1.5))
                                if (isdead[0]) {
                                    let exp = attackedPlayer.getKilledExp()
                                    this.player.addKillCount(exp)
                                    this.player.addRewardMoney(attackedPlayer.getLevel())
                                    CustomEventListener.dispatchEvent(Contants.EventName.startKillReport,
                                        this.player.getName(), attackedPlayer.getName())
                                }
                                if (isdead[1] != 0 && !this.player.isAi) {
                                    CustomEventListener.dispatchEvent(Contants.EventName.ShowDamage,
                                        attackedPlayer.node.getWorldPosition(), new Color(41, 57, 255, 255), isdead[1])
                                }
                            }
                        }
                    }
                    if (dis < 1) {
                        this.setStop()
                    }
                }
            }
        }
    }

    setStop() {
        if (!this.hadTouchEnery) {
            this.hadTouchEnery = true
            this.moveTime = 0
            this.maxMoveTime = 5
        }
    }

    destroySelf() {
        if (PlatformManager.getInstance().isOppo()) {
            if (!this.qgAudio) {

            } else {
                this.qgAudio.stop()
            }
        } else {
            this.audio.clip.stop()
        }
        ObjectPoolMgr.getInstance().put(this.node)
    }




}
