import { _decorator, Component, Node, LabelComponent, Font } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LabelTest')
export class LabelTest extends Component {

    private label: LabelComponent

    @property(Font)
    font: Font = null

    start() {
        this.label = this.node.getComponent(LabelComponent)
        this.scheduleOnce(()=>{
            console.log(this.label)
        },0)
        //this.label.useSystemFont = true
        this.scheduleOnce(() => {
            this.label.useSystemFont = false
            this.label.font = this.font
        }, 1.5)
    }

    update() {
        // console.log("label:scale:" + this.node.getScale().toString())
        // console.log("label:front:" + this.label.font.name)
    }


}
