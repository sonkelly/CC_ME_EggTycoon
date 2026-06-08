import { _decorator, Component, Node, Prefab } from 'cc';
import { PoolManager } from '../Pool/PoolManager';
import { PoolType } from '../Common/Defines';
import { StageController } from './StageController';
const { ccclass, property } = _decorator;

@ccclass('MainGameController')
export class MainGameController extends Component {
    @property(Prefab) preChicken: Prefab = null!;
    @property(Prefab) preCar: Prefab = null!;
    @property(Prefab) preToastEgg: Prefab = null!;
    @property(Prefab) preToastMoney: Prefab = null!;

    @property(StageController) stageController: StageController = null!;

    protected onLoad(): void {
        this.initGame();
    }

    public initGame(): void {
        PoolManager.Instance.register(PoolType.Car, this.preCar, 20);
        PoolManager.Instance.register(PoolType.Chicken, this.preChicken, 100);

        PoolManager.Instance.register(PoolType.ToastEgg, this.preToastEgg, 100);
        PoolManager.Instance.register(PoolType.ToastMoney, this.preToastMoney, 100);


        // Init pooling done
        this.stageController.spawnStage();
    }
}


