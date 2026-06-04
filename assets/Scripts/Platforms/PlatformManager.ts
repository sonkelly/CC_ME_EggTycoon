import { sys } from "cc";
import { YandexSDK } from "../Platforms/YandexSDK";
import { CrazyGamesSDK } from "../Platforms/CrazyGamesSDK";
import { GameDistributionSDK } from "../Platforms/GameDistributionSDK";
import { PokiSDK } from "../Platforms/PokiSDK";
import { Y8SDK } from "../Platforms/Y8SDK";
import { LocalSDK } from "../Platforms/LocalSDK";
import { GamePlatform } from "../Common/Defines";

declare const ysdk: any;
const AdsConfig = {
    timeLimitShowBanner: 30000,
    timeLimitShowAds: 60000,
};

var PlatformManager = {
    SDK: null,
    type: -1,

    hasBannerAds: 0,
    allowShowFirstAds: false,
    showFistAds: false,
    loadedInterstitials: 0,
    loadedRewars: 0,
    lastShowAdsTime: 0,
    lastShowRewardTime: 0,
    _interstitialLevel: 0,
    _rewardedLevel: 0,

    initPlatform(type, cb: Function): void {
        let initSDKComplete = function (sdk) {
            PlatformManager.setAdsPlatform(sdk, type);
            cb?.();
        }

        let sdk = null;
        switch (type) {
            case GamePlatform.YANDEX:
                sdk = new YandexSDK();
                break;
            case GamePlatform.CRAZYGAMES:
                sdk = new CrazyGamesSDK();
                break;
            case GamePlatform.GAMEDISTRIBUTION:
                sdk = new GameDistributionSDK();
                break;
            case GamePlatform.POKI:
                sdk = new PokiSDK();
                break;
            case GamePlatform.Y8:
                sdk = new Y8SDK();
                break;
            case GamePlatform.COOLMATHGAMES:
                break;
            case GamePlatform.FACEBOOK:
                break;
            case GamePlatform.LOCAL:
                sdk = new LocalSDK();
                break;
        }

        sdk.init(initSDKComplete);
    },

    setAdsPlatform: function (sdk, type) {
        PlatformManager.SDK = sdk;
        PlatformManager.type = type;
    },

    getPlatformType: function () {
        return PlatformManager.type;
    },

    // BANNER
    isDisplayBanner: function () { // for setup UI game
        return false;
    },
    canShowBanner: function () {
        if ((!PlatformManager.hasBannerAds || PlatformManager.hasBannerAds + AdsConfig.timeLimitShowBanner < new Date().getTime())) {
            return true;
        }
        return false;
    },
    interBanner: 0,
    showBanner(cb: any = null, cberr: any = null) {

    },
    hideBannerAds(cb) {
        ysdk.adv.hideBannerAdv();
        if (cb) {
            cb();
        }
    },
    _currentCrossBanner: {
        home: null,
        game: null
    },
    loadCrossBanner() {

    },
    hideCrossBanner() {

    },
    handleBanner(callback: any = null) {
        if (PlatformManager.SDK.hasPlatform()) {
            ysdk.adv.getBannerAdvStatus().then(({ stickyAdvIsShowing, reason }) => {
                if (stickyAdvIsShowing) {
                    // ad is shown
                    callback(true);
                } else if (reason) {
                    // ad isn't shown
                    console.log(reason);
                    callback(false);
                } else {
                    ysdk.adv.showBannerAdv();
                    if (callback) {
                        callback(true);
                    }

                }
            })
        }
    },

    // INTERTIAL
    interTial: 0,
    attempLoadTial: 0,
    tryPreloadInterTime: [2000, 5000, 10000, 20000],
    isLoadingIntertial: false,
    preloadInterstitial: function (cb: any = null, cberr: any = null, trying = false) {

    },
    canShowInterstitial: function () {
        if (!PlatformManager.SDK.hasPlatform()) return false;

        var currentTime = new Date().getTime();
        if (PlatformManager.lastShowAdsTime <= currentTime) {
            return true;
        } else {
            return false;
        }
    },

    hasInterstitial: function () {
        return PlatformManager.loadedInterstitials > 0;
    },

    showInterstitial: function (callback) {
        // PopupController.instance.showVideoAdsLoading();
        // SFXController.instance.pauseAllSFX();
        if (PlatformManager.canShowInterstitial()) {
            PlatformManager.onShowing = true;
            const callbacks = {
                onOpen: () => {
                    PlatformManager.onShowing = true;
                    // PopupController.instance.hideVideoAdsLoading();
                },
                onClose: () => {
                    PlatformManager.onShowing = false;
                    // PopupController.instance.hideVideoAdsLoading();
                    PlatformManager.lastShowAdsTime = new Date().getTime() + AdsConfig.timeLimitShowAds;
                    if (callback) {
                        callback(true);
                    }
                },
                onError: () => {
                    // PopupController.instance.hideVideoAdsLoading();
                    PlatformManager.onShowing = false;
                    if (callback) {
                        callback(false);
                    }
                }
            }
            PlatformManager.SDK.showInterstitialAds(callbacks);
        } else {
            // PopupController.instance.hideVideoAdsLoading();
            callback?.(false);
        }


    },

    // REWARD

    interReward: 0,
    attempLoadReward: 0,
    tryPreloadRewardTime: [2000, 5000, 10000, 20000],
    isLoadingReward: false,

    onShowing: false,
    _onRewarded: false,

    preloadReward: function (cb: any = null, cberr: any = null, trying = false) {

    },

    hasReward: function () {
        return PlatformManager.loadedRewars > 0;
    },

    canShowReward: function () {
        if (!PlatformManager.SDK.hasPlatform()) return false;
        var currentTime = new Date().getTime();
        if (PlatformManager.lastShowRewardTime <= currentTime) {
            return true;
        } else {
            return false;
        }
    },

    showRewarded: function (callback: any = null) {
        PlatformManager._onRewarded = false; // set true on open ads callback
        // PopupController.instance.showVideoAdsLoading();

        // if (!PlatformManager.canShowReward()) {
        //     PlatformManager.onShowing = true;
        //     setTimeout(function () {
        //         PopupController.instance.hideVideoAdsLoading();
        //         PlatformManager.onShowing = false;
        //         PlatformManager.lastShowRewardTime = new Date().getTime() + AdsConfig.timeLimitShowAds;
        //         callback?.(true);
        //     }, 3000);
        //     return;
        // }
        PlatformManager.onShowing = true;
        // SFXController.instance.pauseAllSFX();

        // call show
        const callbacks = {
            onOpen: () => {
                // PopupController.instance.hideVideoAdsLoading();
            },
            onRewarded: () => {
                PlatformManager._onRewarded = true;
            },
            onClose: () => {
                PlatformManager.onShowing = false;
                // PopupController.instance.hideVideoAdsLoading();
                if (PlatformManager._onRewarded) {
                    PlatformManager.lastShowAdsTime = new Date().getTime() + 10 * 1000;
                    PlatformManager.lastShowRewardTime = new Date().getTime() + AdsConfig.timeLimitShowAds;
                    callback?.(true);
                } else {
                    callback?.(false);
                }
            },
            onError: () => {
                // PopupController.instance.hideVideoAdsLoading();
                PlatformManager.onShowing = false;
                callback?.(false);
            }
        }
        PlatformManager.SDK.showRewardedAds(callbacks);
    },

    FireGameReady(): void {
        PlatformManager.SDK.fireGameReady();
    },
    UpdatePlayerScore(score: number): void {
        PlatformManager.SDK.updatePlayerScore(score);
    },
    GameplayAPIStart(): void {
        PlatformManager.SDK.gameplayAPIStart();
    },
    GameplayAPIStop(): void {
        PlatformManager.SDK.gameplayAPIStop();
    },
    CheckShowShortcut() {
        let logShowShortcut = function () {
            sys.localStorage.setItem("PTShowShortcuted", 1);
        }

        let isShowed = sys.localStorage.getItem("PTShowShortcuted", 0);
        if (isShowed == 1) return;
        PlatformManager.SDK.checkShowShortcut(logShowShortcut);
    },

    CheckShowRating() {
        let logShowRating = function () {
            sys.localStorage.setItem("PTShowRating", 1);
        }

        let isShowed = sys.localStorage.getItem("PTShowRating", 0);
        if (isShowed == 1) return;
        PlatformManager.SDK.checkShowRating().then((canCreate) => {
            if (canCreate) {
                PlatformManager.SDK.showGameRating(logShowRating);
            }
        });
    },

    async GetDataLeaderboard(): Promise<any[]> {
        if (!PlatformManager.SDK) return [];
        try {
            const ranks = await PlatformManager.SDK.getTopPlayers();
            return ranks;
        } catch (error) {
            return [];
        }
    },

    getLanguage() {
        return PlatformManager.SDK.getPlatformLanguage();
    }
};

export default PlatformManager;
