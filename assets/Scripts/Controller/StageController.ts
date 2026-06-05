import { _decorator, Component, instantiate, Node, Prefab, profiler } from 'cc';
import Defines, { FarmData } from '../Common/Defines';
import { ChickenFarmController } from './ChickenFarmController';
const { ccclass, property } = _decorator;

@ccclass('StageController')
export class StageController extends Component {

    @property(Node) nContent: Node = null;
    @property(Prefab) preStage: Prefab = null;

    start() {
        profiler.showStats();
        this.spawnStage()
    }

    public spawnStage() {
        Defines.Stages.forEach((stage, index) => {
            let nStage = instantiate(this.preStage)
            if (nStage) {
                nStage.parent = this.nContent
                let stageController = nStage.getComponent(ChickenFarmController)
                let farmData: FarmData = {
                    id: index + 1,
                    level: 1,
                    unlock: true,
                    maxChicken: 15,
                    chickenSpawnInterval: 1,
                    nextSpawnTime: 5,
                    chickens: 15,
                    incomePerSecond: 5,
                    upgradeCost: 15000
                }
                if (stageController) {
                    stageController.initFarmData(farmData)
                }
            }
        });
    }
}


