import { _decorator, Component, Node, Vec2 } from 'cc';
import { ObjectPoolMgr } from '../Managers/ObjectPoolMgr';
import { ShieldBuffObject } from '../ObjectPool/ShieldBuffObject';
import { BasePlayer } from '../Player/BasePlayer';
import { BaseBuff } from './BaseBuff';
const { ccclass, property } = _decorator;

@ccclass('ShiledBuff')
export class ShiledBuff extends BaseBuff {

    private shieldNode: ShieldBuffObject = null

    startBuff(player: BasePlayer, buffName: string) {
        super.startBuff(player, buffName)
        let node = ObjectPoolMgr.getInstance().get("Shield")
        node.active = true
        this.shieldNode = node.getComponent(ShieldBuffObject)
        this.addShield()
    }

    update(dt: number) {
        super.update(dt)
        if (this.shieldNode.node && this.player.node) {
            this.shieldNode.node.setWorldPosition(this.player.node.worldPosition)
        }
    }

    removeBuff() {
        super.removeBuff()
    }

    debugStartBuff(player: BasePlayer, buffName: string, time: number, addition: number) {
        super.debugStartBuff(player, buffName, time, addition)
        let node = ObjectPoolMgr.getInstance().get("Shield")
        this.shieldNode = node.getComponent(ShieldBuffObject)
        this.addShield()
    }

    addShield() {
        if (this.shieldNode) {
            this.shieldNode.enableShield()
        }

    }

    getResist(pos: Vec2) {
        if (this.shieldNode) {
            return this.shieldNode.getResist(pos)
        }
    }

    onDestroy() {
        this.shieldNode.endLife()
    }

}
