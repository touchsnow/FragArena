import { _decorator, Node, find, game, instantiate, loader, resources } from 'cc';
import { PoolObjLifeCycle } from '../ObjectPool/PoolObjLifeCycle';
const { ccclass, property } = _decorator;

@ccclass('ObjectPoolMgr')
export class ObjectPoolMgr {

    private static objectPoolMgr: ObjectPoolMgr
    public static getInstance(): ObjectPoolMgr {
        if (this.objectPoolMgr == null) {
            this.objectPoolMgr = new ObjectPoolMgr()
        }
        return ObjectPoolMgr.objectPoolMgr
    }

    private poolNode: Node = null

    private poolDic: Map<string, Array<Node>> = new Map<string, Array<Node>>()

    private resPath: string = "PoolRes/"

    init() {
        this.poolNode = find("PoolNode")
        game.addPersistRootNode(this.poolNode)
    }

    get(name: string) {
        // console.log("获取对象："+name)
        if (this.poolDic.has(name)) {
            let pool = this.poolDic.get(name)
            if (pool.length > 0) {
                //        console.log("直接拿")
                return pool.pop()
            } else {
                //        console.log("没有了，加载一个")
                return this.loadObj(name)
            }
        } else {
            let pool = []
            this.poolDic.set(name, pool)
            //   console.log("创建一个对象池")
            return this.loadObj(name)
        }
    }

    put(node: Node) {
        // console.log("放进对象池：" + node.name)
        if (this.poolDic.has(node.name)) {
            let pool = this.poolDic.get(node.name)
            pool.push(node)
        } else {
            let pool = []
            pool.push(node)
            this.poolDic.set(node.name, pool)
        }
        node.active = false
    }

    getUIObj(name: string) {
        if (this.poolDic.has(name)) {
            let pool = this.poolDic.get(name)
            if (pool.length > 0) {
                return pool.pop()
            } else {
                return this.loadObj(name)
            }
        } else {
            let pool = []
            this.poolDic.set(name, pool)
            return this.loadObj(name)
        }
    }

    putUIObj(node: Node) {
        if (this.poolDic.has(node.name)) {
            let pool = this.poolDic.get(node.name)
            pool.push(node)
        } else {
            let pool = []
            pool.push(node)
            this.poolDic.set(node.name, pool)
        }
        node.active = false
        node.setParent(this.poolNode)
    }

    end() {
        for (let node of this.poolNode.children) {
            let life = node.getComponent(PoolObjLifeCycle)
            if (life) {
                node.getComponent(PoolObjLifeCycle).endLife()
            }
        }
    }

    generateObjects() {
        this.genrate("AttackUpper", 1)
        this.genrate("DynamiteBomb", 6)
        this.genrate("DynamiteBullet", 5)
        this.genrate("HealthBuff", 1)
        this.genrate("MachineBomb", 10)
        this.genrate("MachineBullet", 15)
        this.genrate("MachineLight", 1)
        this.genrate("PistolBomb", 10)
        this.genrate("PistolBullet", 25)
        this.genrate("RockBomb", 5)
        this.genrate("RockBullet", 10)
        this.genrate("RoleDeath", 5)
        this.genrate("RoleStart", 5)
        this.genrate("ShotBomb", 7)
        this.genrate("ShotBullet", 15)
        this.genrate("ShotFire", 5)
        this.genrate("SpeedBuff", 1)
        this.genrate("TeslaBomb", 20)
        this.genrate("TeslaBullet", 15)
        this.genrate("DamageLabel", 6)
    }

    private genrate(name: string, count: number) {
        let objectList = []
        for (let i = 0; i < count; i++) {
            let obj = this.get(name)
            objectList.push(obj)
        }
        for (let obj of objectList) {
            this.put(obj)
        }
    }

    private loadObj(name: string) {
        console.log("对象池加载：" + name)
        let objPath = this.resPath + name
        let obj = instantiate(resources.get(objPath))
        obj.setParent(this.poolNode)
        return obj
    }

}
