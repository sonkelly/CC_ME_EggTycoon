import { sys } from "cc";
import CryptoJS from 'crypto-js';


const PlayerData = {
    _tryLoadData: 0,
    _getData: false,
    _key: "PlayerData",
    LocalData: {
        coin: 0,
        level: 1
    },
    saveLocalData: function () {
        let data = JSON.stringify(PlayerData.LocalData);
        let encriptData = CryptoJS.AES.encrypt(data, 'rYmWetvqSHEc8o0Y');
        sys.localStorage.setItem(PlayerData._key, encriptData);
    },
    loadLocalData() {
        return new Promise((resolve: any, _reject) => {
            if (PlayerData._getData) {
                resolve();
            } else {
                let data = sys.localStorage.getItem(PlayerData._key);
                if (data) {
                    data = CryptoJS.AES.decrypt(data, 'rYmWetvqSHEc8o0Y');
                    data = data.toString(CryptoJS.enc.Utf8)
                }
                data = data ? JSON.parse(data) : {};
                if (data && Object.keys(data).length > 0 && data.constructor === Object
                ) {
                    Object.keys(data).forEach(key => {
                        PlayerData.LocalData[key] = data[key];
                    });
                }

                PlayerData._tryLoadData = 0;
                PlayerData._getData = true;
                resolve();
            }
        });
    },

    addCoin(value: number) {
        PlayerData.LocalData.coin += value;
        PlayerData.saveLocalData();
    },

    getCoin() {
        return PlayerData.LocalData.coin;
    },
    getLevel() {
        return PlayerData.LocalData.level;
    },
    updateLevel() {
        PlayerData.LocalData.level += 1;
        PlayerData.saveLocalData()
    }
};

export default PlayerData;