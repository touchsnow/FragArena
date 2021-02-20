import { Component, _decorator } from 'cc';
import { BasePlayer } from '../BasePlayer';
import { PlayerAI } from '../PlayerAI';
import { FSMController } from './FSMController';
const { ccclass, property } = _decorator;

@ccclass('BaseFSMState')
export class BaseFSMState {

    protected controller: FSMController = null
    protected player: PlayerAI = null

    constructor(controller: FSMController) {
        this.controller = controller
        this.player = this.controller.player
    }

    enter() { }
    exit() { }
    update(dt:number) { }

}
