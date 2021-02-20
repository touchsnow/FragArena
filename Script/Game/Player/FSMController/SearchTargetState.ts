import { _decorator, Component, Node, Vec2, Vec3, ColliderComponent, ICollisionEvent, tween, Tween } from 'cc';
import { BaseFSMState } from './BaseFSMState';
const { ccclass, property } = _decorator;

@ccclass('SearchTargetState')
export class SearchTargetState extends BaseFSMState {

    private colliderList = [
        "WallRock",
        "RockGrey",
        "ConeTree-Green",
        "Log"
    ]

    private targetPoint: Vec3 = new Vec3()

    private adjustPos: boolean = false

    private collider: ColliderComponent = null

    //private startPos: Vec3 = new Vec3()

    private endPos: Vec3 = new Vec3()

    private currentIndex: number = 0

    private searchPath: Vec3[] = []

    private searchPathTween: Tween = null

    private currentMoveTime: number = 0

    enter() {

        this.searchPathTween = tween(this.player)
            .call(() => {
                if (this.controller.currentState) {
                    this.searchAvailablePath()
                }
            })
            .delay(2)
            .union()
            .repeatForever()
            .start()
    }

    update(dt: number) {
        let playerVec2 = new Vec2(this.player.node.worldPosition.x, this.player.node.worldPosition.z)
        let endPosVec2 = new Vec2(this.endPos.x, this.endPos.z)
        let dis = Vec2.distance(playerVec2, endPosVec2)
        this.currentMoveTime += dt
        if (dis < 0.2) {
            this.currentMoveTime = 0
            this.setMovePos(this.currentIndex + 1)
        }
        if (this.currentMoveTime >= 2) {
            // console.log("超过运动时间。重新寻找目标")
            this.controller.switchState(new SearchTargetState(this.controller))
        }
    }

    setMovePos(index: number) {
        if (index == this.searchPath.length - 1) {
            this.controller.switchState(new SearchTargetState(this.controller))
        }
        this.currentIndex = index
        this.endPos = this.searchPath[index]
        let moveVec = this.getMoveVec(this.endPos)
        this.player.setMove(moveVec)
    }

    getMoveVec(vec3: Vec3) {
        let result = vec3.clone().subtract(this.player.node.getWorldPosition())
        let result2D = new Vec2(result.x, -result.z)
        return result2D
    }

    searchAvailablePath() {
        let startPos: Vec2 = new Vec2
        this.controller.nanoNav.getXYFromWorldLocation(this.player.node.getWorldPosition(), startPos)
        let endPos: Vec2 = new Vec2
        let endPos3D: Vec3 = new Vec3()
        let posNode = this.player.playerMgr.getAMovePos()
        if (posNode) {
            endPos3D = posNode.getWorldPosition()
            this.controller.nanoNav.getXYFromWorldLocation(endPos3D, endPos)
            let path = this.controller.astarSearch.search(startPos, endPos)
            if (path) {
                //console.log(path)
                let worldPosY = this.player.node.getWorldPosition().y
                for (let pos of path) {
                    let worldPos2D = this.controller.nanoNav.getWorldPosFromMesh(pos.x, pos.y)
                    let worldPos3D = new Vec3(worldPos2D.x, worldPosY, worldPos2D.y)
                    worldPos3D.y = worldPosY
                    this.searchPath.push(worldPos3D)
                }
                this.searchPath = this.searchPath.reverse()
                this.setMovePos(0)
                this.searchPathTween.stop()
            } else {
                this.player.setStop()
                // console.log("寻找路径失败，重新寻找")
            }
        }

    }

    exit() {
        this.player.setStop()
        this.searchPathTween.stop()
    }

}
