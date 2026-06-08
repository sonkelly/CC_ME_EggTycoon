import { _decorator, Color, Label } from 'cc';

import { ToastController } from './ToastController';
import { PoolType } from '../Common/Defines';

const { ccclass, property } = _decorator;

@ccclass('ToastMoneyController')
export class ToastMoneyController
    extends ToastController {

    @property(Label) lbValue: Label = null;

    protected poolType = PoolType.ToastMoney;

    public show(amount: number): void {
        if (amount >= 0) {
            this.lbValue.string = `+$${amount}`;
        } else {
            this.lbValue.string = `-$${Math.abs(amount)}`;
        }
        
        this.play();
    }
}