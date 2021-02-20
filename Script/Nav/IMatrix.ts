import { Vec2, _decorator } from "cc";

const { ccclass, property } = _decorator;

/**
 *@description: 
 *@author: BenFei 不全连iL不改名
 *@date: 2020-07-08 21:58:43
 *尊重游戏创意，拒绝抄袭游戏
*/
@ccclass
export default class IMatrix<T>{

    data: Array<Array<T>> = null;

    width: number = 0;
    height: number = 0;

    static createMatrixBySize<T>(width: number, height: number, init: (x: number, y: number) => T): IMatrix<T> {
        let matrix = new IMatrix<T>();
        matrix.width = width;
        matrix.height = height;
        matrix.data = [];
        for (let i = 0; i < width; i++) {
            matrix.data.push([]);
            for (let j = 0; j < height; j++) {
                matrix.data[i].push(init(i, j));
            }
        }
        return matrix;
    }

    static createMatrixBySizeFrom<T>(width: number, height: number, value: T): IMatrix<T> {
        let matrix = new IMatrix<T>();
        matrix.width = width;
        matrix.height = height;
        matrix.data = [];
        for (let i = 0; i < width; i++) {
            matrix.data.push([]);
            for (let j = 0; j < height; j++) {
                matrix.data[i].push(value);
            }
        }
        return matrix;
    }

    get(x: number, y: number): T {
        return this.data[x][y];
    }

    getFrom(pos: Vec2) {
        return this.data[pos.x][pos.y];
    }

    set(x: number, y: number, value: T) {
        this.data[x][y] = value;
    }

    fillAll(value: T) {
        for (let ix = 0; ix < this.width; ix++) {
            for (let iy = 0; iy < this.height; iy++) {
                this.data[ix][iy] = value;
            }
        }
    }

    /**
     * find each x column first
     */
    iterateAll(f: (x: number, y: number, item: T) => void) {
        for (let ix = 0; ix < this.width; ix++) {
            for (let iy = 0; iy < this.height; iy++) {
                f(ix, iy, this.data[ix][iy]);
            }
        }
    }

    /**
     * find each x column first
     */
    iterateIndex(f: (x: number, y: number) => void) {
        for (let ix = 0; ix < this.width; ix++) {
            for (let iy = 0; iy < this.height; iy++) {
                f(ix, iy);
            }
        }
    }

    /**
     * find each x column first
     */
    reverseIterIndex(f: (x: number, y: number) => void) {
        for (let ix = this.width - 1; ix >= 0; ix--) {
            for (let iy = this.height - 1; iy >= 0; iy--) {
                f(ix, iy);
            }
        }
    }

    horizontalFlip() {
        if (!this.data || this.data.length <= 0) {
            return;
        }
        for (let startP = 0, endP = this.width - 1; startP < endP; startP++, endP--) {
            for (let y = 0; y < this.height; y++) {
                let tempValue = this.get(startP, y);
                this.set(startP, y, this.get(endP, y));
                this.set(endP, y, tempValue);
            }
        }
    }

    verticalFlip() {
        if (!this.data || this.data.length <= 0) {
            return;
        }
        for (let startP = 0, endP = this.height - 1; startP < endP; startP++, endP--) {
            for (let x = 0; x < this.height; x++) {
                let tempValue = this.get(x, startP);
                this.set(x, startP, this.get(x, endP));
                this.set(x, endP, tempValue);
            }
        }
    }

    XYIndexValid(x: number, y: number) {
        return x >= 0 && y >= 0 && x < this.width && y < this.height;
    }

    XYIndexValidOf(index: Vec2) {
        return index.x >= 0 && index.y >= 0 && index.x < this.width && index.y < this.height;
    }

    printMatrix() {
        console.log("Matrix: [" + this.width + "][" + this.height + "]");
        console.log(this.data);
    }

    printNumMap(blankValue: number) {
        console.log(`【Map】 ${this.width} X ${this.height}, Grid Num: ${this.width * this.height}`);
        let curValue: any = 0;
        let str = "\n ";
        for (let x = 0; x < this.width; x++) {
            str += x % 2 == 0 ? " a" : " b";
        }
        str += "\n";
        for (let y = 0; y < this.height; y++) {
            str += y % 2 == 0 ? "a" : "b";
            for (let x = 0; x < this.width; x++) {
                curValue = this.get(x, y);
                if (curValue === blankValue) {
                    str += "  ";
                } else if (curValue < 10) {
                    str += ' ' + curValue;
                } else {
                    str += curValue;
                }
            }
            str += y % 2 == 0 ? "a" : "b";
            str += "\n";
        }
        str += " ";
        for (let x = 0; x < this.width; x++) {
            str += x % 2 == 0 ? " a" : " b";
        }
        //console.log(str);
    }
}
