import { _decorator, Component, Node, RigidBodyComponent, SkeletalAnimationComponent, TiledUserNodeData, Vec3, lerp, Tween, tween, ColliderComponent } from 'cc';
import { Contants } from '../../Data/Contants';
import { CustomEventListener } from '../../Data/CustomEventListener';
import { HumanAttr } from '../../Data/HumanAttr';
import { PlayerConfig } from '../../Data/PlayerConfig';
import { UpgradeSystem } from '../../Data/UpgradeSystem';
import { PlayerInfo } from '../../View/Other/PlayerInfo';
import { ConfigMgr } from '../Managers/ConfigMgr';
import { DrawCardMgr } from '../Managers/DrwaCardMgr';
import { ObjectPoolMgr } from '../Managers/ObjectPoolMgr';
import { PlayerMgr } from '../Managers/PlayerMgr';
import { WeaponMgr } from '../Managers/WeaponMgr';
import { PoolObjLifeCycle } from '../ObjectPool/PoolObjLifeCycle';
import { IWeapon } from '../Weapon/IWeapon';
import { Pistol } from '../Weapon/Pistol';
import { MatMgr } from './MatMgr';
import { Player } from './Player';
import { PlayerBuffMgr } from './PlayerBuffMgr';

const { ccclass, property } = _decorator;
enum MoveState {
    Move,
    Stop
}
enum Anim {
    RunStart = "Run_Start",
    RunFire = "Run_Fire",
    IdelStart = "Idle_Start",
    IdelFire = "Idle_Fire"
}
@ccclass('BasePlayer')
export class BasePlayer extends Component {
    /**玩家管理器 */
    public playerMgr: PlayerMgr = null
    /**重力组建 */
    public rigidBody: RigidBodyComponent = null
    /**刚体组建 */
    protected collider: ColliderComponent = null
    /**人类属性 */
    public hunmanAttr: HumanAttr = new HumanAttr()
    /**武器类 */
    public weapon: IWeapon = new IWeapon()
    /**动画组件 */
    protected skeletalAnimation: SkeletalAnimationComponent = null
    /**运动状态枚举 */
    public MoveState = MoveState
    /**当前运动状态 */
    public moveState = MoveState.Stop
    /**是否已经开始攻击 */
    private hadAttack: boolean = false
    /**玩家UI状态 */
    public playerInfo: PlayerInfo = null
    /**锁定的敌人 */
    public lockedEnemy: BasePlayer = null
    /**范围内的敌人 */
    public aroundEnemy: BasePlayer[] = []
    /**侦查敌人的缓动 */
    public detectTween: Tween<Node> = null
    /**射击范围 */
    public attackRange: number = 6
    /**玩家击杀数 */
    public killCount: number = 0
    /**升级系统 */
    public upgradeSystem: UpgradeSystem = new UpgradeSystem()

    public matMgr: MatMgr = null

    public deBuffMgr: PlayerBuffMgr = null

    public isAi: boolean = false

    public rewradMoney: number = 0


    start() { }

    /**初始化玩家 */
    init(playerMgr: PlayerMgr, playerConfig: PlayerConfig) {
        this.playerMgr = playerMgr
        let anim = this.node.children[0].getComponent(SkeletalAnimationComponent)
        if (anim) this.skeletalAnimation = anim

        WeaponMgr.getInstance().getWeapon<Pistol>(new Pistol, this)
        let rigidBody = this.node.getComponent(RigidBodyComponent)
        if (rigidBody) {
            this.rigidBody = rigidBody
            this.rigidBody.sleep()
        }
        let collider = this.node.getComponent(ColliderComponent)
        if (collider) {
            this.collider = collider
            this.playerMgr.setGuroup(collider)
        }
        this.hunmanAttr.skin = playerConfig.skin
        
        //试用皮肤
        if (playerConfig.trySkin != "") {
            let buffs = ConfigMgr.getInstance().getSkinConfig().json[playerConfig.trySkin]
            for (let buffName of buffs.buffList) {
                let drawItem = ConfigMgr.getInstance().getDrwaCardConfig().json[buffName]
                DrawCardMgr.getInstance().enableItemBuff(this, drawItem.caseValue, drawItem.addition)
            }
        }
        else{
            //选择的皮肤
            let buffs = ConfigMgr.getInstance().getSkinConfig().json[this.hunmanAttr.skin]
            for (let buffName of buffs.buffList) {
                let drawItem = ConfigMgr.getInstance().getDrwaCardConfig().json[buffName]
                DrawCardMgr.getInstance().enableItemBuff(this, drawItem.caseValue, drawItem.addition)
            }
        }

        this.hunmanAttr.name = playerConfig.name
        this.setIdleAnim()
        let random = Math.random() * 0.2 + 0.1
        this.detectTween = tween(this.node)
            .delay(random)
            .call(() => {
                this.detectEnemy()
            })
            .union()
            .repeatForever()
            .start()

        this.scheduleOnce(() => {
            let startEffect = ObjectPoolMgr.getInstance().get("RoleStart")
            startEffect.active = true
            if (startEffect) {
                var callBack = function () {
                    startEffect.setWorldPosition(this.node.worldPosition)
                }.bind(this)
                startEffect.getComponent(PoolObjLifeCycle).startLife(callBack)
            }
        }, 0)

        this.matMgr = this.node.getComponent(MatMgr)
        this.matMgr.init()
        this.deBuffMgr = new PlayerBuffMgr()
        this.deBuffMgr.player = this
    }

