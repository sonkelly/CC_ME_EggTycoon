import Defines from "../Common/Defines";
import PlayerData from "../DataManager/PlayerData";

export class SaleController {

    private static _instance: SaleController;

    public static get Instance(): SaleController {

        if (!this._instance) {
            this._instance = new SaleController();
        }

        return this._instance;
    }


    public sellEgg(amount: number): number {
        const income = amount * Defines.GameDefine.EGG_PRICE;
        PlayerData.addCoin(income)
        return income;
    }
}