import { _decorator, Component, director, Enum, Node } from 'cc';
import DataManager from './DataManager/DataManager';
import PlatformManager from './Platforms/PlatformManager';
import { GamePlatform } from './Common/Defines';
const { ccclass, property } = _decorator;

@ccclass('InitScene')
export class InitScene extends Component {
    @property({ type: Enum(GamePlatform) }) Platform: GamePlatform = GamePlatform.YANDEX;

    protected onLoad(): void {
        PlatformManager.initPlatform(this.Platform, () => {
            DataManager.initAllData(() => {
                director.loadScene("GamePlay");
            })
        });
    }
}


