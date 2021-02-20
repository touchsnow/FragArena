import { _decorator, Component, Node, Vec2, Mat4, Size, ColliderComponent, Vec3, CylinderCollider, BoxCollider } from 'cc';
import IMatrix from './IMatrix';
import IMatrixTool from './IMatrixTool';

const { ccclass, property } = _decorator;

type MapMatrix = IMatrix<number>;

/**
 *@description: static nav
 *@author: 不单手全连iL不改名
 *@date: 2020-11-03 17:33:15
 *尊重游戏创意，拒绝抄袭游戏
*/
@ccclass('NanoNav')
export class NanoNav extends Component {

    @property
    mapSize: Vec2 = new Vec2(10, 10);

    @property
    meshSize: number = 1;

    @property
    printMap: boolean = true;

    @property
    agentRadius: number = 1;

    /**
     * there may be multiple walkable value that will greater than walkableValue
     */
    @property
    walkableValue: number = 1;

    /**
     * the block value are the unique
     */
    @property
    blockValue: number = 0;

    public readonly enablePrintMap = true;

    private _mapMatrixSize: Size = null;
    get matrixSize(): Size {
        return this._mapMatrixSize;
    }

    staticMatrix: MapMatrix = null;

    private _layerMatrix: Mat4 = null;

    private _colliderList: ColliderComponent[] = [];

    /**
     * used for store search tool
     * need to init manually 
     */
    searchTool: any = null;

    start() {
        this._layerMatrix = this.node.getWorldMatrix().invert();
        this.buildNavMap();
        if (this.printMap && this.enablePrintMap) {
            this.staticMatrix.printNumMap(0);
        }
    }

    buildNavMap() {
        this._mapMatrixSize = new Size(Math.ceil(this.mapSize.x / this.meshSize), Math.ceil(this.mapSize.y / this.meshSize));
        this.buildStaticMap(this.node);
    }

    xyIsBlock(x: number, y: number) {
        return this.staticMatrix.get(x, y) === this.blockValue;
    }

    xyPass(x: number, y: number) {
        return this.staticMatrix.get(x, y) !== this.blockValue;
    }

    xyIndexValide(x: number, y: number) {
        return x >= 0 && y >= 0 && x < this.staticMatrix.width && y < this.staticMatrix.height;
    }

    xyCanWalk(x: number, y: number) {
        return this.xyIndexValide(x, y) && this.xyPass(x, y);
    }

    xyNotWalkable(x: number, y: number) {
        return !this.xyIndexValide(x, y) || this.xyIsBlock(x, y);
    }

    posIsBlock(pos: Vec2) {
        return this.staticMatrix.getFrom(pos) === this.blockValue;
    }

    posPass(pos: Vec2) {
        return this.staticMatrix.get(pos.x, pos.y) !== this.blockValue;
    }

    posIndexValide(pos: Vec2) {
        return pos.x >= 0 && pos.y >= 0 && pos.x < this.staticMatrix.width && pos.y < this.staticMatrix.height;
    }

    posCanWalk(pos: Vec2) {
        return this.posIndexValide(pos) && this.posPass(pos);
    }

    posNotWalkable(pos: Vec2) {
        return !this.posIndexValide(pos) || this.posIsBlock(pos);
    }

    validePosRange(pos: Vec2) {
        let hasChange = false;
        if (pos.x < 0) {
            pos.x = 0;
            hasChange = true;
        } else if (pos.x >= this.matrixSize.width) {
            pos.x = this.matrixSize.width - 1;
            hasChange = true;
        }

        if (pos.y < 0) {
            pos.y = 0;
            hasChange = true;
        } else if (pos.y >= this.matrixSize.height) {
            pos.y = this.matrixSize.height - 1;
            hasChange = true;
        }
        return hasChange;
    }

    private buildStaticMap(mapLayer: Node) {
        this.staticMatrix = IMatrix.createMatrixBySizeFrom(this._mapMatrixSize.width, this._mapMatrixSize.height, this.walkableValue);
        console.log(this.staticMatrix)
        this.readCollider(mapLayer);
        this.fillMatrixWithCollider(this.staticMatrix);
    }

    readCollider(layer: Node) {
        this._colliderList = layer.getComponentsInChildren(ColliderComponent);
    }

