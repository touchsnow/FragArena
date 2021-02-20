import { _decorator, Component, Node, systemEvent, SystemEvent, Vec2, RigidBodyComponent, Vec3, lerp, CCFloat, SkeletalAnimation, SkeletalAnimationComponent, macro, EventKeyboard, assetManager, loader, instantiate, find, geometry, PhysicsSystem, PhysicsRayResult, CapsuleCollider, ITriggerEvent, tween, Touch, UITransform } from 'cc';
import { Bullet } from './Game/Bullet/Bullet';
const { ccclass, property } = _decorator;
enum TouchState {
    TouchMove,
    TouchEnd
}

enum Anim {
    Hit = "Riflel_Hit",
    Idel = "Riflel_Idle",
    Moev = "Riflel_Move",
    Die = "Riflel_Die",
    Attack = "Riflel_Attack"
}

@ccclass('PlayerCtrl')
export class PlayerCtrl extends Component {

    // /**开始触摸的坐标 */
    // private touchStartPos: Vec2 = new Vec2()
    // /**当前触摸的坐标 */
    // private touchCurrentPos: Vec2 = new Vec2()
    // /**当前触摸状态 */
    // private touchState = TouchState.TouchEnd
    // /**刚体组建 */
    // private rigidBody: RigidBodyComponent = null
    // /**开始触摸到当前触摸的方向 */
    // private directStartToCurrent2D: Vec2 = new Vec2()
    // /**开始触摸到当前触摸的方向 */
    // private directStartToCurrent3D: Vec3 = new Vec3()
    // /**要旋转到的目标角度 */
    // private targetAngleY: number = 0
    // /**移动速度 */
    // @property({ type: CCFloat })
    // moveSpeed: number = 0

    // @property(SkeletalAnimationComponent)
    // skeletalAnimation: SkeletalAnimationComponent = null

    // @property(Node)
    // firePoint: Node = null

    // private fireTime: number = 0
    // private playerState: Anim = Anim.Idel

    // private attackTarget: PlayerAI = null

    // private attackDis: number = 4

    // private targetList: PlayerAI[] = []

    // private ray = new geometry.ray()

    // @property(Node)
    // movePad: Node = null

    // private movePadPos: Vec3 = new Vec3()

    // @property(Node)
    // moveThumb: Node = null

    // @property(Node)
    // attackNode: Node = null

    // start() {
    //     systemEvent.on(SystemEvent.EventType.TOUCH_MOVE, this.onTouchMove, this)
    //     systemEvent.on(SystemEvent.EventType.TOUCH_END, this.onTouchEnd, this)
    //     systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this)
    //     this.attackNode.on(Node.EventType.TOUCH_END, this.attack, this)
    //     this.rigidBody = this.node.getComponent(RigidBodyComponent)
    //     this.skeletalAnimation.play(Anim.Idel)
    //     let playerAiNode = find("PlayerAI") as Node
    //     for (let i = 0; i < playerAiNode.children.length; i++) {
    //         let playerAi = playerAiNode.children[i].getComponent(PlayerAI)
    //         this.targetList.push(playerAi)
    //     }
    //     tween(this.node).repeatForever(tween(this.node)
    //         .delay(0.2)
    //         .call(() => {
    //             let minDis: number = 10000
    //             this.attackTarget = null
    //             this.targetList.forEach(element => {
    //                 let dis = Vec3.distance(element.node.worldPosition, this.node.worldPosition)
    //                 if (dis < minDis && dis < this.attackDis && !element.isDead) {
    //                     minDis = dis
    //                     this.attackTarget = element
    //                 }
    //             })
    //         })
    //         .start()
    //     ).start()
    //     this.movePadPos = this.movePad.getWorldPosition()
    // }

    // update(dt: number) {
    //     if (this.playerState == Anim.Attack) {
    //         this.fireTime += dt
    //         if (this.fireTime >= 0.2) {
    //             this.fireTime = 0
    //             if (this.touchState == TouchState.TouchMove) {
    //                 this.skeletalAnimation.play(Anim.Moev)
    //                 this.playerState = Anim.Moev
    //             } else {
    //                 this.skeletalAnimation.play(Anim.Idel)
    //                 this.playerState = Anim.Idel
    //             }
    //         }
    //     }
    //     this.posCtrl()
    // }

