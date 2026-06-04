import DataManager from "../Common/DataManager";
import { BaseSDk } from "./BaseSDK";

export class YandexSDK extends BaseSDk {

    private LeaderBoardKey = "global";

    public init(cb): void {
        const loadYandexSDK = () => {
            return new Promise((resolve, reject) => {
                if ((window as any).YaGames) {
                    resolve((window as any).YaGames);
                    return;
                }
                const script = document.createElement("script");
                script.src = "/sdk.js"; // Yandex sẽ tự cấp file này khi chạy trên Graft
                script.onload = () => resolve((window as any).YaGames);
                script.onerror = (err) => {
                    reject(err);
                };
                document.head.appendChild(script);
            });
        };

        loadYandexSDK().then((YaGames: any) => {
            if (!YaGames) {
                return;
            }

            YaGames.init()
                .then(ysdk => {
                    window.ysdk = ysdk;
                    this.SDK = ysdk;
                    DataManager.FetchRemoteConfig(()=>{
                        cb && cb(this);
                        this.showInterstitialAds({});
                    })
                })
                .catch((error: any) => {
                });
        }).catch((error: any) => {
        });
    }

    public fireGameReady() {
        if (!this._fireGameReady) {
            this.SDK.features.LoadingAPI?.ready();
            this._fireGameReady = true;
        }
    }

    public showInterstitialAds(cb) {
        if (this.isYandexPlatform()) {
            if (typeof this.SDK.adv != "undefined") {
                this.SDK.adv.showFullscreenAdv({
                    callbacks: {
                        onOpen: () => cb.onOpen?.(),
                        onClose: () => cb.onClose?.(),
                        onError: (err: any) => cb.onError?.(),
                    }
                });
            } else {
                cb.onError?.();
            }
        } else {
            // local host
            setTimeout(() => {
                cb.onRewarded?.(); // for test in local
                cb.onClose?.();
            }, 3000);
        }
    }

    public showRewardedAds(cb) {
        if (this.isYandexPlatform()) {
            if (typeof this.SDK.adv != "undefined") {
                this.SDK.adv.showRewardedVideo({
                    callbacks: {
                        onOpen: () => cb.onOpen?.(),
                        onRewarded: () => cb.onRewarded?.(),
                        onClose: () => cb.onClose?.(),
                        onError: () => cb.onError?.()
                    }
                });
            } else {
                cb.onError?.();
            }
        } else {
            // local host
            setTimeout(() => {
                cb.onRewarded?.(); // for test in local
                cb.onClose?.();
            }, 3000);

        }
    }
    public isYandexPlatform(): boolean {
        return typeof this !== "undefined" && window.location.href.includes("yandex");
    }

    public getPlatformLanguage(): any {
        if (typeof this.SDK != "undefined") {
            let language = this.SDK.environment.i18n.lang;
            console.log("detect_ysdk_language " + language);
            return language;
        }
    }

    public gameplayAPIStart(): void {
        if (typeof this.SDK != "undefined") {
            this.SDK.features.GameplayAPI.start();
        }
    }

    public gameplayAPIStop(): void {
        this.SDK.features.GameplayAPI.stop();
    }
    public async getData(): Promise<any> {
        if (!this.SDK) return null;

        try {
            const player = await this.SDK.getPlayer();
            const data = await player.getData();
            //console.log("Dữ liệu tải về:", data);
            this.playerData = player;
            return data;
        } catch (error) {
            console.log("Wrong load data:", error);
            return null;
        }
    }

    public async setData(): Promise<any> {
        if (!this.SDK) return;

        try {
            const player = await this.SDK.getPlayer();
            await player.setData(this.playerData);
            console.log("Save data:", this.playerData);
        } catch (error) {
            console.log("Wrong save data:", error);
        }
    }

    public async LoginPlayer(): Promise<void> {
        if (typeof this.SDK == "undefined") return;

        try {
            const player = await this.SDK.getPlayer({ scopes: true }); // Yêu cầu quyền truy cập
            console.log("UserName:", player.getName());
            console.log("ID:", player.getUniqueID());
            this.playerData = player;
            console.log(this.playerData);
        } catch (error) {
            console.log("No Login", error);
        }
    }

    public async checkAuth(): Promise<boolean> {
        if (!this.SDK) return false;

        try {
            const player = await this.SDK.getPlayer();
            if (player.isAuthorized()) {
                this.playerData = player;
            } else {
                this.LoginPlayer();
            }
        } catch (error) {
            return false;
        }
    }

    public async getTopPlayers(): Promise<any> {
        if (!this.SDK) return [];

        let leaderboards = await this.SDK.getLeaderboards();
        let res = await leaderboards.getLeaderboardEntries(this.LeaderBoardKey, { quantityTop: 30 });
        let ranks = [];
        if (res && res.entries) {
            res.entries.forEach(entry => {
                let nRank = {
                    "name": entry.player.publicName || "Anonymous",
                    "score": entry.score
                };
                ranks.push(nRank);
            });
        }

        return ranks;
    }
    public async getPlayerRank(): Promise<any> {
        if (!this.SDK) return;
        try {
            const leaderboard = await this.SDK.getLeaderboards();
            const playerEntry = await leaderboard.getLeaderboardPlayerEntry(this.LeaderBoardKey);
            return playerEntry;
        } catch (error) {
            return null;
        }
    }

    public async updatePlayerScore(score: number): Promise<boolean> {
        if (!this.SDK) return false;

        try {
            const leaderboards = await this.SDK.getLeaderboards();
            await leaderboards.setLeaderboardScore(this.LeaderBoardKey, score);
            return true;
        } catch (error) {
            return false;
        }
    }

    public async checkShowShortcut(cb): Promise<void> {
        if (!this.SDK) return;

        try {
            const result = await this.SDK.shortcut.canShowPrompt();
            console.log("wrong shortcut:", result);
            if (result) {
                try {
                    const result = await this.SDK.shortcut.showPrompt();
                    if (result) {
                        console.log("wrong!");
                    } else {
                        console.log("wrong shortcut.");
                    }
                    cb?.();
                } catch (error) {
                    console.log("wrong shortcut:", error);
                }
            }
        } catch (error) {
            console.log("wrong shortcut:", error);
        }
    }

    public async checkShowRating(cb): Promise<void> {
        if (!this.SDK) return;

        try {
            const result = await this.SDK.feedback.canReview();
            if (result) {
                console.log("wrong:", result);
                try {
                    const result = await this.SDK.feedback.requestReview();
                    if (result) {
                        console.log("wrong!");
                    } else {
                        console.log("wrong.");
                    }
                    cb?.();
                } catch (error) {
                    console.log("wrong:", error);
                }
            }
        } catch (error) {
            console.log("wrong rating:", error);
        }
    }
}