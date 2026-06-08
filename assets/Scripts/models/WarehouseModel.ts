export class WarehouseModel {

    private eggCount = 0;

    public addEgg(amount: number): void {
        this.eggCount += amount;
    }

    public removeEgg(amount: number): boolean {

        if (this.eggCount < amount) {
            return false;
        }

        this.eggCount -= amount;
        return true;
    }

    public getEggCount(): number {
        return this.eggCount;
    }
}