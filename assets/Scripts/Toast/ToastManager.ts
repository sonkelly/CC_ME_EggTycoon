import { _decorator, Component, Node, Vec3 } from 'cc';

import { PoolManager } from '../Pool/PoolManager';
import { ToastEggController } from './ToastEggController';
import { ToastMoneyController } from './ToastMoneyController';
import { PoolType } from '../Common/Defines';

const { ccclass, property } = _decorator;

@ccclass('ToastManager')
export class ToastManager extends Component {

    @property(Node) toastRoot: Node = null!;

    private static _instance: ToastManager;

    public static get Instance(): ToastManager {
        return this._instance;
    }

    protected onLoad(): void {
        ToastManager._instance = this;
    }

    public showEgg(amount: number, worldPos: Vec3): void {
        const node = PoolManager.Instance.get(PoolType.ToastEgg);
        node.parent = this.toastRoot;
        node.setWorldPosition(worldPos);
        node.getComponent(ToastEggController).show(amount);
    }

    public showMoney(amount: number, worldPos: Vec3): void {
        const node = PoolManager.Instance.get(PoolType.ToastMoney);
        node.parent = this.toastRoot;
        node.setWorldPosition(worldPos);
        node.getComponent(ToastMoneyController).show(amount);
    }
}