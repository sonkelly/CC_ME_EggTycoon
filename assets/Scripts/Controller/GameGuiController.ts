import { _decorator, Component, Label, Node } from 'cc';
import Defines from '../Common/Defines';
import PlayerData from '../DataManager/PlayerData';
import { EventManager } from '../Exts/EventManager';
const { ccclass, property } = _decorator;

@ccclass('GameGuiController')
export class GameGuiController extends Component {
    @property(Node) nBoostStart: Node = null;
    @property(Label) lbLevel: Label = null;
    @property(Label) lbCoin: Label = null;

    protected onLoad(): void {
        this.initGuiData()
        EventManager.on("UPDATE_GOLD", this.updateCoin.bind(this));
    }

    private updateCoin() {
        this.setCoin();
    }

    public setCoin(): void {
        this.lbCoin.string = PlayerData.getCoin().toString()
    }

    public initGuiData(): void {
        this.lbLevel.string = PlayerData.getLevel().toString()
        this.nBoostStart.active = PlayerData.getLevel() >= Defines.GameDefine.LEVEL_ACTIVE_BOOST
        this.setCoin();
    }
}


