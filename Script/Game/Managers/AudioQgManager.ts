import { sys, _decorator } from "cc";

const { ccclass, property } = _decorator;

const EFFECT_VOLUME_KEY = 'effect_volume';

@ccclass
export default class AudioQgManager {

    private static instance: AudioQgManager;
    private _audioRootPath: string = 'https://xiaoyudi-1259481479.cos.ap-guangzhou.myqcloud.com/BenFei/FragArena/oppo/Sound/';

    public static getInstance(): AudioQgManager {
        if (!AudioQgManager.instance) {
            AudioQgManager.instance = new AudioQgManager();
        }
        return AudioQgManager.instance;
    }

    private auidoDic: Map<string, Array<any>> = new Map<string, Array<any>>()

    private resolvePath(path: string) {
        return `${this._audioRootPath}${path}.mp3`;
    }

    public playQgAudio(path: string, isLoop: boolean = false, volume: number = 1) {
        let audioObj = null;
        if (typeof qg != "undefined") {
            audioObj = qg.createInnerAudioContext();
            audioObj.loop = isLoop;
            audioObj.volume = volume;
            audioObj.autoplay = false;
            audioObj.src = this.resolvePath(path);
            this.setAudio(path, audioObj)
            let playSound = function () {
                audioObj.play();
                audioObj.offCanplay(playSound);
            };
            audioObj.onCanplay(playSound);
            let errorSound = function () {
                console.log("音频出现错误")
            }
            audioObj.onError(errorSound);
            let onEnded = function () {
                audioObj.destroy()
            }
            audioObj.onEnded(onEnded);
        }
    }

    getQgAudio(path: string, isLoop: boolean = false, volume: number = 1) {
        let audioObj = null;
        if (typeof qg != "undefined") {
            audioObj = qg.createInnerAudioContext();
            audioObj.loop = isLoop;
            audioObj.volume = volume;
            audioObj.autoplay = false;
            audioObj.src = this.resolvePath(path);
            let playSound = function () {
                audioObj.play();
                audioObj.offCanplay(playSound);
            };
            audioObj.onCanplay(playSound);
            return audioObj;
        }
    }

    getCanPlayAudio(name: string) {
        let audioArray = this.auidoDic.get(name)
        console.log(audioArray)
        if (audioArray) {
            for (let audio of audioArray) {
                if (audio.paused) {
                    return audio
                }
            }
        }
        return null
    }

    setAudio(name, audioObj) {
        let array = this.auidoDic.get(name)
        if (array) {
            array.push(audioObj)
        } else {
            let newArray = []
            newArray.push(audioObj)
            this.auidoDic.set(name, newArray)
        }
    }

}
