import { NodePool, Prefab } from "cc";

export class PoolData {

    public prefab: Prefab;

    public pool: NodePool;

    constructor(prefab: Prefab) {

        this.prefab = prefab;
        this.pool = new NodePool();
    }
}