import { EventManager } from "../Exts/EventManager";

export class SaleController {

    private static _instance: SaleController;

    public static get Instance(): SaleController {

        if (!this._instance) {
            this._instance = new SaleController();
        }

        return this._instance;
    }

    private gold = 0;

    private eggPrice = 5;

    public sellEgg(amount: number): void {

        const income =
            amount * this.eggPrice;

        this.gold += income;

        EventManager.emit(
            "UPDATE_GOLD",
            this.gold
        );
    }

    public getGold(): number {
        return this.gold;
    }
}