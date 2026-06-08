import { _decorator, Animation, Component, Label, Node, tween, Vec3 } from 'cc';
import Defines, { FarmData, PoolType } from '../Common/Defines';
import { ChickenController } from './ChickenController';
import { WarehouseController } from './WarehouseController';
import { PoolManager } from '../Pool/PoolManager';
import { ToastManager } from '../Toast/ToastManager';
const { ccclass, property } = _decorator;



@ccclass('ChickenFarmController')
export class ChickenFarmController extends Component {

    @property(Node) waterPoint: Node = null!;
    @property(Node) nestPoint: Node = null!;

    @property(Node) eggNest: Node = null!;
    @property(Node) chickenRoot: Node = null!;
    @property(Label) lbTitle: Label = null!;

    @property(Animation) animTransferEgg: Animation = null!;

    private farmData: FarmData = null!;
    private chickenList: ChickenController[] = [];
    private farmEggStorage = 0;



    public initFarmData(data: FarmData): void {
        this.farmData = data;
        this.lbTitle.string = this.farmData.id.toString();
        // this.loadChickens();
    }

    private loadChickens(): void {
        this.clearAllChicken();
        for (let i = 0; i < this.farmData.chickens; i++) {
            const node = PoolManager.Instance.get(PoolType.Chicken)
            node.parent = this.node;
            const chicken = node.getComponent(ChickenController);
            chicken.initChicken(this.waterPoint, this.nestPoint, this);
            this.chickenList.push(chicken);
        }
    }

    public onChickenLayEgg(amount: number): void {
        ToastManager.Instance.showEgg(amount, this.nestPoint.worldPosition)
        this.farmEggStorage += amount;
        if (this.farmEggStorage >= Defines.GameDefine.FARM_MAX_EGG) {
            this.transportEggToWarehouse();
        }
    }

    private transportEggToWarehouse(): void {
        if (this.farmEggStorage <= 0) {
            return;
        }
        this.animTransferEgg.play();
        console.log("Transport Egg");
        WarehouseController.Instance.receiveEgg(this.farmEggStorage);
        this.farmEggStorage = 0;
    }

    private clearAllChicken(): void {
        this.chickenList.forEach(v => { v.node.destroy(); });
        this.chickenList.length = 0;
    }

    public eggNestOnClick() {
        this.spawnChicken()
    }

    private flyToFarmCenter(chickenNode: Node): void {
        const start = chickenNode.position.clone();
        const end = this.getRandomSpawnPos();
        const jumpHeight = 150;
        tween({ t: 0 })
            .to(
                0.8,
                { t: 1 },
                {
                    onUpdate: (obj) => {
                        const t = obj.t;
                        const x = start.x + (end.x - start.x) * t;
                        const y = start.y + (end.y - start.y) * t + Math.sin(t * Math.PI) * jumpHeight;
                        chickenNode.setPosition(x, y);
                    }
                }
            )
            .call(() => {
                const chicken = chickenNode.getComponent(ChickenController);
                // chicken.startAI();
                chicken.initChicken(this.waterPoint, this.nestPoint, this)
            })
            .start();
    }

    private getRandomSpawnPos(): Vec3 {
        return new Vec3(-120 + Math.random() * 240, -40 + Math.random() * 80, 0);
    }

    public spawnChicken(): void {
        const chickenNode = PoolManager.Instance.get(PoolType.Chicken);
        chickenNode.parent = this.node;
        chickenNode.active = true;
        // spawn tại quả trứng
        chickenNode.setWorldPosition(this.eggNest.worldPosition);
        // bay vào giữa chuồng
        this.flyToFarmCenter(chickenNode);
    }
}

