// Learn TypeScript:
import { _decorator, Component, Node } from 'cc';
import { KnapsackPage } from './KnapsackPage';
import { StoreItem } from './StoreItem';
const { ccclass, property } = _decorator;

@ccclass('KnapsackSubPage')
export class KnapsackSubPage extends Component {

    public kanpsackPage: KnapsackPage = null

    init(kanpsackPage: KnapsackPage) {
        this.kanpsackPage = kanpsackPage
    }

    getAblePutPage(): KnapsackSubPage {
        return this.kanpsackPage.getAblePutPage(this)
    }

    putIn(storeItem:StoreItem) {

    }

    getPageName() {
        return ""
    }

}
