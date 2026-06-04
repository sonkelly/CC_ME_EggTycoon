import { _decorator } from 'cc';
export default class Defines {
    public static gameSpeed = 97;
    public static Stages = [
        {
            name: "Stage 1",
            level: 1,
            specialSlot: 10,
            unlockCost: 50000
        },
        {
            name: "Stage 2",
            level: 1,
            specialSlot: 10,
            unlockCost: 50000
        },
        {
            name: "Stage 2",
            level: 1,
            specialSlot: 10,
            unlockCost: 50000
        },
        {
            name: "Stage 2",
            level: 1,
            specialSlot: 10,
            unlockCost: 50000
        },
        {
            name: "Stage 2",
            level: 1,
            specialSlot: 10,
            unlockCost: 50000
        }
    ]
}

export enum GamePlatform {
    YANDEX = 0,
    POKI = 1,
    CRAZYGAMES = 2,
    COOLMATHGAMES = 3,
    Y8 = 4,
    GAMEDISTRIBUTION = 5,
    FACEBOOK = 6,
    LOCAL = 7
}

export interface ChickenConfig {
    id: number;
    level: number;

    moveSpeed: number;

    eggInterval: number;      // thời gian đẻ 1 trứng
    eggValue: number;         // giá trị 1 trứng

    lifeTime?: number;
}

export interface ChickenData {
    uid: string;

    configId: number;

    x: number;
    y: number;

    bornTime: number;

    nextEggTime: number;
}

export interface FarmData {
    id: number;

    level: number;

    unlock: boolean;

    maxChicken: number;

    chickenSpawnInterval: number;

    nextSpawnTime: number;

    chickens: number

    incomePerSecond: number;

    upgradeCost: number;
}

export interface PlayerFarmData {
    farms: FarmData[];
}