    fillMatrixWithCollider(parentMatrix: MapMatrix) {
        if(this._colliderList.length<0){
            return
        }
        let colliderMatrix: MapMatrix = null;
        let centerPos: Vec3 = null;
        for (let collider of this._colliderList) {
            if (collider instanceof BoxCollider) {
                [colliderMatrix, centerPos] = this.readBoxCollider(collider, 0, 1);
                this.clearSubMesh(parentMatrix, colliderMatrix, centerPos, this.blockValue);
            } else if (collider instanceof CylinderCollider) {
                [colliderMatrix, centerPos] = this.readCylinderCollider(collider, 0, 1);
                this.clearSubMesh(parentMatrix, colliderMatrix, centerPos, this.blockValue);
            }
        }
    }

    readBoxCollider(collider: BoxCollider, blankValue: number, fillValue: number): [MapMatrix, Vec3] {
        let colliderCenter = collider.node.getWorldPosition();
        colliderCenter = colliderCenter.transformMat4(this._layerMatrix);
        let boxSize = new Vec3(collider.size.x * collider.node.scale.x, collider.size.y * collider.node.scale.y, collider.size.z * collider.node.scale.z);
        let sizePadding = this.agentRadius * 2;
        boxSize.x += sizePadding;
        boxSize.z += sizePadding;
        let rawOffset = new Vec3(collider.center.x * collider.node.scale.x, collider.center.y * collider.node.scale.y, collider.center.z * collider.node.scale.z);
        let colliderOffset = new Vec3();
        Vec3.transformQuat(colliderOffset, rawOffset, collider.node.rotation);
        colliderCenter = colliderCenter.add(colliderOffset);
        let angle = collider.node.eulerAngles.y;
        let subMeshSize = Math.sqrt(Math.pow(boxSize.x, 2) + Math.pow(boxSize.z, 2));
        let subMeshCells = Math.ceil(subMeshSize / this.meshSize);
        let subMesh = IMatrix.createMatrixBySizeFrom(subMeshCells, subMeshCells, blankValue);
        let subMeshCenterPos = new Vec2(subMesh.width * this.meshSize / 2, subMesh.height * this.meshSize / 2);
        for (let x = 0; x < subMesh.width; x++) {
            for (let y = 0; y < subMesh.height; y++) {
                let pointPos = new Vec2(this.meshSize / 2 + x * this.meshSize, this.meshSize / 2 + y * this.meshSize);
                pointPos = pointPos.subtract(subMeshCenterPos);
                if (this.getP2RectDis(pointPos, boxSize, angle) < 0) {
                    subMesh.set(x, y, fillValue);
                }
            }
        }
        return [subMesh, colliderCenter];
    }

    readCylinderCollider(collider: CylinderCollider, blankValue: number, fillValue: number): [MapMatrix, Vec3] {
        let colliderCenter = collider.node.getWorldPosition();
        colliderCenter = colliderCenter.transformMat4(this._layerMatrix);
        let rawOffset = new Vec3(collider.center.x * collider.node.scale.x, collider.center.y * collider.node.scale.y, collider.center.z * collider.node.scale.z);
        let colliderOffset = new Vec3();
        Vec3.transformQuat(colliderOffset, rawOffset, collider.node.rotation);
        colliderCenter = colliderCenter.add(colliderOffset);
        let subMeshSize = collider.radius * collider.node.scale.x * 2;
        subMeshSize + this.agentRadius * 2;
        let subMeshCells = Math.ceil(subMeshSize / this.meshSize) + 2;
        let subMesh = IMatrix.createMatrixBySizeFrom(subMeshCells, subMeshCells, blankValue);
        let subMeshCenterPos = new Vec2(subMesh.width * this.meshSize / 2, subMesh.height * this.meshSize / 2);
        for (let x = 0; x < subMesh.width; x++) {
            for (let y = 0; y < subMesh.height; y++) {
                let pointPos = new Vec2(this.meshSize / 2 + x * this.meshSize, this.meshSize / 2 + y * this.meshSize);
                pointPos = pointPos.subtract(subMeshCenterPos);
                if (this.getP2CircleDis(pointPos, collider.radius + this.agentRadius * collider.node.scale.x) < 0) {
                    subMesh.set(x, y, fillValue);
                }
            }
        }
        return [subMesh, colliderCenter];
    }

    getP2RectDis(point: Vec2, rectSize: Vec3, rectAngle: number) {
        point = point.rotate(rectAngle * Math.PI / 180);
        let hDis = Math.abs(point.x) - rectSize.x / 2;
        let vDis = Math.abs(point.y) - rectSize.z / 2;
        if (hDis >= 0 && vDis >= 0) {
            return Math.sqrt(Math.pow(hDis, 2) + Math.pow(vDis, 2));
        } else if (hDis >= 0) {
            return hDis;
        } else if (vDis >= 0) {
            return vDis;
        } else {
            return Math.min(hDis, vDis);
        }
    }

