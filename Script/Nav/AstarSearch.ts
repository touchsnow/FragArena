import { _decorator, Vec2, v2 } from 'cc';
import IMatrix from './IMatrix';
const { ccclass, property } = _decorator;

type IMap = IMatrix<number>;

type ReachableFun = (item: any) => boolean;

class SearchNode {
    x: number = 0;
    y: number = 0;
    from: SearchNode = null;
    vis: boolean = false;
    G: number = 0;
    F: number = 0;
}

/**
 *@description: A Star Search Tool
 *@author: BenFei 不单手全连iL不改名
 *@date: 2020-07-17 14:40:59
 *尊重游戏创意，拒绝抄袭游戏
*/
@ccclass('AstarSearch')
export class AstarSearch {

    map: IMap = null;

    startPos: Vec2 = null;
    endPos: Vec2 = null;

    readonly dir: Vec2[] = [
        v2(0, -1),
        v2(0, 1),
        v2(1, 0),
        v2(-1, 0),
        v2(-1, -1),
        v2(-1, 1),
        v2(1, -1),
        v2(1, 1),
    ];

    private closeMap: IMatrix<SearchNode> = null;
    private xDirty: boolean[] = null;

    private _step = 0;
    private _stepLimit = -1;

    reachable: ReachableFun = (item: any) => {
        return item === 1;
    }

    posValid(x: number, y: number) {
        return x >= 0 && y >= 0 && x < this.map.width && y < this.map.height;
    }

    private createCloseMap() {
        this.closeMap = IMatrix.createMatrixBySize(
            this.map.width,
            this.map.height,
            (x: number, y: number) => {
                let sn = new SearchNode();
                sn.x = x;
                sn.y = y;
                return sn;
            }
        );

        this.xDirty = [];
        for (let i = 0; i < this.map.width; i++) {
            this.xDirty.push(false);
        }
        console.lo
    }

    private initClose() {
        let sn: SearchNode = null;
        for (let x = 0; x < this.closeMap.width; x++) {
            if (!this.xDirty[x]) continue;
            this.xDirty[x] = false;
            for (let y = 0; y < this.closeMap.height; y++) {
                sn = this.closeMap.get(x, y);
                if (sn.vis) {
                    sn.vis = false;
                    sn.from = null;
                }
            }
        }
    }

    private pushSearch(openList: SearchNode[], toX: number, toY: number, cost: number) {
        this._step++;
        this.xDirty[toX] = true;
        let sn = this.closeMap.get(toX, toY);
        sn.G = cost;
        let H = Math.abs(toX - this.endPos.x) + Math.abs(toY - this.endPos.y);
        sn.F = sn.G + H;
        openList.push(sn);
        let minIdx = openList.length - 1;
        for (let i = 0; i < openList.length; i++) {
            if (openList[i].F < openList[minIdx].F) {
                minIdx = i;
            }
        }
        if (minIdx != openList.length - 1) {
            let tempItem = openList[minIdx];
            openList[minIdx] = openList[openList.length - 1];
            openList[openList.length - 1] = tempItem;
        }
    }

    private aster(): boolean {
        let curX = this.startPos.x;
        let curY = this.startPos.y;
        let nextX = 0, nextY = 0;
        let openList: SearchNode[] = [];
        let beginNode = this.closeMap.get(curX, curY);
        beginNode.vis = true;
        this.pushSearch(openList, curX, curY, 0);

        while (openList.length) {
            let curNode = openList.pop();
            if (curNode.x == this.endPos.x && curNode.y == this.endPos.y) {
                return true;
            }
            if (this._step > this._stepLimit) {
               // console.log("search exceed limit");
                return false;
            }
            curX = curNode.x;
            curY = curNode.y;
            for (let d = 0; d < this.dir.length; d++) {
                nextX = curX + this.dir[d].x;
                nextY = curY + this.dir[d].y;
                if (!this.posValid(nextX, nextY) || !this.reachable(this.map.get(nextX, nextY))) continue;
                if (this.closeMap.get(nextX, nextY).vis) continue;
                let cost = curNode.G + Math.sqrt(Math.pow(nextX - curX, 2) + Math.pow(nextY - curY, 2));
                this.closeMap.get(nextX, nextY).vis = true;
                this.closeMap.get(nextX, nextY).from = curNode;
                this.pushSearch(openList, nextX, nextY, cost);
            }
        }
        return false;
    }

    getPath() {
        let pathList: Vec2[] = [];
        let curSearchNode = this.closeMap.get(this.endPos.x, this.endPos.y);
        while (curSearchNode) {
            pathList.push(v2(curSearchNode.x, curSearchNode.y));
            curSearchNode = curSearchNode.from;
        }
        return pathList;
    }

    initSearchInfo(mapInfo: IMap, reachableFun?: ReachableFun) {
        this.map = mapInfo;
        this._stepLimit = this.map.width * this.map.height * 0.25;
        if (reachableFun) {
            this.reachable = reachableFun;
        }
        this.createCloseMap();
    }

    search(startIdx: Vec2, endIdx: Vec2): Vec2[] {
        this.startPos = startIdx;
        this.endPos = endIdx;
        this.initClose();
        this._step = 0;
        if (this.aster()) {
            return this.getPath();
        } else {
            return null;
        }
    }
}
