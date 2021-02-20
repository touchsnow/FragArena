import { _decorator, Component, Node, director, game } from 'cc';
import ASCAd from '../../../Framework3D/Src/AD/ASCAd';
import AudioManager from '../../../Framework3D/Src/Base/AudioManager';
import PlatformManager from '../../../Framework3D/Src/Base/PlatformManager';
import UIUtility from '../../../Framework3D/Src/Base/UIUtility';
const { ccclass, property } = _decorator;

@ccclass('AdManager')
export class AdManager {

    private static adManger: AdManager

    public static getInstance(): AdManager {
        if (this.adManger == null) {
            this.adManger = new AdManager()
        }
        return AdManager.adManger
    }

    private adSwitch = true

    fanun() {
        ASCAd.getInstance().getIntersFlag()
        ASCAd.getInstance().showInters()
        ASCAd.getInstance().showBanner()
    }

    showVideo(callBack) {
        if (this.adSwitch) {
            var callback = function (isEnd) {
                AudioManager.getInstance().resumeMusic()
                director.resume()
                if (isEnd) {
                    if (callBack) callBack()
                }
                else {
                    UIUtility.getInstance().showTopTips("视频未播放完成！")
                }
            }.bind(this)
            if (ASCAd.getInstance().getVideoFlag()) {
                AudioManager.getInstance().pauseMusic()
                director.pause()
                ASCAd.getInstance().showVideo(callback)
            }
            else {
                UIUtility.getInstance().showTopTips("视频未加载完成！")
            }
        } else {
            if (callBack) callBack()
        }
    }

    showBanner() {
        ASCAd.getInstance().showBanner()
    }

    hideBanner() {
        ASCAd.getInstance().hideBanner()
    }

    showInters() {
        ASCAd.getInstance().getIntersFlag() && ASCAd.getInstance().showInters()
    }

    phoneVibrate() {
        ASCAd.getInstance().phoneVibrate('short');
    }

    showNavigateBoxPortal() {
        if (PlatformManager.getInstance().isOppo()) {
            if (ASCAd.getInstance().getNavigateBoxPortalFlag()) {
                //展示互推盒子九宫格
                ASCAd.getInstance().showNavigateBoxPortal();
            }
        }
    }











}
