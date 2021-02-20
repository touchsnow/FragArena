import { _decorator, Component, Node, Material, ModelComponent, Vec4, math, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MatMgr')
export class MatMgr extends Component {

    @property([Node])
    matListNode: Node[] = []

    private matList: Material[] = []

    private blinkTime: number = 0.5
    private currentBlinkTime: number = 0
    private blinkFlag: boolean = false

    init() {
        for (let i = 0; i < this.matListNode.length; i++) {
            let node = this.matListNode[i]
            for (let j = 0; j < node.children.length; j++) {
                let mat = node.children[j].getComponent(ModelComponent)
                if(mat){
                    let mats = node.children[j].getComponent(ModelComponent).materials
                    for (let k = 0; k < mats.length; k++) {
                        this.matList.push(node.children[j].getComponent(ModelComponent).getMaterialInstance(k))
                    }
                }
            }
        }
        // for (let node of this.matListNode) {
        //     let mats = node.getComponent(ModelComponent).materials
        //     for (let k = 0; k < mats.length; k++) {
        //         this.matList.push(node.getComponent(ModelComponent).getMaterialInstance(k))
        //     }
        // }
    }

    update(dt: number) {
        if (this.blinkFlag) {
            this.currentBlinkTime += dt
            if (this.currentBlinkTime > this.blinkTime) {
                this.stopRedBlink()
            }
        }
    }

    startRedBlink() {
        this.currentBlinkTime = 0
        if (!this.blinkFlag) {
            this.matList.forEach(element => {
                element.setProperty("redBlink", 1)
            })
        }
        this.blinkFlag = true
    }

    stopRedBlink() {
        this.blinkFlag = false
        this.matList.forEach(element => {
            element.setProperty("redBlink", 0)
        })
    }

    showOutLine(color: Color) {
        // this.matList.forEach(element => {
        //     element.setProperty("baseColor", color)
        // })
    }

    hideOutLine() {
        // this.matList.forEach(element => {
        //     element.setProperty("baseColor", math.color(0, 0, 0, 255))
        // })
    }

}
