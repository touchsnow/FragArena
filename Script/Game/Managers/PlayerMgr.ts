import { _decorator, Component, Node, instantiate, resources, tween, Tween, ColliderComponent, Vec2 } from 'cc';
import { Contants } from '../../Data/Contants';
import { PlayerConfig } from '../../Data/PlayerConfig';
import { NanoNav } from '../../Nav/NanoNav';
import { BasePlayer } from '../Player/BasePlayer';
import { Player } from '../Player/Player';
import { PlayerAI } from '../Player/PlayerAI';
import { ConfigMgr } from './ConfigMgr';
import { GameMgr } from './GameMgr';
import { StorgeMgr } from './StorgeMgr';
const { ccclass, property } = _decorator;

@ccclass('PlayerMgr')
export class PlayerMgr extends Component {

    public player: Player = null
    private playerAIs: PlayerAI[] = []
    private allPlayer: BasePlayer[] = []
    private playerAiConfig: PlayerConfig[] = []
    private deadPlayers: BasePlayer[] = []
    private spawnPoint: Node[] = []
    public nanoNav: NanoNav = null
    private currentGroupIndex: number = 0

    private resurgenceTween: Tween<Node> = null

    private gameMgr: GameMgr = null

    public stopResurgence = false

    start() {
        this.resurgenceTween = tween(this.node)
            .delay(3)
            .call(() => {
                this.refreshSpwan()
                this.resurgencePlayer()
            })
            .union()
            .repeatForever()
            .start()
    }

    init(mgr: GameMgr) {
        this.playerAiConfig = ConfigMgr.getInstance().getPlayerConfig()
        this.gameMgr = mgr
    }

    /**生成所有玩家 */
    generatePlayer(spawnPoint: Node[], nanoNav: NanoNav) {
        this.spawnPoint = spawnPoint
        this.nanoNav = nanoNav
        let palyerPointIndex = Math.ceil(Math.random() * spawnPoint.length)
        if (palyerPointIndex == spawnPoint.length) palyerPointIndex -= 1

        //生成自己
        let spawnNode = spawnPoint[palyerPointIndex]
        let selfConfig = ConfigMgr.getInstance().getSelfConfig()
        let player = null
        if (selfConfig.trySkin != "") {
            player = instantiate(resources.get("Player/" + selfConfig.trySkin)) as Node
        } else {
            player = instantiate(resources.get("Player/" + selfConfig.skin)) as Node
        }
        player.setParent(spawnNode)
        player.setPosition(0, 0, 0)
        player.setRotationFromEuler(0, 0, 0)
        this.player = player.addComponent(Player)
        this.player.node.getChildByName("AttackRange").active = true
        this.player.init(this, selfConfig)
        this.allPlayer.push(this.player)

        //生成AI
        let spawnIndex = 0
        for (let i = 0; i < this.playerAiConfig.length; i++) {
            //递增出生点
            let playerConfig = this.playerAiConfig[i]
            if (i == palyerPointIndex) {
                spawnIndex += 1
            }
            let spawnNode = spawnPoint[spawnIndex]
            let player = instantiate(resources.get("Player/" + playerConfig.skin)) as Node
            player.setParent(spawnNode)
            player.setPosition(0, 0, 0)
            player.setRotationFromEuler(0, 0, 0)
            let playerAI = player.addComponent(PlayerAI)
            playerAI.init(this, playerConfig)
            this.playerAIs.push(playerAI)
            this.allPlayer.push(playerAI)
            spawnIndex += 1
            if (i == 3) break
        }
    }

    getAllPlayers() {
        return this.allPlayer
    }

    setDead(player: BasePlayer) {
        if (player instanceof PlayerAI) {
            for (let i = 0; i < this.allPlayer.length; i++) {
                if (this.allPlayer[i] == player) {
                    this.deadPlayers.push(this.allPlayer[i])
                    this.allPlayer[i].node.setWorldPosition(100, 1000, 100)
                    this.allPlayer.splice(i, 1)
                    break
                }
            }
        } else {
            for (let i = 0; i < this.allPlayer.length; i++) {
                if (this.allPlayer[i] == player) {
                    this.allPlayer.splice(i, 1)
                    break
                }
            }
        }
    }

    setResurgence(player: BasePlayer) {
        this.allPlayer.push(player)
        let palyerPointIndex = Math.ceil(Math.random() * this.spawnPoint.length)
        if (palyerPointIndex == this.spawnPoint.length) palyerPointIndex -= 1
        let spawnNode = this.spawnPoint[palyerPointIndex]
        player.node.setParent(spawnNode)
        player.node.setPosition(0, 0, 0)
        player.node.setRotationFromEuler(0, 0, 0)
        player.resurgence()
    }

    getAMovePos() {
        let random = Math.floor(Math.random() * this.spawnPoint.length)
        return this.spawnPoint[random]
    }

    refreshSpwan() {
        if (this.spawnPoint.length < 3) return
        let edgePos = this.gameMgr.poisionCircleMgr.edgeNode.worldPosition
        let circleDis = Vec2.distance(new Vec2(edgePos.x, edgePos.z), new Vec2(0, 0))
        let newPointList = []
        for (let point of this.spawnPoint) {
            let pointPos = point.worldPosition
            let pointDis = Vec2.distance(new Vec2(pointPos.x, pointPos.z), new Vec2(0, 0))
            if (circleDis > pointDis) {
                newPointList.push(point)
            }
        }
        this.spawnPoint = newPointList
    }

    resurgencePlayer() {

        let deadCount = 1
        if (this.gameMgr.gameTime < 90) {
            deadCount = 2
        }

        if (this.stopResurgence) {
            if (this.deadPlayers.length >= 4) {
                this.gameMgr.gameTime = 0
            }
            return
        }

        let deadPlayer = []
        for (let player of this.deadPlayers) {
            deadPlayer.push(player)
        }
        for (let i = 0; i < this.deadPlayers.length; i++) {
            if (deadPlayer.length <= deadCount) {
                break
            }
            this.allPlayer.push(this.deadPlayers[i])
            let palyerPointIndex = Math.ceil(Math.random() * this.spawnPoint.length)
            if (palyerPointIndex == this.spawnPoint.length) palyerPointIndex -= 1
            //生成自己
            let spawnNode = this.spawnPoint[palyerPointIndex]
            this.deadPlayers[i].node.setParent(spawnNode)
            this.deadPlayers[i].node.setPosition(0, 0, 0)
            this.deadPlayers[i].node.setRotationFromEuler(0, 0, 0)
            this.deadPlayers[i].resurgence()
            deadPlayer.splice(0, 1)
        }
        this.deadPlayers = deadPlayer

    }

    setGuroup(collider: ColliderComponent) {
        let groupList = Contants.MaskGroups
        collider.setGroup(groupList[this.currentGroupIndex])
        collider.setMask(groupList[this.currentGroupIndex])
        this.currentGroupIndex += 1
        collider.addMask(1)
    }

    endMgr() {
        this.resurgenceTween.stop()
        this.player.paralysis()
        for (let i = 0; i < this.playerAIs.length; i++) {
            let playerAi = this.playerAIs[i]
            playerAi.paralysis()
        }
    }

    getAllAis() {
        return this.playerAIs
    }

}
