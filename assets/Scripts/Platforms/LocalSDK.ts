import { BaseSDk } from "./BaseSDK";

export class LocalSDK extends BaseSDk {
    public init(cb: any): void {
        cb && cb(this);
    }

    showInterstitialAds(callbacks) {
        setTimeout(function () {
            callbacks.onOpen?.();
            callbacks.onClose?.();
        }, 500);
        return;
    }

    showRewardedAds(callbacks) {
        setTimeout(function () {
            callbacks.onOpen?.();
            callbacks.onRewarded?.();
            callbacks.onClose?.();
        }, 1000);

    }

    sampleEntry = {
        score: 900009,
        extraData: '',
        rank: '',
        player: {
            getAvatarSrc: () => { return '' },
            publicName: '',
            uniqueID: ''
        }
    }

    public async getTopPlayers(): Promise<any> {
        try {
            let entries = [];
            for (let i = 0; i < 10; i++) {
                let data = { ...this.sampleEntry };
                data.score = data.score - (i * 100001);
                entries.push(data);
            }
            return entries;
        } catch (error) {
            return [];
        }
    }
}