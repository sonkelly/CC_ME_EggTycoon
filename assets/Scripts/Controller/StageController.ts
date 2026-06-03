import { _decorator, Component, instantiate, Node, Prefab } from 'cc';
import Defines from '../Common/Defines';
const { ccclass, property } = _decorator;

@ccclass('StageController')
export class StageController extends Component {

    @property(Node) nContent: Node = null;
    @property(Prefab) preStage: Prefab = null;

    start() {
        this.spawnStage()
    }

    public spawnStage() {
        Defines.Stages.forEach(stage => {
            let nStage = instantiate(this.preStage)
            if (nStage) {
                nStage.parent = this.nContent
            }
        });
    }
}


