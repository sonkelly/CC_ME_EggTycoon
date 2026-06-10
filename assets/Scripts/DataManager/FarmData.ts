import { sys } from "cc";
import CryptoJS from 'crypto-js';

const FarmData = {
    _tryLoadData: 0,
    _getData: false,
    _key: "FarmData",
    LocalData: {
        coin: 0,
        level: 1
    },
    saveLocalData: function () {
        let data = JSON.stringify(FarmData.LocalData);
        let encriptData = CryptoJS.AES.encrypt(data, 'rYmWetvqSHEc8o0Y');
        sys.localStorage.setItem(FarmData._key, encriptData);
    },
    loadLocalData() {
        return new Promise((resolve: any, _reject) => {
            if (FarmData._getData) {
                resolve();
            } else {
                let data = sys.localStorage.getItem(FarmData._key);
                if (data) {
                    data = CryptoJS.AES.decrypt(data, 'rYmWetvqSHEc8o0Y');
                    data = data.toString(CryptoJS.enc.Utf8)
                }
                data = data ? JSON.parse(data) : {};
                if (data && Object.keys(data).length > 0 && data.constructor === Object
                ) {
                    Object.keys(data).forEach(key => {
                        FarmData.LocalData[key] = data[key];
                    });
                }

                FarmData._tryLoadData = 0;
                FarmData._getData = true;
                resolve();
            }
        });
    },
};

export default FarmData;