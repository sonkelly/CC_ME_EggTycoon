import { _decorator, Label } from 'cc';

import { ToastController } from './ToastController';
import { PoolType } from '../Common/Defines';

const { ccclass, property } = _decorator;

@ccclass('ToastEggController')
export class ToastEggController extends ToastController {

    @property(Label) lbValue: Label = null;

    protected poolType = PoolType.ToastEgg;

    public show(amount: number): void {
        this.lbValue.string = `+${amount} Egg`;
        this.play();
    }
}