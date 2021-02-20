import { _decorator, Component, Node, Vec3, tween, v3 } from 'cc';
import { BasePlayer } from '../Player/BasePlayer';
const { ccclass, property } = _decorator;

@ccclass('Bullet')
export class Bullet extends Component {

    protected startPos: Vec3 = new Vec3()
    protected endPos: Vec3 = new Vec3()
    protected moveDir: Vec3 = new Vec3()
    protected moveTime: number = 0
    protected maxMoveTime:number = 0

    protected isBomb: boolean = false
    protected player:BasePlayer = null

    start() { }

    update(dt: number) { }

    init(startPos: Vec3, moveDir: Vec3, player = null, endPos: Vec3 = new Vec3(10000, 0, 0)) { }

    bomb() { }

}
