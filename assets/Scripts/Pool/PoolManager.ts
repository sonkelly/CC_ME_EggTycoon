import { instantiate, Node, Prefab } from "cc";
import { PoolData } from "./PoolData";

export class PoolManager {

    private static _instance: PoolManager;

    public static get Instance(): PoolManager {

        if (!this._instance) {
            this._instance = new PoolManager();
        }

        return this._instance;
    }

    private pools =
        new Map<string, PoolData>();

    public register(
        key: string,
        prefab: Prefab,
        initCount: number = 0
    ): void {

        if (this.pools.has(key)) {
            return;
        }

        const data =
            new PoolData(prefab);

        for (let i = 0; i < initCount; i++) {

            const node =
                instantiate(prefab);

            data.pool.put(node);
        }

        this.pools.set(key, data);
    }

    public get(
        key: string
    ): Node {

        const data =
            this.pools.get(key);

        if (!data) {
            throw new Error(
                `Pool ${key} not found`
            );
        }

        if (data.pool.size() > 0) {
            return data.pool.get();
        }

        return instantiate(
            data.prefab
        );
    }

    public put(key: string, node: Node): void {

        const data = this.pools.get(key);

        if (!data) {
            node.destroy();
            return;
        }
        data.pool.put(node);
    }
}