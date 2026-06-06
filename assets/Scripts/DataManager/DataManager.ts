import MainData from "./MainData";
import PlayerData from "./PlayerData";
import RemoteData from "./RemoteData";

const DataManager = {
    MainData: MainData,
    PlayerData: PlayerData,
    RemoteData: RemoteData,
    async initAllData(callback): Promise<any> {
        Promise.all([
            MainData.loadLocalData(),
            PlayerData.loadLocalData(),
            RemoteData.FetchRemoteConfig()
        ]).then(() => {
            if (callback) callback();
        });
    }
}
export default DataManager;