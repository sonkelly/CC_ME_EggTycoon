import { _decorator } from 'cc';
export const FARM_UNLOCK_COST = [0, 35000000, 80000000, 180000000, 400000000, 900000000, 2000000000, 4500000000, 10000000000, 22000000000];
export const FARM_UNLOCK_LEVEL = [0, 5, 15, 20, 25, 30, 35, 40, 45, 55, 60];
export const FARM_UNLOCK_TIME = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

export default class Defines {
    public static GameDefine = {
        LEVEL_ACTIVE_BOOST: 1,
        FARM_MAX_EGG: 20,
        EGG_PRICE: 5,
        TIME_SPAWN_CAR: 3,
        TIME_CAR_TO_SALE: 5,
        TIME_CHICKEN_MOVE: 3
    };

    public static Stages = [
        {
            id: 1,
            name: "Stage 1",
            level: 0,
            specialSlot: 15,
            unlockCost: 0,
            timeUnlock: 0
        },
        {
            id: 2,
            name: "Stage 2",
            level: 5,
            specialSlot: 15,
            unlockCost: 35000000,
            timeUnlock: 0.5
        },
        {
            id: 3,
            name: "Stage 3",
            level: 10,
            specialSlot: 15,
            unlockCost: 80000000,
            timeUnlock: 1
        },
        {
            id: 4,
            name: "Stage 4",
            level: 15,
            specialSlot: 15,
            unlockCost: 180000000,
            timeUnlock: 1.5
        },
        {
            id: 5,
            name: "Stage 5",
            level: 20,
            specialSlot: 15,
            unlockCost: 400000000,
            timeUnlock: 2
        },
        {
            id: 6,
            name: "Stage 6",
            level: 25,
            specialSlot: 15,
            unlockCost: 900000000,
            timeUnlock: 2.5
        },
        {
            id: 7,
            name: "Stage 7",
            level: 30,
            specialSlot: 15,
            unlockCost: 2000000000,
            timeUnlock: 3
        },
        {
            id: 8,
            name: "Stage 8",
            level: 35,
            specialSlot: 15,
            unlockCost: 4500000000,
            timeUnlock: 3.5
        },
        {
            id: 9,
            name: "Stage 9",
            level: 40,
            specialSlot: 15,
            unlockCost: 10000000000,
            timeUnlock: 4
        },
        {
            id: 10,
            name: "Stage 10",
            level: 45,
            specialSlot: 15,
            unlockCost: 22000000000,
            timeUnlock: 4.5
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
    name: string;
    level: number;
    specialSlot: number;
    unlockCost: number;
    timeUnlock: number;
}

export interface FarmDataSave {
    id: number;
    current_level: number;
    current_slot: number;
    current_star: number;
    current_chicken_star: boolean;
    current_egg: number;
}

export interface PlayerFarmData {
    farms: FarmData[];
}


export enum CarState {
    Idle,
    MoveToSale,
    Selling,
    Complete
}


export enum PoolType {
    Chicken = "Chicken",
    Car = "Car",
    Egg = "Egg",
    Coin = "Coin",
    Fx = "Fx",
    ToastEgg = "ToastEgg",
    ToastMoney = "ToastMoney"
}
