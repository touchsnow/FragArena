import { _decorator, Component, Node, EditBox, LabelComponent, find } from 'cc';
import { GameMgr } from '../../../Game/Managers/GameMgr';
import { PlayerMgr } from '../../../Game/Managers/PlayerMgr';
import { WeaponMgr } from '../../../Game/Managers/WeaponMgr';
import { BasePlayer } from '../../../Game/Player/BasePlayer';
import { RockGun } from '../../../Game/Weapon/RockGun';
const { ccclass, property } = _decorator;

@ccclass('WeaponPage')
export class WeaponPage extends Component {

    private player: BasePlayer = null

    @property(LabelComponent)
    weaponName: LabelComponent = null

    @property(EditBox)
    damageBox: EditBox = null

    @property(EditBox)
    hitRateBox: EditBox = null

    @property(EditBox)
    recoverSpeedBox: EditBox = null

    @property(EditBox)
    consumeBox: EditBox = null

    @property(EditBox)
    attackFruqBox: EditBox = null

    @property(EditBox)
    damageFruqBox: EditBox = null

    @property(EditBox)
    shotRange: EditBox = null

    @property(Node)
    changeWeapon: Node = null


    start() {
        this.damageBox.node.on('text-changed', this.onDamageBox, this);
        this.hitRateBox.node.on('text-changed', this.onHitRateBox, this);
        this.recoverSpeedBox.node.on('text-changed', this.onRecoverSpeedBox, this);
        this.consumeBox.node.on('text-changed', this.onConsumeBox, this);
        this.attackFruqBox.node.on('text-changed', this.onAttackFruqBox, this);
        this.damageFruqBox.node.on('text-changed', this.onDamageFruqBox, this);
        this.shotRange.node.on('text-changed', this.onShotRange, this);
        this.changeWeapon.on(Node.EventType.TOUCH_END, this.onChangeWeapon, this)
    }

    updateWeaponInfo() {
        if (this.player) {
            let weapon = this.player.weapon
            this.weaponName.string = weapon.getWeaponName()
            this.damageBox.string = weapon.damage.toString()
            this.hitRateBox.string = weapon.hitRate.toString()
            this.recoverSpeedBox.string = weapon.energyRecoverySpeed.toString()
            this.consumeBox.string = weapon.consume.toString()
            this.attackFruqBox.string = weapon.shootingFreq.toString()
            this.damageFruqBox.string = weapon.damageInterval.toString()
            this.shotRange.string = weapon.attackRange.toString()
        }
    }

    initWeaponPage(player: BasePlayer) {
        this.player = player
    }

    onDamageBox(editbox: EditBox) {
        let num = Number(editbox.string)
        this.player.weapon.damage = num
        this.setWeaponValue()
        // console.log(this.player.weapon)
        // console.log(WeaponMgr.getInstance().hadInstancedWeapon)
    }

    onHitRateBox(editbox: EditBox) {
        let num = Number(editbox.string)
        this.player.weapon.hitRate = num
        this.setWeaponValue()
    }

    onRecoverSpeedBox(editbox: EditBox) {
        let num = Number(editbox.string)
        this.player.weapon.energyRecoverySpeed = num
        this.setWeaponValue()
    }

    onConsumeBox(editbox: EditBox) {
        let num = Number(editbox.string)
        this.player.weapon.consume = num
        this.setWeaponValue()
    }

    onAttackFruqBox(editbox: EditBox) {
        let num = Number(editbox.string)
        this.player.weapon.shootingFreq = num
        this.setWeaponValue()
    }

    onDamageFruqBox(editbox: EditBox) {
        let num = Number(editbox.string)
        this.player.weapon.damageInterval = num
        this.setWeaponValue()
    }

    onShotRange(editbox: EditBox) {
        let num = Number(editbox.string)
        this.player.weapon.attackRange = num
        this.setWeaponValue()
    }

    setWeaponValue() {
        WeaponMgr.getInstance().hadInstancedWeapon.set(this.player.weapon.getWeaponName(), this.player.weapon)
    }

    onChangeWeapon() {
        let playerMgr = find("GameMgr").getComponent(PlayerMgr)
        let allPlays = playerMgr.getAllAis()
        // for (let i = 0; i < allPlays.length; i++) {
        //     WeaponMgr.getInstance().getWeapon(this.player.weapon, allPlays[i])
        // }
        for (let player of allPlays) {
           // console.log(player)
            WeaponMgr.getInstance().getWeaponByName(this.player.weapon.getWeaponName(), player)
            //WeaponMgr.getInstance().getWeapon(new RockGun,player)
        }
    }

}
