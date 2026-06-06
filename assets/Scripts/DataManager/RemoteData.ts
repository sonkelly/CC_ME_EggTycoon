import { sys } from "cc";

const RemoteData = {
    version: "001",
    RemoteConfig: {
        hihi: 1
    },
    FetchRemoteConfig() {
        return new Promise((resolve: any, _reject) => {

            if ((window as any).ysdk) {
                (window as any).ysdk.getFlags().then((flags) => {
                    if (flags) {
                        for (let prop in flags) {
                            if (flags.hasOwnProperty(prop) && prop.indexOf("forVersion") == -1) {
                                if (typeof RemoteData.RemoteConfig[prop] == 'string') {
                                    RemoteData.RemoteConfig[prop] = flags[prop];
                                } else {
                                    RemoteData.RemoteConfig[prop] = parseInt(flags[prop]);
                                }
                            }
                        }

                        let forVersion = flags["forVersion_" + RemoteData.version];
                        if (forVersion) {
                            let settingsForVersion = JSON.parse(forVersion);
                            if (settingsForVersion) {
                                for (let prop in settingsForVersion) {
                                    if (settingsForVersion.hasOwnProperty(prop)) {
                                        if (typeof RemoteData.RemoteConfig[prop] == 'string') {
                                            RemoteData.RemoteConfig[prop] = settingsForVersion[prop];
                                        } else {
                                            RemoteData.RemoteConfig[prop] = parseInt(settingsForVersion[prop]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    resolve();
                })
            } else {
                resolve();
            }
        });
    }
}
export default RemoteData;