    // onKeyDown(event: EventKeyboard) {
    //     switch (event.keyCode) {
    //         case macro.KEY.w:
    //             this.attack()
    //             break
    //     }
    // }

    // attack() {
    //     this.skeletalAnimation.getState(Anim.Attack)
    //     this.skeletalAnimation.play(Anim.Attack)
    //     this.fireTime = 0
    //     this.playerState = Anim.Attack
    //     let node = instantiate(loader.getRes("Bullet/Bullet")) as Node
    //     node.setParent(find("BulletPoint"))
    //     let startPos = this.firePoint.getWorldPosition()
    //     let moveDir = this.node.forward
    //     this.ray.d = moveDir.normalize()
    //     this.ray.o = startPos
    //     if (PhysicsSystem.instance.raycast(this.ray)) {
    //         const r = PhysicsSystem.instance.raycastResults;
    //         if (r.length > 0) {
    //             let NearestNode: PhysicsRayResult = new  PhysicsRayResult()
    //             for (let i = 0; i < r.length; i++) {
    //                 if (i === 0) {
    //                     NearestNode = r[i]
    //                 }
    //                 else {
    //                     if (NearestNode.distance > r[i].distance) {
    //                       //  console.log(r[i].collider.node.name)
    //                       //  console.log(r[i].collider.node.name.indexOf("Player"))
    //                         if (r[i].collider.node.name.indexOf("Player") == -1) {
    //                             NearestNode = r[i]
    //                             //console.log(NearestNode.collider.node.name)
    //                         } else {
    //                           //  console.log("过滤了Player")
    //                         }
    //                     }
    //                 }
    //             }
    //             let hitPoint = NearestNode.hitPoint
    //            // console.log(NearestNode.collider.node.name)
    //             let bullet = node.getComponent(Bullet)
    //             if (bullet) {
    //                 bullet.init(startPos, moveDir, this.attackTarget, hitPoint)
    //             }
    //         }
    //     } else {
    //         let bullet = node.getComponent(Bullet)
    //         if (bullet) {
    //             bullet.init(startPos, moveDir, this.attackTarget)
    //         }
    //     }
    // }

    // onTouchMove(e: Touch, a: any) {
    //     if (this.touchState != TouchState.TouchMove) {
    //         this.skeletalAnimation.play(Anim.Moev)
    //         this.playerState = Anim.Moev
    //         this.touchState = TouchState.TouchMove
    //     }
    //     if (a.getTouches().length === 1) {
    //         e.getStartLocation(this.touchStartPos)
    //         e.getLocation(this.touchCurrentPos)
    //         let uiStartPos: Vec2 = new Vec2()
    //         let uiPos: Vec2 = new Vec2()
    //         e.getUIStartLocation(uiStartPos)
    //         e.getUILocation(uiPos)
    //         let dis = Vec2.distance(uiPos, uiStartPos)
    //         this.movePad.setWorldPosition(new Vec3(uiStartPos.x, uiStartPos.y, 0))
    //         this.moveThumb.active = true
    //         let maxLength = this.movePad.getComponent(UITransform).contentSize.x / 2
    //       //  console.log("uiPos.length" + dis)
    //       //  console.log("maxLength" + maxLength)
    //         if (dis >= maxLength) {
    //             console.log(">=")
    //             let Vec2 = uiPos.subtract(uiStartPos)
    //             uiPos = Vec2.normalize().multiplyScalar(maxLength)
    //             this.moveThumb.setPosition(new Vec3(uiPos.x, uiPos.y, 0))

    //         } else {
    //             this.moveThumb.setWorldPosition(new Vec3(uiPos.x, uiPos.y, 0))
    //         }
    //     }
    // }

