import { _decorator, Component, tween, UIOpacity, randomRange } from 'cc';

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
        startPos.x += randomRange(-50, 50);

        this.node.setPosition(startPos);


        const endPos = startPos.clone();

        endPos.y += 80;

        tween(this.node)
            .parallel(

                tween()
                    .to(2, {
                        position: endPos
                    }),

                // tween(opacity)
                //     .to(2, {
                //         opacity: 0
                //     })
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