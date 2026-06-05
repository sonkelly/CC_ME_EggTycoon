import { _decorator, Component, Label, Node } from 'cc';
import DataManager from '../Common/DataManager';
import Defines from '../Common/Defines';
const { ccclass, property } = _decorator;

@ccclass('GameGuiController')
export class GameGuiController extends Component {
    @property(Node) nBoostStart: Node = null;

    @property(Label) lbLevel: Label = null;

    protected onLoad(): void {
        this.initGuiData()
    }

    public initGuiData(): void {
        this.lbLevel.string = DataManager.getLevel().toString()
        this.nBoostStart.active = DataManager.getLevel() >= Defines.GameDefine.LEVEL_ACTIVE_BOOST
    }
}


