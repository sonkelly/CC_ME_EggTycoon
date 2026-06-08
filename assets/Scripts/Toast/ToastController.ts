import {
    _decorator,
    Component,
    tween,
    Vec3,
    UIOpacity
} from 'cc';

import { PoolManager } from '../Pool/PoolManager';
import { PoolType } from '../Common/Defines';

const { ccclass } = _decorator;

@ccclass('ToastController')
export class ToastController extends Component {

    protected poolType: PoolType;

    public play(): void {

        const opacity = this.getComponent(UIOpacity);

        opacity.opacity = 255;

        const startPos = this.node.position.clone();

        const endPos = startPos.clone();

        endPos.y += 80;

        tween(this.node)
            .parallel(

                tween()
                    .to(1, {
                        position: endPos
                    }),

                tween(opacity)
                    .to(1, {
                        opacity: 0
                    })
            )
            .call(() => {

                this.recycle();

            })
            .start();
    }

    protected recycle(): void {
        PoolManager.Instance.put(this.poolType, this.node);
    }
}