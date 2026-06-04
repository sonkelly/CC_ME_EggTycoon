import { _decorator, Component, instantiate, Node, Prefab, randomRange, tween, Vec3 } from 'cc';
import { FarmData } from '../Common/Defines';
import { ChickenController } from './ChickenController';
const { ccclass, property } = _decorator;



@ccclass('ChickenFarmController')
export class ChickenFarmController extends Component {

    @property(Prefab) preChicken: Prefab = null!;
    @property(Node) waterPoint: Node = null!;
    @property(Node) nestPoint: Node = null!;

    @property(Node) eggNest: Node = null!;
    @property(Node) chickenRoot: Node = null!;

    private farmData: FarmData = null!;
    private chickenList: ChickenController[] = [];

    public initFarmData(data: FarmData): void {
        // this.farmData = data;
        this.farmData = {
            id: 1,
            level: 1,
            unlock: true,
            maxChicken: 15,
            chickenSpawnInterval: 5,
            nextSpawnTime: 5,
            chickens: 15,
            incomePerSecond: 5,
            upgradeCost: 15000,
        }
        // this.loadChickens();
    }

    private loadChickens(): void {
        this.clearAllChicken();
        for (let i = 0; i < this.farmData.chickens; i++) {
            const node = instantiate(this.preChicken);
            node.parent = this.node;
            const chicken = node.getComponent(ChickenController);
            chicken.init(this.waterPoint, this.nestPoint);
            this.chickenList.push(chicken);
        }
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
                chicken.init(this.waterPoint, this.nestPoint)
            })
            .start();
    }

    private getRandomSpawnPos(): Vec3 {
        return new Vec3(-120 + Math.random() * 240, -40 + Math.random() * 80, 0);
    }

    public spawnChicken(): void {
        const chickenNode = instantiate(this.preChicken);
        chickenNode.parent = this.node;
        // spawn tại quả trứng
        chickenNode.setWorldPosition(this.eggNest.worldPosition);
        // bay vào giữa chuồng
        this.flyToFarmCenter(chickenNode);
    }
}

