import { _decorator, JsonAsset, random } from 'cc';
import { BackFireBuff } from '../Buff/BackFireBuff';
import { MultipleShotBuff } from '../Buff/MultipleShotBuff';
import { ShiledBuff } from '../Buff/ShiledBuff';
import { SplitFireBuff } from '../Buff/SplitFireBuff';
import { BasePlayer } from '../Player/BasePlayer';
import { Player } from '../Player/Player';
import { DynamiteGun } from '../Weapon/DynamiteGun';
import { FlameGun } from '../Weapon/FlameGun';
import { FreezeGun } from '../Weapon/FreezeGun';
import { IWeapon } from '../Weapon/IWeapon';
import { LaserGun } from '../Weapon/LaserGun';
import { MachineGun } from '../Weapon/MachineGun';
import { PoisonGun } from '../Weapon/PoisonGun';
import { RockGun } from '../Weapon/RockGun';
import { ShotGun } from '../Weapon/ShotGun';
import { TeslaGun } from '../Weapon/TeslaGun';
import { ConfigMgr } from './ConfigMgr';
import { WeaponMgr } from './WeaponMgr';
const { ccclass } = _decorator;

@ccclass('DrawCardMgr')
export class DrawCardMgr {

    /**卡牌配置 */
    public config: JsonAsset = new JsonAsset()

    private static drawCardMgr: DrawCardMgr
    public static getInstance(): DrawCardMgr {
        if (this.drawCardMgr == null) {
            this.drawCardMgr = new DrawCardMgr()
        }
        return DrawCardMgr.drawCardMgr
    }


    private cardItemWeaponList = [
        "DynamiteGun", "RockGun", "MachineGun", "ShotGun", "LaserGun",
        "TeslaGun", "FlameGun", "FreezeGun", "PoisonGun"
    ]

    public cardItemBuffList = [
        "Armor1", "Damage1", "AttackBloodReturn1", "Speed1",
        "AttackSpeed1", "HpRecover1", "MoreExp1", "BloodReturn1", "BackFire", "Shield",
        "SplitFire", "MultipleShot"
    ]

    private probability = [20, 20, 10, 10, 80, 20, 8, 8, 1, 4, 1, 2]
    private continuousPro = [20, 20, 10, 10, 80, 20, 9, 9, 1, 4, 1, 0]
    private normalPro = [20, 20, 10, 10, 80, 20, 8, 8, 1, 4, 1, 2]
    private totalPro = 100

    init() {
        this.config = ConfigMgr.getInstance().getDrwaCardConfig()
        this.probability = this.normalPro
    }

    setProbability(number: number[]) {
        this.probability = number
    }

    getRandomWeaponItem(ignore: string[] = []) {
        let itemList = []
        let itemNameList = []
        let randomTime = 0
        while (true) {
            let randomIndex = Math.floor(Math.random() * (this.cardItemWeaponList.length))
            let item = this.cardItemWeaponList[randomIndex]
            if (ignore.indexOf(item) == -1 && itemNameList.indexOf(item) == -1) {
                itemNameList.push(item)
                itemList.push(this.config.json[item])
            }
            if (itemList.length >= 3) {
                return itemList
            }
            randomTime += 1
            if (randomTime >= this.cardItemWeaponList.length * 2) {
                return itemList
            }
        }
    }

    getRandomBuffItem(player:BasePlayer,ignore: string[] = []) {
        let itemList = []
        let itemNameList = []
        let randomTime = 0
        while (true) {
            let random = Math.random() * this.totalPro
            let randomIndex = 0
            let totalCount = 0
            for (let probality of this.probability) {
                totalCount += probality
                if (totalCount >= random) {
                    break
                }
                randomIndex += 1
            }
            let item = this.cardItemBuffList[randomIndex]
            if (ignore.indexOf(item) == -1 && itemNameList.indexOf(item) == -1) {
                itemNameList.push(item)
                itemList.push(this.config.json[item])
                if(!player.isAi){
                    //console.log("已经抽了一张了，减1"+ this.probability)
                    this.probability[randomIndex] -= 1
                }
            }
            if (itemList.length >= 3) {
                return itemList
            }
            randomTime += 1
            if (randomTime >= this.cardItemBuffList.length * 2) {
                return itemList
            }
        }
    }

