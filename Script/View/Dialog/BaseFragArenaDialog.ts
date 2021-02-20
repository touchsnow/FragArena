import { _decorator, Component, Node, Enum, Tween, UIOpacityComponent, Vec3, tween } from 'cc';
import BaseDialog from '../../../Framework3D/Src/Base/BaseDialog';
import UIUtility from '../../../Framework3D/Src/Base/UIUtility';
const { ccclass, property } = _decorator;

enum InAnimationType {
    NONE,
    FADE_IN,
    SLIDE_IN,
    SHAKE_IN,
}

enum OutAnimationType {
    NONE,
    FADE_OUT,
    SLIDE_OUT,
    SHAKE_OUT,
}

const InAnimation = Enum(InAnimationType);
const OutAnimation = Enum(OutAnimationType);
@ccclass('BaseFragArenaDialog')
export class BaseFragArenaDialog extends BaseDialog {

    start() {
        let touchs = [
            { name: 'ButtonClose', callfunc: 'onTouchClose', customEventData: null },
            { name: 'ButtonBack', callfunc: 'onTouchClose', customEventData: null }
        ];
        for (let i = 0; i < touchs.length; i++) {
            const element = touchs[i]
            //@ts-ignore
            UIUtility.getInstance().registerClick(this.node, this.__proto__.__classname__, element.name, element.callfunc, element.customEventData)
        }
        if (this.inAnimation == InAnimation.NONE) {
            return;
        }
        if (this.inAnimation == InAnimation.FADE_IN) {
            let opacityComponent = this.node.getComponent(UIOpacityComponent);
            if (opacityComponent == null) {
                opacityComponent = this.node.addComponent(UIOpacityComponent);
            }
            opacityComponent.opacity = 0;
            let tween1: Tween<UIOpacityComponent> = null;
            tween1 = new Tween(opacityComponent);
            tween1
                .to(this.showAnimationTime, { opacity: 255 })
                .call(() => {
                    opacityComponent.opacity = 255;
                })
                .start()
        } else if (this.inAnimation == InAnimation.SLIDE_IN) {
            console.warn('还没有实现SLIDE IN动！！！');
        } else if (this.inAnimation == InAnimation.SHAKE_IN) {
            tween(this.node)
                .to(this.showAnimationTime / 2, { scale: new Vec3(1.1, 1.1, 1.1) }, { easing: "circOut" })
                .to(this.showAnimationTime / 2, { scale: new Vec3(1, 1, 1) }, { easing: "circOut" })
                .start()
        }
    }

    onTouchClose(event: any, data: any, noAction: boolean = false) {
        super.onTouchClose(event, data, noAction)
    }

}
