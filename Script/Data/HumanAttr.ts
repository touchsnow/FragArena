import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HumanAttr')
export class HumanAttr {

    constructor(level: number = 1) {
        this.level = level
        this.maxHp = level * 200
        this.currentHp = level * 200
        this.moveSpeed = level * 3
    }

    public maxHp: number = 0
    public currentHp: number = 0
    public moveSpeed: number = 0
    public moveSpeedAddition:number = 0
    public isDead: boolean = false
    public name: string = ""
    public skin: string = ""
    public level: number = 0
    public damageAddition: number = 0
    public armor: number = 0
    public armorAddition:number = 0
    public bloodReturn: number = 0
    public attackBloodReturn: number = 0
    public expAddition: number = 0
    public attackSpeedAddition: number = 0

    update(dt: number) {
        if(!this.isDead){
            this.currentHp += dt * this.maxHp * 0.01 * (1+ this.bloodReturn)
            if(this.currentHp> this.maxHp){
                this.currentHp = this.maxHp
            }
        }
    }

}
