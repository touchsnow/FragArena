import { _decorator, JsonAsset } from 'cc';
import { BasePlayer } from '../Player/BasePlayer';
import { DynamiteGun } from '../Weapon/DynamiteGun';
import { FlameGun } from '../Weapon/FlameGun';
import { FreezeGun } from '../Weapon/FreezeGun';
import { IWeapon } from '../Weapon/IWeapon';
import { LaserGun } from '../Weapon/LaserGun';
import { MachineGun } from '../Weapon/MachineGun';
import { Pistol } from '../Weapon/Pistol';
import { PoisonGun } from '../Weapon/PoisonGun';
import { RockGun } from '../Weapon/RockGun';
import { ShotGun } from '../Weapon/ShotGun';
import { TeslaGun } from '../Weapon/TeslaGun';
import { ConfigMgr } from './ConfigMgr';
const { ccclass, property } = _decorator;

@ccclass('WeaponMgr')
export class WeaponMgr {

    /**武器管理器单例 */
    private static weaponMgr: WeaponMgr
    public static getInstance(): WeaponMgr {
        if (this.weaponMgr == null) {
            this.weaponMgr = new WeaponMgr()
            this.weaponMgr.config = ConfigMgr.getInstance().getWeaponConfig()
        }
        return WeaponMgr.weaponMgr
    }

    /**武器配置 */
    public config: JsonAsset = new JsonAsset()


    public hadInstancedWeapon: Map<string, IWeapon> = new Map<string, IWeapon>()

    public init() {
        this.hadInstancedWeapon = new Map<string, IWeapon>()
    }

    public getWeapon<T extends IWeapon>(weapon?: T, player?: BasePlayer): T {
        let hadWeapon = this.hadInstancedWeapon.get(weapon.getWeaponName())
        if (hadWeapon) {
            weapon.totalEnery = hadWeapon.totalEnery
            weapon.currentEnergy = hadWeapon.currentEnergy
            weapon.shootingFreq = hadWeapon.shootingFreq
            weapon.energyRecoverySpeed = hadWeapon.energyRecoverySpeed
            weapon.damage = hadWeapon.damage
            weapon.consume = hadWeapon.consume
            weapon.hitRate = hadWeapon.hitRate
            weapon.damageInterval = hadWeapon.damageInterval
            weapon.attackRange = hadWeapon.attackRange
            weapon.maxOffset = hadWeapon.maxOffset
            weapon.minOffset = hadWeapon.minOffset
            weapon.detectDis = hadWeapon.detectDis
        } else {
            let weaponConfig = this.config.json[weapon.getWeaponName()]
            Object.assign(weapon, weaponConfig)
        }
        if (player.weapon) {
            player.weapon.disboard()
            let weaponParentNode = player.node.children[0]
            let currentWeapon = weaponParentNode.getChildByName(player.weapon.getWeaponName())
            if (currentWeapon) {
                currentWeapon.active = false
            }
            let newWeapon = weaponParentNode.getChildByPath(weapon.getWeaponName())
            if (newWeapon) {
                newWeapon.active = true
                weapon.rayPoint = player.node.getChildByName("RayPoint")
                weapon.firePoint = player.node.children[0].getChildByPath("FirePoint Socket/" + weapon.getWeaponName())
                weapon.player = player
                //    console.log(player)
            }
        }
        player.weapon = weapon
        if (!player.isAi) {
            if (!this.hadInstancedWeapon.has(weapon.getWeaponName())) {
                //    console.log("放进去一个武器")
                this.hadInstancedWeapon.set(weapon.getWeaponName(), player.weapon)
            }
        }
        weapon.enablePeculiarity()
        return weapon
    }

    public getRandonWeapon(player: BasePlayer) {
        let randomIndex = Math.ceil(Math.random() * 9)
        switch (randomIndex) {
            case 0:
                return this.getWeapon<DynamiteGun>(new DynamiteGun, player)
            case 1:
                return this.getWeapon<FlameGun>(new FlameGun, player)
            case 2:
                return this.getWeapon<FreezeGun>(new FreezeGun, player)
            case 3:
                return this.getWeapon<LaserGun>(new LaserGun, player)
            case 4:
                return this.getWeapon<MachineGun>(new MachineGun, player)
            case 5:
                return this.getWeapon<PoisonGun>(new PoisonGun, player)
            case 6:
                return this.getWeapon<Pistol>(new Pistol, player)
            case 7:
                return this.getWeapon<RockGun>(new RockGun, player)
            case 8:
                return this.getWeapon<ShotGun>(new ShotGun, player)
            case 9:
                return this.getWeapon<TeslaGun>(new TeslaGun, player)
            default:
                break;
        }
    }

    public getWeaponByName(name: string, player: BasePlayer) {
        //let randomIndex = Math.ceil(Math.random() * 9)
        switch (name) {
            case "DynamiteGun":
                return this.getWeapon<DynamiteGun>(new DynamiteGun, player)
            case "FlameGun":
                return this.getWeapon<FlameGun>(new FlameGun, player)
            case "FreezeGun":
                return this.getWeapon<FreezeGun>(new FreezeGun, player)
            case "LaserGun":
                return this.getWeapon<LaserGun>(new LaserGun, player)
            case "MachineGun":
                return this.getWeapon<MachineGun>(new MachineGun, player)
            case "PoisonGun":
                return this.getWeapon<PoisonGun>(new PoisonGun, player)
            case "Pistol":
                return this.getWeapon<Pistol>(new Pistol, player)
            case "RockGun":
                return this.getWeapon<RockGun>(new RockGun, player)
            case "ShotGun":
                return this.getWeapon<ShotGun>(new ShotGun, player)
            case "TeslaGun":
                return this.getWeapon<TeslaGun>(new TeslaGun, player)
            default:
                break;
        }
    }

    endMgr() {
        //loader.loadRes()
    }
}
