import { _decorator, resources, JsonAsset } from 'cc';
import { PlayerConfig } from '../../Data/PlayerConfig';
import { StorgeMgr } from './StorgeMgr';
const { ccclass, property } = _decorator;

@ccclass('ConfigMgr')
export class ConfigMgr {

    private static configMgr: ConfigMgr
    public static getInstance(): ConfigMgr {
        if (this.configMgr == null) {
            this.configMgr = new ConfigMgr()
        }
        return ConfigMgr.configMgr
    }

    /**配置路径 */
    private weaponConfigPath = "Config/Weapon"
    private robotsConfigPath = "Config/robots"
    private drawConfigPath = "Config/DrawCard"
    private skinConfigPath = "Config/Skin"
    private buffConfigPath = "Config/Buff"
    private levelRewardConfigPath = "Config/LevelReward"
    private weaponConfig: JsonAsset = new JsonAsset()
    private robotsConfig: JsonAsset = new JsonAsset()
    private drawConfig: JsonAsset = new JsonAsset()
    private skinConfig: JsonAsset = new JsonAsset()
    private buffConfig: JsonAsset = new JsonAsset()
    private levelRewardConfig: JsonAsset = new JsonAsset()
    private playerConfig: PlayerConfig[] = []

    init() {
        resources.load(this.weaponConfigPath, JsonAsset, (err, jsonAsset) => {
            if (err) {
                return false
            }
            if (jsonAsset) {
                this.weaponConfig = jsonAsset
            }
        })
        resources.load(this.robotsConfigPath, JsonAsset, (err, jsonAsset) => {
            if (err) {
                return false
            }
            if (jsonAsset) {
                this.robotsConfig = jsonAsset
            }
        })
        resources.load(this.drawConfigPath, JsonAsset, (err, jsonAsset) => {
            if (err) {
                return false
            }
            if (jsonAsset) {
                this.drawConfig = jsonAsset
            }
        })
        resources.load(this.skinConfigPath, JsonAsset, (err, jsonAsset) => {
            if (err) {
                return false
            }
            if (jsonAsset) {
                this.skinConfig = jsonAsset
            }
        })
        resources.load(this.buffConfigPath, JsonAsset, (err, jsonAsset) => {
            if (err) {
                return false
            }
            if (jsonAsset) {
                this.buffConfig = jsonAsset
            }
        })
        resources.load(this.levelRewardConfigPath, JsonAsset, (err, jsonAsset) => {
            if (err) {
                return false
            }
            if (jsonAsset) {
                this.levelRewardConfig = jsonAsset
            }
        })
    }

    public getWeaponConfig() {
        return this.weaponConfig
    }

    public getDrwaCardConfig() {
        return this.drawConfig
    }

    public getSkinConfig() {
        return this.skinConfig
    }

    public getBuffConfig() {
        return this.buffConfig
    }

    public getLevelRewardConfig() {
        return this.levelRewardConfig
    }

    public setupAIConfig(setupCount: number) {
        this.playerConfig = []
        for (let i = 0; i < setupCount; i++) {
            this.playerConfig.push(this.createAIConfig())
        }
    }

    private createAIConfig(): PlayerConfig {
        let playerConfig = new PlayerConfig
        let skinConfig = this.skinConfig.json["skinList"]
        let randomIndex = Math.floor(Math.random() * skinConfig.length)
        playerConfig.skin = skinConfig[randomIndex]
        playerConfig.level = 1
        playerConfig.name = this.getRobotName()
        let skin = playerConfig.skin
        playerConfig.headSpritePath = this.skinConfig.json[skin].headSpritePath
        return playerConfig
    }

    getPlayerConfig(): PlayerConfig[] {
        return this.playerConfig
    }

    getSelfConfig() {
        let config = new PlayerConfig
        config.level = 1
        config.name = StorgeMgr.getInstance().playerName
        config.skin = StorgeMgr.getInstance().currentSkin
        config.trySkin = StorgeMgr.getInstance().trySkin
        if (config.trySkin !== "") {
            config.headSpritePath = this.skinConfig.json[config.trySkin].headSpritePath
        } else {
            config.headSpritePath = this.skinConfig.json[config.skin].headSpritePath
        }
        return config
    }

    private getRobotName(): string {
        let data = this.robotsConfig.json as []
        let index = Math.ceil(Math.random() * (data.length - 1))
        let name = data[index][0]
        return name
    }

}
