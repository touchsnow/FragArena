import { _decorator, Component, Node, ParticleSystemComponent, CCInteger } from 'cc';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import { FrangArenaAudioMgr } from '../Managers/FrangArenaAudioMgr';
import { PoolObjLifeCycle } from './PoolObjLifeCycle';
const { ccclass, property } = _decorator;

@ccclass('ShotBombObject')
export class ShotBombObject extends PoolObjLifeCycle {

    @property([ParticleSystemComponent])
    paticleList: ParticleSystemComponent[] = []

    @property(CCInteger)
    lifeTiem: number = 0

    currentLifeTime: number = 0

    update(dt: number) {
        this.currentLifeTime += dt
        if (this.currentLifeTime > this.lifeTiem) {
            this.endLife()
        }
    }

    startLife(callBack?) {
        this.currentLifeTime = 0
        this.node.active = true
        if (callBack) {
            callBack()
        }
        for (let particle of this.paticleList) {
            particle.play()
        }
        FrangArenaAudioMgr.getInstance().playEffectByPath(this.node.worldPosition,"PistolBomb")
    }

    endLife(callBack?) {
        if (callBack) {
            callBack()
        }
        for (let particle of this.paticleList) {
            particle.stop()
        }
        this.recycle()
    }

}
