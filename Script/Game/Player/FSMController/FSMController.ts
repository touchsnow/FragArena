import { _decorator, Component, Node } from 'cc';
import { AstarSearch } from '../../../Nav/AstarSearch';
import { NanoNav } from '../../../Nav/NanoNav';
import { BasePlayer } from '../BasePlayer';
import { PlayerAI } from '../PlayerAI';
import { BaseFSMState } from './BaseFSMState';
import { SearchTargetState } from './SearchTargetState';
const { ccclass, property } = _decorator;

@ccclass('FSMController')
export class FSMController {

    /**控制的玩家 */
    public player: PlayerAI = null

    /**当前状态 */
    public currentState: BaseFSMState = null

    /**Astar寻路 */
    public astarSearch: AstarSearch = new AstarSearch()
    /**Astar地图 */
    public nanoNav: NanoNav = null

    init(player: PlayerAI) {
        this.player = player
        this.nanoNav = this.player.playerMgr.nanoNav
        this.astarSearch.initSearchInfo(this.nanoNav.staticMatrix)
        this.currentState = new SearchTargetState(this)
        this.currentState.enter()
    }

    switchState(state: BaseFSMState) {
        if(this.currentState){
            this.currentState.exit()
        }
        this.currentState = state
        this.currentState.enter()
    }

    update(dt:number) {
        if (this.currentState) {
            this.currentState.update(dt)
        }
    }

}
