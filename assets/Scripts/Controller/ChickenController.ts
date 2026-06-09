import { _decorator, Component, Node, Vec3, tween, randomRange } from 'cc';
import { ChickenFarmController } from './ChickenFarmController';

const { ccclass, property } = _decorator;

enum ChickenState { Idle, GoToWater, Drink, GoToNest, LayEgg, }

@ccclass('ChickenController')
export class ChickenController extends Component {

    waterPoint: Node = null!;
    nestPoint: Node = null!;
    SPEED = 160;


    private state: ChickenState = ChickenState.Idle;
    private farmController: ChickenFarmController = null;

    private isBusy = false;

    initChicken(waterPoint, nestPoint, farmController) {
        this.waterPoint = waterPoint
        this.nestPoint = nestPoint
        this.farmController = farmController
        this.changeState(ChickenState.GoToWater);
    }

    private changeState(state: ChickenState): void {

        this.state = state;

        switch (state) {

            case ChickenState.GoToWater:
                this.goToWater();
                break;

            case ChickenState.Drink:
                this.drink();
                break;

            case ChickenState.GoToNest:
                this.goToNest();
                break;

            case ChickenState.LayEgg:
                this.layEgg();
                break;
        }
    }

    // ---------------------
    // GO WATER
    // ---------------------

    private goToWater(): void {

        if (this.isBusy) return;

        this.isBusy = true;

        const pos = this.randomAround(this.waterPoint.worldPosition, 30, 30);

        this.moveTo(pos, () => {
            this.isBusy = false;
            this.changeState(ChickenState.Drink);
        });
    }

    // ---------------------
    // DRINK
    // ---------------------

    private drink(): void {

        this.scheduleOnce(() => {
            this.changeState(ChickenState.GoToNest);

        }, randomRange(1, 2));
    }

    // ---------------------
    // GO NEST
    // ---------------------

    private goToNest(): void {
        if (this.isBusy) return;
        this.isBusy = true;
        const pos = this.randomAround(this.nestPoint.worldPosition, 20, -10);

        this.moveTo(pos, () => {
            this.isBusy = false;
            this.changeState(ChickenState.LayEgg);
        });
    }

    // ---------------------
    // LAY EGG
    // ---------------------

    private layEgg(): void {

        this.scheduleOnce(() => {

            this.spawnEgg();

            this.changeState(
                ChickenState.GoToWater
            );

        }, randomRange(2, 4));
    }

    // ---------------------
    // MOVE
    // ---------------------

    private moveTo(worldPos: Vec3, complete?: Function): void {

        const localPos = this.node.parent.inverseTransformPoint(new Vec3(), worldPos);
        const distance = Vec3.distance(this.node.position, localPos);
        // const duration = distance / this.SPEED;
        const duration = 5;
        this.flip(localPos);
        tween(this.node)
            .to(duration, {
                position: localPos
            })
            .call(() => {
                complete?.();
            })
            .start();
    }

    private flip(target: Vec3): void {

        const scale = this.node.scale.clone();

        if (target.x > this.node.position.x) {
            scale.x = -Math.abs(scale.x);
        } else {
            scale.x = Math.abs(scale.x);
        }

        this.node.setScale(scale);
    }

    // ---------------------
    // EGG
    // ---------------------

    private spawnEgg(): void {
        console.log("Spawn Egg");
        this.farmController.onChickenLayEgg(1)
        // TODO:
        // FarmController.addEgg(1)
    }

    // ---------------------
    // RANDOM POS
    // ---------------------

    private randomAround(center: Vec3, radius: number, width: number): Vec3 {
        return new Vec3(center.x - width / 2, center.y + randomRange(-radius, radius), center.z);

        return new Vec3(
            center.x + randomRange(-radius, radius),
            center.y + randomRange(-radius, radius),
            center.z
        );
    }
}