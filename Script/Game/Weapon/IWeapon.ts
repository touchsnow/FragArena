import { _decorator, Component, geometry, Node, Vec3, ModelComponent, Vec4 } from 'cc';
import { BasePlayer } from '../Player/BasePlayer';
const { ccclass, property } = _decorator;

@ccclass('IWeapon')
export class IWeapon extends Component {

    /**总弹量 */
    public totalEnery: number = 0

    /**当前能量 */
    public currentEnergy: number = 0

    /**射击频率 */
    public shootingFreq: number = 0

    /**能量恢复速度 */
    public energyRecoverySpeed: number = 0

    /**武器伤害 */
    public damage: number = 0

    /**消耗 */
    public consume: number = 0

    /**命中率 */
    public hitRate: number = 0

    /**伤害间隔 */
    public damageInterval: number = 0

    /**攻击距离 */
    public attackRange: number = 0

    /**最大偏移 */
    public maxOffset: number = 0

    /**最小偏移 */
    public minOffset: number = 0

    public detectDis: number = 0

    /**攻击状态 */
    protected attackState: boolean = false

    /**攻击冷却时间 */
    private attackCD: number = 10

    /**射线 */
    protected ray = new geometry.Ray()

    /**跑动作的射击起始点 */
    public firePoint: Node = null

    /**镭射检测点 */
    public rayPoint: Node = null

    public player: BasePlayer = null

    update(dt: number) {
        this.attackCD += dt
        if (this.attackCD >= this.player.getAttackSpeed() && this.attackState && this.currentEnergy - this.consume >= 0) {
            this.attackCD = 0
            this.attack()
        }
        //能量恢复
        if (this.attackState) {
            this.currentEnergy += this.energyRecoverySpeed * dt
        } else {
            this.currentEnergy += this.energyRecoverySpeed * dt * 3
        }
        if (this.currentEnergy >= this.totalEnery) this.currentEnergy = this.totalEnery
    }

    getWeaponName(): string {
        return "IWeapon"
    }

    startAttack() {
        this.attackState = true
    }

    stopAttack() {
        this.attackState = false
    }

    attack() {
        this.currentEnergy -= this.consume
    }

    enablePeculiarity() {
        if (this.player) {
            let attackRange = this.player.node.getChildByName("AttackRange")
            let scale = this.detectDis / 6
            let oriScale = new Vec3(0.21, 0.21, 0.21)
            attackRange.setScale(oriScale.multiplyScalar(scale))
            this.player.attackRange = 6* this.detectDis / 6
            let mat = attackRange.getComponent(ModelComponent).getMaterialInstance(0)
            mat.setProperty("mainColor",this.getAttackRangeColor().multiplyScalar(0.003921))
        }
    }

    disboard() { }

    getAttackRangeColor():Vec4{
        return new Vec4(255,255,255,126)
    }

}