    getP2CircleDis(point: Vec2, radius: number) {
        return point.length() - radius;
    }

    private _mergeV2_ = new Vec2();
    mergeSubMesh(parentMatrix: MapMatrix, subMesh: MapMatrix, centerPos: Vec3) {
        this._mergeV2_.set(centerPos.x, centerPos.z);
        this._mergeV2_.x += parentMatrix.width * this.meshSize / 2;
        this._mergeV2_.y += parentMatrix.height * this.meshSize / 2;
        this._mergeV2_.x -= subMesh.width * this.meshSize / 2;
        this._mergeV2_.x /= this.meshSize;
        if (this._mergeV2_.x % 1 >= 0.5) {
            this._mergeV2_.x = Math.ceil(this._mergeV2_.x);
        } else {
            this._mergeV2_.x = Math.floor(this._mergeV2_.x);
        }
        this._mergeV2_.y -= subMesh.height * this.meshSize / 2;
        this._mergeV2_.y /= this.meshSize;
        if (this._mergeV2_.y % 1 >= 0.5) {
            this._mergeV2_.y = Math.ceil(this._mergeV2_.y);
        } else {
            this._mergeV2_.y = Math.floor(this._mergeV2_.y);
        }
        IMatrixTool.fillBigger(parentMatrix, subMesh, this._mergeV2_);
    }

    clearSubMesh(parentMatrix: MapMatrix, subMesh: MapMatrix, centerPos: Vec3, clearValue: number) {
        this._mergeV2_.set(centerPos.x, centerPos.z);
        this._mergeV2_.x += parentMatrix.width * this.meshSize / 2;
        this._mergeV2_.y += parentMatrix.height * this.meshSize / 2;
        this._mergeV2_.x -= subMesh.width * this.meshSize / 2;
        this._mergeV2_.x /= this.meshSize;
        if (this._mergeV2_.x % 1 >= 0.5) {
            this._mergeV2_.x = Math.ceil(this._mergeV2_.x);
        } else {
            this._mergeV2_.x = Math.floor(this._mergeV2_.x);
        }
        this._mergeV2_.y -= subMesh.height * this.meshSize / 2;
        this._mergeV2_.y /= this.meshSize;
        if (this._mergeV2_.y % 1 >= 0.5) {
            this._mergeV2_.y = Math.ceil(this._mergeV2_.y);
        } else {
            this._mergeV2_.y = Math.floor(this._mergeV2_.y);
        }
        IMatrixTool.clearSubMatrix(parentMatrix, subMesh, this._mergeV2_, clearValue);
    }

    private _tempWPos_ = new Vec3();
    getWorldPosFromMesh(x: number, y: number, out?: Vec2): Vec2 {
        this._tempWPos_.x = this.meshSize / 2 + x * this.meshSize - this.staticMatrix.width * this.meshSize / 2;
        this._tempWPos_.y = 0;
        this._tempWPos_.z = this.meshSize / 2 + y * this.meshSize - this.staticMatrix.height * this.meshSize / 2;
        this._tempWPos_.transformMat4(this.node.worldMatrix);
        if (out) {
            out.set(this._tempWPos_.x, this._tempWPos_.z);
            return out;
        } else {
            return new Vec2(this._tempWPos_.x, this._tempWPos_.z);
        }
    }

    private _wLoc_ = new Vec3();
    getXYFromWorldLocation(worldLocation: Vec3, out?: Vec2) {
        this._wLoc_.set(worldLocation);
        this._wLoc_.transformMat4(this._layerMatrix);
        let x = Math.floor((this._wLoc_.x + this.staticMatrix.width * this.meshSize / 2) / this.meshSize);
        let y = Math.floor((this._wLoc_.z + this.staticMatrix.height * this.meshSize / 2) / this.meshSize);
        if (out) {
            out.set(x, y);
            return out;
        } else {
            return new Vec2(x, y);
        }
    }

    private _tempV2_ = new Vec2();
    isWorldPosAvoidCollide(pos: Vec3): boolean {
        this.getXYFromWorldLocation(pos, this._tempV2_);
        return this.posIndexValide(this._tempV2_) && this.posPass(this._tempV2_);
    }
}