    /**update */
    update(dt: number) {
        this.weapon.update(dt)
        this.hunmanAttr.update(dt)
    }

    /**攻击 */
    startAttack() {
        if (this.hunmanAttr.isDead) return
        this.weapon.startAttack()
        this.setFireAnim()
    }

    /**停止攻击 */
    stopAttack() {
        this.weapon.stopAttack()
    }

    /**被攻击 */
    attacked(damage: number): [boolean, number] {
        if (this.hunmanAttr.isDead) return [false, 0]
        this.matMgr.startRedBlink()
        let takeDamage = damage * (100 / (100 + this.hunmanAttr.armor * (1 + this.hunmanAttr.armorAddition)))
        this.hunmanAttr.currentHp -= takeDamage
        this.playerInfo.updateDiaplay()
        if (this.hunmanAttr.currentHp <= 0) {
            this.dead()
            return [true, takeDamage]
        }
        return [false, takeDamage]
    }

    /**位置移动 */
    posCtrl(dir: Vec3) {
        this.rigidBody.setLinearVelocity(dir.multiplyScalar(this.hunmanAttr.moveSpeed * (1 + this.hunmanAttr.moveSpeedAddition)))
    }

    /**位置旋转 */
    rotateCtrl(angle: number) {
        if (this.node.eulerAngles.y - angle > 180) {
            this.node.setRotationFromEuler(this.node.eulerAngles.x, this.node.eulerAngles.y - 360, this.node.eulerAngles.z)
        }
        if (this.node.eulerAngles.y - angle < -180) {
            this.node.setRotationFromEuler(this.node.eulerAngles.x, this.node.eulerAngles.y + 360, this.node.eulerAngles.z)
        }
        this.node.setRotationFromEuler(this.node.eulerAngles.x, lerp(this.node.eulerAngles.y, angle, 0.2), this.node.eulerAngles.z)
    }

    /**播放跑动画 */
    setRunAnim() {
        if (this.hadAttack) {
            this.skeletalAnimation.play(Anim.RunFire)
        } else {
            this.skeletalAnimation.play(Anim.RunStart)
        }
        this.moveState = this.MoveState.Move
    }

    /**播放待机动画 */
    setIdleAnim() {
        if (this.hadAttack) {
            this.skeletalAnimation.play(Anim.IdelFire)
        } else {
            this.skeletalAnimation.play(Anim.IdelStart)
        }
        this.moveState = this.MoveState.Stop
    }

    /**播放射击动画 */
    setFireAnim() {
        if (this.moveState == this.MoveState.Move) {
            if (!this.skeletalAnimation.getState(Anim.RunFire).isPlaying) {
                this.skeletalAnimation.play(Anim.RunFire)
            }
        } else {
            if (!this.skeletalAnimation.getState(Anim.IdelFire).isPlaying) {
                this.skeletalAnimation.play(Anim.IdelFire)
            }
        }
        this.hadAttack = true
    }

