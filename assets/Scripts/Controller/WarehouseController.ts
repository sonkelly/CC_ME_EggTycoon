import { _decorator, Component, Node, Prefab, instantiate, Label } from 'cc';
import { WarehouseModel } from '../models/WarehouseModel';
import { SellOrder } from '../models/SellOrder';
import { CarController } from './CarController';
import { PoolManager } from '../Pool/PoolManager';
import Defines, { PoolType } from '../Common/Defines';

const { ccclass, property } = _decorator;

@ccclass('WarehouseController')
export class WarehouseController extends Component {
    protected static _instance: any = null;

    public static get Instance(): any {
        if (!this._instance) {
            throw new Error(
                `[Singleton] ${this.name} has not been initialized.`
            );
        }
        return this._instance;
    }

    protected onLoad(): void {
        WarehouseController._instance = this;
        this.schedule(this.spawnCar, Defines.GameDefine.TIME_SPAWN_CAR);
    }

    @property(Node) public warehouse: Node = null!;
    @property(Node) public saleTarget: Node = null!;
    @property(Node) public toastMoneyTarget: Node = null!;
    @property(Label) public lbCountEgg: Label = null!;

    @property public spawnInterval = 2;

    private model = new WarehouseModel();

    public setCountEgg(): void {
        this.lbCountEgg.string = this.model.getEggCount().toString();
    }

    public receiveEgg(amount: number): void {
        this.model.addEgg(amount);
        this.setCountEgg();
    }

    private spawnCar(): void {
        const eggCount = this.model.getEggCount();
        this.model.removeEgg(eggCount);
        this.setCountEgg();

        const order = new SellOrder(eggCount);
        const carNode = PoolManager.Instance.get(PoolType.Car);

        carNode.parent = this.node;
        carNode.active = true;
        carNode.setWorldPosition(this.warehouse.worldPosition);

        const car = carNode.getComponent(CarController);

        if (!car) return;
        car.initCar(this.warehouse, this.saleTarget, order, this.toastMoneyTarget);
    }

    public getEggCount(): number {
        return this.model.getEggCount();
    }

}