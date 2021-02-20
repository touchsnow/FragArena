import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerConfig')
export class PlayerConfig {

    skin:string = ""
    level:number = 0
    name:string = ""
    trySkin:string = ""
    headSpritePath:string = ""
}
