import { _decorator, Component, Node, instantiate, resources, CameraComponent, Vec2, systemEvent, SystemEvent, EventKeyboard, macro, dragonBones } from 'cc';
import { Contants } from '../../Data/Contants';
import { CustomEventListener } from '../../Data/CustomEventListener';
import { NanoNav } from '../../Nav/NanoNav';
import { PlayerInfo } from '../../View/Other/PlayerInfo';
import { GameUI } from '../../View/UI/GameUI';
import { CameraCtrls } from '../CameraCtrls';
import { Goods } from '../Goods/Goods';
import { Player } from '../Player/Player';
import { DynamiteGun } from '../Weapon/DynamiteGun';
import { FlameGun } from '../Weapon/FlameGun';
import { FreezeGun } from '../Weapon/FreezeGun';
import { LaserGun } from '../Weapon/LaserGun';
import { MachineGun } from '../Weapon/MachineGun';
import { Pistol } from '../Weapon/Pistol';
import { PoisonGun } from '../Weapon/PoisonGun';
import { RockGun } from '../Weapon/RockGun';
import { ShotGun } from '../Weapon/ShotGun';
import { TeslaGun } from '../Weapon/TeslaGun';
import { DrawCardMgr } from './DrwaCardMgr';
import { EffectMgr } from './EffectMgr';
import { FrangArenaAudioMgr } from './FrangArenaAudioMgr';
import { ObjectPoolMgr } from './ObjectPoolMgr';
import { PlayerMgr } from './PlayerMgr';
import { PoisionCircleMgr } from './PoisionCircleMgr';
import { WeaponMgr } from './WeaponMgr';
const { ccclass, property } = _decorator;

@ccclass('GameMgr')
export class GameMgr extends Component {

    @property(Node)
    spawnPoint: Node = null

    @property(CameraCtrls)
    mainCamera: CameraCtrls = null

    @property(EffectMgr)
    effectMgr: EffectMgr = null

    @property(PlayerMgr)
    playerMgr: PlayerMgr = null

    @property(GameUI)
    gameUI: GameUI = null

    @property(PoisionCircleMgr)
    poisionCircleMgr: PoisionCircleMgr = null

    @property(NanoNav)
    nanoNav: NanoNav = null

    @property(Node)
    goodsRoot: Node = null

    @property(Node)
    auidoNode: Node = null

    public player: Player = null

    public gameTime: number = 90

    private spawnPointList: Node[] = []

    private hadEndGame: boolean = false

    start() {

        if (Contants.deBugMode) {
            this.gameTime = 10000
        }
        for (let point of this.spawnPoint.children) {
            this.spawnPointList.push(point)
        }
        //初始化管理器
        this.initManagers()
        //初始化玩家
        this.initPlayers()
        //初始化相机
        this.initCamera()
        //初始化UI
        this.initUI()
        //初始化捡起物
        this.initGoods()

        CustomEventListener.on(Contants.EventName.EndGame, this.endGame, this)
    }

    update(dt: number) {

        if (this.hadEndGame) return
        this.gameTime -= dt
        if (this.gameTime <= 0) {
            this.endGame()
        }
        if (this.gameTime < 20) {
            this.playerMgr.stopResurgence = true
        }
    }

    onTouchMove(vec: Vec2) {
        if (this.playerMgr.player) {
            this.playerMgr.player.setMove(vec)
        }
    }

    onTouchEnd() {
        if (this.playerMgr.player) {
            this.playerMgr.player.setStop()
        }
    }

