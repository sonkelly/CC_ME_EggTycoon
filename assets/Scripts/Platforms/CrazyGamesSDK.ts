import { BaseSDk } from "./BaseSDK";

export class CrazyGamesSDK extends BaseSDk {

    public init(cb: any): void {
        const loadCrazyGamesSDK = () => {
            return new Promise((resolve, reject) => {
                if ((window as any).CrazyGames) {
                    resolve((window as any).CrazyGames.SDK);
                    return;
                }
                const script = document.createElement("script");
                script.src = "https://sdk.crazygames.com/crazygames-sdk-v3.js";
                script.onload = () => resolve((window as any).CrazyGames.SDK);
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        loadCrazyGamesSDK().then((CrazyGamesSDK: any) => {
            CrazyGamesSDK.init().then(() => {
                console.log("✅ CrazyGames SDK v3 đã sẵn sàng!");
                this.SDK = CrazyGamesSDK;
                cb && cb(this);
            }).catch((error: any) => {
            });
        }).catch((error: any) => {
        })
    }

    showInterstitialAds(callbacks) {
        this.SDK.ad.requestAd("midgame", {
            adStarted: () => callbacks.onOpen?.(),
            adFinished: () => callbacks.onClose?.(),
            adError: (error, errorData) => callbacks.onError?.(),
        })
    }

    showRewardedAds(callbacks) {
        this.SDK.ad.requestAd("rewarded", {
            adStarted: () => callbacks.onOpen?.(),
            adFinished: () => {
                callbacks.onRewarded?.();
                callbacks.onClose?.();
            },
            adError: (error, errorData) => callbacks.onError?.(),
        });
    }
}