    /**向量转换角度 */
    getAngleByVector(lenx: number, leny: number) {
        if (leny === 0) {
            if (lenx < 0) {
                return 270
            }
            else if (lenx > 0) {
                return 90
            }

        }
        if (lenx === 0) {
            if (leny >= 0) {
                return 0
            }
            else if (leny < 0) {
                return 180
            }
        }

        let tanyx = Math.abs(leny) / Math.abs(lenx)
        let angle = 0
        if (leny > 0 && lenx < 0) {
            angle = 270 + Math.atan(tanyx) * 180 / Math.PI
        }
        else if (leny > 0 && lenx > 0) {
            angle = 90 - Math.atan(tanyx) * 180 / Math.PI
        }
        else if (leny < 0 && lenx < 0) {
            angle = 270 - Math.atan(tanyx) * 180 / Math.PI
        }
        else if (leny < 0 && lenx > 0) {
            angle = 90 + Math.atan(tanyx) * 180 / Math.PI
        }
        return angle
    }

    getHpPercent() {
        return this.hunmanAttr.currentHp / this.hunmanAttr.maxHp
    }

    getMpPercent() {
        return this.weapon.currentEnergy / this.weapon.totalEnery
    }

    getName() {
        return this.hunmanAttr.name
    }

    getLevel() {
        return this.hunmanAttr.level
    }

    getDamage() {
        let damage = this.weapon.damage * (1 + this.hunmanAttr.damageAddition)
        this.hunmanAttr.currentHp = this.hunmanAttr.currentHp + damage * this.hunmanAttr.attackBloodReturn
        return damage
    }

    getAttackedDamage(damage: number) {
        return damage * (100 / (100 + this.hunmanAttr.armor * (1 + this.hunmanAttr.armorAddition)))
    }

    getKilledExp() {
        return this.upgradeSystem.getCurrentUpgradeExp() * 0.75
    }

    getAttackSpeed() {
        return this.weapon.shootingFreq * (1 - this.hunmanAttr.attackSpeedAddition)
    }

    getDamageInterval() {
        return this.weapon.damageInterval * (1 - this.hunmanAttr.attackSpeedAddition)
    }

    detectEnemy() {
        let allPlayer = this.playerMgr.getAllPlayers()
        let lockedEnemy = null
        let minDis = 99999
        this.aroundEnemy = []
        for (let i = 0; i < allPlayer.length; i++) {
            let player = allPlayer[i]
            if (player == this) continue
            let dis = Vec3.distance(this.node.worldPosition, player.node.worldPosition)
            if (dis < this.attackRange) {
                this.aroundEnemy.push(player)
                if (dis < minDis) {
                    lockedEnemy = player
                    minDis = dis
                }
            }
        }
        this.lockedEnemy = lockedEnemy
    }

    dead() {
        this.hunmanAttr.isDead = true
        this.node.active = false
        let deadEffect = ObjectPoolMgr.getInstance().get("RoleDeath")
        deadEffect.active = true
        if (deadEffect) {
            var callBack = function () {
                deadEffect.setWorldPosition(this.node.worldPosition)
            }.bind(this)
            deadEffect.getComponent(PoolObjLifeCycle).startLife(callBack)
        }
        this.deBuffMgr.removeAllDebuff()
        this.playerMgr.setDead(this)

    }

    resurgence() {
        this.hunmanAttr.currentHp = 200
        this.hunmanAttr.isDead = false
        this.node.active = true
        this.playerInfo.updateDiaplay()
        let startEffect = ObjectPoolMgr.getInstance().get("RoleStart")
        startEffect.active = true
        if (startEffect) {
            var callBack = function () {
                startEffect.setWorldPosition(this.node.worldPosition)
            }.bind(this)
            startEffect.getComponent(PoolObjLifeCycle).startLife(callBack)
        }
    }

    paralysis() {
        this.detectTween.stop()
        this.lockedEnemy = null
        this.setIdleAnim()
    }

    addKillCount(exp: number) {
        this.killCount += 1
        CustomEventListener.dispatchEvent(Contants.EventName.UpdateRightRankUI)
        return this.addExp(exp)
    }

    addExp(exp: number) {
        let newExp = exp * (1 + this.hunmanAttr.expAddition)
        let result = this.upgradeSystem.addExp(newExp)
        if (result) {
            this.hunmanAttr.armor += 15
            this.hunmanAttr.level = this.upgradeSystem.getCurrentLevel()
        }
        return result
    }

    addRewardMoney(level: number) {
        this.rewradMoney += level * 50
    }

    addDebuff(buffName: string, givePlayer: BasePlayer) {
        this.deBuffMgr.addDebuff(buffName, givePlayer)
    }

}