    onKeyDown(event: Event, customEventData: string) {
        //console.log(customEventData)
        switch (customEventData) {
            case "0":
                WeaponMgr.getInstance().getWeapon<DynamiteGun>(new DynamiteGun, this.playerMgr.player)
                break
            case "1":
                WeaponMgr.getInstance().getWeapon<FlameGun>(new FlameGun, this.playerMgr.player)
                break
            case "2":
                WeaponMgr.getInstance().getWeapon<FreezeGun>(new FreezeGun, this.playerMgr.player)
                break
            case "3":
                WeaponMgr.getInstance().getWeapon<LaserGun>(new LaserGun, this.playerMgr.player)
                break
            case "4":
                WeaponMgr.getInstance().getWeapon<MachineGun>(new MachineGun, this.playerMgr.player)
                break
            case "5":
                WeaponMgr.getInstance().getWeapon<Pistol>(new Pistol, this.playerMgr.player)
                break
            case "6":
                WeaponMgr.getInstance().getWeapon<PoisonGun>(new PoisonGun, this.playerMgr.player)
                break
            case "7":
                WeaponMgr.getInstance().getWeapon<RockGun>(new RockGun, this.playerMgr.player)
                break
            case "8":
                WeaponMgr.getInstance().getWeapon<ShotGun>(new ShotGun, this.playerMgr.player)
                break
            case "9":
                WeaponMgr.getInstance().getWeapon<TeslaGun>(new TeslaGun, this.playerMgr.player)
                break
        }
        if (Contants.deBugMode) {
            this.gameUI.debugUI.weaponUI.updateWeaponInfo()
        }
    }

    initManagers() {
        this.playerMgr.init(this)
        this.effectMgr.init()
        this.poisionCircleMgr.init(this.gameTime, this)
        WeaponMgr.getInstance().init()
        ObjectPoolMgr.getInstance().generateObjects()
        DrawCardMgr.getInstance().init()
        this.scheduleOnce(() => {
            FrangArenaAudioMgr.getInstance().init(this.playerMgr.player.node)
        }, 0)
    }

    initPlayers() {
        this.playerMgr.generatePlayer(this.spawnPointList, this.nanoNav)
        this.nanoNav.node.active = false
    }

    initCamera() {
        this.mainCamera.init(this.playerMgr.player.node)
    }

    initUI() {
        let players = this.playerMgr.getAllPlayers()
        for (let i = 0; i < players.length; i++) {
            let player = players[i]
            let playerInfo = null
            if (player instanceof Player) {
                //生命条
                playerInfo = instantiate(resources.get("UI/PlayerInfo")) as Node
                //顶部信息
                let topUIInfo = this.gameUI.topUIInfo
                topUIInfo.init(player)

            } else {
                playerInfo = instantiate(resources.get("UI/PlayerAIInfo")) as Node
            }
            playerInfo.setParent(this.gameUI.palyerInfo)
            let playerInfoComt = playerInfo.getComponent(PlayerInfo)
            player.playerInfo = playerInfoComt
            playerInfoComt.init(player)
            playerInfoComt.mainCamera = this.mainCamera.node.getComponent(CameraComponent)
            this.gameUI.rightRankUI.itemList[i].init(player)
        }
        this.gameUI.setTimeDown(this.gameTime)
        this.gameUI.drawCard.initDrawCard(this.playerMgr.player)
        this.scheduleOnce(() => {
            this.gameUI.loading.active = false
            this.gameTime = 90
            this.gameUI.setTimeDown(this.gameTime)
        }, 0)

        if (Contants.deBugMode) {
            this.gameUI.debugUI.initDebugUI(this.playerMgr.player)
        }
    }

    initGoods() {
        for (let good of this.goodsRoot.children) {
            good.getComponent(Goods).init(this.playerMgr)
        }
    }

    endGame(showSettle: boolean = true) {
        this.hadEndGame = true
        this.playerMgr.endMgr()
        this.effectMgr.endMgr()
        this.gameUI.setEndGame()
        if (showSettle) {
            let rank = this.playerMgr.getAllPlayers().length
            if (this.playerMgr.player.hunmanAttr.isDead) {
                rank += 1
            }
            let killCount = this.playerMgr.player.rewradMoney
            let data = {
                rank: rank,
                rewardMoney: killCount
            }
            this.gameUI.settlePage.show(data)
        }
        ObjectPoolMgr.getInstance().end()
    }

    onDestroy() {
        CustomEventListener.off(Contants.EventName.EndGame, this.endGame, this)
    }
    
}