    enableItemBuff(player: BasePlayer, value: number, addition: number) {
        switch (value) {
            case 0:
                WeaponMgr.getInstance().getWeapon<DynamiteGun>(new DynamiteGun, player)
                break;
            case 1:
                WeaponMgr.getInstance().getWeapon<RockGun>(new RockGun, player)
                break;
            case 2:
                WeaponMgr.getInstance().getWeapon<MachineGun>(new MachineGun, player)
                break;
            case 3:
                WeaponMgr.getInstance().getWeapon<ShotGun>(new ShotGun, player)
                break;
            case 4:
                WeaponMgr.getInstance().getWeapon<LaserGun>(new LaserGun, player)
                break;
            case 5:
                WeaponMgr.getInstance().getWeapon<TeslaGun>(new TeslaGun, player)
                break;
            case 6:
                WeaponMgr.getInstance().getWeapon<FlameGun>(new FlameGun, player)
                if (!player.isAi) { this.setProbability(this.continuousPro) }
                break;
            case 7:
                WeaponMgr.getInstance().getWeapon<FreezeGun>(new FreezeGun, player)
                if (!player.isAi) { this.setProbability(this.continuousPro) }
                break;
            case 8:
                WeaponMgr.getInstance().getWeapon<PoisonGun>(new PoisonGun, player)
                if (!player.isAi) { this.setProbability(this.continuousPro) }
                break;
            case 9:
                player.hunmanAttr.armorAddition += addition
                break
            case 10:
                player.hunmanAttr.damageAddition += addition
                break
            case 11:
                player.hunmanAttr.attackBloodReturn += addition
                break
            case 12:
                player.hunmanAttr.moveSpeedAddition += addition
                break
            case 13:
                player.hunmanAttr.attackSpeedAddition += addition
                // if (player.hunmanAttr.attackSpeedAddition > 0.4) {
                //     player.hunmanAttr.attackSpeedAddition = 0.4
                // }
                break
            case 14:
                player.hunmanAttr.currentHp += player.hunmanAttr.maxHp * addition
                if (player.hunmanAttr.currentHp > player.hunmanAttr.maxHp) {
                    player.hunmanAttr.currentHp = player.hunmanAttr.maxHp
                }
                break
            case 15:
                player.hunmanAttr.bloodReturn += addition
                break
            case 16:
                player.hunmanAttr.expAddition += addition
                break
            case 17:
                let shield: ShiledBuff = null
                shield = player.node.getComponent(ShiledBuff)
                if (shield) {
                    shield.addShield()
                } else {
                    player.node.addComponent(ShiledBuff).startBuff(player, "ShieldBuff")
                }
                break
            case 18:
                let backFire: BackFireBuff = null
                backFire = player.node.getComponent(BackFireBuff)
                if (!backFire) {
                    player.node.addComponent(BackFireBuff).startBuff(player, "BackFireBuff")
                }
                break
            case 19:
                let splitFire: SplitFireBuff = null
                splitFire = player.node.getComponent(SplitFireBuff)
                if (!splitFire) {
                    player.node.addComponent(SplitFireBuff).startBuff(player, "SplitFireBuff")
                }
                break
            case 20:
                let multipleShotBuff: MultipleShotBuff = null
                multipleShotBuff = player.node.getComponent(MultipleShotBuff)
                if (!multipleShotBuff) {
                    multipleShotBuff = player.node.addComponent(MultipleShotBuff)
                    multipleShotBuff.startBuff(player, "MultipleShotBuff")
                    multipleShotBuff.addShotCount()
                } else {
                    multipleShotBuff.addShotCount()
                }
                break
            default:
                break;
        }
    }

}
