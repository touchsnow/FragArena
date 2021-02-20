import { _decorator, Component, Node, sys } from 'cc';
import BaseStorge from '../../../Framework3D/Src/Base/BaseStorge';
import { Contants } from '../../Data/Contants';
const { ccclass, property } = _decorator;

@ccclass('StorgeMgr')
export class StorgeMgr extends BaseStorge {

    private static storgeMgr: StorgeMgr
    public static getInstance(): StorgeMgr {
        if (this.storgeMgr == null) {
            this.storgeMgr = new StorgeMgr()
        }
        return StorgeMgr.storgeMgr
    }

    init() {
        //@ts-ignore
        let storgeItem = this.get(this.__proto__.constructor.name);
        if (storgeItem) {
            //@ts-ignore
            Object.assign(this, storgeItem);
            if (this.gameVer !== Contants.gameVer) {
                //@ts-ignore
                this.remove(this.__proto__.constructor.name)
                this.initData()
                //@ts-ignore
                this.set(this.__proto__.constructor.name, this);
            }
        } else {
            //@ts-ignore
            this.set(this.__proto__.constructor.name, this);
        }
        return this;
    }

    private gameVer: number = 0
    public playerName: string = "我"
    public totalExp: number = 0
    public giftBoxProgress: number = 0
    public money: number = 0
    public currentSkin: string = "Oscar"
    public trySkin:string = ""
    public ownedSkin: string[] = ["Oscar"]
    public limitRewardTime: number = 0
    public storeItemLIst: string[] = []
    public tankItemList: string[] = []
    public newUser:boolean = true

    initData() {
        this.gameVer = Contants.gameVer
        this.playerName = "我"
        this.totalExp = 0
        this.giftBoxProgress = 0
        this.money = 0
        this.currentSkin = "Oscar"
        this.trySkin = ""
        this.ownedSkin = ["Oscar"]
        this.limitRewardTime = 0
        this.storeItemLIst = []
        this.tankItemList = []
        this.newUser = true
    }

    public set(key: string, value: any): void {
        super.set(key, value)
    }

    public get(key: string, defaultValue: any = null): any {
        return super.get(key, defaultValue)
    }
}