    // onTouchEnd() {
    //     this.touchState = TouchState.TouchEnd
    //     this.rigidBody.setLinearVelocity(new Vec3(0, 0, 0))
    //     this.skeletalAnimation.play(Anim.Idel)
    //     this.playerState = Anim.Idel
    //     this.moveThumb.active = false
    //     this.movePad.setWorldPosition(this.movePadPos)
    // }

    // fire() {
    //     this.skeletalAnimation.play(Anim.Attack)
    // }

    // posCtrl() {
    //     if (this.touchState === TouchState.TouchMove) {
    //         Vec2.subtract(this.directStartToCurrent2D, this.touchCurrentPos, this.touchStartPos)
    //         if (this.attackTarget) {
    //             let dir = this.attackTarget.node.worldPosition.clone().subtract(this.node.worldPosition).normalize()
    //             let directStartToCurrent2D = new Vec2(-dir.x, -dir.z)
    //             this.targetAngleY = this.getAngleByVector(directStartToCurrent2D.x, directStartToCurrent2D.y)
    //             if (this.node.eulerAngles.y - this.targetAngleY > 180) {
    //                 this.node.setRotationFromEuler(this.node.eulerAngles.x, this.node.eulerAngles.y - 360, this.node.eulerAngles.z)
    //             }
    //             if (this.node.eulerAngles.y - this.targetAngleY < -180) {
    //                 this.node.setRotationFromEuler(this.node.eulerAngles.x, this.node.eulerAngles.y + 360, this.node.eulerAngles.z)
    //             }
    //             this.node.setRotationFromEuler(this.node.eulerAngles.x, lerp(this.node.eulerAngles.y, this.targetAngleY, 0.2), this.node.eulerAngles.z)
    //         } else {
    //             //角度旋转
    //             this.targetAngleY = -this.getAngleByVector(this.directStartToCurrent2D.x, this.directStartToCurrent2D.y)
    //             if (this.node.eulerAngles.y - this.targetAngleY > 180) {
    //                 this.node.setRotationFromEuler(this.node.eulerAngles.x, this.node.eulerAngles.y - 360, this.node.eulerAngles.z)
    //             }
    //             if (this.node.eulerAngles.y - this.targetAngleY < -180) {
    //                 this.node.setRotationFromEuler(this.node.eulerAngles.x, this.node.eulerAngles.y + 360, this.node.eulerAngles.z)
    //             }
    //             this.node.setRotationFromEuler(this.node.eulerAngles.x, lerp(this.node.eulerAngles.y, this.targetAngleY, 0.2), this.node.eulerAngles.z)
    //         }
    //         this.directStartToCurrent3D = new Vec3(this.directStartToCurrent2D.x, 0, -this.directStartToCurrent2D.y).normalize()
    //         this.rigidBody.setLinearVelocity(this.directStartToCurrent3D.multiplyScalar(this.moveSpeed))
    //     }
    // }

    // searchTarget() {

    // }

    // /**向量转换角度 */
    // getAngleByVector(lenx: number, leny: number) {
    //     if (leny === 0) {
    //         if (lenx < 0) {
    //             return 270
    //         }
    //         else if (lenx > 0) {
    //             return 90
    //         }

    //     }
    //     if (lenx === 0) {
    //         if (leny >= 0) {
    //             return 0
    //         }
    //         else if (leny < 0) {
    //             return 180
    //         }
    //     }

    //     let tanyx = Math.abs(leny) / Math.abs(lenx)
    //     let angle = 0
    //     if (leny > 0 && lenx < 0) {
    //         angle = 270 + Math.atan(tanyx) * 180 / Math.PI
    //     }
    //     else if (leny > 0 && lenx > 0) {
    //         angle = 90 - Math.atan(tanyx) * 180 / Math.PI
    //     }
    //     else if (leny < 0 && lenx < 0) {
    //         angle = 270 - Math.atan(tanyx) * 180 / Math.PI
    //     }
    //     else if (leny < 0 && lenx > 0) {
    //         angle = 90 + Math.atan(tanyx) * 180 / Math.PI
    //     }
    //     return angle
    // }

    // attacked() {
    //    // console.log("主角被攻击了")
    // }


}
