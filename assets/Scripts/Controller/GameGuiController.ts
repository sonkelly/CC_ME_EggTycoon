import { _decorator, Component, Label, Node } from 'cc';
import Defines from '../Common/Defines';
import PlayerData from '../DataManager/PlayerData';
const { ccclass, property } = _decorator;

@ccclass('GameGuiController')
export class GameGuiController extends Component    {
    @property(Node) nBoostStart: Node = null;

    @property(Label) lbLevel: Label = null;

    protected onLoad(): void {
        this.initGuiData()
    }

    public initGuiData(): void {
        this.lbLevel.string = PlayerData.getLevel().toString()
        this.nBoostStart.active = PlayerData.getLevel() >= Defines.GameDefine.LEVEL_ACTIVE_BOOST
    }
}


