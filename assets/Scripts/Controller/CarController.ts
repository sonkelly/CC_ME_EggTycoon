import {
    _decorator,
    Component,
    Node,
    tween,
    Vec3
} from 'cc';

import { SaleController } from './SaleController';
import { CarState, PoolType } from '../Common/Defines';
import { SellOrder } from '../models/SellOrder';
import { PoolManager } from '../Pool/PoolManager';

const { ccclass, property } = _decorator;

@ccclass('CarController')
export class CarController extends Component {

    @property
    public moveSpeed = 500;

    private state = CarState.Idle;

    private warehouse: Node = null!;
    private saleTarget: Node = null!;

    private order: SellOrder = null!;

    public initCar(warehouse: Node, saleTarget: Node, order: SellOrder): void {
        this.warehouse = warehouse;
        this.saleTarget = saleTarget;
        this.order = order;
        this.changeState(CarState.MoveToSale);
    }

    private changeState(state: CarState): void {
        this.state = state;
        switch (state) {

            case CarState.MoveToSale:
                this.moveToSale();
                break;
            case CarState.Selling:
                this.selling();
                break;
            case CarState.Complete:
                this.complete();
                break;
        }
    }

    private moveToSale(): void {
        const targetPos = this.saleTarget.worldPosition;
        const distance = Vec3.distance(this.node.worldPosition, targetPos);
        const duration = distance / this.moveSpeed;
        tween(this.node)
            .to(duration, {
                worldPosition: targetPos
            })
            .call(() => {
                this.changeState(CarState.Selling);

            })
            .start();
    }

    private selling(): void {
        SaleController.Instance.sellEgg(this.order.eggAmount);
        this.scheduleOnce(() => {
            this.changeState(CarState.Complete);
        }, 0.3);
    }

    private complete(): void {
        console.error("Car Complete")
        this.recycle();
    }

    private recycle(): void {
        tween(this.node).stop();
        this.unscheduleAllCallbacks();
        this.node.active = false;
        PoolManager.Instance.put(PoolType.Car, this.node);
    }
}