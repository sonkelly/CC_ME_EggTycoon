import { _decorator, Component, sys, view } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class ScaleAdapter extends Component {
    designWidth: number = 1080;

    @property() magicScale: number = 1;

    private origScale;

    onLoad() {
        this.origScale = this.node.scale;
    }

    onEnable() {
        this.refresh();
        view.on('canvas-resize', this.refresh, this);
    }

    onDisable() {
        view.off('canvas-resize', this.refresh, this);
    }

    refresh() {
        const visibleSize = view.getVisibleSize();
        const visibleWidth = visibleSize.width;

        if (visibleWidth < this.designWidth) {
            let scale = visibleWidth / this.designWidth;
            scale *= this.magicScale;
            this.node.setScale(scale, scale);
        } else {
            //alway fit
            if (sys.isMobile) {
                let scale = visibleWidth / this.designWidth;
                scale *= this.magicScale;
                this.node.setScale(scale, scale);
            } else {
                this.node.setScale(this.origScale);
            }
        }
    }
}

