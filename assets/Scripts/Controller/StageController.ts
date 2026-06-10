import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import Defines, { FarmData } from '../Common/Defines';
import { ChickenFarmController } from './ChickenFarmController';
const { ccclass, property } = _decorator;

@ccclass('StageController')
export class StageController extends Component {

    @property(Node) nContent: Node = null;
    @property(Prefab) preStage: Prefab = null;

    public spawnStage() {
        Defines.Stages.forEach((stageData, index) => {
            let nStage = instantiate(this.preStage)
            if (nStage) {
                nStage.parent = this.nContent
                let stageController = nStage.getComponent(ChickenFarmController)
                if (stageController) {
                    stageController.initFarmData(stageData)
                }
            }
        });
    }
}


