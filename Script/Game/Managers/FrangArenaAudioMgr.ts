import { _decorator, Component, Node, Vec3, AudioSourceComponent, AudioClip, resources } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import PlatformManager from '../../../Framework3D/Src/Base/PlatformManager';
import UIUtility from '../../../Framework3D/Src/Base/UIUtility';
import { Contants } from '../../Data/Contants';
import { BasePlayer } from '../Player/BasePlayer';
import AudioQgManager from './AudioQgManager';
const { ccclass, property } = _decorator;

@ccclass('FrangArenaAudioMgr')
export class FrangArenaAudioMgr {

    private static frangArenaAudioMgr: FrangArenaAudioMgr
    public static getInstance(): FrangArenaAudioMgr {
        if (this.frangArenaAudioMgr == null) {
            this.frangArenaAudioMgr = new FrangArenaAudioMgr()
        }
        return FrangArenaAudioMgr.frangArenaAudioMgr
    }

    private player: Node = null
    private _audioRootPath: string = 'Sound';
    private hadPlayFirstBlood: boolean = false

    killSounds = [
        "successiveKilled_1",
        "slaineEnemy",
        "successiveKilled_2",
        "successiveKilled_3",
        "successiveKilled_4",
        "successiveKilled_5",
        "successiveKilled_6",
        "successiveKilled_7",
        "successiveKilled_8",
        "successiveKilled_9",
        "shutDown"
    ]

    // firstPlayList = [
    //     "successiveKilled_1",
    //     "slaineEnemy",
    //     "successiveKilled_2",
    //     "successiveKilled_3",
    //     "successiveKilled_4",
    //     "successiveKilled_5",
    //     "successiveKilled_6",
    //     "successiveKilled_7",
    //     "successiveKilled_8",
    //     "successiveKilled_9",
    //     "shutDown",
    //     "ContinuousBullet",
    //     "Lottery",
    //     "PistolBomb",
    //     "PistolGun",
    //     "ReceivingMoney",
    //     "RockBomb",
    //     "RockBullet",
    //     "ShotGun",
    //     "StoreItem",
    //     "TeslaBomb",
    //     "TeslaBullet"
    // ]

    localPlayList = [
        "PistolGun",
        "PistolBomb",
        "TeslaBomb"
    ]

    init(player: Node) {
        this.player = player
        this.hadPlayFirstBlood = false
    }

    playEffectByPath(pos: Vec3, path: string) {
        if (!AudioManager.getInstance().getEffectState()) {
            return
        }
        if (this.player && this.player.worldPosition) {
            let dis = Vec3.distance(pos, this.player.worldPosition)
            if (dis < 11) {
                let volume = -0.125 * dis + 1.125
                if (volume > 1) {
                    volume = 1
                }
                if (volume < 0) {
                    volume = 0
                }
                if ((PlatformManager.getInstance().isOppo() || PlatformManager.getInstance().isHuaWei()) && this.localPlayList.indexOf(path) == -1) {
                    AudioQgManager.getInstance().playQgAudio(path, false, volume)
                } else {
                    this.playEffect(path, false, volume)
                }
            }
        }
    }

    playEffect(path: string, loop: boolean = false, volume: number) {

        let asset = resources.get(this.resolvePath(path)) as AudioClip
        if (AudioManager.getInstance().getEffectState() && asset) {
            asset.playOneShot(volume);
        }

    }

    playKillSoundByCount(player: BasePlayer, killCount: number) {
        if (Contants.deBugMode) return
        if (!this.hadPlayFirstBlood) {
            this.hadPlayFirstBlood = true
            if (PlatformManager.getInstance().isOppo() || PlatformManager.getInstance().isHuaWei()) {
                AudioQgManager.getInstance().playQgAudio(this.killSounds[0], false, 1)
            } else {
                this.playEffect(this.killSounds[0], false, 1)
            }
            //this.playEffect(this.killSounds[0], false, 1)
        } else {
            if (!player.isAi) {
                if (killCount > 9) {
                    killCount = 9
                }
                //this.killSounds[0]
                if (PlatformManager.getInstance().isOppo() || PlatformManager.getInstance().isHuaWei()) {
                    AudioQgManager.getInstance().playQgAudio(this.killSounds[killCount], false, 1)
                } else {
                    this.playEffect(this.killSounds[killCount], false, 1)
                }
                //this.playEffect(this.killSounds[killCount], false, 1)
            }
        }
    }

    playKillSoundByID(killSoundId: number) {
        if (Contants.deBugMode) return
        if (!this.hadPlayFirstBlood) {
            this.hadPlayFirstBlood = true
            //this.playEffect(this.killSounds[0], false, 1)
            if (PlatformManager.getInstance().isOppo() || PlatformManager.getInstance().isHuaWei()) {
                AudioQgManager.getInstance().playQgAudio(this.killSounds[0], false, 1)
            } else {
                this.playEffect(this.killSounds[0], false, 1)
            }
        } else {
            if (PlatformManager.getInstance().isOppo() || PlatformManager.getInstance().isHuaWei()) {
                AudioQgManager.getInstance().playQgAudio(this.killSounds[killSoundId], false, 1)
            } else {
                this.playEffect(this.killSounds[killSoundId], false, 1)
            }
            //this.playEffect(this.killSounds[killSoundId], false, 1)
        }
    }

    resolvePath(path: string) {
        return `${this._audioRootPath}/${path}`;
    }

    playFitstAuido() {
        for (let path of this.localPlayList) {
            this.playEffect(path, false, 0)
        }
    }
}
