import { _decorator,  Node, instantiate, resources } from 'cc';
import { ConfigMgr } from '../../../Game/Managers/ConfigMgr';
import { StorgeMgr } from '../../../Game/Managers/StorgeMgr';
import { KnapsackSubPage } from './KnapsackSubPage';
import { StoreItem } from './StoreItem';
const { ccclass, property } = _decorator;

@ccclass('StorePage')
export class StorePage extends KnapsackSubPage {

    @property(Node)
    content: Node = null

    // start() {
    //     this.generateStoreItem()
    // }

    generateStoreItem() {
        for(let item of this.content.children){
            item.destroy()
        }
        let itemList = StorgeMgr.getInstance().storeItemLIst
        let cardConfig = ConfigMgr.getInstance().getDrwaCardConfig().json
        for (let item of itemList) {
            let itemPrefba = instantiate(resources.get("UI/StoreItem"))
            itemPrefba.setParent(this.content)
            let data = cardConfig[item]
            itemPrefba.getComponent(StoreItem).set(data, this)
        }
    }

    putIn(storeItem: StoreItem) {
        storeItem.node.setParent(this.content)
        storeItem.currentPage = this
        storeItem.putAnim()
    }

    getPageName() {
        return "StorePage"
    }

    updateStore(){
        this.generateStoreItem()
    }

    saveStore() {
        StorgeMgr.getInstance().storeItemLIst = []
        console.log(this.content.children)
        for (let item of this.content.children) {
            StorgeMgr.getInstance().storeItemLIst.push(item.getComponent(StoreItem).engName)
        }
        StorgeMgr.getInstance().update()
    }
}
